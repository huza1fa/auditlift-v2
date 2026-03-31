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

	// Try to find by existing stripeCustomerId first
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
			const currentPeriodEnd = (stripeSub as any).current_period_end
				? new Date((stripeSub as any).current_period_end * 1000)
				: null;

			await db
				.update(subscriptions)
				.set({
					status: 'active',
					stripeSubscriptionId: stripeSub.id,
					currentPeriodEnd,
					cancelAtPeriodEnd: (stripeSub as any).cancel_at_period_end,
					updatedAt: new Date()
				})
				.where(eq(subscriptions.organizationId, orgId));

			return json({ status: 'active', synced: true });
		}
	} else {
		// Search by customer email
		const email = locals.session.user.email;
		const customers = await stripe.customers.search({
			query: `email:"${email}"`
		});

		if (customers.data.length > 0) {
			const customer = customers.data[0];
			const stripeSubs = await stripe.subscriptions.list({
				customer: customer.id,
				status: 'active',
				limit: 1
			});

			if (stripeSubs.data.length > 0) {
				const stripeSub = stripeSubs.data[0];
				const currentPeriodEnd = (stripeSub as any).current_period_end
					? new Date((stripeSub as any).current_period_end * 1000)
					: null;

				if (existingSub) {
					await db
						.update(subscriptions)
						.set({
							status: 'active',
							stripeCustomerId: customer.id,
							stripeSubscriptionId: stripeSub.id,
							currentPeriodEnd,
							cancelAtPeriodEnd: (stripeSub as any).cancel_at_period_end,
							updatedAt: new Date()
						})
						.where(eq(subscriptions.organizationId, orgId));
				} else {
					await db.insert(subscriptions).values({
						organizationId: orgId,
						status: 'active',
						stripeCustomerId: customer.id,
						stripeSubscriptionId: stripeSub.id,
						currentPeriodEnd,
						cancelAtPeriodEnd: (stripeSub as any).cancel_at_period_end
					});
				}

				return json({ status: 'active', synced: true });
			}
		}
	}

	return json({ status: existingSub?.status ?? 'no_subscription', synced: false });
};
