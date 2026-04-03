import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { controls, evidence, policies } from '$lib/server/db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
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

	const allControlsWithStatus = await db
		.select({
			id: controls.id,
			code: controls.code,
			title: controls.title,
			evidenceCount: sql<number>`count(distinct ${evidence.id})::int`,
			policyCount: sql<number>`count(distinct ${policies.id})::int`
		})
		.from(controls)
		.leftJoin(
			evidence,
			and(
				eq(evidence.controlId, controls.id),
				eq(evidence.organizationId, orgId),
				eq(evidence.status, 'active'),
				isNull(evidence.deletedAt)
			)
		)
		.leftJoin(
			policies,
			and(
				eq(policies.controlId, controls.id),
				eq(policies.organizationId, orgId),
				isNull(policies.archivedAt)
			)
		)
		.where(eq(controls.frameworkId, control.frameworkId))
		.groupBy(controls.id)
		.orderBy(controls.code);

	const incomplete = allControlsWithStatus.filter(
		(c) => c.evidenceCount === 0 && c.policyCount === 0
	);
	const nextAfterCurrent = incomplete.find((c) => c.code > control.code);
	const nextIncompleteControl = nextAfterCurrent ?? incomplete[0] ?? null;
	const finalNext =
		nextIncompleteControl?.id === control.id ? (incomplete[1] ?? null) : nextIncompleteControl;

	return {
		control,
		evidenceList,
		linkedPolicies,
		isComplete: evidenceList.length > 0 || linkedPolicies.length > 0,
		nextIncompleteControl: finalNext
			? { id: finalNext.id, code: finalNext.code, title: finalNext.title }
			: null
	};
};
