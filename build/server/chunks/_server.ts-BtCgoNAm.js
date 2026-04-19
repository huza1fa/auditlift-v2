import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, h as evidence, i as and, e as eq, c as controls } from './index2-BGADDK3r.js';
import { f as fileExists } from './storage-uhHqgdeh.js';
import { c as computeReadinessScore } from './score-B6xFlMNO.js';
import { l as logActivity } from './activity-eOUiNNTt.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';
import '@aws-sdk/client-s3';
import '@aws-sdk/s3-request-presigner';

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

export { POST };
//# sourceMappingURL=_server.ts-BtCgoNAm.js.map
