import { e as error, j as json } from './index-wpIsICWW.js';
import { z } from 'zod';
import { d as db, p as policies, i as and, j as isNull, e as eq, H as policyVersions } from './index2-C4rYKX5Z.js';
import { l as logActivity } from './activity-Cf6RVhrQ.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const RestoreSchema = z.object({
  versionId: z.string().uuid()
});
const POST = async ({ locals, params, request }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const policyId = params.id;
  if (!policyId) {
    throw error(400, "Missing policy ID");
  }
  const result = RestoreSchema.safeParse(await request.json());
  if (!result.success) throw error(400, "Invalid input");
  const { versionId } = result.data;
  const [existingPolicy] = await db.select().from(policies).where(
    and(
      eq(policies.id, policyId),
      eq(policies.organizationId, locals.organizationId),
      isNull(policies.archivedAt)
    )
  ).limit(1);
  if (!existingPolicy) {
    throw error(404, "Policy not found");
  }
  const [version] = await db.select().from(policyVersions).where(
    and(
      eq(policyVersions.id, versionId),
      eq(policyVersions.policyId, policyId),
      eq(policyVersions.organizationId, locals.organizationId)
    )
  ).limit(1);
  if (!version) {
    throw error(404, "Version not found");
  }
  await db.insert(policyVersions).values({
    policyId,
    organizationId: locals.organizationId,
    content: existingPolicy.content,
    savedBy: locals.session.user.id
  });
  const [updated] = await db.update(policies).set({
    content: version.content,
    editedAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }).where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId))).returning();
  logActivity({
    organizationId: locals.organizationId,
    userId: locals.session.user.id,
    userName: locals.session.user.name,
    action: "policy.edit",
    entityType: "policy",
    entityId: existingPolicy.id,
    entityName: existingPolicy.title
  }).catch(console.error);
  return json({ content: updated.content });
};

export { POST };
//# sourceMappingURL=_server.ts-C-ehzHYl.js.map
