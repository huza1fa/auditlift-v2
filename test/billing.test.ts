import { describe, expect, it } from 'vitest';
import {
	hasActiveAccess,
	hasActivePaidAccess,
	hasTrialQuestionnaireExportAvailable,
	isReadOnly
} from '../src/lib/server/billing';

type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';

function subscription(status: SubscriptionStatus) {
	return { status } as Parameters<typeof hasActiveAccess>[0];
}

describe('billing access rules', () => {
	it('grants access to active Stripe subscriptions regardless of trial end', () => {
		const activeStripeSubscription = {
			status: 'active',
			stripeSubscriptionId: 'sub_123'
		} as Parameters<typeof hasActiveAccess>[0];
		expect(hasActiveAccess(activeStripeSubscription, new Date(Date.now() - 1))).toBe(true);
		expect(hasActivePaidAccess(activeStripeSubscription)).toBe(true);
		expect(isReadOnly(activeStripeSubscription, new Date(Date.now() - 1))).toBe(false);
	});

	it('expires unlinked active subscriptions unless an explicit override is current', () => {
		const expired = {
			status: 'active',
			currentPeriodEnd: new Date(Date.now() - 60_000)
		} as Parameters<typeof hasActiveAccess>[0];
		const overridden = {
			...expired,
			accessOverrideUntil: new Date(Date.now() + 60_000)
		} as Parameters<typeof hasActiveAccess>[0];

		expect(hasActiveAccess(expired)).toBe(false);
		expect(hasActivePaidAccess(expired)).toBe(false);
		expect(isReadOnly(expired)).toBe(true);
		expect(hasActiveAccess(overridden)).toBe(true);
		expect(hasActivePaidAccess(overridden)).toBe(true);
	});

	it('requires an explicit future period for unlinked active subscriptions', () => {
		const current = {
			status: 'active',
			currentPeriodEnd: new Date(Date.now() + 60_000)
		} as Parameters<typeof hasActiveAccess>[0];
		const withoutPeriod = { status: 'active' } as Parameters<typeof hasActiveAccess>[0];

		expect(hasActiveAccess(current)).toBe(true);
		expect(hasActivePaidAccess(current)).toBe(true);
		expect(hasActiveAccess(withoutPeriod)).toBe(false);
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

	it('allows exactly one questionnaire export during an active unpaid trial', () => {
		const future = new Date(Date.now() + 60_000);
		const past = new Date(Date.now() - 60_000);

		expect(hasTrialQuestionnaireExportAvailable(subscription('trialing'), future, null)).toBe(true);
		expect(hasTrialQuestionnaireExportAvailable(subscription('trialing'), future, new Date())).toBe(
			false
		);
		expect(hasTrialQuestionnaireExportAvailable(subscription('trialing'), past, null)).toBe(false);
	});

	it('does not classify paid organizations as trial-export eligible', () => {
		const future = new Date(Date.now() + 60_000);
		const paidSubscription = {
			status: 'active',
			stripeSubscriptionId: 'sub_123'
		} as Parameters<typeof hasActiveAccess>[0];
		expect(hasTrialQuestionnaireExportAvailable(paidSubscription, future, null)).toBe(false);
	});
});
