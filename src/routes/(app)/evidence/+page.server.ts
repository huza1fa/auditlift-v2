import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { evidence, controls } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const evidenceList = await db
		.select({
			id: evidence.id,
			filename: evidence.filename,
			mimeType: evidence.mimeType,
			sizeBytes: evidence.sizeBytes,
			notes: evidence.notes,
			createdAt: evidence.createdAt,
			controlId: evidence.controlId,
			controlCode: controls.code,
			controlTitle: controls.title
		})
		.from(evidence)
		.leftJoin(controls, eq(evidence.controlId, controls.id))
		.where(eq(evidence.organizationId, locals.organizationId));

	return { evidenceList };
};
