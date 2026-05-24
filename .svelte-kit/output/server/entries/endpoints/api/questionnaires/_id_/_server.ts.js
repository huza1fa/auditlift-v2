import { error, json } from "@sveltejs/kit";
import { d as db, q as questionnaires, j as questionnaireQuestions, p as policies, a as controls } from "../../../../../chunks/index2.js";
import { and, eq, asc, inArray, isNull } from "drizzle-orm";
import { h as hasActiveAccess } from "../../../../../chunks/billing.js";
const DELETE = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const { id } = params;
  const [questionnaire] = await db.select().from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) throw error(404, "Questionnaire not found");
  await db.delete(questionnaireQuestions).where(
    and(
      eq(questionnaireQuestions.questionnaireId, id),
      eq(questionnaireQuestions.organizationId, orgId)
    )
  );
  await db.delete(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)));
  return json({ success: true });
};
const GET = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to access questionnaires.");
  }
  const { id } = params;
  const [questionnaire] = await db.select().from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  const questions = await db.select().from(questionnaireQuestions).where(
    and(
      eq(questionnaireQuestions.questionnaireId, id),
      eq(questionnaireQuestions.organizationId, orgId)
    )
  ).orderBy(asc(questionnaireQuestions.order));
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const allPolicyIds = [
    ...new Set(
      questions.flatMap((q) => q.mappedPolicyIds ?? []).filter((id2) => UUID_RE.test(id2))
    )
  ];
  const policyMap = {};
  if (allPolicyIds.length > 0) {
    const policyRows = await db.select({ id: policies.id, title: policies.title }).from(policies).where(inArray(policies.id, allPolicyIds));
    for (const p of policyRows) {
      policyMap[p.id] = p.title;
    }
  }
  const allControlIds = [
    ...new Set(
      questions.flatMap((q) => q.mappedControlIds ?? []).filter((id2) => UUID_RE.test(id2))
    )
  ];
  const controlMap = {};
  if (allControlIds.length > 0) {
    const controlRows = await db.select({ id: controls.id, code: controls.code, title: controls.title }).from(controls).where(inArray(controls.id, allControlIds));
    for (const c of controlRows) {
      controlMap[c.id] = { code: c.code, title: c.title };
    }
  }
  const orgPolicyRows = await db.select({ type: policies.type }).from(policies).where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt)));
  const existingPolicyTypes = [...new Set(orgPolicyRows.map((p) => p.type))];
  return json({ questionnaire, questions, policyMap, controlMap, existingPolicyTypes });
};
export {
  DELETE,
  GET
};
