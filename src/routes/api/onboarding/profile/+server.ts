import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';

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

	const { organizationId } = await requireOrganizationRole(
		locals,
		'admin',
		'Only admins can update organization details'
	);

	await db
		.update(organizations)
		.set({ dataTypes, customerType, geoReach, productType })
		.where(eq(organizations.id, organizationId));

	return json({ ok: true });
};
