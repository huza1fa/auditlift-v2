import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPortalSession } from '$lib/server/stripe';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const stripeCustomerId = locals.subscription?.stripeCustomerId;

	if (!stripeCustomerId) {
		throw error(400, 'No Stripe customer found for this organization');
	}

	const origin = env.ORIGIN || 'http://localhost:5173';
	const cleanOrigin = origin.replace(/\/$/, '');

	const portalUrl = await createPortalSession(stripeCustomerId, `${cleanOrigin}/settings/billing`);

	return json({ url: portalUrl });
};
