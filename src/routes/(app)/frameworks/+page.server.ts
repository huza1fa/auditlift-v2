import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { frameworks, organizationFrameworks, userOrganizations } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const allFrameworks = await db.select().from(frameworks);
	const orgFrameworks = await db
		.select()
		.from(organizationFrameworks)
		.where(eq(organizationFrameworks.organizationId, locals.organizationId));

	const activeIds = new Set(orgFrameworks.map((f) => f.frameworkId));
	const [membership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, locals.organizationId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	return {
		frameworks: allFrameworks.map((f) => ({ ...f, active: activeIds.has(f.id) })),
		canManageFrameworks: membership?.role === 'owner' || membership?.role === 'admin'
	};
};
