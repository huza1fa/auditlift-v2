import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPortalSession } from '$lib/server/stripe';
import { env } from '$env/dynamic/private';
import { requireOrganizationRole } from '$lib/server/auth-utils';

export const POST: RequestHandler = async ({ locals }) => {
	await requireOrganizationRole(locals, 'owner', 'Only the organization owner can manage billing');

	const stripeCustomerId = locals.subscription?.stripeCustomerId;

	if (!stripeCustomerId) {
		throw error(400, 'No Stripe customer found for this organization');
	}

	const origin = env.ORIGIN || 'http://localhost:5173';
	const cleanOrigin = origin.replace(/\/$/, '');

	const portalUrl = await createPortalSession(stripeCustomerId, `${cleanOrigin}/settings/billing`);

	return json({ url: portalUrl });
};
