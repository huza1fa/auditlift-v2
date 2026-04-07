import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { hasActiveAccess } from '$lib/server/billing';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
		throw error(402, 'Trial expired. Upgrade to access questionnaires.');
	}

	const rows = await db
		.select({
			id: questionnaires.id,
			filename: questionnaires.filename,
			status: questionnaires.status,
			totalQuestions: questionnaires.totalQuestions,
			answeredCount: questionnaires.answeredCount,
			gapCount: questionnaires.gapCount,
			highCount: questionnaires.highCount,
			mediumCount: questionnaires.mediumCount,
			lowCount: questionnaires.lowCount,
			dealReadinessScore: questionnaires.dealReadinessScore,
			sourceFormat: questionnaires.sourceFormat,
			createdAt: questionnaires.createdAt
		})
		.from(questionnaires)
		.where(eq(questionnaires.organizationId, orgId))
		.orderBy(desc(questionnaires.createdAt));

	return json({ questionnaires: rows });
};
