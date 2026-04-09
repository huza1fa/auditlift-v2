import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, u as userOrganizations, i as and, e as eq } from './index2-C4rYKX5Z.js';
import { b as requireMinimumRole, c as canChangeRole } from './auth-utils-BpQyI09M.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const PATCH = async ({ params, request, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const targetUserId = params.userId;
  if (!targetUserId) {
    throw error(400, "User ID is required");
  }
  const [currentUserMembership] = await db.select({ role: userOrganizations.role, userId: userOrganizations.userId }).from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, orgId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  if (!currentUserMembership) {
    throw error(403, "You are not a member of this organization");
  }
  const [targetUserMembership] = await db.select({ role: userOrganizations.role, userId: userOrganizations.userId }).from(userOrganizations).where(
    and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
  ).limit(1);
  if (!targetUserMembership) {
    throw error(404, "User not found in this organization");
  }
  const targetRole = targetUserMembership.role;
  const currentRole = currentUserMembership.role;
  if (!canChangeRole(currentRole, targetRole, targetUserId, locals.session.user.id)) {
    throw error(403, "You do not have permission to change this user's role");
  }
  const body = await request.json();
  const { role } = body;
  if (!role || !["admin", "member", "viewer"].includes(role)) {
    throw error(400, "Invalid role. Must be admin, member, or viewer");
  }
  if (targetRole === "owner") {
    throw error(403, "Cannot change the owner's role");
  }
  await db.update(userOrganizations).set({ role, updatedAt: /* @__PURE__ */ new Date() }).where(
    and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
  );
  return json({ success: true });
};
const DELETE = async ({ params, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const targetUserId = params.userId;
  if (!targetUserId) {
    throw error(400, "User ID is required");
  }
  if (targetUserId === locals.session.user.id) {
    throw error(400, "You cannot remove yourself. Transfer ownership first.");
  }
  const [currentUserMembership] = await db.select({ role: userOrganizations.role }).from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, orgId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  if (!currentUserMembership) {
    throw error(403, "You are not a member of this organization");
  }
  requireMinimumRole(currentUserMembership.role, "admin");
  const [targetUserMembership] = await db.select({ role: userOrganizations.role }).from(userOrganizations).where(
    and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
  ).limit(1);
  if (!targetUserMembership) {
    throw error(404, "User not found in this organization");
  }
  if (targetUserMembership.role === "owner") {
    throw error(403, "Cannot remove the owner");
  }
  await db.delete(userOrganizations).where(
    and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
  );
  return json({ success: true });
};

export { DELETE, PATCH };
//# sourceMappingURL=_server.ts-DZ_QRDUJ.js.map
