import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userOrganizations } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

const ACTIVE_ORGANIZATION_COOKIE = 'auditlift_active_organization_id';

export const POST: RequestHandler = async ({ request, locals, cookies, url }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const body = await request.json().catch(() => null);
	const organizationId = body?.organizationId;
	if (typeof organizationId !== 'string') throw error(400, 'organizationId is required');

	const [membership] = await db
		.select({ organizationId: userOrganizations.organizationId })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.userId, locals.session.user.id),
				eq(userOrganizations.organizationId, organizationId)
			)
		)
		.limit(1);

	if (!membership) throw error(403, 'You are not a member of this organization');

	cookies.set(ACTIVE_ORGANIZATION_COOKIE, organizationId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 365
	});

	return json({ organizationId });
};
