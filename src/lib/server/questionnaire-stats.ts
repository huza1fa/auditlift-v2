import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { questionnaireQuestions, questionnaires } from '$lib/server/db/schema';

/**
 * Recomputes the questionnaire summary after any question-level change.
 * A manually confirmed answer counts as high confidence, while AI-generated
 * answers retain their existing high/medium/low weighting.
 */
export async function refreshQuestionnaireStats(
	questionnaireId: string,
	organizationId: string
): Promise<void> {
	const processedQuestions = await db
		.select({ confidence: questionnaireQuestions.confidence })
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.questionnaireId, questionnaireId),
				eq(questionnaireQuestions.organizationId, organizationId)
			)
		);

	const totalQuestions = processedQuestions.length;
	let highCount = 0;
	let mediumCount = 0;
	let lowCount = 0;
	let gapCount = 0;

	for (const question of processedQuestions) {
		if (question.confidence === 'high') highCount++;
		else if (question.confidence === 'medium') mediumCount++;
		else if (question.confidence === 'low') lowCount++;
		else if (question.confidence === 'gap') gapCount++;
	}

	const answeredCount = highCount + mediumCount + lowCount;
	const processedCount = answeredCount + gapCount;
	const dealReadinessScore =
		processedCount > 0
			? Math.min(
					100,
					Math.round((highCount * 100 + mediumCount * 70 + lowCount * 40) / processedCount)
				)
			: 0;

	await db
		.update(questionnaires)
		.set({
			status: 'ready',
			totalQuestions,
			answeredCount,
			gapCount,
			highCount,
			mediumCount,
			lowCount,
			dealReadinessScore,
			errorMessage: null,
			updatedAt: new Date()
		})
		.where(
			and(eq(questionnaires.id, questionnaireId), eq(questionnaires.organizationId, organizationId))
		);
}
