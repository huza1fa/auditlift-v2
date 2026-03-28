// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasActiveAccess } from '$lib/server/billing';

export const load = async ({ locals, url }: Parameters<LayoutServerLoad>[0]) => {
	// 1. No session → redirect to login
	if (!locals.session) {
		redirect(302, '/login');
	}

	// 2. No org or onboarding incomplete → redirect to onboarding
	if (!locals.organization || !locals.organization.onboardingComplete) {
		redirect(302, '/onboarding');
	}

	// 3. Trial expired + no active subscription → billing
	// Skip this check on the billing page itself to avoid a redirect loop
	const isBillingPage = url.pathname.startsWith('/settings/billing');
	if (
		!isBillingPage &&
		!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)
	) {
		redirect(302, '/settings/billing');
	}

	return {
		user: locals.session.user,
		organization: locals.organization,
		subscription: locals.subscription
	};
};
