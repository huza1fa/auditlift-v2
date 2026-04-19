import { db } from '$lib/server/db';
import {
	questionnaires,
	questionnaireQuestions,
	policies,
	controls,
	organizationFrameworks,
	organizations,
	subscriptions
} from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { hasActivePaidAccess } from '$lib/server/billing';

const TRIAL_QUESTION_LIMIT = 15;
const BATCH_SIZE = 5; // Questions per API call
const PARALLEL_BATCHES = 3; // Concurrent API calls

const QuestionClassificationSchema = z.object({
	domain: z.string(),
	confidence: z.enum(['high', 'medium', 'low', 'gap']),
	answer: z.string().nullable(),
	gapReason: z.string().nullable(),
	gapRemediation: z.string().nullable(),
	mappedPolicyIds: z.array(z.string()),
	mappedControlIds: z.array(z.string())
});

const BatchClassificationSchema = z.object({
	results: z.array(QuestionClassificationSchema)
});

type QuestionClassification = z.infer<typeof QuestionClassificationSchema>;

interface ProcessingContext {
	orgName: string;
	isPaid: boolean;
	policyContext: Array<{ id: string; title: string; contentSnippet: string }>;
	controlContext: Array<{
		id: string;
		code: string;
		title: string;
		category: string;
		whatAuditorExpects: string;
	}>;
}

function getOpenRouterClient() {
	const apiKey = env.OPEN_ROUTER_API_KEY;
	if (!apiKey) throw new Error('OPEN_ROUTER_API_KEY is not configured');
	return createOpenAI({
		baseURL: 'https://openrouter.ai/api/v1',
		apiKey,
		headers: {
			'HTTP-Referer': 'https://auditlift.app',
			'X-Title': 'AuditLift'
		}
	});
}

async function classifyQuestion(
	questionText: string,
	orgName: string,
	policyContext: Array<{ id: string; title: string; contentSnippet: string }>,
	controlContext: Array<{
		id: string;
		code: string;
		title: string;
		category: string;
		whatAuditorExpects: string;
	}>
): Promise<QuestionClassification> {
	const openrouter = getOpenRouterClient();

	const policiesList = policyContext
		.map((p) => `- [${p.id}] ${p.title}: ${p.contentSnippet}`)
		.join('\n');

	const controlsList = controlContext
		.map((c) => `- [${c.id}] ${c.code} ${c.title} (${c.category}): ${c.whatAuditorExpects}`)
		.join('\n');

	const hasOrgContext = policyContext.length > 0 || controlContext.length > 0;

	const prompt = `You are helping answer a security questionnaire on behalf of ${orgName}.

${
	hasOrgContext
		? `Use the provided policies and controls as your primary source. You may supplement with general industry-standard security practices when the provided context is incomplete.

Available policies:
${policiesList || '(none)'}

Available controls:
${controlsList || '(none)'}`
		: `${orgName} has not yet generated policies or mapped controls. Draft a reasonable answer based on industry-standard security practices (SOC 2, ISO 27001, NIST) that a typical SaaS company would follow. The answer will be marked as low confidence so the user can review and customize it.`
}

<question>${questionText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</question>

Instructions:
- domain: classify this question into one of: access_control, data_security, incident_response, vendor_management, business_continuity, cryptography, physical_security, other
- confidence:
    high = answered directly from a specific org policy with concrete detail
    medium = answered from related org policies/controls but inferred
    low = answered using general security best practices (no org-specific policy found)
    gap = question requires org-specific data (e.g. specific vendor names, exact employee counts, custom SLAs) that cannot be drafted generically
- answer: draft a helpful answer. Use "low" confidence for general-practice answers. Only return null for true gaps that need specific org data.
- gapReason: why this cannot be answered even generically (only for gap). null otherwise.
- gapRemediation: specific action to resolve this gap e.g. "Generate an Access Control Policy" or "Upload MFA evidence for CC6.1". null if high/medium/low confidence.
- mappedPolicyIds: array of policy IDs you used (from the list above, empty if none)
- mappedControlIds: array of control IDs you used (from the list above, empty if none)`;

	const result = await generateObject({
		model: openrouter('openai/gpt-4o-mini'),
		schema: QuestionClassificationSchema,
		prompt
	});

	return result.object;
}

