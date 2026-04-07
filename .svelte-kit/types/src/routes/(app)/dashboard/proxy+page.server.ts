// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	organizationFrameworks,
	frameworks,
	readinessSnapshots,
	questionnaires,
	questionnaireQuestions,
	policies,
	controls,
	evidence
} from '$lib/server/db/schema';
import { eq, and, desc, count, avg, isNull, inArray, lt } from 'drizzle-orm';
import { computeReadinessScore } from '$lib/server/score';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const orgId = locals.organizationId;
	const justSubscribed = url.searchParams.get('subscribed') === 'true';

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

	let scoreHistory: Array<{ score: number; snapshotAt: Date }> = [];
	if (orgFramework) {
		scoreHistory = await db
			.select({ score: readinessSnapshots.score, snapshotAt: readinessSnapshots.snapshotAt })
			.from(readinessSnapshots)
			.where(
				and(
					eq(readinessSnapshots.organizationId, orgId),
					eq(readinessSnapshots.frameworkId, orgFramework.framework.id)
				)
			)
			.orderBy(desc(readinessSnapshots.snapshotAt))
			.limit(8)
			.then((rows) => rows.reverse());
	}

	// Sync subscription from Stripe if user just completed checkout
	// This handles webhook delivery failures in dev/prod
	if (justSubscribed && url.searchParams.get('session_id')) {
		const sessionId = url.searchParams.get('session_id')!;
		try {
			const { stripe } = await import('$lib/server/stripe');
			const { db } = await import('$lib/server/db');
			const { subscriptions } = await import('$lib/server/db/schema');
			const { eq } = await import('drizzle-orm');

			const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

			if (checkoutSession.subscription && checkoutSession.metadata?.organizationId === orgId) {
				const stripeSub = await stripe.subscriptions.retrieve(
					checkoutSession.subscription as string
				);
				const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end
					? new Date(stripeSub.items.data[0].current_period_end * 1000)
					: null;

				// Check if sub exists in DB
				const [existingSub] = await db
					.select()
					.from(subscriptions)
					.where(eq(subscriptions.organizationId, orgId))
					.limit(1);

				if (existingSub) {
					await db
						.update(subscriptions)
						.set({
							status: 'active',
							stripeCustomerId: checkoutSession.customer as string,
							stripeSubscriptionId: stripeSub.id,
							currentPeriodEnd,
							cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
							updatedAt: new Date()
						})
						.where(eq(subscriptions.organizationId, orgId));
				} else {
					await db.insert(subscriptions).values({
						organizationId: orgId,
						status: 'active',
						stripeCustomerId: checkoutSession.customer as string,
						stripeSubscriptionId: stripeSub.id,
						currentPeriodEnd,
						cancelAtPeriodEnd: stripeSub.cancel_at_period_end
					});
				}

				// Re-fetch subscription to reflect updated state
				locals.subscription =
					(
						await db
							.select()
							.from(subscriptions)
							.where(eq(subscriptions.organizationId, orgId))
							.limit(1)
					)[0] ?? null;
			}
		} catch (err) {
			console.error('[Dashboard] Failed to sync subscription from Stripe:', err);
		}
	}

	const trialEndsAt = locals.organization?.trialEndsAt;
	const isActiveSubscription = locals.subscription?.status === 'active';
	const trialDaysRemaining = isActiveSubscription
		? null
		: trialEndsAt
			? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
			: null;

	// ── Questionnaire stats ────────────────────────────────────────────────────

	// Recent questionnaires (up to 3)
	const recentQuestionnaires = await db
		.select({
			id: questionnaires.id,
			dealReadinessScore: questionnaires.dealReadinessScore,
			answeredCount: questionnaires.answeredCount,
			totalQuestions: questionnaires.totalQuestions,
			gapCount: questionnaires.gapCount,
			filename: questionnaires.filename,
			status: questionnaires.status,
			createdAt: questionnaires.createdAt
		})
		.from(questionnaires)
		.where(eq(questionnaires.organizationId, orgId))
		.orderBy(desc(questionnaires.createdAt))
		.limit(3);

	// Total questionnaire count
	const [{ value: questionnaireTotal }] = await db
		.select({ value: count() })
		.from(questionnaires)
		.where(eq(questionnaires.organizationId, orgId));

	// Average deal readiness score across all "ready" questionnaires
	const [avgRow] = await db
		.select({ value: avg(questionnaires.dealReadinessScore) })
		.from(questionnaires)
		.where(and(eq(questionnaires.organizationId, orgId), eq(questionnaires.status, 'ready')));

	const avgDealReadiness: number | null =
		avgRow?.value != null ? Math.round(Number(avgRow.value)) : null;

	// ── Policy count ───────────────────────────────────────────────────────────

	const [{ value: policiesTotal }] = await db
		.select({ value: count() })
		.from(policies)
		.where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt)));

	// ── Aggregate framework coverage from questionnaire mappings ───────────────

	// Collect all unique control IDs mapped across all processed questions for this org
	const allMappedQuestions = await db
		.select({ mappedControlIds: questionnaireQuestions.mappedControlIds })
		.from(questionnaireQuestions)
		.where(eq(questionnaireQuestions.organizationId, orgId));

	const allMappedControlIds = [
		...new Set(allMappedQuestions.flatMap((q) => (q.mappedControlIds as string[]) ?? []))
	];

	// Load all frameworks selected by this org
	const orgFrameworkRows = await db
		.select({
			frameworkId: organizationFrameworks.frameworkId,
			frameworkName: frameworks.name
		})
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId));

	type QuestionnaireCoverageEntry = {
		frameworkId: string;
		frameworkName: string;
		controlsCoveredByQuestionnaires: number;
		totalControls: number;
	};

	let questionnaireCoverage: QuestionnaireCoverageEntry[] = [];

	if (orgFrameworkRows.length > 0) {
		const orgFrameworkIds = orgFrameworkRows.map((f) => f.frameworkId);

		// Fetch all controls for the org's selected frameworks in one query
		const allFrameworkControls = await db
			.select({ id: controls.id, frameworkId: controls.frameworkId })
			.from(controls)
			.where(inArray(controls.frameworkId, orgFrameworkIds));

		// Build a map of frameworkId -> Set of control IDs
		const controlsByFramework = new Map<string, Set<string>>();
		for (const row of allFrameworkControls) {
			if (!controlsByFramework.has(row.frameworkId)) {
				controlsByFramework.set(row.frameworkId, new Set());
			}
			controlsByFramework.get(row.frameworkId)!.add(row.id);
		}

		// The set of mapped control IDs for fast intersection
		const mappedSet = new Set(allMappedControlIds);

		questionnaireCoverage = orgFrameworkRows.map((fw) => {
			const frameworkControlSet = controlsByFramework.get(fw.frameworkId) ?? new Set<string>();
			const totalControls = frameworkControlSet.size;
			const controlsCoveredByQuestionnaires = [...frameworkControlSet].filter((cId) =>
				mappedSet.has(cId)
			).length;

			return {
				frameworkId: fw.frameworkId,
				frameworkName: fw.frameworkName,
				controlsCoveredByQuestionnaires,
				totalControls
			};
		});
	}

	// ── Stale evidence count (older than 90 days, not deleted, active) ─────────

	const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
	const staleResult = await db
		.select({ value: count() })
		.from(evidence)
		.where(
			and(
				eq(evidence.organizationId, orgId),
				lt(evidence.createdAt, ninetyDaysAgo),
				isNull(evidence.deletedAt),
				eq(evidence.status, 'active')
			)
		);
	const staleEvidenceCount = staleResult[0]?.value ?? 0;

	// ── Next action recommendation ───────────────────────────────────────────

	type NextAction =
		| { type: 'fix-gaps'; gapCount: number; questionnaireId: string }
		| { type: 'upload-questionnaire' }
		| { type: 'generate-policy' }
		| { type: 'stale-evidence' };

	let nextAction: NextAction | null = null;

	const questionnaireWithGaps = recentQuestionnaires.find((q) => (q.gapCount ?? 0) > 0);
	const totalGaps = recentQuestionnaires.reduce((sum, q) => sum + (q.gapCount ?? 0), 0);

	if (questionnaireWithGaps && totalGaps > 0) {
		nextAction = {
			type: 'fix-gaps',
			gapCount: totalGaps,
			questionnaireId: questionnaireWithGaps.id
		};
	} else if (questionnaireTotal === 0) {
		nextAction = { type: 'upload-questionnaire' };
	} else if (policiesTotal === 0) {
		nextAction = { type: 'generate-policy' };
	} else if (staleEvidenceCount > 0) {
		nextAction = { type: 'stale-evidence' };
	}

	return {
		readiness,
		framework: orgFramework?.framework ?? null,
		trialDaysRemaining,
		justSubscribed,
		scoreHistory,
		recentQuestionnaires,
		questionnaireTotal,
		avgDealReadiness,
		policiesTotal,
		questionnaireCoverage,
		staleEvidenceCount,
		nextAction
	};
};
