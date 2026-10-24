import { describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
import { planPrices, priceInCents } from '../src/lib/pricing';
import { matchesCheckoutPrice, resolveCheckoutPrice } from '../src/lib/server/checkout-price';

function price(changes: Partial<Stripe.Price> = {}): Stripe.Price {
	return {
		id: 'price_new',
		active: true,
		currency: 'usd',
		type: 'recurring',
		unit_amount: 4900,
		billing_scheme: 'per_unit',
		recurring: { interval: 'month', interval_count: 1, usage_type: 'licensed' },
		product: 'prod_starter',
		transform_quantity: null,
		tax_behavior: 'exclusive',
		...changes
	} as Stripe.Price;
}
function client(configured: Stripe.Price, found: Stripe.Price[] = []) {
	const prices = {
		retrieve: vi.fn().mockResolvedValue(configured),
		list: vi.fn().mockResolvedValue({ data: found }),
		create: vi.fn().mockResolvedValue(price())
	};
	return { prices, stripe: { prices } as unknown as Stripe };
}

describe('shared pricing and Stripe checkout', () => {
	it('lowers both tiers and gives exactly two months free annually', () => {
		expect(planPrices.starter.monthly).toBe(49);
		expect(planPrices.growth.monthly).toBe(99);
		for (const tier of ['starter', 'growth'] as const) {
			expect(planPrices[tier].yearly).toBe(planPrices[tier].monthly * 10);
			expect(priceInCents(tier, 'yearly')).toBe(planPrices[tier].yearly * 100);
		}
	});
	it('uses a correctly configured price without creating another price', async () => {
		const { stripe, prices } = client(price());
		expect(await resolveCheckoutPrice(stripe, 'configured', 'starter', 'monthly')).toBe(
			'price_new'
		);
		expect(prices.list).not.toHaveBeenCalled();
		expect(prices.create).not.toHaveBeenCalled();
	});
	it('does not charge the old price when production still has the old configured ID', async () => {
		const { stripe, prices } = client(price({ id: 'price_old', unit_amount: 14900 }));
		expect(await resolveCheckoutPrice(stripe, 'price_old', 'starter', 'monthly')).toBe('price_new');
		expect(prices.create).toHaveBeenCalledWith(
			expect.objectContaining({
				unit_amount: 4900,
				product: 'prod_starter',
				recurring: { interval: 'month' },
				tax_behavior: 'exclusive'
			}),
			{ idempotencyKey: expect.stringContaining('starter-monthly-usd-4900') }
		);
	});
	it('reuses the new lookup price across instances and restarts', async () => {
		const { stripe, prices } = client(price({ unit_amount: 14900 }), [price()]);
		expect(await resolveCheckoutPrice(stripe, 'price_old', 'starter', 'monthly')).toBe('price_new');
		expect(prices.create).not.toHaveBeenCalled();
	});
	it('resolves annual plans to an annual rather than monthly price', async () => {
		const recurring = {
			interval: 'year',
			interval_count: 1,
			usage_type: 'licensed'
		} as Stripe.Price.Recurring;
		const { stripe, prices } = client(
			price({ unit_amount: 287000, recurring, product: 'prod_growth' })
		);
		prices.create.mockResolvedValue(
			price({ unit_amount: 99000, recurring, product: 'prod_growth' })
		);
		await resolveCheckoutPrice(stripe, 'old', 'growth', 'yearly');
		expect(prices.create).toHaveBeenCalledWith(
			expect.objectContaining({
				unit_amount: 99000,
				product: 'prod_growth',
				recurring: { interval: 'year' }
			}),
			expect.anything()
		);
	});
	it.each([
		{ active: false },
		{ currency: 'eur' },
		{ unit_amount: 14900 },
		{ billing_scheme: 'tiered' },
		{ transform_quantity: { divide_by: 10, round: 'up' } },
		{ recurring: { interval: 'month', interval_count: 2, usage_type: 'licensed' } },
		{ recurring: { interval: 'month', interval_count: 1, usage_type: 'metered' } }
	] as Partial<Stripe.Price>[])(
		'never accepts an unexpected charge configuration: %j',
		(changes) => {
			expect(matchesCheckoutPrice(price(changes), 'starter', 'monthly')).toBe(false);
		}
	);
	it('fails closed on a conflicting or cross-product lookup price', async () => {
		const { stripe, prices } = client(price({ unit_amount: 14900 }), [
			price({ product: 'prod_other' })
		]);
		await expect(resolveCheckoutPrice(stripe, 'old', 'starter', 'monthly')).rejects.toThrow(
			'published plan'
		);
		expect(prices.create).not.toHaveBeenCalled();
	});
	it('fails closed if Stripe cannot provision the lower amount', async () => {
		const { stripe, prices } = client(price({ unit_amount: 14900 }));
		prices.create.mockRejectedValue(new Error('Permission denied'));
		await expect(resolveCheckoutPrice(stripe, 'old', 'starter', 'monthly')).rejects.toThrow(
			'Permission denied'
		);
	});
	it('rejects an incorrectly configured currency or interval rather than guessing', async () => {
		const { stripe, prices } = client(price({ currency: 'eur' }));
		await expect(resolveCheckoutPrice(stripe, 'old', 'starter', 'monthly')).rejects.toThrow(
			'unexpected currency'
		);
		expect(prices.create).not.toHaveBeenCalled();
	});
});
