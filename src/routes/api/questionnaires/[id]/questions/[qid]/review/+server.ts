import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaireQuestions } from '$lib/server/db/schema';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';
import { checkRateLimit } from '$lib/server/rate-limit';
import { fingerprint } from '$lib/server/answer-freshness';
import { loadKnowledgeFreshness } from '$lib/server/knowledge-freshness';
import {
	QuestionSourceReviewSchema,
	selectReviewedCitations,
	quotesMatchSources
} from '$lib/server/answer-review';
import { logActivity } from '$lib/server/activity';

export const POST: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId, userEmail } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can sign off reviewed answers'
	);
	if (![params.id, params.qid].every((id) => z.string().uuid().safeParse(id).success))
		throw error(400, 'Invalid questionnaire or question ID.');
	if (!(await checkRateLimit(`answer-review:${organizationId}:${userId}`, 30, 60_000)))
		throw error(429, 'Too many answer reviews. Please try again shortly.');
	const parsed = QuestionSourceReviewSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) throw error(400, 'Invalid source review.');
	const input = parsed.data;
	await db.transaction(async (tx) => {
		const [question] = await tx
			.select()
			.from(questionnaireQuestions)
			.where(
				and(
					eq(questionnaireQuestions.id, params.qid),
					eq(questionnaireQuestions.questionnaireId, params.id),
					eq(questionnaireQuestions.organizationId, organizationId)
				)
			)
			.for('update');
		if (!question) throw error(404, 'Question not found.');
		if (fingerprint(question) !== input.revision)
			throw error(409, 'The answer changed while you were reviewing. Reload before continuing.');
		if (
			!(question.userEditedAnswer ?? question.generatedAnswer)?.trim() ||
			question.confidence === 'gap'
		)
			throw error(400, 'Resolve this answer before signing off its sources.');
		const context = await loadKnowledgeFreshness(organizationId, tx);
		if (context.revision !== input.sourceRevision)
			throw error(409, 'Sources changed while you were reviewing. Reload before continuing.');
		const citations = selectReviewedCitations(question.citations, input);
		if (!citations) throw error(400, 'Invalid source selection or supporting quote.');
		if (!quotesMatchSources(citations, context.reviewSources(citations, params.id)))
			throw error(
				409,
				'Each selected citation must quote its current, available source. Update the quote or remove the source.'
			);
		await tx
			.update(questionnaireQuestions)
			.set({ citations: context.stamp(citations, params.id), updatedAt: new Date() })
			.where(
				and(
					eq(questionnaireQuestions.id, question.id),
					eq(questionnaireQuestions.questionnaireId, params.id),
					eq(questionnaireQuestions.organizationId, organizationId)
				)
			);
	});
	await logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name ?? userEmail,
		action: 'questionnaire.answer_review',
		entityType: 'questionnaire',
		entityId: params.id,
		details: `Reviewed sources for question ${params.qid}; preserved answer wording`
	});
	return json({ success: true });
};
