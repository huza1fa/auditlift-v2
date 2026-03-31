// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organizationFrameworks, frameworks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { computeReadinessScore } from '$lib/server/score';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const orgId = locals.organizationId;
	const justSubscribed = url.searchParams.get('subscribed') === 'true';

	// Get org's active framework
	const [orgFramework] = await db
		.select({ framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.limit(1);

	let readiness: {
		score: number;
		totalControls: number;
		completedControls: number;
		blockers: Array<{ id: string; code: string; title: string; category: string }>;
	} = { score: 0, totalControls: 0, completedControls: 0, blockers: [] };

	if (orgFramework) {
		readiness = await computeReadinessScore(orgId, orgFramework.framework.id);
	}

	// Sync subscription from Stripe if user just completed checkout
	// This handles webhook delivery failures in dev/prod
	if (justSubscribed && url.searchParams.get('session_id')) {
		const sessionId = url.searchParams.get('session_id')!;
		try {
			const { stripe } = await import('$lib/server/stripe');
			const { db } = await import('$lib/server/db');
			const { subscriptions } = await import('$lib/server/db/schema');
			const { eq } = await import('drizzle-orm');

			const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

			if (checkoutSession.subscription && checkoutSession.metadata?.organizationId === orgId) {
				const stripeSub = await stripe.subscriptions.retrieve(
					checkoutSession.subscription as string
				);
				const currentPeriodEnd = (stripeSub as any).current_period_end
					? new Date((stripeSub as any).current_period_end * 1000)
					: null;

				// Check if sub exists in DB
				const [existingSub] = await db
					.select()
					.from(subscriptions)
					.where(eq(subscriptions.organizationId, orgId))
					.limit(1);

				if (existingSub) {
					await db
						.update(subscriptions)
						.set({
							status: 'active',
							stripeCustomerId: checkoutSession.customer as string,
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
						stripeCustomerId: checkoutSession.customer as string,
						stripeSubscriptionId: stripeSub.id,
						currentPeriodEnd,
						cancelAtPeriodEnd: (stripeSub as any).cancel_at_period_end
					});
				}

				// Re-fetch subscription to reflect updated state
				locals.subscription =
					(
						await db
							.select()
							.from(subscriptions)
							.where(eq(subscriptions.organizationId, orgId))
							.limit(1)
					)[0] ?? null;
			}
		} catch (err) {
			console.error('[Dashboard] Failed to sync subscription from Stripe:', err);
		}
	}

	const trialEndsAt = locals.organization?.trialEndsAt;
	const isActiveSubscription = locals.subscription?.status === 'active';
	const trialDaysRemaining = isActiveSubscription
		? null
		: trialEndsAt
			? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
			: null;

	return {
		readiness,
		framework: orgFramework?.framework ?? null,
		trialDaysRemaining,
		justSubscribed
	};
};
