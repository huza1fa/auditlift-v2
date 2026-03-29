import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCheckoutSession, type PlanInterval } from '$lib/server/stripe';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const { interval } = await request.json();

	if (interval !== 'monthly' && interval !== 'yearly') {
		throw error(400, 'Invalid interval. Must be "monthly" or "yearly"');
	}

	const origin = env.ORIGIN || 'http://localhost:5173';
	const cleanOrigin = origin.replace(/\/$/, '');

	const checkoutUrl = await createCheckoutSession(
		locals.session.user.email,
		interval as PlanInterval,
		locals.organizationId,
		`${cleanOrigin}/dashboard?subscribed=true`,
		`${cleanOrigin}/settings/billing`
	);

	return json({ url: checkoutUrl });
};
