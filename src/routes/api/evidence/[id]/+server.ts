import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence, controls } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { getPresignedDownloadUrl, deleteFile } from '$lib/server/storage';
import { computeReadinessScore } from '$lib/server/score';
import { logActivity } from '$lib/server/activity';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	const [ev] = await db
		.select()
		.from(evidence)
		.where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)))
		.limit(1);

	if (!ev) {
		throw error(404, 'Evidence not found');
	}

	if (ev.status !== 'active') {
		throw error(400, 'Evidence upload not confirmed');
	}

	const downloadUrl = await getPresignedDownloadUrl(ev.storageKey);

	return json({
		id: ev.id,
		filename: ev.filename,
		mimeType: ev.mimeType,
		sizeBytes: ev.sizeBytes,
		downloadUrl
	});
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	const [ev] = await db
		.select()
		.from(evidence)
		.where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)))
		.limit(1);

	if (!ev) {
		throw error(404, 'Evidence not found');
	}

	try {
		await deleteFile(ev.storageKey);
	} catch (err) {
		console.error('Failed to delete file from S3:', err);
	}

	await db
		.delete(evidence)
		.where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)));

	const [ctrl] = await db
		.select({ frameworkId: controls.frameworkId, code: controls.code })
		.from(controls)
		.where(eq(controls.id, ev.controlId))
		.limit(1);

	logActivity({
		organizationId: orgId,
		userId: locals.session.user.id,
		userName: locals.session.user.name,
		action: 'evidence.delete',
		entityType: 'evidence',
		entityId: ev.id,
		entityName: ev.filename,
		controlCode: ctrl?.code ?? null
	}).catch(console.error);

	if (ctrl) {
		computeReadinessScore(orgId, ctrl.frameworkId).catch(console.error);
	}

	return json({ success: true });
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	const [ev] = await db
		.select()
		.from(evidence)
		.where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)))
		.limit(1);

	if (!ev) {
		throw error(404, 'Evidence not found');
	}

	const body = await request.json();
	const { notes } = body as { notes?: string };

	const [updated] = await db
		.update(evidence)
		.set({ notes, updatedAt: new Date() })
		.where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)))
		.returning();

	return json({ evidence: updated });
};
