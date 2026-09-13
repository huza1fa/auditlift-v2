import type { InferSelectModel } from 'drizzle-orm';
import type { subscriptions } from './db/schema';

type Subscription = InferSelectModel<typeof subscriptions> | null | undefined;

/** Trial orgs can have at most 2 members (owner + 1 invite). Paid orgs are unlimited. */
export const TRIAL_MEMBER_LIMIT = 2;

function hasValidPaidAccess(subscription: NonNullable<Subscription>, now: Date): boolean {
	if (subscription.status !== 'active') return false;

	// A time-boxed override is for deliberate support or internal testing access.
	// It is stored on the subscription so it is reviewable and never tied to an email address in code.
	if (subscription.accessOverrideUntil && subscription.accessOverrideUntil > now) return true;

	// Stripe-backed subscriptions are kept current by webhooks and billing sync.
	if (subscription.stripeSubscriptionId) return true;

	// Legacy/manual active rows are valid only for their explicitly recorded access period.
	return Boolean(subscription.currentPeriodEnd && subscription.currentPeriodEnd > now);
}

export function hasActiveAccess(subscription: Subscription, trialEndsAt?: Date | null): boolean {
	const now = new Date();
	if (!subscription) {
		// Check org trial
		if (trialEndsAt) return trialEndsAt > now;
		return false;
	}

	if (subscription.status === 'active') return hasValidPaidAccess(subscription, now);

	if (subscription.status === 'trialing') {
		if (!trialEndsAt) return false;
		return trialEndsAt > now;
	}

	return false;
}

export function hasActivePaidAccess(subscription: Subscription): boolean {
	return subscription ? hasValidPaidAccess(subscription, new Date()) : false;
}

/**
 * Paid organizations retain unrestricted questionnaire exports. During an active
 * unpaid trial, an organization can return one completed questionnaire.
 */
export function hasTrialQuestionnaireExportAvailable(
	subscription: Subscription,
	trialEndsAt: Date | null | undefined,
	trialQuestionnaireExportedAt: Date | null | undefined
): boolean {
	return (
		!hasActivePaidAccess(subscription) &&
		hasActiveAccess(subscription, trialEndsAt) &&
		!trialQuestionnaireExportedAt
	);
}

export function isReadOnly(subscription: Subscription, trialEndsAt?: Date | null): boolean {
	return !hasActiveAccess(subscription, trialEndsAt);
}
