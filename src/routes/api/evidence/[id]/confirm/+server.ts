import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence, controls } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fileExists, deleteFile } from '$lib/server/storage';
import { computeReadinessScore } from '$lib/server/score';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;
	const evidenceId = params.id;

	if (!evidenceId) {
		throw error(400, 'Evidence ID is required');
	}

	const [existingEvidence] = await db
		.select()
		.from(evidence)
		.where(and(eq(evidence.id, evidenceId), eq(evidence.organizationId, orgId)));

	if (!existingEvidence) {
		throw error(404, 'Evidence not found');
	}

	if (existingEvidence.status === 'active') {
		return json({ success: true, message: 'Evidence already confirmed' });
	}

	const exists = await fileExists(existingEvidence.storageKey);
	if (!exists) {
		await db.delete(evidence).where(eq(evidence.id, evidenceId));
		throw error(410, 'File no longer exists in storage. Please upload again.');
	}

	try {
		await db
			.update(evidence)
			.set({
				status: 'active',
				updatedAt: new Date()
			})
			.where(and(eq(evidence.id, evidenceId), eq(evidence.organizationId, orgId)));

		const [ctrl] = await db
			.select({ frameworkId: controls.frameworkId })
			.from(controls)
			.where(eq(controls.id, existingEvidence.controlId))
			.limit(1);
		if (ctrl) {
			computeReadinessScore(orgId, ctrl.frameworkId).catch(console.error);
		}

		return json({ success: true });
	} catch (err) {
		console.error('Failed to confirm evidence:', err);
		throw error(500, 'Failed to confirm upload');
	}
};
