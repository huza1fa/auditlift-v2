import { error } from "@sveltejs/kit";
import { d as db, q as questionnaires, g as organizations, j as questionnaireQuestions, p as policies } from "../../../../chunks/index2.js";
import { and, eq, inArray } from "drizzle-orm";
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
export {
  load
};
