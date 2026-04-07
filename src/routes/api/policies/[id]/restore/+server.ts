import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { policies, policyVersions } from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { logActivity } from '$lib/server/activity';

const RestoreSchema = z.object({
	versionId: z.string().uuid()
});

export const POST: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const policyId = params.id;
	if (!policyId) {
		throw error(400, 'Missing policy ID');
	}

	const result = RestoreSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { versionId } = result.data;

	// Fetch the current policy
	const [existingPolicy] = await db
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

	if (!existingPolicy) {
		throw error(404, 'Policy not found');
	}

	// Fetch the version, verifying it belongs to this org + policy
	const [version] = await db
		.select()
		.from(policyVersions)
		.where(
			and(
				eq(policyVersions.id, versionId),
				eq(policyVersions.policyId, policyId),
				eq(policyVersions.organizationId, locals.organizationId)
			)
		)
		.limit(1);

	if (!version) {
		throw error(404, 'Version not found');
	}

	// Save current content as a new version before restoring
	await db.insert(policyVersions).values({
		policyId: policyId,
		organizationId: locals.organizationId,
		content: existingPolicy.content,
		savedBy: locals.session.user.id
	});

	// Restore the version's content
	const [updated] = await db
		.update(policies)
		.set({
			content: version.content,
			editedAt: new Date(),
			updatedAt: new Date()
		})
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId)))
		.returning();

	logActivity({
		organizationId: locals.organizationId,
		userId: locals.session.user.id,
		userName: locals.session.user.name,
		action: 'policy.edit',
		entityType: 'policy',
		entityId: existingPolicy.id,
		entityName: existingPolicy.title
	}).catch(console.error);

	return json({ content: updated.content });
};
