import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasActivePaidAccess } from '$lib/server/billing';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) redirect(302, '/login');
	return {
		subscription: locals.subscription,
		hasActivePaidAccess: hasActivePaidAccess(locals.subscription)
	};
};
