// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { evidence, policies, organizationFrameworks, frameworks } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import { hasActiveAccess } from '$lib/server/billing';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');
	const orgId = locals.organizationId;

	const canExport = hasActiveAccess(locals.subscription);

	const [orgFramework] = await db
		.select({ framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.limit(1);

	const [evidenceCount] = await db
		.select({ count: count() })
		.from(evidence)
		.where(eq(evidence.organizationId, orgId));
	const [policyCount] = await db
		.select({ count: count() })
		.from(policies)
		.where(eq(policies.organizationId, orgId));

	return {
		canExport,
		framework: orgFramework?.framework ?? null,
		evidenceCount: evidenceCount?.count ?? 0,
		policyCount: policyCount?.count ?? 0
	};
};
