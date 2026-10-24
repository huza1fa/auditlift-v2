/** USD list prices, shared by marketing, billing, SEO, and Stripe checkout. */
export const planPrices = {
	starter: { monthly: 49, yearly: 490 },
	growth: { monthly: 99, yearly: 990 }
} as const;

export type PlanTier = keyof typeof planPrices;
export type PlanInterval = 'monthly' | 'yearly';

export function priceInCents(tier: PlanTier, interval: PlanInterval): number {
	return planPrices[tier][interval] * 100;
}
