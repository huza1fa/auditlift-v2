// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { subscriptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const [subscription] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.organizationId, locals.organizationId))
		.limit(1);

	return {
		organization: locals.organization,
		subscription: subscription ?? null
	};
};
