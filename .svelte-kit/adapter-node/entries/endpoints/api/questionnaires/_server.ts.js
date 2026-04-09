import { error, json } from "@sveltejs/kit";
import { d as db, q as questionnaires } from "../../../../chunks/index2.js";
import { eq, desc } from "drizzle-orm";
import { h as hasActiveAccess } from "../../../../chunks/billing.js";
const GET = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to access questionnaires.");
  }
  const rows = await db.select({
    id: questionnaires.id,
    filename: questionnaires.filename,
    status: questionnaires.status,
    totalQuestions: questionnaires.totalQuestions,
    answeredCount: questionnaires.answeredCount,
    gapCount: questionnaires.gapCount,
    highCount: questionnaires.highCount,
    mediumCount: questionnaires.mediumCount,
    lowCount: questionnaires.lowCount,
    dealReadinessScore: questionnaires.dealReadinessScore,
    sourceFormat: questionnaires.sourceFormat,
    createdAt: questionnaires.createdAt
  }).from(questionnaires).where(eq(questionnaires.organizationId, orgId)).orderBy(desc(questionnaires.createdAt));
  return json({ questionnaires: rows });
};
export {
  GET
};
