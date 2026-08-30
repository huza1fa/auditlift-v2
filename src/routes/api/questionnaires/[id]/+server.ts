import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	deals,
	questionnaires,
	questionnaireQuestions,
	policies,
	controls
} from '$lib/server/db/schema';
import { eq, and, asc, inArray, isNull } from 'drizzle-orm';
import { requireActiveOrganizationRole, requireOrganizationRole } from '$lib/server/auth-utils';
import { logActivity } from '$lib/server/activity';
import { z } from 'zod';

const PatchQuestionnaireSchema = z.object({ dealId: z.string().uuid().nullable() });

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

	await logActivity({
		organizationId: orgId,
		userId: locals.session!.user.id,
		userName: locals.session!.user.name ?? locals.session!.user.email,
		action: 'questionnaire.delete',
		entityType: 'questionnaire',
		entityId: id,
		entityName: questionnaire.filename
	});

	return json({ success: true });
};

/** Attach a questionnaire to the customer security review it belongs to. */
export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const {
		organizationId: orgId,
		userId,
		userEmail
	} = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot update questionnaires',
		'Trial expired. Upgrade to organize questionnaires into deals.'
	);
	const parsed = PatchQuestionnaireSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) throw error(400, 'Select a valid deal.');
	const [questionnaire] = await db
		.select({ id: questionnaires.id, filename: questionnaires.filename })
		.from(questionnaires)
		.where(and(eq(questionnaires.id, params.id), eq(questionnaires.organizationId, orgId)))
		.limit(1);
	if (!questionnaire) throw error(404, 'Questionnaire not found.');
	if (parsed.data.dealId) {
		const [deal] = await db
			.select({ id: deals.id, name: deals.name })
			.from(deals)
			.where(and(eq(deals.id, parsed.data.dealId), eq(deals.organizationId, orgId)))
			.limit(1);
		if (!deal) throw error(400, 'The selected deal does not belong to this organization.');
	}
	const [updated] = await db
		.update(questionnaires)
		.set({ dealId: parsed.data.dealId, updatedAt: new Date() })
		.where(and(eq(questionnaires.id, questionnaire.id), eq(questionnaires.organizationId, orgId)))
		.returning();
	await logActivity({
		organizationId: orgId,
		userId,
		userName: locals.session!.user.name ?? userEmail,
		action: 'questionnaire.deal_assign',
		entityType: 'questionnaire',
		entityId: questionnaire.id,
		entityName: questionnaire.filename,
		details: parsed.data.dealId ? 'Attached to a deal' : 'Removed from deal'
	});
	return json({ questionnaire: updated });
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
