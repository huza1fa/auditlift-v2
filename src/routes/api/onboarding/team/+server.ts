import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';

const TeamSizeSchema = z.object({
	teamSize: z.enum(['1', '2-10', '11-50', '50+'])
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const result = TeamSizeSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { teamSize } = result.data;

	const { organizationId } = await requireOrganizationRole(
		locals,
		'admin',
		'Only admins can update organization details'
	);

	await db.update(organizations).set({ teamSize }).where(eq(organizations.id, organizationId));
	return json({ ok: true });
};
