import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const [userOrg] = await db
		.select()
		.from(userOrganizations)
		.where(eq(userOrganizations.userId, locals.session.user.id))
		.limit(1);
	if (!userOrg) throw error(400, 'No organization found');

	await db
		.update(organizations)
		.set({ onboardingComplete: true })
		.where(eq(organizations.id, userOrg.organizationId));

	return json({ ok: true });
};
