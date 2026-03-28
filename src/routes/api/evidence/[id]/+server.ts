import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { evidence } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.organizationId) throw error(401, 'Unauthorized');
	const orgId = locals.organizationId;

	const [ev] = await db
		.select()
		.from(evidence)
		.where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)))
		.limit(1);
	if (!ev) throw error(404, 'Evidence not found');

	// Delete file
	try {
		await fs.unlink(path.join(process.cwd(), 'uploads', ev.storageKey));
	} catch {
		// file may not exist
	}

	await db
		.delete(evidence)
		.where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)));

	return json({ ok: true });
};