/**
 * Classify multiple questions in a single API call.
 * Returns results in the same order as the input questions.
 * Falls back to individual classification if batch fails.
 */
async function classifyQuestionBatch(
	questions: Array<{ id: string; questionText: string }>,
	orgName: string,
	policyContext: ProcessingContext['policyContext'],
	controlContext: ProcessingContext['controlContext']
): Promise<Array<{ questionId: string; classification: QuestionClassification }>> {
	if (questions.length === 0) return [];

	// Single question — use the existing function
	if (questions.length === 1) {
		const classification = await classifyQuestion(
			questions[0].questionText,
			orgName,
			policyContext,
			controlContext
		);
		return [{ questionId: questions[0].id, classification }];
	}

	const openrouter = getOpenRouterClient();

	const policiesList = policyContext
		.map((p) => `- [${p.id}] ${p.title}: ${p.contentSnippet}`)
		.join('\n');

	const controlsList = controlContext
		.map((c) => `- [${c.id}] ${c.code} ${c.title} (${c.category}): ${c.whatAuditorExpects}`)
		.join('\n');

	const hasOrgContext = policyContext.length > 0 || controlContext.length > 0;

	const questionsList = questions
		.map(
			(q, i) =>
				`<question index="${i}">${q.questionText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</question>`
		)
		.join('\n');

	const prompt = `You are helping answer a security questionnaire on behalf of ${orgName}.

${
	hasOrgContext
		? `Use the provided policies and controls as your primary source. Supplement with general industry-standard security practices when the provided context is incomplete.

Available policies:
${policiesList || '(none)'}

Available controls:
${controlsList || '(none)'}`
		: `${orgName} has not yet generated policies or mapped controls. Draft reasonable answers based on industry-standard security practices (SOC 2, ISO 27001, NIST). Answers will be marked as low confidence.`
}

Classify and answer each of these ${questions.length} questions. Return a "results" array with exactly ${questions.length} items, one per question, in the same order.

${questionsList}

For each question return:
- domain: one of access_control, data_security, incident_response, vendor_management, business_continuity, cryptography, physical_security, vulnerability_management, change_management, privacy, remote_work, ai_usage, data_retention, general, other
- confidence: high | medium | low | gap
- answer: draft answer (null only for gaps)
- gapReason: why it can't be answered (null unless gap)
- gapRemediation: action to fix the gap (null unless gap)
- mappedPolicyIds: policy IDs used (from list above)
- mappedControlIds: control IDs used (from list above)`;

	try {
		const result = await generateObject({
			model: openrouter('openai/gpt-4o-mini'),
			schema: BatchClassificationSchema,
			prompt
		});

		const results = result.object.results;

		// Ensure we got the right number of results
		if (results.length === questions.length) {
			return questions.map((q, i) => ({
				questionId: q.id,
				classification: results[i]
			}));
		}

		// Mismatch — fall back to individual processing
		console.warn(
			`[questionnaire-processor] Batch returned ${results.length} results for ${questions.length} questions, falling back to individual`
		);
	} catch (batchErr) {
		console.warn('[questionnaire-processor] Batch classification failed, falling back:', batchErr);
	}

	// Fallback: process individually
	const fallbackResults: Array<{ questionId: string; classification: QuestionClassification }> = [];
	for (const q of questions) {
		const classification = await classifyQuestion(q.questionText, orgName, policyContext, controlContext);
		fallbackResults.push({ questionId: q.id, classification });
	}
	return fallbackResults;
}

/**
 * Loads all org-level context needed for classifying questions: org name,
 * paid status, policy snippets, and control list from enrolled frameworks.
 */
