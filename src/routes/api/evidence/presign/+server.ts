import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence } from '$lib/server/db/schema';
import {
	validateFileType,
	validateFileSize,
	generateStorageKey,
	getPresignedUploadPost,
	sanitizeFilename,
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE
} from '$lib/server/storage';
import { PresignEvidenceSchema } from '$lib/server/validation';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { organizationId: orgId, userId } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot upload evidence',
		'Trial expired. Upgrade to upload evidence.'
	);

	const body: unknown = await request.json();
	const result = PresignEvidenceSchema.safeParse(body);
	if (!result.success) throw error(400, 'Invalid input');
	const { controlId, filename, mimeType, sizeBytes } = result.data;
	const checksumSha256 =
		typeof body === 'object' && body !== null && 'checksumSha256' in body
			? body.checksumSha256
			: undefined;
	if (typeof checksumSha256 !== 'string' || !/^[A-Za-z0-9+/]{43}=$/.test(checksumSha256)) {
		throw error(400, 'A SHA-256 checksum is required');
	}

	const safeFilename = sanitizeFilename(filename);

	if (!validateFileType(mimeType)) {
		throw error(400, `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
	}

	if (!validateFileSize(sizeBytes)) {
		throw error(400, `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
	}

	const storageKey = generateStorageKey(orgId, controlId, mimeType);
	const upload = await getPresignedUploadPost(storageKey, mimeType, checksumSha256);

	try {
		const [newEvidence] = await db
			.insert(evidence)
			.values({
				organizationId: orgId,
				controlId,
				filename: safeFilename,
				storageKey,
				mimeType,
				sizeBytes,
				status: 'pending',
				uploadedBy: userId
			})
			.returning({ id: evidence.id });

		return json({
			evidenceId: newEvidence.id,
			uploadUrl: upload.url,
			uploadFields: upload.fields,
			storageKey
		});
	} catch (err) {
		console.error('Failed to create pending evidence record:', err);
		throw error(500, 'Failed to initiate upload');
	}
};
