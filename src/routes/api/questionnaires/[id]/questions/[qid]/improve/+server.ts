import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires, questionnaireQuestions } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { checkRateLimit } from '$lib/server/rate-limit';
import { ImproveAnswerSchema } from '$lib/server/validation';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { env } from '$env/dynamic/private';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';

function getOpenRouterClient() {
	const apiKey = env.OPEN_ROUTER_API_KEY;
	if (!apiKey) throw error(503, 'AI improvement is not configured');
	return createOpenAI({
		baseURL: 'https://openrouter.ai/api/v1',
		apiKey,
		headers: {
			'HTTP-Referer': 'https://auditlift.app',
			'X-Title': 'Auditlift'
		}
	});
}

export const POST: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId: orgId } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot improve questionnaire answers',
		'Trial expired. Upgrade to improve answers with AI.'
	);

	if (!(await checkRateLimit(`improve:${orgId}`, 30, 60 * 60 * 1000))) {
		throw error(429, 'Too many answer improvements. Please wait before trying again.');
	}

	const { id, qid } = params;

	// Validate input
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const parsed = ImproveAnswerSchema.safeParse(body);
	if (!parsed.success) {
		throw error(400, 'Invalid input: refinementPrompt must be between 1 and 500 characters');
	}

	const { refinementPrompt } = parsed.data;

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

	// Determine the current answer to refine
	const currentAnswer = existing.userEditedAnswer ?? existing.generatedAnswer;
	if (!currentAnswer) {
		throw error(422, 'No answer to improve — this question has not been answered yet');
	}

	// Call OpenRouter AI (retry once before giving up)
	const openrouter = getOpenRouterClient();
	const modelName = (env.QUESTIONNAIRE_AI_MODELS || 'openai/gpt-4o-mini').split(',')[0].trim();
	let improvedAnswer: string | null = null;
	let lastError: unknown;
	for (let attempt = 1; attempt <= 2 && !improvedAnswer; attempt++) {
		try {
			const result = await generateText({
				model: openrouter(modelName),
				prompt: `You are refining a security questionnaire answer.

<current_answer>
${currentAnswer.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
</current_answer>

<instruction>${refinementPrompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</instruction>

Rewrite the answer applying the instruction. Preserve factual accuracy and do not introduce company-specific tools, practices, certifications, or commitments that are absent from the current answer. Return only the revised answer text with no preamble, no explanation, and no markdown formatting.`
			});
			improvedAnswer = result.text.trim() || null;
		} catch (err) {
			lastError = err;
			if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 800));
		}
	}
	if (!improvedAnswer) {
		console.error('[improve-answer] AI improvement failed:', lastError);
		throw error(502, 'AI improvement failed. Please try again.');
	}

	// Persist the improved answer as userEditedAnswer
	await db
		.update(questionnaireQuestions)
		.set({
			userEditedAnswer: improvedAnswer,
			updatedAt: new Date()
		})
		.where(
			and(
				eq(questionnaireQuestions.id, qid),
				eq(questionnaireQuestions.questionnaireId, id),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		);

	return json({ answer: improvedAnswer });
};
