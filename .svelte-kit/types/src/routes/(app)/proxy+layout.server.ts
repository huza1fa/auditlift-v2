// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { hasActiveAccess, isReadOnly } from '$lib/server/billing';
import { db } from '$lib/server/db';
import { organizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendTrialExpiringEmail, sendTrialExpiredEmail } from '$lib/server/email';

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

	// Fire-and-forget trial lifecycle emails
	const org = locals.organization;
	if (org.trialEndsAt && locals.session?.user) {
		const daysLeft = Math.ceil((org.trialEndsAt.getTime() - Date.now()) / 86400000);
		const user = locals.session.user;

		if (daysLeft <= 3 && daysLeft > 0 && !org.trialReminderSentAt) {
			sendTrialExpiringEmail({
				to: user.email,
				name: user.name ?? '',
				organizationName: org.name,
				daysLeft,
				trialEndsAt: org.trialEndsAt
			})
				.then(() =>
					db
						.update(organizations)
						.set({ trialReminderSentAt: new Date() })
						.where(eq(organizations.id, org.id))
				)
				.catch(console.error);
		}

		if (daysLeft <= 0 && !org.trialExpiredEmailSentAt) {
			sendTrialExpiredEmail({
				to: user.email,
				name: user.name ?? '',
				organizationName: org.name
			})
				.then(() =>
					db
						.update(organizations)
						.set({ trialExpiredEmailSentAt: new Date() })
						.where(eq(organizations.id, org.id))
				)
				.catch(console.error);
		}
	}

	// Only hard-block if they're trying to access the billing page while already there (no loop)
	// Allow all pages in read-only mode — API endpoints handle write blocking

	return {
		user: locals.session.user,
		organization: locals.organization,
		subscription: locals.subscription,
		isReadOnly: readOnly
	};
};
