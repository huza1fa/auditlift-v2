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
import { loadKnowledgeFreshness } from '$lib/server/knowledge-freshness';
import { fingerprint } from '$lib/server/answer-freshness';
import { checkRateLimit } from '$lib/server/rate-limit';

const ApproveAnswerSchema = z.object({
	scope: z.literal('Company-wide').default('Company-wide'),
	expiresAt: z.string().datetime().nullable().optional(),
	sourceRevision: z.string().regex(/^[a-f0-9]{64}$/),
	questionRevision: z.string().regex(/^[a-f0-9]{64}$/)
});

/** Promote a reviewed answer into reusable, explicitly approved company knowledge. */
export const POST: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId, userEmail } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can approve reusable company answers',
		'Trial expired. Upgrade to manage the Answer Library.'
	);
	if (![params.id, params.qid].every((id) => z.string().uuid().safeParse(id).success))
		throw error(400, 'Invalid questionnaire or question ID.');
	if (!(await checkRateLimit(`answer-review:${organizationId}:${userId}`, 30, 60_000)))
		throw error(429, 'Too many answer reviews. Please try again shortly.');
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
	if (fingerprint(question) !== parsed.data.questionRevision)
		throw error(409, 'This answer changed. Reload before approving it.');

	const answer = (question.userEditedAnswer ?? question.generatedAnswer ?? '').trim();
	if (!answer || question.confidence === 'gap') {
		throw error(400, 'Resolve this question before approving it for reuse.');
	}
	if (parsed.data.expiresAt && new Date(parsed.data.expiresAt) <= new Date())
		throw error(400, 'Choose a future review date.');
	const context = await loadKnowledgeFreshness(organizationId);
	if (context.revision !== parsed.data.sourceRevision)
		throw error(409, 'Sources changed. Reload and review the current answer and sources.');
	if (context.citationIssues(question.citations, questionnaire.id).length)
		throw error(
			409,
			'Review this answer against its current sources before approving it for reuse.'
		);
	const existingEntry = context.entries.find((entry) => entry.sourceQuestionId === question.id);
	const citations = context.stamp(question.citations ?? []);
	if (existingEntry && context.dependsOn(citations, existingEntry.id))
		throw error(
			400,
			'This answer depends on its own library entry. Review it in the Answer Library instead.'
		);
	if (context.citationIssues(citations).length)
		throw error(
			409,
			'A cited source is unavailable or needs review. Resolve its review before approving this answer.'
		);

	const [entry] = await db
		.insert(answerLibraryEntries)
		.values({
			organizationId,
			questionText: question.questionText,
			answer,
			scope: parsed.data.scope,
			citations,
			sourceQuestionnaireId: questionnaire.id,
			sourceQuestionId: question.id,
			reviewedBy: userId,
			reviewedAt: new Date(),
			expiresAt:
				parsed.data.expiresAt === null
					? null
					: new Date(parsed.data.expiresAt ?? Date.now() + 90 * 86400000)
		})
		.onConflictDoUpdate({
			target: [answerLibraryEntries.organizationId, answerLibraryEntries.sourceQuestionId],
			set: {
				questionText: question.questionText,
				answer,
				scope: parsed.data.scope,
				citations,
				reviewedBy: userId,
				reviewedAt: new Date(),
				expiresAt:
					parsed.data.expiresAt === null
						? null
						: new Date(parsed.data.expiresAt ?? Date.now() + 90 * 86400000),
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
