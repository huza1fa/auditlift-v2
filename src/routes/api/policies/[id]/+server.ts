import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { policies } from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { logActivity } from '$lib/server/activity';
import { PatchPolicySchema } from '$lib/server/validation';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

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
				eq(policies.organizationId, locals.organizationId),
				isNull(policies.archivedAt)
			)
		)
		.limit(1);

	if (!existing) {
		throw error(404, 'Policy not found');
	}

	await db
		.update(policies)
		.set({ archivedAt: new Date(), updatedAt: new Date() })
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId)));

	logActivity({
		organizationId: locals.organizationId,
		userId: locals.session.user.id,
		userName: locals.session.user.name,
		action: 'policy.archive',
		entityType: 'policy',
		entityId: existing.id,
		entityName: existing.title
	}).catch(console.error);

	return json({ success: true });
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

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
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId)))
		.limit(1);

	if (!existing) {
		throw error(404, 'Policy not found');
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
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId)))
		.returning();

	logActivity({
		organizationId: locals.organizationId!,
		userId: locals.session!.user.id,
		userName: locals.session!.user.name,
		action: 'policy.edit',
		entityType: 'policy',
		entityId: updated.id,
		entityName: updated.title
	}).catch(console.error);

	return json({ policy: updated });
};
