import { error, json } from "@sveltejs/kit";
import { d as db, q as questionnaires } from "../../../../../../chunks/index2.js";
import { and, eq } from "drizzle-orm";
import { a as hasActivePaidAccess } from "../../../../../../chunks/billing.js";
const POST = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActivePaidAccess(locals.subscription)) {
    throw error(402, "Upgrade to enable questionnaire sharing.");
  }
  const { id } = params;
  const [questionnaire] = await db.select({
    id: questionnaires.id,
    status: questionnaires.status,
    shareToken: questionnaires.shareToken,
    sharedAt: questionnaires.sharedAt
  }).from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  if (questionnaire.status !== "ready") {
    throw error(400, "Questionnaire must be fully processed before sharing.");
  }
  let shareToken;
  let sharedAt;
  if (questionnaire.shareToken === null) {
    shareToken = crypto.randomUUID();
    sharedAt = /* @__PURE__ */ new Date();
  } else {
    shareToken = null;
    sharedAt = null;
  }
  await db.update(questionnaires).set({ shareToken, sharedAt }).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)));
  const response = { shareToken, sharedAt };
  return json(response);
};
export {
  POST
};
