import { e as error } from './index-wpIsICWW.js';
import { d as db, q as questionnaires, i as and, e as eq, o as organizations, l as questionnaireQuestions, p as policies, m as inArray } from './index2-BGADDK3r.js';
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

const index = 27;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-MSIj8g_n.js')).default;
const server_id = "src/routes/share/[token]/+page.server.ts";
const imports = ["_app/immutable/nodes/27.DbcJ0ABc.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/BXKLm6Zk.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/B69-cLJ0.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/BM-_O9eA.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=27-BZtZY8h4.js.map