async function loadProcessingContext(organizationId: string): Promise<ProcessingContext> {
	const [org] = await db
		.select()
		.from(organizations)
		.where(eq(organizations.id, organizationId))
		.limit(1);

	const [subscription] = await db
		.select()
		.from(subscriptions)
		.where(eq(subscriptions.organizationId, organizationId))
		.limit(1);

	const orgName = org?.name ?? 'the organization';
	const isPaid = hasActivePaidAccess(subscription ?? null);

	const orgPolicies = await db
		.select({
			id: policies.id,
			title: policies.title,
			type: policies.type,
			content: policies.content,
			archivedAt: policies.archivedAt
		})
		.from(policies)
		.where(eq(policies.organizationId, organizationId));

	const policyContext = orgPolicies
		.filter((p) => p.archivedAt === null)
		.map((p) => ({
			id: p.id,
			title: p.title,
			contentSnippet: p.content.slice(0, 500)
		}));

	const orgFrameworkRows = await db
		.select({ frameworkId: organizationFrameworks.frameworkId })
		.from(organizationFrameworks)
		.where(eq(organizationFrameworks.organizationId, organizationId));

	const frameworkIds = orgFrameworkRows.map((r) => r.frameworkId);

	const orgControls =
		frameworkIds.length > 0
			? await db
					.select({
						id: controls.id,
						code: controls.code,
						title: controls.title,
						category: controls.category,
						whatAuditorExpects: controls.whatAuditorExpects
					})
					.from(controls)
					.where(inArray(controls.frameworkId, frameworkIds))
			: [];

	const controlContext = orgControls.map((c) => ({
		id: c.id,
		code: c.code,
		title: c.title,
		category: c.category,
		whatAuditorExpects: c.whatAuditorExpects
	}));

	return { orgName, isPaid, policyContext, controlContext };
}

/**
 * Re-fetches all questions for the questionnaire, computes summary stats
 * (high/medium/low/gap counts and deal readiness score), and writes them
 * back to the questionnaires row. The processedCount parameter is used as
 * the denominator for the deal readiness score — it should equal the number
 * of questions that were actually sent to the AI (respecting trial limits).
 */
async function computeAndSaveStats(
	questionnaireId: string,
	organizationId: string,
	processedCount: number
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

	for (const q of processedQuestions) {
		if (q.confidence === 'high') highCount++;
		else if (q.confidence === 'medium') mediumCount++;
		else if (q.confidence === 'low') lowCount++;
		else if (q.confidence === 'gap') gapCount++;
	}

	const answeredCount = highCount + mediumCount + lowCount;

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
		.where(eq(questionnaires.id, questionnaireId));
}

