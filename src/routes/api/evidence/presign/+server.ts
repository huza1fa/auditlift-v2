import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence } from '$lib/server/db/schema';
import {
	validateFileType,
	validateFileSize,
	generateStorageKey,
	getPresignedUploadUrl,
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE
} from '$lib/server/storage';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	const body = await request.json();
	const { controlId, filename, mimeType, sizeBytes } = body;

	if (!controlId || !filename || !mimeType || !sizeBytes) {
		throw error(400, 'Missing required fields: controlId, filename, mimeType, sizeBytes');
	}

	if (!validateFileType(mimeType)) {
		throw error(400, `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
	}

	if (!validateFileSize(sizeBytes)) {
		throw error(400, `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
	}

	const storageKey = generateStorageKey(orgId, controlId, filename);
	const uploadUrl = await getPresignedUploadUrl(storageKey, mimeType);

	try {
		const [newEvidence] = await db
			.insert(evidence)
			.values({
				organizationId: orgId,
				controlId,
				filename,
				storageKey,
				mimeType,
				sizeBytes,
				status: 'pending',
				uploadedBy: locals.session.user.id
			})
			.returning({ id: evidence.id });

		return json({
			evidenceId: newEvidence.id,
			uploadUrl,
			storageKey
		});
	} catch (err) {
		console.error('Failed to create pending evidence record:', err);
		throw error(500, 'Failed to initiate upload');
	}
};
