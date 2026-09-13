import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';
import { db } from '$lib/server/db';
import { questionnaireQuestions, questionnaires } from '$lib/server/db/schema';
import { createOrganizationFact } from '$lib/server/organization-facts';
import { queueKnowledgeRefresh } from '$lib/server/knowledge-sync';

const PromoteFactSchema = z.object({
	label: z.string().trim().min(1).max(200),
	scope: z.enum(['company', 'questionnaire']).default('company')
});

/**
 * Promote an owner-confirmed questionnaire answer into authoritative knowledge.
 * This is deliberately an explicit action: a buyer-specific answer must never
 * silently become a company-wide policy claim.
 */
export const POST: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can verify reusable company facts'
	);
	const parsed = PromoteFactSchema.safeParse(await request.json().catch(() => ({})));
	if (!parsed.success) throw error(400, 'Provide a fact label and scope.');

	const [questionnaire] = await db
		.select({ id: questionnaires.id })
		.from(questionnaires)
		.where(and(eq(questionnaires.id, params.id), eq(questionnaires.organizationId, organizationId)))
		.limit(1);
	if (!questionnaire) throw error(404, 'Questionnaire not found.');

	const [question] = await db
		.select()
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.id, params.qid),
				eq(questionnaireQuestions.questionnaireId, questionnaire.id),
				eq(questionnaireQuestions.organizationId, organizationId)
			)
		)
		.limit(1);
	if (!question) throw error(404, 'Question not found.');

	const value = (question.userEditedAnswer ?? '').trim();
	if (!value) {
		throw error(400, 'Save an owner-confirmed answer before making it a reusable fact.');
	}

	let fact;
	try {
		fact = await createOrganizationFact({
			organizationId,
			actorUserId: userId,
			category: question.domain ?? 'general',
			label: parsed.data.label,
			value,
			scope: parsed.data.scope,
			questionnaireId: parsed.data.scope === 'questionnaire' ? questionnaire.id : null,
			status: 'verified',
			sourceDetail: `Owner-confirmed from questionnaire question: ${question.questionText.slice(0, 1_500)}`
		});
	} catch (cause) {
		if (typeof cause === 'object' && cause !== null && 'code' in cause && cause.code === '23505') {
			throw error(
				409,
				'A fact with this category and label already exists. Choose a more specific label.'
			);
		}
		throw cause;
	}

	const refreshedQuestionnaires = await queueKnowledgeRefresh({
		organizationId,
		questionnaireId: parsed.data.scope === 'questionnaire' ? questionnaire.id : undefined
	});

	return json({ fact, refreshedQuestionnaires }, { status: 201 });
};
