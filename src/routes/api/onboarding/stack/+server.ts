import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';
import { StackSchema } from '$lib/server/validation';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const result = StackSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { stack } = result.data;

	const { organizationId } = await requireOrganizationRole(
		locals,
		'admin',
		'Only admins can update organization details'
	);

	await db.update(organizations).set({ stack }).where(eq(organizations.id, organizationId));
	return json({ ok: true });
};
