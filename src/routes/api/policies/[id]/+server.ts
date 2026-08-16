import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { policies, policyControls, policyVersions, controls } from '$lib/server/db/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { logActivity } from '$lib/server/activity';
import { PatchPolicySchema } from '$lib/server/validation';
import { requireActiveOrganizationRole, requireOrganizationRole } from '$lib/server/auth-utils';
import { computeReadinessScore } from '$lib/server/score';

export const GET: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId } = await requireOrganizationRole(locals);

	const policyId = params.id;
	if (!policyId) {
		throw error(400, 'Missing policy ID');
	}

	const url = new URL(request.url);
	if (url.searchParams.get('versions') === 'true') {
		const versions = await db
			.select()
			.from(policyVersions)
			.where(
				and(
					eq(policyVersions.policyId, policyId),
					eq(policyVersions.organizationId, organizationId)
				)
			)
			.orderBy(desc(policyVersions.savedAt))
			.limit(3);
		return json({ versions });
	}

	const [policy] = await db
		.select()
		.from(policies)
		.where(
			and(
				eq(policies.id, policyId),
				eq(policies.organizationId, organizationId),
				isNull(policies.archivedAt)
			)
		)
		.limit(1);

	if (!policy) {
		throw error(404, 'Policy not found');
	}

	return json({ policy });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { organizationId, userId } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can archive policies',
		'Trial expired. Upgrade to manage policies.'
	);

	const policyId = params.id;
	if (!policyId) {
		throw error(400, 'Missing policy ID');
	}

	const [existing] = await db
		.select()
		.from(policies)
		.where(
			and(
				eq(policies.id, policyId),
				eq(policies.organizationId, organizationId),
				isNull(policies.archivedAt)
			)
		)
		.limit(1);

	if (!existing) {
		throw error(404, 'Policy not found');
	}

	const affectedControls = await db
		.select({ frameworkId: controls.frameworkId })
		.from(policyControls)
		.innerJoin(controls, eq(policyControls.controlId, controls.id))
		.where(
			and(eq(policyControls.policyId, policyId), eq(policyControls.organizationId, organizationId))
		);

	await db
		.update(policies)
		.set({ archivedAt: new Date(), updatedAt: new Date() })
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, organizationId)));

	logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name,
		action: 'policy.archive',
		entityType: 'policy',
		entityId: existing.id,
		entityName: existing.title
	}).catch(console.error);

	for (const { frameworkId } of affectedControls) {
		computeReadinessScore(organizationId, frameworkId).catch(console.error);
	}

	return json({ success: true });
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot edit policies',
		'Trial expired. Upgrade to edit policies.'
	);

	const policyId = params.id;
	if (!policyId) {
		throw error(400, 'Missing policy ID');
	}

	const result = PatchPolicySchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const body = result.data;
	const { content, title } = body;

	const [existing] = await db
		.select()
		.from(policies)
		.where(
			and(
				eq(policies.id, policyId),
				eq(policies.organizationId, organizationId),
				isNull(policies.archivedAt)
			)
		)
		.limit(1);

	if (!existing) {
		throw error(404, 'Policy not found');
	}

	// Save current content as a version before overwriting
	if (existing.content) {
		await db.insert(policyVersions).values({
			policyId: policyId,
			organizationId,
			content: existing.content,
			savedBy: userId
		});
	}

	const updates: Record<string, unknown> = {
		updatedAt: new Date(),
		editedAt: new Date()
	};

	if (content !== undefined) updates.content = content;
	if (title !== undefined) updates.title = title;

	const [updated] = await db
		.update(policies)
		.set(updates)
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, organizationId)))
		.returning();

	logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name,
		action: 'policy.edit',
		entityType: 'policy',
		entityId: updated.id,
		entityName: updated.title
	}).catch(console.error);

	return json({ policy: updated });
};
