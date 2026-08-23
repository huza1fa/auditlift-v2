import type { InferSelectModel } from 'drizzle-orm';
import type { subscriptions } from './db/schema';

type Subscription = InferSelectModel<typeof subscriptions> | null | undefined;

/** Trial orgs can have at most 2 members (owner + 1 invite). Paid orgs are unlimited. */
export const TRIAL_MEMBER_LIMIT = 2;

export function hasActiveAccess(subscription: Subscription, trialEndsAt?: Date | null): boolean {
	if (!subscription) {
		// Check org trial
		if (trialEndsAt) return trialEndsAt > new Date();
		return false;
	}

	if (subscription.status === 'active') return true;

	if (subscription.status === 'trialing') {
		if (!trialEndsAt) return false;
		return trialEndsAt > new Date();
	}

	return false;
}

export function hasActivePaidAccess(subscription: Subscription): boolean {
	if (!subscription) return false;
	return subscription.status === 'active';
}

export function isReadOnly(subscription: Subscription, trialEndsAt?: Date | null): boolean {
	return !hasActiveAccess(subscription, trialEndsAt);
}
