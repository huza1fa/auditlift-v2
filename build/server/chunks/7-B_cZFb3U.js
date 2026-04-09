import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq, r as readinessSnapshots, i as and, k as desc, q as questionnaires, p as policies, j as isNull, l as questionnaireQuestions, c as controls, m as inArray, h as evidence, n as lt } from './index2-C4rYKX5Z.js';
import { c as computeReadinessScore } from './score-D1dw6UeA.js';
import { c as count, a as avg } from './aggregate-D-tQqRQs.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals, url }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const orgId = locals.organizationId;
  const justSubscribed = url.searchParams.get("subscribed") === "true";
  const [orgFramework] = await db.select({ framework: frameworks }).from(organizationFrameworks).innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id)).where(eq(organizationFrameworks.organizationId, orgId)).limit(1);
  let readiness = { score: 0, totalControls: 0, completedControls: 0, blockers: [] };
  if (orgFramework) {
    readiness = await computeReadinessScore(orgId, orgFramework.framework.id);
  }
  let scoreHistory = [];
  if (orgFramework) {
    scoreHistory = await db.select({ score: readinessSnapshots.score, snapshotAt: readinessSnapshots.snapshotAt }).from(readinessSnapshots).where(
      and(
        eq(readinessSnapshots.organizationId, orgId),
        eq(readinessSnapshots.frameworkId, orgFramework.framework.id)
      )
    ).orderBy(desc(readinessSnapshots.snapshotAt)).limit(8).then((rows) => rows.reverse());
  }
  if (justSubscribed && url.searchParams.get("session_id")) {
    const sessionId = url.searchParams.get("session_id");
    try {
      const { stripe } = await import('./stripe-DFaJIGJ7.js');
      const { db: db2 } = await import('./index2-C4rYKX5Z.js').then(function (n) { return n.b4; }).then((n) => n.m);
      const { subscriptions } = await import('./index2-C4rYKX5Z.js').then(function (n) { return n.b4; }).then((n) => n.j);
      const { eq: eq2 } = await import('./index-CShQ_mIj.js');
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (checkoutSession.subscription && checkoutSession.metadata?.organizationId === orgId) {
        const stripeSub = await stripe.subscriptions.retrieve(
          checkoutSession.subscription
        );
        const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end ? new Date(stripeSub.items.data[0].current_period_end * 1e3) : null;
        const [existingSub] = await db2.select().from(subscriptions).where(eq2(subscriptions.organizationId, orgId)).limit(1);
        if (existingSub) {
          await db2.update(subscriptions).set({
            status: "active",
            stripeCustomerId: checkoutSession.customer,
            stripeSubscriptionId: stripeSub.id,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq2(subscriptions.organizationId, orgId));
        } else {
          await db2.insert(subscriptions).values({
            organizationId: orgId,
            status: "active",
            stripeCustomerId: checkoutSession.customer,
            stripeSubscriptionId: stripeSub.id,
            currentPeriodEnd,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end
          });
        }
        locals.subscription = (await db2.select().from(subscriptions).where(eq2(subscriptions.organizationId, orgId)).limit(1))[0] ?? null;
      }
    } catch (err) {
      console.error("[Dashboard] Failed to sync subscription from Stripe:", err);
    }
  }
  const trialEndsAt = locals.organization?.trialEndsAt;
  const isActiveSubscription = locals.subscription?.status === "active";
  const trialDaysRemaining = isActiveSubscription ? null : trialEndsAt ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 864e5)) : null;
  const recentQuestionnaires = await db.select({
    id: questionnaires.id,
    dealReadinessScore: questionnaires.dealReadinessScore,
    answeredCount: questionnaires.answeredCount,
    totalQuestions: questionnaires.totalQuestions,
    gapCount: questionnaires.gapCount,
    filename: questionnaires.filename,
    status: questionnaires.status,
    createdAt: questionnaires.createdAt
  }).from(questionnaires).where(eq(questionnaires.organizationId, orgId)).orderBy(desc(questionnaires.createdAt)).limit(3);
  const [{ value: questionnaireTotal }] = await db.select({ value: count() }).from(questionnaires).where(eq(questionnaires.organizationId, orgId));
  const [avgRow] = await db.select({ value: avg(questionnaires.dealReadinessScore) }).from(questionnaires).where(and(eq(questionnaires.organizationId, orgId), eq(questionnaires.status, "ready")));
  const avgDealReadiness = avgRow?.value != null ? Math.round(Number(avgRow.value)) : null;
  const [{ value: policiesTotal }] = await db.select({ value: count() }).from(policies).where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt)));
  const allMappedQuestions = await db.select({ mappedControlIds: questionnaireQuestions.mappedControlIds }).from(questionnaireQuestions).where(eq(questionnaireQuestions.organizationId, orgId));
  const allMappedControlIds = [
    ...new Set(allMappedQuestions.flatMap((q) => q.mappedControlIds ?? []))
  ];
  const orgFrameworkRows = await db.select({
    frameworkId: organizationFrameworks.frameworkId,
    frameworkName: frameworks.name
  }).from(organizationFrameworks).innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id)).where(eq(organizationFrameworks.organizationId, orgId));
  let questionnaireCoverage = [];
  if (orgFrameworkRows.length > 0) {
    const orgFrameworkIds = orgFrameworkRows.map((f) => f.frameworkId);
    const allFrameworkControls = await db.select({ id: controls.id, frameworkId: controls.frameworkId }).from(controls).where(inArray(controls.frameworkId, orgFrameworkIds));
    const controlsByFramework = /* @__PURE__ */ new Map();
    for (const row of allFrameworkControls) {
      if (!controlsByFramework.has(row.frameworkId)) {
        controlsByFramework.set(row.frameworkId, /* @__PURE__ */ new Set());
      }
      controlsByFramework.get(row.frameworkId).add(row.id);
    }
    const mappedSet = new Set(allMappedControlIds);
    questionnaireCoverage = orgFrameworkRows.map((fw) => {
      const frameworkControlSet = controlsByFramework.get(fw.frameworkId) ?? /* @__PURE__ */ new Set();
      const totalControls = frameworkControlSet.size;
      const controlsCoveredByQuestionnaires = [...frameworkControlSet].filter(
        (cId) => mappedSet.has(cId)
      ).length;
      return {
        frameworkId: fw.frameworkId,
        frameworkName: fw.frameworkName,
        controlsCoveredByQuestionnaires,
        totalControls
      };
    });
  }
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1e3);
  const staleResult = await db.select({ value: count() }).from(evidence).where(
    and(
      eq(evidence.organizationId, orgId),
      lt(evidence.createdAt, ninetyDaysAgo),
      isNull(evidence.deletedAt),
      eq(evidence.status, "active")
    )
  );
  const staleEvidenceCount = staleResult[0]?.value ?? 0;
  let nextAction = null;
  const questionnaireWithGaps = recentQuestionnaires.find((q) => (q.gapCount ?? 0) > 0);
  const totalGaps = recentQuestionnaires.reduce((sum, q) => sum + (q.gapCount ?? 0), 0);
  if (questionnaireWithGaps && totalGaps > 0) {
    nextAction = {
      type: "fix-gaps",
      gapCount: totalGaps,
      questionnaireId: questionnaireWithGaps.id
    };
  } else if (questionnaireTotal === 0) {
    nextAction = { type: "upload-questionnaire" };
  } else if (policiesTotal === 0) {
    nextAction = { type: "generate-policy" };
  } else if (staleEvidenceCount > 0) {
    nextAction = { type: "stale-evidence" };
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

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DwSCIzAk.js')).default;
const server_id = "src/routes/(app)/dashboard/+page.server.ts";
const imports = ["_app/immutable/nodes/7.DVVd0McP.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/Cox_fmk7.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/Buxdmzsi.js","_app/immutable/chunks/Cr8RfznP.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/DgJLreGn.js","_app/immutable/chunks/VtrdIure.js","_app/immutable/chunks/8JVPSuNb.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BqR5w0Vn.js","_app/immutable/chunks/BWlwuY2s.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-B_cZFb3U.js.map
