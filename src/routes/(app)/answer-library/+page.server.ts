import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { userOrganizations } from '$lib/server/db/schema';
import { loadKnowledgeFreshness } from '$lib/server/knowledge-freshness';
import { answerRevision } from '$lib/server/answer-freshness';
import { isReadOnly } from '$lib/server/billing';

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
	const context = await loadKnowledgeFreshness(locals.organizationId);
	const entries = context.entries
		.map((entry) => ({
			...entry,
			revision: answerRevision(entry),
			issues: context.entryIssues(entry.id),
			sources: context.reviewSources(entry.citations)
		}))
		.sort((a, b) => b.reviewedAt.getTime() - a.reviewedAt.getTime());
	return {
		entries,
		sourceRevision: context.revision,
		canApprove:
			!isReadOnly(locals.subscription, locals.organization?.trialEndsAt) &&
			(membership?.role === 'owner' || membership?.role === 'admin')
	};
};
