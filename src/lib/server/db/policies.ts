import { db } from '$lib/server/db';
import { policies, policyControls } from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

export type Policy = InferSelectModel<typeof policies>;

export async function getPoliciesForControl(orgId: string, controlId: string): Promise<Policy[]> {
	const rows = await db
		.select()
		.from(policies)
		.innerJoin(
			policyControls,
			and(eq(policyControls.policyId, policies.id), eq(policyControls.organizationId, orgId))
		)
		.where(
			and(
				eq(policies.organizationId, orgId),
				eq(policyControls.controlId, controlId),
				isNull(policies.archivedAt)
			)
		);
	return rows.map((row) => row.policies);
}

export async function getPoliciesForOrg(orgId: string): Promise<Policy[]> {
	return db
		.select()
		.from(policies)
		.where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt)));
}
