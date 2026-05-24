import { error, json } from "@sveltejs/kit";
import { d as db, u as userOrganizations, i as activityLogs, b as organizationInvitations, e as evidence, p as policies, l as readinessSnapshots, r as readinessScores, o as organizationFrameworks, s as subscriptions, g as organizations, m as user } from "../../../../../chunks/index2.js";
import { and, eq } from "drizzle-orm";
import { r as requireOrgDeletionPermission } from "../../../../../chunks/auth-utils.js";
const DELETE = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const userId = locals.session.user.id;
  const [membership] = await db.select({ role: userOrganizations.role }).from(userOrganizations).where(and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, userId))).limit(1);
  if (!membership) {
    throw error(403, "You are not a member of this organization");
  }
  requireOrgDeletionPermission(membership.role);
  await db.transaction(async (tx) => {
    await tx.delete(activityLogs).where(eq(activityLogs.organizationId, orgId));
    await tx.delete(organizationInvitations).where(eq(organizationInvitations.organizationId, orgId));
    await tx.delete(evidence).where(eq(evidence.organizationId, orgId));
    await tx.delete(policies).where(eq(policies.organizationId, orgId));
    await tx.delete(readinessSnapshots).where(eq(readinessSnapshots.organizationId, orgId));
    await tx.delete(readinessScores).where(eq(readinessScores.organizationId, orgId));
    await tx.delete(organizationFrameworks).where(eq(organizationFrameworks.organizationId, orgId));
    await tx.delete(subscriptions).where(eq(subscriptions.organizationId, orgId));
    await tx.delete(userOrganizations).where(eq(userOrganizations.organizationId, orgId));
    await tx.delete(organizations).where(eq(organizations.id, orgId));
  });
  await db.delete(user).where(eq(user.id, userId));
  return json({ success: true });
};
export {
  DELETE
};
