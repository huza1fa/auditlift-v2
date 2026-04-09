import { error, json } from "@sveltejs/kit";
import { d as db, p as policies, g as policyVersions } from "../../../../../chunks/index2.js";
import { and, eq, isNull, desc } from "drizzle-orm";
import { l as logActivity } from "../../../../../chunks/activity.js";
import { a as PatchPolicySchema } from "../../../../../chunks/validation.js";
const GET = async ({ locals, params, request }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const policyId = params.id;
  if (!policyId) {
    throw error(400, "Missing policy ID");
  }
  const url = new URL(request.url);
  if (url.searchParams.get("versions") === "true") {
    const versions = await db.select().from(policyVersions).where(
      and(
        eq(policyVersions.policyId, policyId),
        eq(policyVersions.organizationId, locals.organizationId)
      )
    ).orderBy(desc(policyVersions.savedAt)).limit(3);
    return json({ versions });
  }
  const [policy] = await db.select().from(policies).where(
    and(
      eq(policies.id, policyId),
      eq(policies.organizationId, locals.organizationId),
      isNull(policies.archivedAt)
    )
  ).limit(1);
  if (!policy) {
    throw error(404, "Policy not found");
  }
  return json({ policy });
};
const DELETE = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const policyId = params.id;
  if (!policyId) {
    throw error(400, "Missing policy ID");
  }
  const [existing] = await db.select().from(policies).where(
    and(
      eq(policies.id, policyId),
      eq(policies.organizationId, locals.organizationId),
      isNull(policies.archivedAt)
    )
  ).limit(1);
  if (!existing) {
    throw error(404, "Policy not found");
  }
  await db.update(policies).set({ archivedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId)));
  logActivity({
    organizationId: locals.organizationId,
    userId: locals.session.user.id,
    userName: locals.session.user.name,
    action: "policy.archive",
    entityType: "policy",
    entityId: existing.id,
    entityName: existing.title
  }).catch(console.error);
  return json({ success: true });
};
const PATCH = async ({ locals, params, request }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const policyId = params.id;
  if (!policyId) {
    throw error(400, "Missing policy ID");
  }
  const result = PatchPolicySchema.safeParse(await request.json());
  if (!result.success) throw error(400, "Invalid input");
  const body = result.data;
  const { content, title } = body;
  const [existing] = await db.select().from(policies).where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId))).limit(1);
  if (!existing) {
    throw error(404, "Policy not found");
  }
  if (existing.content) {
    await db.insert(policyVersions).values({
      policyId,
      organizationId: locals.organizationId,
      content: existing.content,
      savedBy: locals.session.user.id
    });
  }
  const updates = {
    updatedAt: /* @__PURE__ */ new Date(),
    editedAt: /* @__PURE__ */ new Date()
  };
  if (content !== void 0) updates.content = content;
  if (title !== void 0) updates.title = title;
  const [updated] = await db.update(policies).set(updates).where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId))).returning();
  logActivity({
    organizationId: locals.organizationId,
    userId: locals.session.user.id,
    userName: locals.session.user.name,
    action: "policy.edit",
    entityType: "policy",
    entityId: updated.id,
    entityName: updated.title
  }).catch(console.error);
  return json({ policy: updated });
};
export {
  DELETE,
  GET,
  PATCH
};
