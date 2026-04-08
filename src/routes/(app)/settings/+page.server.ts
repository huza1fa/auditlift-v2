import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { subscriptions, userOrganizations } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const [subscription] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.organizationId, locals.organizationId))
		.limit(1);

	const [membership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, locals.organizationId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	return {
		organization: locals.organization,
		subscription: subscription ?? null,
		userRole: membership?.role ?? 'member'
	};
};
