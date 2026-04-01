import Stripe from 'stripe';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
const STRIPE_STARTER_MONTHLY = env.STRIPE_STARTER_MONTHLY_PRICE_ID;
const STRIPE_STARTER_YEARLY = env.STRIPE_STARTER_YEARLY_PRICE_ID;
const STRIPE_GROWTH_MONTHLY = env.STRIPE_GROWTH_MONTHLY_PRICE_ID;
const STRIPE_GROWTH_YEARLY = env.STRIPE_GROWTH_YEARLY_PRICE_ID;

if (!STRIPE_SECRET_KEY) {
	console.error('[Stripe] Missing STRIPE_SECRET_KEY in environment variables');
	throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	typescript: true
});

export type PlanInterval = 'monthly' | 'yearly';
export type PlanTier = 'starter' | 'growth';

export function getPriceId(tier: PlanTier, interval: PlanInterval): string {
	const map: Record<string, string | undefined> = {
		'starter-monthly': STRIPE_STARTER_MONTHLY,
		'starter-yearly': STRIPE_STARTER_YEARLY,
		'growth-monthly': STRIPE_GROWTH_MONTHLY,
		'growth-yearly': STRIPE_GROWTH_YEARLY
	};
	const priceId = map[`${tier}-${interval}`];
	if (!priceId) throw error(500, `Missing Stripe price ID for ${tier} ${interval}`);
	return priceId;
}

export function getWebhookSecret(): string {
	if (!STRIPE_WEBHOOK_SECRET) {
		throw error(500, 'Missing Stripe webhook secret');
	}
	return STRIPE_WEBHOOK_SECRET;
}

export function constructWebhookEvent(body: string | Buffer, signature: string): Stripe.Event {
	try {
		return stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
	} catch (err) {
		console.error('[Stripe] Webhook signature verification failed:', err);
		throw error(400, 'Invalid webhook signature');
	}
}

export async function createCheckoutSession(
	customerEmail: string,
	tier: PlanTier,
	interval: PlanInterval,
	organizationId: string,
	successUrl: string,
	cancelUrl: string
): Promise<string> {
	const priceId = getPriceId(tier, interval);

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		line_items: [{ price: priceId, quantity: 1 }],
		customer_email: customerEmail,
		success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: cancelUrl,
		metadata: {
			organizationId
		},
		subscription_data: {
			metadata: {
				organizationId
			}
		}
	});

	return session.url!;
}

export async function createPortalSession(
	stripeCustomerId: string,
	returnUrl: string
): Promise<string> {
	const session = await stripe.billingPortal.sessions.create({
		customer: stripeCustomerId,
		return_url: returnUrl
	});

	return session.url;
}
