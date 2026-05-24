import { error, json } from "@sveltejs/kit";
import { d as db, e as evidence, a as controls } from "../../../../../../chunks/index2.js";
import { and, eq } from "drizzle-orm";
import { f as fileExists } from "../../../../../../chunks/storage.js";
import { c as computeReadinessScore } from "../../../../../../chunks/score.js";
import { l as logActivity } from "../../../../../../chunks/activity.js";
const POST = async ({ params, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const evidenceId = params.id;
  if (!evidenceId) {
    throw error(400, "Evidence ID is required");
  }
  const [existingEvidence] = await db.select().from(evidence).where(and(eq(evidence.id, evidenceId), eq(evidence.organizationId, orgId)));
  if (!existingEvidence) {
    throw error(404, "Evidence not found");
  }
  if (existingEvidence.status === "active") {
    return json({ success: true, message: "Evidence already confirmed" });
  }
  const exists = await fileExists(existingEvidence.storageKey);
  if (!exists) {
    await db.delete(evidence).where(eq(evidence.id, evidenceId));
    throw error(410, "File no longer exists in storage. Please upload again.");
  }
  try {
    await db.update(evidence).set({
      status: "active",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(and(eq(evidence.id, evidenceId), eq(evidence.organizationId, orgId)));
    const [ctrl] = await db.select({ frameworkId: controls.frameworkId, code: controls.code }).from(controls).where(eq(controls.id, existingEvidence.controlId)).limit(1);
    logActivity({
      organizationId: orgId,
      userId: locals.session.user.id,
      userName: locals.session.user.name,
      action: "evidence.upload",
      entityType: "evidence",
      entityId: existingEvidence.id,
      entityName: existingEvidence.filename,
      controlCode: ctrl?.code ?? null
    }).catch(console.error);
    if (ctrl) {
      computeReadinessScore(orgId, ctrl.frameworkId).catch(console.error);
    }
    return json({ success: true });
  } catch (err) {
    console.error("Failed to confirm evidence:", err);
    throw error(500, "Failed to confirm upload");
  }
};
export {
  POST
};
