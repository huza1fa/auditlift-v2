import { redirect } from "@sveltejs/kit";
import { d as db, b as organizations, u as userOrganizations, a as organizationInvitations } from "../../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
import { a as hasActivePaidAccess, T as TRIAL_MEMBER_LIMIT } from "../../../../../chunks/billing.js";
const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    redirect(302, "/login");
  }
  const orgId = locals.organizationId;
  const [org] = await db.select({
    id: organizations.id,
    name: organizations.name,
    domain: organizations.domain
  }).from(organizations).where(eq(organizations.id, orgId)).limit(1);
  const [currentMembership] = await db.select({
    role: userOrganizations.role,
    userId: userOrganizations.userId
  }).from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, orgId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  const members = await db.select({
    id: userOrganizations.id,
    userId: userOrganizations.userId,
    role: userOrganizations.role,
    createdAt: userOrganizations.createdAt
  }).from(userOrganizations).where(eq(userOrganizations.organizationId, orgId));
  const pendingInvites = await db.select({
    id: organizationInvitations.id,
    email: organizationInvitations.email,
    role: organizationInvitations.role,
    expiresAt: organizationInvitations.expiresAt,
    createdAt: organizationInvitations.createdAt
  }).from(organizationInvitations).where(
    and(
      eq(organizationInvitations.organizationId, orgId),
      eq(organizationInvitations.status, "pending")
    )
  );
  const isPaid = hasActivePaidAccess(locals.subscription);
  const canInviteMore = isPaid || members.length + pendingInvites.length < TRIAL_MEMBER_LIMIT;
  return {
    organization: org,
    currentUser: {
      id: locals.session.user.id,
      name: locals.session.user.name,
      email: locals.session.user.email,
      image: locals.session.user.image,
      role: currentMembership?.role || "member"
    },
    members: members.map((m) => ({
      ...m,
      isCurrentUser: m.userId === locals.session?.user.id
    })),
    pendingInvites,
    memberLimit: isPaid ? null : TRIAL_MEMBER_LIMIT,
    canInviteMore
  };
};
export {
  load
};
