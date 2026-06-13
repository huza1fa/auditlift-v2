import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireMinimumRole } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';

const ProfileSchema = z.object({
	dataTypes: z.array(z.enum(['pii', 'phi', 'financial', 'business'])).default([]),
	customerType: z.enum(['b2b', 'b2c', 'enterprise', 'internal']),
	geoReach: z.enum(['us', 'eu', 'global']),
	productType: z.enum(['saas', 'api', 'mobile', 'internal'])
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const result = ProfileSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { dataTypes, customerType, geoReach, productType } = result.data;

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
		.set({ dataTypes, customerType, geoReach, productType })
		.where(eq(organizations.id, userOrg.organizationId));

	return json({ ok: true });
};
