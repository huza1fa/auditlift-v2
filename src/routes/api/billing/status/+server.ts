import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireOrganizationRole } from '$lib/server/auth-utils';

export const GET: RequestHandler = async ({ locals }) => {
	await requireOrganizationRole(locals);

	return json({
		subscription: locals.subscription,
		organization: locals.organization
	});
};
