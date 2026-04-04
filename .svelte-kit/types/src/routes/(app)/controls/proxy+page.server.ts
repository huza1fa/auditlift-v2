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
import { eq, and, count, sql, isNull } from 'drizzle-orm';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');
	const orgId = locals.organizationId;

	// Get all frameworks for this organization
	const orgFrameworks = await db
		.select({ frameworkId: organizationFrameworks.frameworkId, framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId));

	if (orgFrameworks.length === 0) return { controls: [], framework: null, frameworks: [] };

	// Determine which framework to show (from query param or first one)
	const selectedFrameworkSlug = url.searchParams.get('framework');
	let selectedFramework = orgFrameworks[0];
	if (selectedFrameworkSlug) {
		const found = orgFrameworks.find((f) => f.framework.slug === selectedFrameworkSlug);
		if (found) selectedFramework = found;
	}

	// Single query with LEFT JOINs to get evidence and policy counts per control
	const controlsWithCounts = await db
		.select({
			id: controls.id,
			frameworkId: controls.frameworkId,
			code: controls.code,
			title: controls.title,
			description: controls.description,
			whyItMatters: controls.whyItMatters,
			whatAuditorExpects: controls.whatAuditorExpects,
			category: controls.category,
			createdAt: controls.createdAt,
			updatedAt: controls.updatedAt,
			evidenceCount: sql<number>`count(distinct ${evidence.id})::int`,
			policyCount: sql<number>`count(distinct ${policies.id})::int`
		})
		.from(controls)
		.leftJoin(
			evidence,
			and(
				eq(evidence.controlId, controls.id),
				eq(evidence.organizationId, orgId),
				isNull(evidence.deletedAt),
				eq(evidence.status, 'active')
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
		.where(eq(controls.frameworkId, selectedFramework.frameworkId))
		.groupBy(controls.id);

	const result = controlsWithCounts.map((c) => ({
		id: c.id,
		frameworkId: c.frameworkId,
		code: c.code,
		title: c.title,
		description: c.description,
		whyItMatters: c.whyItMatters,
		whatAuditorExpects: c.whatAuditorExpects,
		category: c.category,
		createdAt: c.createdAt,
		updatedAt: c.updatedAt,
		evidenceCount: c.evidenceCount ?? 0,
		policyCount: c.policyCount ?? 0,
		complete: (c.evidenceCount ?? 0) > 0 || (c.policyCount ?? 0) > 0
	}));

	return {
		controls: result,
		framework: selectedFramework.framework,
		frameworks: orgFrameworks.map((f) => f.framework)
	};
};
