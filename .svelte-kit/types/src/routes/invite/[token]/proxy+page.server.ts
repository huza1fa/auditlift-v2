// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
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
