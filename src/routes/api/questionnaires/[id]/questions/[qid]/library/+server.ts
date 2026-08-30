import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/server/db';
import {
	answerLibraryEntries,
	questionnaireQuestions,
	questionnaires
} from '$lib/server/db/schema';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';
import { logActivity } from '$lib/server/activity';

const ApproveAnswerSchema = z.object({
	scope: z.string().trim().min(1).max(120).default('Company-wide'),
	expiresAt: z.string().datetime().nullable().optional()
});

/** Promote a reviewed answer into reusable, explicitly approved company knowledge. */
export const POST: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId, userEmail } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can approve reusable company answers',
		'Trial expired. Upgrade to manage the Answer Library.'
	);
	const parsed = ApproveAnswerSchema.safeParse(await request.json().catch(() => ({})));
	if (!parsed.success) throw error(400, 'Invalid approval details.');

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

	const answer = (question.userEditedAnswer ?? question.generatedAnswer ?? '').trim();
	if (!answer || question.confidence === 'gap') {
		throw error(400, 'Resolve this question before approving it for reuse.');
	}

	const [entry] = await db
		.insert(answerLibraryEntries)
		.values({
			organizationId,
			questionText: question.questionText,
			answer,
			scope: parsed.data.scope,
			citations: question.citations ?? [],
			sourceQuestionnaireId: questionnaire.id,
			sourceQuestionId: question.id,
			reviewedBy: userId,
			reviewedAt: new Date(),
			expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null
		})
		.onConflictDoUpdate({
			target: [answerLibraryEntries.organizationId, answerLibraryEntries.sourceQuestionId],
			set: {
				questionText: question.questionText,
				answer,
				scope: parsed.data.scope,
				citations: question.citations ?? [],
				reviewedBy: userId,
				reviewedAt: new Date(),
				expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
				status: 'approved',
				updatedAt: new Date()
			}
		})
		.returning();

	await logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name ?? userEmail,
		action: 'answer_library.approve',
		entityType: 'answer_library_entry',
		entityId: entry.id,
		entityName: question.questionText.slice(0, 120),
		details: `Approved reusable answer (${entry.scope})`
	});

	return json({ entry });
};
