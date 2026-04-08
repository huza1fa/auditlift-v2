import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const PostureSchema = z.object({
	securityTools: z
		.array(z.enum(['sso', 'mdm', 'password_manager', 'ci_cd', 'code_review']))
		.default([])
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const result = PostureSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { securityTools } = result.data;

	const [userOrg] = await db
		.select()
		.from(userOrganizations)
		.where(eq(userOrganizations.userId, locals.session.user.id))
		.limit(1);
	if (!userOrg) throw error(400, 'No organization found');

	await db
		.update(organizations)
		.set({ securityTools })
		.where(eq(organizations.id, userOrg.organizationId));

	return json({ ok: true });
};
