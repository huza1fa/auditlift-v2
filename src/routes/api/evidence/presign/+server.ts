import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence } from '$lib/server/db/schema';
import {
	validateFileType,
	validateFileSize,
	generateStorageKey,
	getPresignedUploadUrl,
	sanitizeFilename,
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE
} from '$lib/server/storage';
import { hasActiveAccess } from '$lib/server/billing';
import { eq, and } from 'drizzle-orm';
import { PresignEvidenceSchema } from '$lib/server/validation';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
		throw error(402, 'Trial expired. Upgrade to upload evidence.');
	}

	const result = PresignEvidenceSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const { controlId, filename, mimeType, sizeBytes } = result.data;

	const safeFilename = sanitizeFilename(filename);

	if (!validateFileType(mimeType)) {
		throw error(400, `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
	}

	if (!validateFileSize(sizeBytes)) {
		throw error(400, `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
	}

	const storageKey = generateStorageKey(orgId, controlId, mimeType);
	const uploadUrl = await getPresignedUploadUrl(storageKey, mimeType);

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
