import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { policies, policyControls, policyVersions, controls } from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { logActivity } from '$lib/server/activity';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';
import { computeReadinessScore } from '$lib/server/score';

const RestoreSchema = z.object({
	versionId: z.string().uuid()
});

export const POST: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot restore policy versions',
		'Trial expired. Upgrade to edit policies.'
	);

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
				eq(policies.organizationId, organizationId),
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
				eq(policyVersions.organizationId, organizationId)
			)
		)
		.limit(1);

	if (!version) {
		throw error(404, 'Version not found');
	}

	// Save current content as a new version before restoring
	await db.insert(policyVersions).values({
		policyId: policyId,
		organizationId,
		content: existingPolicy.content,
		savedBy: userId
	});

	// Restore the version's content
	const [updated] = await db
		.update(policies)
		.set({
			content: version.content,
			editedAt: new Date(),
			updatedAt: new Date()
		})
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, organizationId)))
		.returning();

	const affectedControls = await db
		.select({ frameworkId: controls.frameworkId })
		.from(policyControls)
		.innerJoin(controls, eq(policyControls.controlId, controls.id))
		.where(
			and(eq(policyControls.policyId, policyId), eq(policyControls.organizationId, organizationId))
		);
	for (const { frameworkId } of affectedControls) {
		computeReadinessScore(organizationId, frameworkId).catch(console.error);
	}

	logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name,
		action: 'policy.restore',
		entityType: 'policy',
		entityId: existingPolicy.id,
		entityName: existingPolicy.title
	}).catch(console.error);

	return json({ content: updated.content });
};
