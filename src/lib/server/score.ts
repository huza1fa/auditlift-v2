import { db } from './db';
import { controls, evidence, policies, readinessScores, readinessSnapshots } from './db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

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
	// Single query with LEFT JOINs — replaces N+1 loop (was 2 queries per control)
	const rows = await db
		.select({
			id: controls.id,
			code: controls.code,
			title: controls.title,
			category: controls.category,
			evidenceCount: sql<number>`count(distinct ${evidence.id})::int`,
			policyCount: sql<number>`count(distinct ${policies.id})::int`
		})
		.from(controls)
		.leftJoin(
			evidence,
			and(
				eq(evidence.controlId, controls.id),
				eq(evidence.organizationId, orgId),
				eq(evidence.status, 'active')
			)
		)
		.leftJoin(
			policies,
			and(eq(policies.controlId, controls.id), eq(policies.organizationId, orgId))
		)
		.where(eq(controls.frameworkId, frameworkId))
		.groupBy(controls.id);

	if (rows.length === 0) {
		return { score: 0, totalControls: 0, completedControls: 0, blockers: [] };
	}

	const completed = rows.filter((r) => (r.evidenceCount ?? 0) > 0 || (r.policyCount ?? 0) > 0);
	const blockerItems = rows
		.filter((r) => (r.evidenceCount ?? 0) === 0 && (r.policyCount ?? 0) === 0)
		.map((r) => ({ id: r.id, code: r.code, title: r.title, category: r.category }));

	const score = Math.round((completed.length / rows.length) * 100);

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

		// Snapshot: insert at most once per 24h per org+framework
		const [lastSnap] = await db
			.select({ snapshotAt: readinessSnapshots.snapshotAt })
			.from(readinessSnapshots)
			.where(
				and(
					eq(readinessSnapshots.organizationId, orgId),
					eq(readinessSnapshots.frameworkId, frameworkId)
				)
			)
			.orderBy(desc(readinessSnapshots.snapshotAt))
			.limit(1);

		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
		if (!lastSnap || lastSnap.snapshotAt < oneDayAgo) {
			await db.insert(readinessSnapshots).values({ organizationId: orgId, frameworkId, score });
		}
	} catch {
		// Ignore conflict errors — score caching is best-effort
	}

	return {
		score,
		totalControls: rows.length,
		completedControls: completed.length,
		blockers: blockerItems
	};
}
