import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires, questionnaireQuestions } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { hasActiveAccess } from '$lib/server/billing';
import { z } from 'zod';

const PatchAnswerSchema = z.object({
	answer: z.string().min(1).max(10000)
});

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
		throw error(402, 'Trial expired. Upgrade to edit questionnaire answers.');
	}

	const { id, qid } = params;

	// Validate input
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const parsed = PatchAnswerSchema.safeParse(body);
	if (!parsed.success) {
		throw error(400, 'Invalid input: answer must be a non-empty string');
	}

	const { answer } = parsed.data;

	// Verify the questionnaire belongs to this org
	const [questionnaire] = await db
		.select({ id: questionnaires.id })
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) {
		throw error(404, 'Questionnaire not found');
	}

	// Verify the question belongs to this questionnaire + org
	const [existing] = await db
		.select()
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.id, qid),
				eq(questionnaireQuestions.questionnaireId, id),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		)
		.limit(1);

	if (!existing) {
		throw error(404, 'Question not found');
	}

	const [updated] = await db
		.update(questionnaireQuestions)
		.set({
			userEditedAnswer: answer,
			updatedAt: new Date()
		})
		.where(eq(questionnaireQuestions.id, qid))
		.returning();

	return json(updated);
};
