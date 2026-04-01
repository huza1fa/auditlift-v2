// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasActiveAccess, isReadOnly } from '$lib/server/billing';

export const load = async ({ locals, url }: Parameters<LayoutServerLoad>[0]) => {
	// 1. No session → redirect to login
	if (!locals.session) {
		redirect(302, '/login');
	}

	// 2. No org or onboarding incomplete → redirect to onboarding
	if (!locals.organization || !locals.organization.onboardingComplete) {
		redirect(302, '/onboarding');
	}

	const readOnly = isReadOnly(locals.subscription, locals.organization?.trialEndsAt ?? null);

	// Only hard-block if they're trying to access the billing page while already there (no loop)
	// Allow all pages in read-only mode — API endpoints handle write blocking

	return {
		user: locals.session.user,
		organization: locals.organization,
		subscription: locals.subscription,
		isReadOnly: readOnly
	};
};
