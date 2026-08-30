import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { answerLibraryEntries, userOrganizations } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');
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
	const entries = await db
		.select()
		.from(answerLibraryEntries)
		.where(eq(answerLibraryEntries.organizationId, locals.organizationId))
		.orderBy(desc(answerLibraryEntries.reviewedAt));
	return { entries, canApprove: membership?.role === 'owner' || membership?.role === 'admin' };
};
