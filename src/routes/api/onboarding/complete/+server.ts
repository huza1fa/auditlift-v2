import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '$lib/server/email';

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
	}

	const redirectTo = intent === 'questionnaire' ? '/questionnaires' : '/dashboard';

	return json({ ok: true, redirectTo });
};
