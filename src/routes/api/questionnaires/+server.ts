import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';

export const GET: RequestHandler = async ({ locals }) => {
	const { organizationId: orgId } = await requireOrganizationRole(locals);

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
