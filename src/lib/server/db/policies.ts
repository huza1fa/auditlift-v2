import { db } from '$lib/server/db';
import { policies } from '$lib/server/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

export type Policy = InferSelectModel<typeof policies>;

export async function getPoliciesForControl(orgId: string, controlId: string): Promise<Policy[]> {
	return db
		.select()
		.from(policies)
		.where(
			and(
				eq(policies.organizationId, orgId),
				eq(policies.controlId, controlId),
				isNull(policies.archivedAt)
			)
		);
}

export async function getPoliciesForOrg(orgId: string): Promise<Policy[]> {
	return db
		.select()
		.from(policies)
		.where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt)));
}
