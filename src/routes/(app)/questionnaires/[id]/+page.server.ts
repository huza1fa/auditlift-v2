import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasActivePaidAccess } from '$lib/server/billing';
import { db } from '$lib/server/db';
import { deals, userOrganizations } from '$lib/server/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) redirect(302, '/login');
	const [membership] = locals.organizationId
		? await db
				.select({ role: userOrganizations.role })
				.from(userOrganizations)
				.where(
					and(
						eq(userOrganizations.organizationId, locals.organizationId),
						eq(userOrganizations.userId, locals.session.user.id)
					)
				)
				.limit(1)
		: [];
	const dealOptions = locals.organizationId
		? await db
				.select({
					id: deals.id,
					customerName: deals.customerName,
					name: deals.name,
					status: deals.status
				})
				.from(deals)
				.where(eq(deals.organizationId, locals.organizationId))
				.orderBy(desc(deals.updatedAt))
		: [];
	return {
		hasActivePaidAccess: hasActivePaidAccess(locals.subscription),
		canApproveAnswers: membership?.role === 'owner' || membership?.role === 'admin',
		dealOptions
	};
};
