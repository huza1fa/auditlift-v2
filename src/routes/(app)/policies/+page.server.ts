import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { controls, policies, policyControls } from '$lib/server/db/schema';
import { eq, desc, and, isNull, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const policyList = await db
		.select()
		.from(policies)
		.where(and(eq(policies.organizationId, locals.organizationId), isNull(policies.archivedAt)))
		.orderBy(desc(policies.createdAt));

	const controlsByPolicy: Record<string, Array<{ id: string; code: string; title: string }>> = {};
	if (policyList.length > 0) {
		const controlLinks = await db
			.select({
				policyId: policyControls.policyId,
				id: controls.id,
				code: controls.code,
				title: controls.title
			})
			.from(policyControls)
			.innerJoin(controls, eq(policyControls.controlId, controls.id))
			.where(
				and(
					eq(policyControls.organizationId, locals.organizationId),
					inArray(
						policyControls.policyId,
						policyList.map((policy) => policy.id)
					)
				)
			);

		for (const control of controlLinks) {
			(controlsByPolicy[control.policyId] ??= []).push({
				id: control.id,
				code: control.code,
				title: control.title
			});
		}
	}

	return { policies: policyList, controlsByPolicy };
};
