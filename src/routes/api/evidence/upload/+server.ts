import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence } from '$lib/server/db/schema';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_TYPES = [
	'application/pdf',
	'image/png',
	'image/jpeg',
	'text/csv',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.organizationId) throw error(401, 'Unauthorized');
	const orgId = locals.organizationId;

	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const controlId = formData.get('controlId') as string | null;

	if (!file || !controlId) throw error(400, 'Missing file or controlId');
	if (file.size > MAX_SIZE) throw error(400, 'File too large (max 10MB)');
	if (!ALLOWED_TYPES.includes(file.type)) throw error(400, 'File type not allowed');

	const storageKey = `${orgId}/${controlId}/${crypto.randomUUID()}-${file.name}`;
	const uploadDir = path.join(process.cwd(), 'uploads', orgId, controlId);
	await fs.mkdir(uploadDir, { recursive: true });
	const buffer = Buffer.from(await file.arrayBuffer());
	await fs.writeFile(path.join(process.cwd(), 'uploads', storageKey), buffer);

	await db.insert(evidence).values({
		organizationId: orgId,
		controlId,
		filename: file.name,
		storageKey,
		mimeType: file.type,
		sizeBytes: file.size,
		uploadedBy: locals.session.user.id
	});

	return json({ ok: true });
};
