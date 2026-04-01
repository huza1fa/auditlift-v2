// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { activityLogs } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const logs = await db
		.select()
		.from(activityLogs)
		.where(eq(activityLogs.organizationId, locals.organizationId))
		.orderBy(desc(activityLogs.createdAt))
		.limit(50);

	return { logs };
};
