import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires, questionnaireQuestions, policies, controls } from '$lib/server/db/schema';
import { eq, and, asc, inArray, isNull } from 'drizzle-orm';
import { requireActiveOrganizationRole, requireOrganizationRole } from '$lib/server/auth-utils';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { organizationId: orgId } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can delete questionnaires',
		'Trial expired. Upgrade to manage questionnaires.'
	);
	const { id } = params;

	const [questionnaire] = await db
		.select()
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) throw error(404, 'Questionnaire not found');

	await db
		.delete(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.questionnaireId, id),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		);

	await db
		.delete(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)));

	return json({ success: true });
};

export const GET: RequestHandler = async ({ locals, params }) => {
	const { organizationId: orgId } = await requireOrganizationRole(locals);

	const { id } = params;

	const [questionnaire] = await db
		.select()
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) {
		throw error(404, 'Questionnaire not found');
	}

	const questions = await db
		.select()
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.questionnaireId, id),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		)
		.orderBy(asc(questionnaireQuestions.order));

	// Filter to UUIDs only — the AI may have stored control codes (e.g. "5.2")
	// instead of UUIDs for questionnaires processed before this bug was fixed.
	const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

	// Resolve policy IDs to titles for source traceability in the UI.
	const allPolicyIds = [
		...new Set(
			questions
				.flatMap((q) => (q.mappedPolicyIds as string[]) ?? [])
				.filter((id) => UUID_RE.test(id))
		)
	];
	const policyMap: Record<string, string> = {};
	if (allPolicyIds.length > 0) {
		const policyRows = await db
			.select({ id: policies.id, title: policies.title })
			.from(policies)
			.where(and(eq(policies.organizationId, orgId), inArray(policies.id, allPolicyIds)));
		for (const p of policyRows) {
			policyMap[p.id] = p.title;
		}
	}

	// Resolve control IDs to code + title for gap remediation display.
	const allControlIds = [
		...new Set(
			questions
				.flatMap((q) => (q.mappedControlIds as string[]) ?? [])
				.filter((id) => UUID_RE.test(id))
		)
	];
	const controlMap: Record<string, { code: string; title: string }> = {};
	if (allControlIds.length > 0) {
		const controlRows = await db
			.select({ id: controls.id, code: controls.code, title: controls.title })
			.from(controls)
			.where(inArray(controls.id, allControlIds));
		for (const c of controlRows) {
			controlMap[c.id] = { code: c.code, title: c.title };
		}
	}

	// Existing policy types for confidence upgrade hints
	const orgPolicyRows = await db
		.select({ type: policies.type })
		.from(policies)
		.where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt)));
	const existingPolicyTypes = [...new Set(orgPolicyRows.map((p) => p.type))];

	return json({ questionnaire, questions, policyMap, controlMap, existingPolicyTypes });
};
