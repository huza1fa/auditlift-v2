import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireMinimumRole } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';
import { StackSchema } from '$lib/server/validation';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const result = StackSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { stack } = result.data;

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

	await db.update(organizations).set({ stack }).where(eq(organizations.id, userOrg.organizationId));
	return json({ ok: true });
};
