import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCheckoutSession, type PlanInterval, type PlanTier } from '$lib/server/stripe';
import { env } from '$env/dynamic/private';
import { captureServerEvent } from '$lib/server/posthog';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const { plan, interval } = await request.json();

	if (interval !== 'monthly' && interval !== 'yearly') {
		throw error(400, 'Invalid interval. Must be "monthly" or "yearly"');
	}

	if (plan !== 'starter' && plan !== 'growth') {
		throw error(400, 'Invalid plan. Must be "starter" or "growth"');
	}

	const origin = env.ORIGIN || 'http://localhost:5173';
	const cleanOrigin = origin.replace(/\/$/, '');

	const checkoutUrl = await createCheckoutSession(
		locals.session.user.email,
		plan as PlanTier,
		interval as PlanInterval,
		locals.organizationId,
		`${cleanOrigin}/dashboard?subscribed=true`,
		`${cleanOrigin}/settings/billing`
	);

	await captureServerEvent({
		event: 'checkout_started',
		properties: {
			plan,
			interval,
			org_id: locals.organizationId
		},
		groups: { organization: locals.organizationId }
	});

	return json({ url: checkoutUrl });
};
