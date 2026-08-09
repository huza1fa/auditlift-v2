import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence, controls } from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import {
	getFileMetadata,
	downloadFile,
	deleteFile,
	calculateSha256,
	hasValidFileSignature,
	validateFileSize,
	validateFileType
} from '$lib/server/storage';
import { computeReadinessScore } from '$lib/server/score';
import { logActivity } from '$lib/server/activity';
import { captureServerEvent } from '$lib/server/posthog';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';

function isMissingStorageObject(err: unknown): boolean {
	if (typeof err !== 'object' || err === null) return false;
	const storageError = err as { name?: string; $metadata?: { httpStatusCode?: number } };
	return (
		storageError.name === 'NotFound' ||
		storageError.name === 'NoSuchKey' ||
		storageError.$metadata?.httpStatusCode === 404
	);
}

export const POST: RequestHandler = async ({ params, locals }) => {
	const { organizationId: orgId, userId } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot confirm evidence uploads',
		'Trial expired. Upgrade to upload evidence.'
	);
	const evidenceId = params.id;

	if (!evidenceId) {
		throw error(400, 'Evidence ID is required');
	}

	const [existingEvidence] = await db
		.select()
		.from(evidence)
		.where(
			and(
				eq(evidence.id, evidenceId),
				eq(evidence.organizationId, orgId),
				isNull(evidence.deletedAt)
			)
		);

	if (!existingEvidence) {
		throw error(404, 'Evidence not found');
	}

	if (existingEvidence.status === 'active') {
		return json({ success: true, message: 'Evidence already confirmed' });
	}

	const discardPendingUpload = async () => {
		await deleteFile(existingEvidence.storageKey);
		await db
			.delete(evidence)
			.where(and(eq(evidence.id, evidenceId), eq(evidence.organizationId, orgId)));
	};
	const expectedMimeType = existingEvidence.mimeType;
	if (!validateFileType(expectedMimeType)) {
		try {
			await discardPendingUpload();
		} catch (err) {
			console.error('Failed to discard invalid evidence upload:', err);
			throw error(500, 'Failed to remove invalid upload');
		}
		throw error(422, 'Uploaded file type is not allowed.');
	}

	let uploadedFile;
	try {
		uploadedFile = await getFileMetadata(existingEvidence.storageKey);
	} catch (err) {
		if (!isMissingStorageObject(err)) {
			console.error('Failed to read uploaded evidence metadata:', err);
			throw error(500, 'Failed to inspect uploaded file');
		}
		await db
			.delete(evidence)
			.where(and(eq(evidence.id, evidenceId), eq(evidence.organizationId, orgId)));
		throw error(410, 'File no longer exists in storage. Please upload again.');
	}

	const uploadedChecksum = uploadedFile.metadata?.sha256;
	const metadataIsValid =
		uploadedFile.contentLength === existingEvidence.sizeBytes &&
		validateFileSize(uploadedFile.contentLength ?? 0) &&
		uploadedFile.contentType === existingEvidence.mimeType &&
		typeof uploadedChecksum === 'string' &&
		/^[A-Za-z0-9+/]{43}=$/.test(uploadedChecksum);

	if (!metadataIsValid) {
		try {
			await discardPendingUpload();
		} catch (err) {
			console.error('Failed to discard invalid evidence upload:', err);
			throw error(500, 'Failed to remove invalid upload');
		}
		throw error(422, 'Uploaded file metadata did not match the authorized upload.');
	}

	let fileBuffer: Buffer;
	try {
		fileBuffer = await downloadFile(existingEvidence.storageKey);
	} catch (err) {
		console.error('Failed to read uploaded evidence:', err);
		throw error(500, 'Failed to inspect uploaded file');
	}

	if (
		fileBuffer.length !== existingEvidence.sizeBytes ||
		calculateSha256(fileBuffer) !== uploadedChecksum ||
		!hasValidFileSignature(fileBuffer, expectedMimeType)
	) {
		try {
			await discardPendingUpload();
		} catch (err) {
			console.error('Failed to discard invalid evidence upload:', err);
			throw error(500, 'Failed to remove invalid upload');
		}
		throw error(422, 'Uploaded file content failed integrity validation.');
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
			.select({ frameworkId: controls.frameworkId, code: controls.code })
			.from(controls)
			.where(eq(controls.id, existingEvidence.controlId))
			.limit(1);

		logActivity({
			organizationId: orgId,
			userId,
			userName: locals.session!.user.name,
			action: 'evidence.upload',
			entityType: 'evidence',
			entityId: existingEvidence.id,
			entityName: existingEvidence.filename,
			controlCode: ctrl?.code ?? null
		}).catch(console.error);

		await captureServerEvent({
			event: 'evidence_uploaded',
			properties: {
				org_id: orgId,
				control_id: existingEvidence.controlId,
				control_code: ctrl?.code ?? null,
				file_type: existingEvidence.mimeType,
				file_size: existingEvidence.sizeBytes
			},
			groups: { organization: orgId }
		});

		if (ctrl) {
			computeReadinessScore(orgId, ctrl.frameworkId).catch(console.error);
		}

		return json({ success: true });
	} catch (err) {
		console.error('Failed to confirm evidence:', err);
		throw error(500, 'Failed to confirm upload');
	}
};
