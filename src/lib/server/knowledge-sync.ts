import { and, eq, inArray } from 'drizzle-orm';
import { db } from './db';
import { questionnaireQuestions } from './db/schema';
import { reprocessQuestionnaire } from './questionnaire-processor';

const REFRESHABLE_CONFIDENCES = new Set(['gap', 'low', 'medium']);
const MAX_REFRESHED_QUESTIONNAIRES = 25;

/**
 * Queues only answers the AI is still allowed to improve. Human-edited answers
 * are deliberately excluded: company knowledge may improve drafts, never
 * overwrite a response someone has explicitly approved for a buyer.
 */
export async function queueKnowledgeRefresh(input: {
	organizationId: string;
	questionnaireId?: string;
	controlIds?: string[];
}): Promise<number> {
	const questions = await db
		.select({
			questionnaireId: questionnaireQuestions.questionnaireId,
			userEditedAnswer: questionnaireQuestions.userEditedAnswer,
			confidence: questionnaireQuestions.confidence,
			mappedControlIds: questionnaireQuestions.mappedControlIds
		})
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.organizationId, input.organizationId),
				...(input.questionnaireId
					? [eq(questionnaireQuestions.questionnaireId, input.questionnaireId)]
					: [])
			)
		);

	const relevantControlIds = new Set(input.controlIds ?? []);
	const questionnaireIds = [
		...new Set(
			questions
				.filter((question) => {
					if (question.userEditedAnswer !== null) return false;
					if (!question.confidence || !REFRESHABLE_CONFIDENCES.has(question.confidence))
						return false;
					if (relevantControlIds.size === 0) return true;
					return ((question.mappedControlIds as string[] | null) ?? []).some((id) =>
						relevantControlIds.has(id)
					);
				})
				.map((question) => question.questionnaireId)
		)
	].slice(0, MAX_REFRESHED_QUESTIONNAIRES);

	await Promise.all(
		questionnaireIds.map((questionnaireId) =>
			reprocessQuestionnaire(questionnaireId, input.organizationId)
		)
	);

	return questionnaireIds.length;
}
