import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq, r as readinessSnapshots, i as and, k as desc, q as questionnaires, p as policies, j as isNull, l as questionnaireQuestions, c as controls, m as inArray, h as evidence, n as lt, t as activityLogs } from './index2-CrtZLkpF.js';
import { c as computeReadinessScore } from './score-Cvm9SYw4.js';
import { c as count, a as avg } from './aggregate-CbMItvtT.js';
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
      const { db: db2 } = await import('./index2-CrtZLkpF.js').then(function (n) { return n.b5; }).then((n) => n.n);
      const { subscriptions } = await import('./index2-CrtZLkpF.js').then(function (n) { return n.b5; }).then((n) => n.k);
      const { eq: eq2 } = await import('./index-BX8F4bJ2.js');
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
  const [lastActivity] = await db.select({
    action: activityLogs.action,
    entityName: activityLogs.entityName,
    createdAt: activityLogs.createdAt
  }).from(activityLogs).where(eq(activityLogs.organizationId, orgId)).orderBy(desc(activityLogs.createdAt)).limit(1);
  const sd = locals.organization?.systemDescription ?? null;
  const hasSystemDescription = !!(sd && (sd.productDescription || sd.dataFlowType || sd.keyTools));
  return {
    readiness,
    framework: orgFramework?.framework ?? null,
    trialDaysRemaining,
    isActiveSubscription,
    justSubscribed,
    scoreHistory,
    recentQuestionnaires,
    questionnaireTotal,
    avgDealReadiness,
    policiesTotal,
    questionnaireCoverage,
    staleEvidenceCount,
    nextAction,
    lastActivity: lastActivity ?? null,
    hasSystemDescription
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-4zzTBEWL.js')).default;
const server_id = "src/routes/(app)/dashboard/+page.server.ts";
const imports = ["_app/immutable/nodes/7.DtylIQ8l.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/Dmx2quEY.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/CubP1Oyd.js","_app/immutable/chunks/8ivS15n9.js","_app/immutable/chunks/BXf5cY5b.js","_app/immutable/chunks/D_QU1ycN.js","_app/immutable/chunks/DAG7djFR.js","_app/immutable/chunks/B3X34l_G.js","_app/immutable/chunks/CEcNqGI_.js","_app/immutable/chunks/lpvZEjax.js","_app/immutable/chunks/jmpbzBok.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/Bnm8G59_.js","_app/immutable/chunks/iYVaaFRt.js","_app/immutable/chunks/DVaPL7Nh.js","_app/immutable/chunks/BE4e1YPt.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BqR5w0Vn.js","_app/immutable/chunks/BWlwuY2s.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-DqzkRDth.js.map
