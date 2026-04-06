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

const QuestionClassificationSchema = z.object({
	domain: z.string(),
	confidence: z.enum(['high', 'medium', 'low', 'gap']),
	answer: z.string().nullable(),
	gapReason: z.string().nullable(),
	gapRemediation: z.string().nullable(),
	mappedPolicyIds: z.array(z.string()),
	mappedControlIds: z.array(z.string())
});

type QuestionClassification = z.infer<typeof QuestionClassificationSchema>;

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

Question: "${questionText}"

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

		// 2. Load org details (for name) and subscription
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

		// 3. Determine how many questions to process
		const processLimit = isPaid
			? questions.length
			: Math.min(TRIAL_QUESTION_LIMIT, questions.length);
		const questionsToProcess = questions.slice(0, processLimit);

		// 4. Load org's policies (first 2000 chars of content)
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

		// 5. Load org's controls via their frameworks
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

		// 6. Process each question
		for (const question of questionsToProcess) {
			try {
				const classification = await classifyQuestion(
					question.questionText,
					orgName,
					policyContext,
					controlContext
				);

				// Validate AI-returned IDs against known IDs — the model sometimes
				// returns control codes (e.g. "5.2") instead of UUIDs.
				const validPolicyIds = new Set(policyContext.map((p) => p.id));
				const validControlIds = new Set(controlContext.map((c) => c.id));
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
					.where(eq(questionnaireQuestions.id, question.id));
			} catch (questionErr) {
				console.error(
					`[questionnaire-processor] Failed to process question ${question.id}:`,
					questionErr
				);
				// Mark as gap on failure so it's still accounted for
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

		// 7. Re-fetch all processed questions to compute summary stats
		const processedQuestions = await db
			.select({
				confidence: questionnaireQuestions.confidence
			})
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
		const totalProcessed = processLimit;

		const dealReadinessScore =
			totalProcessed > 0
				? Math.min(
						100,
						Math.round((highCount * 100 + mediumCount * 70 + lowCount * 40) / totalProcessed)
					)
				: 0;

		await db
			.update(questionnaires)
			.set({
				status: 'ready',
				totalQuestions,
				answeredCount,
				gapCount,
				dealReadinessScore,
				errorMessage: null,
				updatedAt: new Date()
			})
			.where(eq(questionnaires.id, questionnaireId));
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
