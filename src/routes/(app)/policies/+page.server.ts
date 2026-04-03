import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { policies } from '$lib/server/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const policyList = await db
		.select()
		.from(policies)
		.where(and(eq(policies.organizationId, locals.organizationId), isNull(policies.archivedAt)))
		.orderBy(desc(policies.createdAt));

	return { policies: policyList };
};
