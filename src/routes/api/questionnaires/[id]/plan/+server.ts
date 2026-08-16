import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { requireOrganizationRole } from '$lib/server/auth-utils';
import { db } from '$lib/server/db';
import {
	controls,
	evidence,
	policies,
	policyControls,
	questionnaireQuestions,
	questionnaires
} from '$lib/server/db/schema';
import { buildRemediationPlan } from '$lib/server/deal-remediation';

const QuestionnaireIdSchema = z.string().uuid();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: RequestHandler = async ({ locals, params }) => {
	const { organizationId } = await requireOrganizationRole(locals);
	const parsedId = QuestionnaireIdSchema.safeParse(params.id);
	if (!parsedId.success) throw error(400, 'Invalid questionnaire id');
	const questionnaireId = parsedId.data;

	const [questionnaire] = await db
		.select({ id: questionnaires.id, status: questionnaires.status })
		.from(questionnaires)
		.where(
			and(eq(questionnaires.id, questionnaireId), eq(questionnaires.organizationId, organizationId))
		)
		.limit(1);
	if (!questionnaire) throw error(404, 'Questionnaire not found');

	const [questions, activePolicies, policyMappings, activeEvidence] = await Promise.all([
		db
			.select()
			.from(questionnaireQuestions)
			.where(
				and(
					eq(questionnaireQuestions.questionnaireId, questionnaireId),
					eq(questionnaireQuestions.organizationId, organizationId)
				)
			)
			.orderBy(asc(questionnaireQuestions.order)),
		db
			.select({ id: policies.id, controlId: policies.controlId })
			.from(policies)
			.where(and(eq(policies.organizationId, organizationId), isNull(policies.archivedAt))),
		db
			.select({ controlId: policyControls.controlId })
			.from(policyControls)
			.innerJoin(
				policies,
				and(
					eq(policyControls.policyId, policies.id),
					eq(policyControls.organizationId, policies.organizationId)
				)
			)
			.where(and(eq(policyControls.organizationId, organizationId), isNull(policies.archivedAt))),
		db
			.select({ controlId: evidence.controlId })
			.from(evidence)
			.where(
				and(
					eq(evidence.organizationId, organizationId),
					eq(evidence.status, 'active'),
					isNull(evidence.deletedAt)
				)
			)
	]);

	const mappedControlIds = [
		...new Set(
			questions
				.flatMap((question) => (question.mappedControlIds as string[] | null) ?? [])
				.filter((id) => UUID_RE.test(id))
		)
	];
	const mappedControls =
		mappedControlIds.length > 0
			? await db
					.select({
						id: controls.id,
						code: controls.code,
						title: controls.title,
						category: controls.category
					})
					.from(controls)
					.where(inArray(controls.id, mappedControlIds))
			: [];

	const controlIdsWithPolicy = new Set([
		...activePolicies.flatMap((policy) => (policy.controlId ? [policy.controlId] : [])),
		...policyMappings.map((mapping) => mapping.controlId)
	]);
	const plan = buildRemediationPlan({
		questions: questions.map((question) => ({
			...question,
			mappedControlIds: (question.mappedControlIds as string[] | null) ?? [],
			mappedPolicyIds: (question.mappedPolicyIds as string[] | null) ?? []
		})),
		controls: mappedControls,
		existingPolicyIds: new Set(activePolicies.map((policy) => policy.id)),
		controlIdsWithPolicy,
		controlIdsWithEvidence: new Set(activeEvidence.map((item) => item.controlId))
	});

	return json({ questionnaireId, questionnaireStatus: questionnaire.status, ...plan });
};
