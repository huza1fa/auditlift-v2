import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { activityLogs } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const activities = await db
		.select({
			id: activityLogs.id,
			action: activityLogs.action,
			entityType: activityLogs.entityType,
			entityName: activityLogs.entityName,
			controlCode: activityLogs.controlCode,
			details: activityLogs.details,
			userName: activityLogs.userName,
			createdAt: activityLogs.createdAt
		})
		.from(activityLogs)
		.where(eq(activityLogs.organizationId, locals.organizationId))
		.orderBy(desc(activityLogs.createdAt))
		.limit(200);

	return {
		activities: activities.map((a) => ({
			...a,
			createdAt: a.createdAt.toISOString()
		}))
	};
};
