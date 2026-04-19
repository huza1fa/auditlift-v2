import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, h as evidence, i as and, j as isNull, e as eq, c as controls } from './index2-BGADDK3r.js';
import { c as getPresignedDownloadUrl } from './storage-uhHqgdeh.js';
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

const GET = async ({ params, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const [ev] = await db.select().from(evidence).where(
    and(
      eq(evidence.id, params.id),
      eq(evidence.organizationId, orgId),
      isNull(evidence.deletedAt)
    )
  ).limit(1);
  if (!ev) {
    throw error(404, "Evidence not found");
  }
  if (ev.status !== "active") {
    throw error(400, "Evidence upload not confirmed");
  }
  const downloadUrl = await getPresignedDownloadUrl(ev.storageKey);
  return json({
    id: ev.id,
    filename: ev.filename,
    mimeType: ev.mimeType,
    sizeBytes: ev.sizeBytes,
    downloadUrl
  });
};
const DELETE = async ({ params, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const [ev] = await db.select().from(evidence).where(
    and(
      eq(evidence.id, params.id),
      eq(evidence.organizationId, orgId),
      isNull(evidence.deletedAt)
    )
  ).limit(1);
  if (!ev) {
    throw error(404, "Evidence not found");
  }
  await db.update(evidence).set({ deletedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId)));
  const [ctrl] = await db.select({ frameworkId: controls.frameworkId, code: controls.code }).from(controls).where(eq(controls.id, ev.controlId)).limit(1);
  logActivity({
    organizationId: orgId,
    userId: locals.session.user.id,
    userName: locals.session.user.name,
    action: "evidence.delete",
    entityType: "evidence",
    entityId: ev.id,
    entityName: ev.filename,
    controlCode: ctrl?.code ?? null
  }).catch(console.error);
  if (ctrl) {
    computeReadinessScore(orgId, ctrl.frameworkId).catch(console.error);
  }
  return json({ success: true });
};
const PATCH = async ({ params, locals, request }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const [ev] = await db.select().from(evidence).where(
    and(
      eq(evidence.id, params.id),
      eq(evidence.organizationId, orgId),
      isNull(evidence.deletedAt)
    )
  ).limit(1);
  if (!ev) {
    throw error(404, "Evidence not found");
  }
  const body = await request.json();
  const { notes } = body;
  const [updated] = await db.update(evidence).set({ notes, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(evidence.id, params.id), eq(evidence.organizationId, orgId))).returning();
  return json({ evidence: updated });
};

export { DELETE, GET, PATCH };
//# sourceMappingURL=_server.ts-Bhzkcd9A.js.map
