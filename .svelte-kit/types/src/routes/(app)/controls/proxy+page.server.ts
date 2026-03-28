// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	controls,
	organizationFrameworks,
	frameworks,
	evidence,
	policies
} from '$lib/server/db/schema';
import { eq, and, count } from 'drizzle-orm';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');
	const orgId = locals.organizationId;

	const [orgFramework] = await db
		.select({ frameworkId: organizationFrameworks.frameworkId, framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.limit(1);

	if (!orgFramework) return { controls: [], framework: null };

	const allControls = await db
		.select()
		.from(controls)
		.where(eq(controls.frameworkId, orgFramework.frameworkId));

	const controlsWithStatus = await Promise.all(
		allControls.map(async (control) => {
			const [ev] = await db
				.select({ count: count() })
				.from(evidence)
				.where(and(eq(evidence.organizationId, orgId), eq(evidence.controlId, control.id)));
			const [pol] = await db
				.select({ count: count() })
				.from(policies)
				.where(and(eq(policies.organizationId, orgId), eq(policies.controlId, control.id)));
			return {
				...control,
				evidenceCount: ev?.count ?? 0,
				policyCount: pol?.count ?? 0,
				complete: (ev?.count ?? 0) > 0 || (pol?.count ?? 0) > 0
			};
		})
	);

	return { controls: controlsWithStatus, framework: orgFramework.framework };
};
