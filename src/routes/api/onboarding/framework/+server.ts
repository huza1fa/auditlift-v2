import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizationFrameworks, frameworks, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireMinimumRole } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');
	const { frameworkSlug } = await request.json();

	const [userOrg] = await db
		.select()
		.from(userOrganizations)
		.where(eq(userOrganizations.userId, locals.session.user.id))
		.limit(1);
	if (!userOrg) throw error(400, 'No organization found');

	// Only owners/admins can change the compliance framework
	requireMinimumRole(userOrg.role as UserRole, 'admin', 'Only admins can change frameworks');

	const [framework] = await db
		.select()
		.from(frameworks)
		.where(eq(frameworks.slug, frameworkSlug))
		.limit(1);
	if (!framework) throw error(404, 'Framework not found');

	await db
		.insert(organizationFrameworks)
		.values({
			organizationId: userOrg.organizationId,
			frameworkId: framework.id
		})
		.onConflictDoNothing();

	return json({ ok: true });
};
