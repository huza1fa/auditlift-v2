import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkRateLimit } from '$lib/server/rate-limit';

// Auth paths that are vulnerable to brute-force / abuse
const RATE_LIMITED_PATHS = [
	'/sign-in/email', // login
	'/sign-up/email', // registration
	'/forget-password', // password reset request
	'/reset-password' // password reset completion
];

export const GET: RequestHandler = ({ request }) => auth.handler(request);

export const POST: RequestHandler = ({ request, getClientAddress }) => {
	const url = new URL(request.url);
	const authPath = url.pathname.replace('/api/auth', '');

	if (RATE_LIMITED_PATHS.some((p) => authPath.startsWith(p))) {
		const ip = getClientAddress();
		// 10 attempts per path per IP per 15 minutes
		if (!checkRateLimit(`auth:${authPath}:${ip}`, 10, 15 * 60 * 1000)) {
			throw error(429, 'Too many attempts. Please try again later.');
		}
	}

	return auth.handler(request);
};
