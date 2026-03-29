import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.session?.user,
		organization: locals.organization,
		subscription: locals.subscription
	};
};
