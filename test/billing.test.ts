import { describe, expect, it } from 'vitest';
import { hasActiveAccess, hasActivePaidAccess, isReadOnly } from '../src/lib/server/billing';

type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';

function subscription(status: SubscriptionStatus) {
	return { status } as Parameters<typeof hasActiveAccess>[0];
}

describe('billing access rules', () => {
	it('grants access to active subscriptions regardless of trial end', () => {
		expect(hasActiveAccess(subscription('active'), new Date(Date.now() - 1))).toBe(true);
		expect(hasActivePaidAccess(subscription('active'))).toBe(true);
		expect(isReadOnly(subscription('active'), new Date(Date.now() - 1))).toBe(false);
	});

	it('grants trial access only while the organization trial is current', () => {
		const future = new Date(Date.now() + 60_000);
		const past = new Date(Date.now() - 60_000);

		expect(hasActiveAccess(null, future)).toBe(true);
		expect(hasActiveAccess(null, past)).toBe(false);
		expect(hasActiveAccess(subscription('trialing'), future)).toBe(true);
		expect(hasActiveAccess(subscription('trialing'), past)).toBe(false);
	});

	it('denies trialing subscriptions without a trial end date', () => {
		expect(hasActiveAccess(subscription('trialing'))).toBe(false);
		expect(hasActiveAccess(subscription('trialing'), null)).toBe(false);
		expect(isReadOnly(subscription('trialing'))).toBe(true);
	});

	it('rejects inactive subscriptions and keeps them read-only', () => {
		for (const status of ['canceled', 'past_due', 'incomplete'] as SubscriptionStatus[]) {
			expect(hasActiveAccess(subscription(status), new Date(Date.now() + 60_000))).toBe(false);
			expect(hasActivePaidAccess(subscription(status))).toBe(false);
			expect(isReadOnly(subscription(status), new Date(Date.now() + 60_000))).toBe(true);
		}
	});
});
