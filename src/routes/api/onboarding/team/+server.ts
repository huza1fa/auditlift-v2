import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireMinimumRole } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';

const TeamSizeSchema = z.object({
	teamSize: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional()
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const result = TeamSizeSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { teamSize } = result.data;

	const [userOrg] = await db
		.select()
		.from(userOrganizations)
		.where(eq(userOrganizations.userId, locals.session.user.id))
		.limit(1);
	if (!userOrg) throw error(400, 'No organization found');

	// Only owners/admins can update organization profile data
	requireMinimumRole(
		userOrg.role as UserRole,
		'admin',
		'Only admins can update organization details'
	);

	await db
		.update(organizations)
		.set({ teamSize })
		.where(eq(organizations.id, userOrg.organizationId));
	return json({ ok: true });
};
