import { db } from './db';
import { controls, evidence, policies, readinessScores } from './db/schema';
import { eq, and, count } from 'drizzle-orm';

export interface ReadinessResult {
	score: number;
	totalControls: number;
	completedControls: number;
	blockers: Array<{ id: string; code: string; title: string; category: string }>;
}

export async function computeReadinessScore(
	orgId: string,
	frameworkId: string
): Promise<ReadinessResult> {
	// Get all controls for this framework
	const allControls = await db.select().from(controls).where(eq(controls.frameworkId, frameworkId));

	if (allControls.length === 0) {
		return { score: 0, totalControls: 0, completedControls: 0, blockers: [] };
	}

	// For each control, check if it has evidence or policy
	const results = await Promise.all(
		allControls.map(async (control) => {
			const [evidenceCount] = await db
				.select({ count: count() })
				.from(evidence)
				.where(and(eq(evidence.organizationId, orgId), eq(evidence.controlId, control.id)));

			const [policyCount] = await db
				.select({ count: count() })
				.from(policies)
				.where(and(eq(policies.organizationId, orgId), eq(policies.controlId, control.id)));

			const isComplete = (evidenceCount?.count ?? 0) > 0 || (policyCount?.count ?? 0) > 0;
			return { control, isComplete };
		})
	);

	const completed = results.filter((r) => r.isComplete);
	const blockerItems = results
		.filter((r) => !r.isComplete)
		.map((r) => ({
			id: r.control.id,
			code: r.control.code,
			title: r.control.title,
			category: r.control.category
		}));

	const score = Math.round((completed.length / allControls.length) * 100);

	// Cache the score
	try {
		await db
			.insert(readinessScores)
			.values({
				organizationId: orgId,
				frameworkId,
				score,
				blockerCount: blockerItems.length,
				computedAt: new Date()
			})
			.onConflictDoUpdate({
				target: [readinessScores.organizationId, readinessScores.frameworkId],
				set: { score, blockerCount: blockerItems.length, computedAt: new Date() }
			});
	} catch {
		// Ignore conflict errors — score caching is best-effort
	}

	return {
		score,
		totalControls: allControls.length,
		completedControls: completed.length,
		blockers: blockerItems
	};
}
