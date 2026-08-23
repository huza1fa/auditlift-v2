import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	questionnaires,
	questionnaireQuestions,
	organizations,
	policies,
	controls
} from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { checkRateLimit } from '$lib/server/rate-limit';

export const load: PageServerLoad = async ({ params, getClientAddress }) => {
	const token = params.token;
	if (!token) throw error(400, 'Invalid share link');

	try {
		if (!(await checkRateLimit(`share-view:${getClientAddress()}`, 120, 60 * 60 * 1000))) {
			throw error(429, 'Too many requests. Please slow down.');
		}
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) throw e;
	}

	// Find questionnaire by share token
	const [questionnaire] = await db
		.select()
		.from(questionnaires)
		.where(and(eq(questionnaires.shareToken, token), eq(questionnaires.status, 'ready')))
		.limit(1);

	if (!questionnaire || !questionnaire.sharedAt) {
		throw error(404, 'This questionnaire is not shared or does not exist');
	}

	if (!questionnaire.shareExpiresAt || questionnaire.shareExpiresAt < new Date()) {
		throw error(404, 'This share link has expired. Ask for a fresh link.');
	}

	// Load org name
	const [org] = await db
		.select({ name: organizations.name })
		.from(organizations)
		.where(eq(organizations.id, questionnaire.organizationId))
		.limit(1);

	if (!org) throw error(404, 'Organization not found');

	// Load all questions
	const questions = await db
		.select({
			id: questionnaireQuestions.id,
			sectionName: questionnaireQuestions.sectionName,
			questionNumber: questionnaireQuestions.questionNumber,
			questionText: questionnaireQuestions.questionText,
			domain: questionnaireQuestions.domain,
			confidence: questionnaireQuestions.confidence,
			generatedAnswer: questionnaireQuestions.generatedAnswer,
			userEditedAnswer: questionnaireQuestions.userEditedAnswer,
			gapReason: questionnaireQuestions.gapReason,
			order: questionnaireQuestions.order
		})
		.from(questionnaireQuestions)
		.where(eq(questionnaireQuestions.questionnaireId, questionnaire.id))
		.orderBy(questionnaireQuestions.order);

	// Load mapped policy IDs from the questions
	const fullQuestions = await db
		.select({
			id: questionnaireQuestions.id,
			mappedPolicyIds: questionnaireQuestions.mappedPolicyIds
		})
		.from(questionnaireQuestions)
		.where(eq(questionnaireQuestions.questionnaireId, questionnaire.id));

	const policyIdSet = new Set<string>();
	for (const q of fullQuestions) {
		if (q.mappedPolicyIds && Array.isArray(q.mappedPolicyIds)) {
			for (const id of q.mappedPolicyIds as string[]) policyIdSet.add(id);
		}
	}

	let policyMap: Record<string, string> = {};
	if (policyIdSet.size > 0) {
		const policyRows = await db
			.select({ id: policies.id, title: policies.title })
			.from(policies)
			.where(
				and(
					eq(policies.organizationId, questionnaire.organizationId),
					inArray(policies.id, [...policyIdSet])
				)
			);
		for (const p of policyRows) policyMap[p.id] = p.title;
	}

	return {
		organizationName: org.name,
		questionnaire: {
			filename: questionnaire.filename,
			dealReadinessScore: questionnaire.dealReadinessScore,
			totalQuestions: questionnaire.totalQuestions,
			answeredCount: questionnaire.answeredCount,
			gapCount: questionnaire.gapCount,
			highCount: questionnaire.highCount,
			mediumCount: questionnaire.mediumCount,
			lowCount: questionnaire.lowCount,
			sharedAt: questionnaire.sharedAt
		},
		questions: questions.map((q) => ({
			...q,
			answer: q.userEditedAnswer ?? q.generatedAnswer
		})),
		policyMap
	};
};
