import { error, json } from "@sveltejs/kit";
import { z } from "zod";
import { d as db, p as policies, g as policyVersions } from "../../../../../../chunks/index2.js";
import { and, eq, isNull } from "drizzle-orm";
import { l as logActivity } from "../../../../../../chunks/activity.js";
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
export {
  POST
};
