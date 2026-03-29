import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const token = params.token;

	if (!token) {
		throw error(400, 'Invalid invitation');
	}

	// This will fetch via the API - client will call it
	return {
		token,
		isLoggedIn: !!locals.session
	};
};
