import { error, json } from "@sveltejs/kit";
import { d as db, q as questionnaires } from "../../../../../../chunks/index2.js";
import { and, eq } from "drizzle-orm";
import { h as hasActiveAccess } from "../../../../../../chunks/billing.js";
import { c as checkRateLimit } from "../../../../../../chunks/rate-limit.js";
import { r as reprocessQuestionnaire } from "../../../../../../chunks/questionnaire-processor.js";
const POST = async ({ params, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt)) {
    throw error(402, "Your trial has expired. Please upgrade to continue.");
  }
  if (!checkRateLimit(`reprocess:${orgId}`, 5, 60 * 60 * 1e3)) {
    throw error(429, "Too many reprocess requests. Please wait before trying again.");
  }
  const questionnaireId = params.id;
  if (!questionnaireId) {
    throw error(400, "Missing questionnaire ID");
  }
  const [questionnaire] = await db.select({ id: questionnaires.id, status: questionnaires.status }).from(questionnaires).where(
    and(eq(questionnaires.id, questionnaireId), eq(questionnaires.organizationId, orgId))
  ).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  if (questionnaire.status === "processing") {
    throw error(409, "Questionnaire is already being processed. Please wait for it to complete.");
  }
  reprocessQuestionnaire(questionnaireId, orgId).catch(console.error);
  return json({ success: true });
};
export {
  POST
};
