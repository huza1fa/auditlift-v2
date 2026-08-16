import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizationFrameworks, frameworks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');
	const { frameworkSlug } = await request.json();

	const { organizationId } = await requireOrganizationRole(
		locals,
		'admin',
		'Only admins can change frameworks'
	);

	const [framework] = await db
		.select()
		.from(frameworks)
		.where(eq(frameworks.slug, frameworkSlug))
		.limit(1);
	if (!framework) throw error(404, 'Framework not found');

	await db
		.insert(organizationFrameworks)
		.values({
			organizationId,
			frameworkId: framework.id
		})
		.onConflictDoNothing();

	return json({ ok: true });
};
