import type { PageServerLoad } from './$types';
import { hasActivePaidAccess } from '$lib/server/billing';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.session?.user,
		organization: locals.organization,
		subscription: locals.subscription,
		hasActivePaidAccess: hasActivePaidAccess(locals.subscription)
	};
};
