import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '$lib/server/email';
import { captureServerEvent, identifyUserServer } from '$lib/server/posthog';
import { requireMinimumRole } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const body = await request.json().catch(() => ({}));
	const intent = body?.intent === 'questionnaire' ? 'questionnaire' : 'compliance';

	const [userOrg] = await db
		.select()
		.from(userOrganizations)
		.where(eq(userOrganizations.userId, locals.session.user.id))
		.limit(1);
	if (!userOrg) throw error(400, 'No organization found');

	// Only owners/admins can complete onboarding for the organization
	requireMinimumRole(userOrg.role as UserRole, 'admin', 'Only admins can complete onboarding');

	const [org] = await db
		.select()
		.from(organizations)
		.where(eq(organizations.id, userOrg.organizationId))
		.limit(1);
	if (!org) throw error(400, 'Organization not found');

	const shouldSendEmail = !org.onboardingComplete;

	await db
		.update(organizations)
		.set({ onboardingComplete: true })
		.where(eq(organizations.id, userOrg.organizationId));

	if (shouldSendEmail) {
		sendWelcomeEmail({
			to: locals.session.user.email ?? '',
			name: locals.session.user.name ?? '',
			organizationName: org.name,
			trialEndsAt: org.trialEndsAt ?? null
		}).catch(console.error);

		// Analytics: first-time onboarding completion
		identifyUserServer({
			distinctId: locals.session.user.id,
			properties: {
				email: locals.session.user.email,
				name: locals.session.user.name,
				org_id: org.id,
				org_name: org.name,
				industry: org.industry,
				team_size: org.teamSize,
				intent
			}
		});

		captureServerEvent({
			event: 'user_signed_up',
			distinctId: locals.session.user.id,
			properties: {
				intent,
				org_id: org.id,
				org_name: org.name,
				industry: org.industry,
				team_size: org.teamSize,
				auth_method: locals.session.user.emailVerified ? 'oauth' : 'email'
			},
			groups: { organization: org.id }
		});

		captureServerEvent({
			event: 'onboarding_completed',
			distinctId: locals.session.user.id,
			properties: {
				intent,
				steps_completed: intent === 'questionnaire' ? 6 : 7,
				org_id: org.id,
				org_name: org.name
			},
			groups: { organization: org.id }
		});
	}

	const redirectTo = intent === 'questionnaire' ? '/questionnaires?tour=1' : '/dashboard?tour=1';

	return json({ ok: true, redirectTo });
};
