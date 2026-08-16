import { db } from './db';
import {
	controls,
	evidence,
	policies,
	policyControls,
	questionnaires,
	questionnaireQuestions,
	readinessScores,
	readinessSnapshots
} from './db/schema';
import { eq, and, desc, inArray, isNull } from 'drizzle-orm';
import { calculateReadiness } from './readiness-calculation';

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
	const frameworkControls = await db
		.select({
			id: controls.id,
			code: controls.code,
			title: controls.title,
			category: controls.category
		})
		.from(controls)
		.where(eq(controls.frameworkId, frameworkId));

	if (frameworkControls.length === 0) {
		return { score: 0, totalControls: 0, completedControls: 0, blockers: [] };
	}

	const controlIds = frameworkControls.map((control) => control.id);
	const [activeEvidence, activePolicies, mappedQuestions] = await Promise.all([
		db
			.select({ controlId: evidence.controlId })
			.from(evidence)
			.where(
				and(
					eq(evidence.organizationId, orgId),
					inArray(evidence.controlId, controlIds),
					eq(evidence.status, 'active'),
					isNull(evidence.deletedAt)
				)
			),
		db
			.select({ controlId: policyControls.controlId })
			.from(policyControls)
			.innerJoin(
				policies,
				and(
					eq(policyControls.policyId, policies.id),
					eq(policyControls.organizationId, policies.organizationId)
				)
			)
			.where(
				and(
					eq(policyControls.organizationId, orgId),
					inArray(policyControls.controlId, controlIds),
					isNull(policies.archivedAt)
				)
			),
		db
			.select({ mappedControlIds: questionnaireQuestions.mappedControlIds })
			.from(questionnaireQuestions)
			.innerJoin(
				questionnaires,
				and(
					eq(questionnaireQuestions.questionnaireId, questionnaires.id),
					eq(questionnaireQuestions.organizationId, questionnaires.organizationId)
				)
			)
			.where(
				and(
					eq(questionnaireQuestions.organizationId, orgId),
					eq(questionnaires.organizationId, orgId)
				)
			)
	]);

	const coveredControlIds = new Set<string>([
		...activeEvidence.map((item) => item.controlId),
		...activePolicies.map((item) => item.controlId),
		...mappedQuestions.flatMap((question) => (question.mappedControlIds as string[]) ?? [])
	]);
	const result = calculateReadiness(frameworkControls, coveredControlIds);

	// Cache the score
	try {
		await db
			.insert(readinessScores)
			.values({
				organizationId: orgId,
				frameworkId,
				score: result.score,
				blockerCount: result.blockers.length,
				computedAt: new Date()
			})
			.onConflictDoUpdate({
				target: [readinessScores.organizationId, readinessScores.frameworkId],
				set: { score: result.score, blockerCount: result.blockers.length, computedAt: new Date() }
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
			await db
				.insert(readinessSnapshots)
				.values({ organizationId: orgId, frameworkId, score: result.score });
		}
	} catch {
		// Ignore conflict errors — score caching is best-effort
	}

	return result;
}
