import { error, json } from "@sveltejs/kit";
import { d as db, q as questionnaires, i as questionnaireQuestions } from "../../../../../../../chunks/index2.js";
import { and, eq } from "drizzle-orm";
import { h as hasActiveAccess } from "../../../../../../../chunks/billing.js";
import { z } from "zod";
const PatchAnswerSchema = z.object({
  answer: z.string().min(1).max(1e4)
});
const PATCH = async ({ locals, params, request }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to edit questionnaire answers.");
  }
  const { id, qid } = params;
  let body;
  try {
    body = await request.json();
  } catch {
    throw error(400, "Invalid JSON body");
  }
  const parsed = PatchAnswerSchema.safeParse(body);
  if (!parsed.success) {
    throw error(400, "Invalid input: answer must be a non-empty string");
  }
  const { answer } = parsed.data;
  const [questionnaire] = await db.select({ id: questionnaires.id }).from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  const [existing] = await db.select().from(questionnaireQuestions).where(
    and(
      eq(questionnaireQuestions.id, qid),
      eq(questionnaireQuestions.questionnaireId, id),
      eq(questionnaireQuestions.organizationId, orgId)
    )
  ).limit(1);
  if (!existing) {
    throw error(404, "Question not found");
  }
  const [updated] = await db.update(questionnaireQuestions).set({
    userEditedAnswer: answer,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(questionnaireQuestions.id, qid)).returning();
  return json(updated);
};
export {
  PATCH
};
