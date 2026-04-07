import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires, questionnaireQuestions, policies, controls } from '$lib/server/db/schema';
import { eq, and, asc, inArray } from 'drizzle-orm';
import { hasActiveAccess } from '$lib/server/billing';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;
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
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
		throw error(402, 'Trial expired. Upgrade to access questionnaires.');
	}

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
			.where(inArray(policies.id, allPolicyIds));
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

	return json({ questionnaire, questions, policyMap, controlMap });
};
