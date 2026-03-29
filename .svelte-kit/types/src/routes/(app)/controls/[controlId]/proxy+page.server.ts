// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { controls, evidence, policies } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');
	const orgId = locals.organizationId;

	const [control] = await db
		.select()
		.from(controls)
		.where(eq(controls.id, params.controlId))
		.limit(1);
	if (!control) throw error(404, 'Control not found');

	const evidenceList = await db
		.select({
			id: evidence.id,
			filename: evidence.filename,
			mimeType: evidence.mimeType,
			sizeBytes: evidence.sizeBytes,
			createdAt: evidence.createdAt
		})
		.from(evidence)
		.where(
			and(
				eq(evidence.organizationId, orgId),
				eq(evidence.controlId, control.id),
				eq(evidence.status, 'active')
			)
		);

	const linkedPolicies = await db
		.select()
		.from(policies)
		.where(and(eq(policies.organizationId, orgId), eq(policies.controlId, control.id)));

	return { control, evidenceList, linkedPolicies };
};
