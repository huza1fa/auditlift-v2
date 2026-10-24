import type Stripe from 'stripe';
import { priceInCents, type PlanInterval, type PlanTier } from '../pricing';

export function matchesCheckoutPrice(
	price: Stripe.Price,
	tier: PlanTier,
	interval: PlanInterval
): boolean {
	return (
		price.active &&
		price.currency === 'usd' &&
		price.type === 'recurring' &&
		price.unit_amount === priceInCents(tier, interval) &&
		price.billing_scheme === 'per_unit' &&
		price.recurring?.interval === (interval === 'monthly' ? 'month' : 'year') &&
		price.recurring.interval_count === 1 &&
		price.recurring.usage_type === 'licensed' &&
		!price.transform_quantity
	);
}

/**
 * Stripe prices are immutable. Use configured IDs as product anchors and create
 * a new, reusable price if they still contain the old amount. Existing subscribers
 * keep their existing price; no subscriptions or old prices are modified.
 */
export async function resolveCheckoutPrice(
	stripe: Stripe,
	configuredPriceId: string,
	tier: PlanTier,
	interval: PlanInterval
): Promise<string> {
	const configured = await stripe.prices.retrieve(configuredPriceId);
	if (matchesCheckoutPrice(configured, tier, interval)) return configured.id;
	if (
		configured.currency !== 'usd' ||
		configured.recurring?.interval !== (interval === 'monthly' ? 'month' : 'year') ||
		configured.recurring.interval_count !== 1 ||
		configured.recurring.usage_type !== 'licensed' ||
		configured.billing_scheme !== 'per_unit' ||
		configured.transform_quantity
	) {
		throw new Error(
			'Configured Stripe price has an unexpected currency, billing interval, or price configuration'
		);
	}
	const product =
		typeof configured.product === 'string' ? configured.product : configured.product.id;
	const amount = priceInCents(tier, interval);
	const lookupKey = `auditlift-${tier}-${interval}-usd-${amount}-${product}`;
	const existing = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
	if (existing.data[0]) {
		if (
			!matchesCheckoutPrice(existing.data[0], tier, interval) ||
			existing.data[0].product !== product
		) {
			throw new Error('Stripe lookup price does not match the published plan');
		}
		return existing.data[0].id;
	}
	const price = await stripe.prices.create(
		{
			product,
			currency: 'usd',
			unit_amount: amount,
			recurring: { interval: interval === 'monthly' ? 'month' : 'year' },
			lookup_key: lookupKey,
			...(configured.tax_behavior && configured.tax_behavior !== 'unspecified'
				? { tax_behavior: configured.tax_behavior }
				: {}),
			metadata: { auditlift_plan: tier, auditlift_interval: interval }
		},
		{ idempotencyKey: lookupKey }
	);
	if (!matchesCheckoutPrice(price, tier, interval))
		throw new Error('Stripe created an unexpected price');
	return price.id;
}