export async function processQuestionnaire(
	questionnaireId: string,
	organizationId: string
): Promise<void> {
	try {
		// 1. Load all questions for this questionnaire
		const questions = await db
			.select()
			.from(questionnaireQuestions)
			.where(
				and(
					eq(questionnaireQuestions.questionnaireId, questionnaireId),
					eq(questionnaireQuestions.organizationId, organizationId)
				)
			)
			.orderBy(questionnaireQuestions.order);

		if (questions.length === 0) {
			await db
				.update(questionnaires)
				.set({ status: 'ready', updatedAt: new Date() })
				.where(eq(questionnaires.id, questionnaireId));
			return;
		}

		// 2. Load org context (name, subscription, policies, controls)
		const { orgName, isPaid, policyContext, controlContext } =
			await loadProcessingContext(organizationId);

		// 3. Determine how many questions to process
		const processLimit = isPaid
			? questions.length
			: Math.min(TRIAL_QUESTION_LIMIT, questions.length);
		const questionsToProcess = questions.slice(0, processLimit);

		// 4. Process questions in batches with parallel execution
		const validPolicyIds = new Set(policyContext.map((p) => p.id));
		const validControlIds = new Set(controlContext.map((c) => c.id));

		// Split into batches of BATCH_SIZE
		const batches: Array<typeof questionsToProcess> = [];
		for (let i = 0; i < questionsToProcess.length; i += BATCH_SIZE) {
			batches.push(questionsToProcess.slice(i, i + BATCH_SIZE));
		}

		// Process PARALLEL_BATCHES at a time
		for (let i = 0; i < batches.length; i += PARALLEL_BATCHES) {
			const parallelBatches = batches.slice(i, i + PARALLEL_BATCHES);

			const batchResults = await Promise.allSettled(
				parallelBatches.map((batch) =>
					classifyQuestionBatch(
						batch.map((q) => ({ id: q.id, questionText: q.questionText })),
						orgName,
						policyContext,
						controlContext
					)
				)
			);

			// Persist results from all parallel batches
			for (const result of batchResults) {
				if (result.status === 'fulfilled') {
					for (const { questionId, classification } of result.value) {
						const safePolicyIds = classification.mappedPolicyIds.filter((id) =>
							validPolicyIds.has(id)
						);
						const safeControlIds = classification.mappedControlIds.filter((id) =>
							validControlIds.has(id)
						);

						await db
							.update(questionnaireQuestions)
							.set({
								domain: classification.domain,
								confidence: classification.confidence,
								generatedAnswer: classification.answer,
								gapReason: classification.gapReason,
								gapRemediation: classification.gapRemediation,
								mappedPolicyIds: safePolicyIds,
								mappedControlIds: safeControlIds,
								updatedAt: new Date()
							})
							.where(eq(questionnaireQuestions.id, questionId));
					}
				} else {
					console.error('[questionnaire-processor] Batch failed:', result.reason);
					// Mark all questions in the failed batch as gaps
					const failedBatch = parallelBatches[batchResults.indexOf(result)];
					if (failedBatch) {
						for (const question of failedBatch) {
							await db
								.update(questionnaireQuestions)
								.set({
									confidence: 'gap',
									gapReason: 'Processing failed due to an internal error.',
									updatedAt: new Date()
								})
								.where(eq(questionnaireQuestions.id, question.id));
						}
					}
				}
			}
		}

		// 5. Compute and persist summary stats
		await computeAndSaveStats(questionnaireId, organizationId, processLimit);
	} catch (err) {
		console.error('[questionnaire-processor] Fatal error:', err);
		await db
			.update(questionnaires)
			.set({
				status: 'error',
				errorMessage: err instanceof Error ? err.message : 'Unknown error occurred',
				updatedAt: new Date()
			})
			.where(eq(questionnaires.id, questionnaireId));
	}
}

/**
 * Re-runs AI classification for all questions in a questionnaire that:
 * - Have NOT been edited by the user (userEditedAnswer IS NULL)
 * - Have a confidence of 'gap', 'low', or 'medium' (skips 'high' and unprocessed)
 *
 * The questionnaire status is set to 'processing' at the start and 'ready'
 * (or 'error') at the end. Summary stats are recomputed after all updates.
 */
