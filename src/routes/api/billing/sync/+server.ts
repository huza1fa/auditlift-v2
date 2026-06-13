import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { subscriptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;

	// Only resolve subscriptions from the org's existing subscription record.
	// Never search Stripe by email — that would let a user activate a different
	// org using any subscription associated with their email address.
	const [existingSub] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.organizationId, orgId))
		.limit(1);

	if (existingSub?.stripeCustomerId) {
		// List active subscriptions for this customer
		const stripeSubs = await stripe.subscriptions.list({
			customer: existingSub.stripeCustomerId,
			status: 'active',
			limit: 1
		});

		if (stripeSubs.data.length > 0) {
			const stripeSub = stripeSubs.data[0];
			const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end
				? new Date(stripeSub.items.data[0].current_period_end * 1000)
				: null;

			await db
				.update(subscriptions)
				.set({
					status: 'active',
					stripeSubscriptionId: stripeSub.id,
					currentPeriodEnd,
					cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
					updatedAt: new Date()
				})
				.where(eq(subscriptions.organizationId, orgId));

			return json({ status: 'active', synced: true });
		}
	}

	return json({ status: existingSub?.status ?? 'no_subscription', synced: false });
};
