// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { policies } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const policyList = await db
		.select()
		.from(policies)
		.where(eq(policies.organizationId, locals.organizationId))
		.orderBy(desc(policies.createdAt));

	return { policies: policyList };
};
