import { redirect } from "@sveltejs/kit";
import { d as db, f as frameworks, o as organizationFrameworks, p as policies, a as controls, e as evidence } from "../../../../chunks/index2.js";
import { eq, and, isNull, desc } from "drizzle-orm";
import { a as hasActivePaidAccess } from "../../../../chunks/billing.js";
const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const orgId = locals.organizationId;
  const canExport = hasActivePaidAccess(locals.subscription);
  const [orgFramework] = await db.select({ framework: frameworks }).from(organizationFrameworks).innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id)).where(eq(organizationFrameworks.organizationId, orgId)).limit(1);
  const policyList = await db.select({
    id: policies.id,
    title: policies.title,
    type: policies.type,
    isCustom: policies.isCustom
  }).from(policies).where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt))).orderBy(desc(policies.createdAt));
  const evidenceList = await db.select({
    id: evidence.id,
    filename: evidence.filename,
    sizeBytes: evidence.sizeBytes,
    controlId: evidence.controlId,
    controlCode: controls.code
  }).from(evidence).leftJoin(controls, eq(evidence.controlId, controls.id)).where(
    and(
      eq(evidence.organizationId, orgId),
      eq(evidence.status, "active"),
      isNull(evidence.deletedAt)
    )
  );
  return {
    canExport,
    framework: orgFramework?.framework ?? null,
    policyList,
    evidenceList
  };
};
export {
  load
};
