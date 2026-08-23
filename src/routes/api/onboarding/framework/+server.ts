import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizationFrameworks, frameworks } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';
import { normalizeFrameworkSlug } from '$lib/server/cross-framework';
import { logActivity } from '$lib/server/activity';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');
	const { frameworkSlug } = await request.json();

	const { organizationId } = await requireOrganizationRole(
		locals,
		'admin',
		'Only admins can change frameworks'
	);

	if (!normalizeFrameworkSlug(String(frameworkSlug))) {
		throw error(400, 'Unknown framework');
	}

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

	await logActivity({
		organizationId,
		userId: locals.session.user.id,
		userName: locals.session.user.name ?? locals.session.user.email,
		action: 'framework.activated',
		entityType: 'framework',
		entityId: framework.id,
		entityName: framework.name
	});

	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');
	const { frameworkSlug } = await request.json().catch(() => ({ frameworkSlug: null }));

	const { organizationId } = await requireOrganizationRole(
		locals,
		'admin',
		'Only admins can change frameworks'
	);

	const slug = normalizeFrameworkSlug(String(frameworkSlug));
	if (!slug) throw error(400, 'Unknown framework');

	const [framework] = await db.select().from(frameworks).where(eq(frameworks.slug, slug)).limit(1);
	if (!framework) throw error(404, 'Framework not found');

	await db
		.delete(organizationFrameworks)
		.where(
			and(
				eq(organizationFrameworks.organizationId, organizationId),
				eq(organizationFrameworks.frameworkId, framework.id)
			)
		);

	await logActivity({
		organizationId,
		userId: locals.session.user.id,
		userName: locals.session.user.name ?? locals.session.user.email,
		action: 'framework.deactivated',
		entityType: 'framework',
		entityId: framework.id,
		entityName: framework.name
	});

	return json({ ok: true });
};
