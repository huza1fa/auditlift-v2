// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { frameworks, organizationFrameworks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const allFrameworks = await db.select().from(frameworks);
	const orgFrameworks = await db
		.select()
		.from(organizationFrameworks)
		.where(eq(organizationFrameworks.organizationId, locals.organizationId));

	const activeIds = new Set(orgFrameworks.map((f) => f.frameworkId));

	return {
		frameworks: allFrameworks.map((f) => ({ ...f, active: activeIds.has(f.id) }))
	};
};
