import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organizationFrameworks, frameworks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { computeReadinessScore } from '$lib/server/score';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const orgId = locals.organizationId;

	// Get org's active framework
	const [orgFramework] = await db
		.select({ framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.limit(1);

	let readiness: {
		score: number;
		totalControls: number;
		completedControls: number;
		blockers: Array<{ id: string; code: string; title: string; category: string }>;
	} = { score: 0, totalControls: 0, completedControls: 0, blockers: [] };

	if (orgFramework) {
		readiness = await computeReadinessScore(orgId, orgFramework.framework.id);
	}

	const trialEndsAt = locals.organization?.trialEndsAt;
	const trialDaysRemaining = trialEndsAt
		? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
		: null;

	return {
		readiness,
		framework: orgFramework?.framework ?? null,
		trialDaysRemaining
	};
};
