import type { InferSelectModel } from 'drizzle-orm';
import type { subscriptions } from './db/schema';

type Subscription = InferSelectModel<typeof subscriptions> | null | undefined;

export function hasActiveAccess(subscription: Subscription, trialEndsAt?: Date | null): boolean {
	if (!subscription) {
		// Check org trial
		if (trialEndsAt) return trialEndsAt > new Date();
		return false;
	}

	if (subscription.status === 'active') return true;

	if (subscription.status === 'trialing') {
		if (trialEndsAt) return trialEndsAt > new Date();
		return true;
	}

	return false;
}

export function isReadOnly(subscription: Subscription, trialEndsAt?: Date | null): boolean {
	return !hasActiveAccess(subscription, trialEndsAt);
}
