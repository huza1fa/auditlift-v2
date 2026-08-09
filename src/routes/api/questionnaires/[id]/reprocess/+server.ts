import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { checkRateLimit } from '$lib/server/rate-limit';
import { reprocessQuestionnaire } from '$lib/server/questionnaire-processor';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { organizationId: orgId } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot reprocess questionnaires',
		'Your trial has expired. Please upgrade to continue.'
	);

	// 3. Rate limit — 5 reprocesses per org per hour
	if (!checkRateLimit(`reprocess:${orgId}`, 5, 60 * 60 * 1000)) {
		throw error(429, 'Too many reprocess requests. Please wait before trying again.');
	}

	// 4. Validate questionnaire ID
	const questionnaireId = params.id;
	if (!questionnaireId) {
		throw error(400, 'Missing questionnaire ID');
	}

	// 5. Verify questionnaire exists, belongs to this org, and is in a reprocessable state
	const [questionnaire] = await db
		.select({ id: questionnaires.id, status: questionnaires.status })
		.from(questionnaires)
		.where(and(eq(questionnaires.id, questionnaireId), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) {
		throw error(404, 'Questionnaire not found');
	}

	if (questionnaire.status === 'processing') {
		throw error(409, 'Questionnaire is already being processed. Please wait for it to complete.');
	}

	// 6. Persist the job before acknowledging the request.
	await reprocessQuestionnaire(questionnaireId, orgId);

	return json({ success: true });
};
