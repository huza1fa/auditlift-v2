import { e as error } from './index-wpIsICWW.js';
import { d as db, q as questionnaires, i as and, e as eq, o as organizations, l as questionnaireQuestions, p as policies, m as inArray } from './index2-CrtZLkpF.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ params }) => {
  const token = params.token;
  if (!token) throw error(400, "Invalid share link");
  const [questionnaire] = await db.select().from(questionnaires).where(and(eq(questionnaires.shareToken, token), eq(questionnaires.status, "ready"))).limit(1);
  if (!questionnaire || !questionnaire.sharedAt) {
    throw error(404, "This questionnaire is not shared or does not exist");
  }
  const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, questionnaire.organizationId)).limit(1);
  if (!org) throw error(404, "Organization not found");
  const questions = await db.select({
    id: questionnaireQuestions.id,
    sectionName: questionnaireQuestions.sectionName,
    questionNumber: questionnaireQuestions.questionNumber,
    questionText: questionnaireQuestions.questionText,
    domain: questionnaireQuestions.domain,
    confidence: questionnaireQuestions.confidence,
    generatedAnswer: questionnaireQuestions.generatedAnswer,
    userEditedAnswer: questionnaireQuestions.userEditedAnswer,
    gapReason: questionnaireQuestions.gapReason,
    order: questionnaireQuestions.order
  }).from(questionnaireQuestions).where(eq(questionnaireQuestions.questionnaireId, questionnaire.id)).orderBy(questionnaireQuestions.order);
  [
    ...new Set(
      questions.flatMap(() => [])
      // questions don't have mappedPolicyIds in this select
    )
  ];
  const fullQuestions = await db.select({
    id: questionnaireQuestions.id,
    mappedPolicyIds: questionnaireQuestions.mappedPolicyIds
  }).from(questionnaireQuestions).where(eq(questionnaireQuestions.questionnaireId, questionnaire.id));
  const policyIdSet = /* @__PURE__ */ new Set();
  for (const q of fullQuestions) {
    if (q.mappedPolicyIds && Array.isArray(q.mappedPolicyIds)) {
      for (const id of q.mappedPolicyIds) policyIdSet.add(id);
    }
  }
  let policyMap = {};
  if (policyIdSet.size > 0) {
    const policyRows = await db.select({ id: policies.id, title: policies.title }).from(policies).where(inArray(policies.id, [...policyIdSet]));
    for (const p of policyRows) policyMap[p.id] = p.title;
  }
  return {
    organizationName: org.name,
    questionnaire: {
      filename: questionnaire.filename,
      dealReadinessScore: questionnaire.dealReadinessScore,
      totalQuestions: questionnaire.totalQuestions,
      answeredCount: questionnaire.answeredCount,
      gapCount: questionnaire.gapCount,
      highCount: questionnaire.highCount,
      mediumCount: questionnaire.mediumCount,
      lowCount: questionnaire.lowCount,
      sharedAt: questionnaire.sharedAt
    },
    questions: questions.map((q) => ({
      ...q,
      answer: q.userEditedAnswer ?? q.generatedAnswer
    })),
    policyMap
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 28;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BME_yi5a.js')).default;
const server_id = "src/routes/share/[token]/+page.server.ts";
const imports = ["_app/immutable/nodes/28.C0rjfxOZ.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/DZpD_d6q.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/BkY_wzAx.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/CB9dS2F2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=28-Bwz21d90.js.map