export async function reprocessQuestionnaire(
	questionnaireId: string,
	organizationId: string
): Promise<void> {
	try {
		// 1. Mark as processing
		await db
			.update(questionnaires)
			.set({ status: 'processing', updatedAt: new Date() })
			.where(
				and(
					eq(questionnaires.id, questionnaireId),
					eq(questionnaires.organizationId, organizationId)
				)
			);

		// 2. Load all questions for this questionnaire scoped to org
		const allQuestions = await db
			.select()
			.from(questionnaireQuestions)
			.where(
				and(
					eq(questionnaireQuestions.questionnaireId, questionnaireId),
					eq(questionnaireQuestions.organizationId, organizationId)
				)
			)
			.orderBy(questionnaireQuestions.order);

		// 3. Filter to only eligible questions:
		//    - No user edit (userEditedAnswer IS NULL)
		//    - Confidence is gap, low, or medium (not high, not unprocessed/null)
		const REPROCESS_CONFIDENCES = new Set(['gap', 'low', 'medium']);
		const eligibleQuestions = allQuestions.filter(
			(q) =>
				q.userEditedAnswer === null &&
				q.confidence !== null &&
				REPROCESS_CONFIDENCES.has(q.confidence)
		);

		if (eligibleQuestions.length === 0) {
			// Nothing to reprocess — mark ready immediately
			await db
				.update(questionnaires)
				.set({ status: 'ready', updatedAt: new Date() })
				.where(eq(questionnaires.id, questionnaireId));
			return;
		}

		// 4. Load processing context
		const { orgName, isPaid, policyContext, controlContext } =
			await loadProcessingContext(organizationId);

		// 5. Apply trial question limit to the eligible set
		const processLimit = isPaid
			? eligibleQuestions.length
			: Math.min(TRIAL_QUESTION_LIMIT, eligibleQuestions.length);
		const questionsToProcess = eligibleQuestions.slice(0, processLimit);

		// 6. Reclassify eligible questions in batches with parallel execution
		const validPolicyIds = new Set(policyContext.map((p) => p.id));
		const validControlIds = new Set(controlContext.map((c) => c.id));

		const batches: Array<typeof questionsToProcess> = [];
		for (let i = 0; i < questionsToProcess.length; i += BATCH_SIZE) {
			batches.push(questionsToProcess.slice(i, i + BATCH_SIZE));
		}

		for (let i = 0; i < batches.length; i += PARALLEL_BATCHES) {
			const parallelBatches = batches.slice(i, i + PARALLEL_BATCHES);

			const batchResults = await Promise.allSettled(
				parallelBatches.map((batch) =>
					classifyQuestionBatch(
						batch.map((q) => ({ id: q.id, questionText: q.questionText })),
						orgName,
						policyContext,
						controlContext
					)
				)
			);

			for (const result of batchResults) {
				if (result.status === 'fulfilled') {
					for (const { questionId, classification } of result.value) {
						const safePolicyIds = classification.mappedPolicyIds.filter((id) =>
							validPolicyIds.has(id)
						);
						const safeControlIds = classification.mappedControlIds.filter((id) =>
							validControlIds.has(id)
						);

						await db
							.update(questionnaireQuestions)
							.set({
								domain: classification.domain,
								confidence: classification.confidence,
								generatedAnswer: classification.answer,
								gapReason: classification.gapReason,
								gapRemediation: classification.gapRemediation,
								mappedPolicyIds: safePolicyIds,
								mappedControlIds: safeControlIds,
								updatedAt: new Date()
							})
							.where(
								and(
									eq(questionnaireQuestions.id, questionId),
									eq(questionnaireQuestions.organizationId, organizationId)
								)
							);
					}
				} else {
					console.error('[questionnaire-processor] reprocess batch failed:', result.reason);
					const failedBatch = parallelBatches[batchResults.indexOf(result)];
					if (failedBatch) {
						for (const question of failedBatch) {
							await db
								.update(questionnaireQuestions)
								.set({
									confidence: 'gap',
									gapReason: 'Reprocessing failed due to an internal error.',
									updatedAt: new Date()
								})
								.where(
									and(
										eq(questionnaireQuestions.id, question.id),
										eq(questionnaireQuestions.organizationId, organizationId)
									)
								);
						}
					}
				}
			}
		}

		// 7. Recompute summary stats across all questions (not just reprocessed ones)
		//    Use total all-question count as denominator to keep score consistent
		await computeAndSaveStats(questionnaireId, organizationId, allQuestions.length);
	} catch (err) {
		console.error('[questionnaire-processor] reprocess fatal error:', err);
		await db
			.update(questionnaires)
			.set({
				status: 'error',
				errorMessage: err instanceof Error ? err.message : 'Unknown error occurred',
				updatedAt: new Date()
			})
			.where(eq(questionnaires.id, questionnaireId));
	}
}
