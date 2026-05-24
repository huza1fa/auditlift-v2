import { e as error, j as json } from './index-wpIsICWW.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import { d as db, J as user, u as userOrganizations, e as eq, v as organizationInvitations, i as and } from './index2-CrtZLkpF.js';
import { a as requireInvitePermission } from './auth-utils-BpQyI09M.js';
import { sendInviteEmail } from './email-cUsGqBbo.js';
import { b as InviteTeamMemberSchema } from './validation-CH6LL-Nw.js';
import { h as hasActivePaidAccess, T as TRIAL_MEMBER_LIMIT } from './billing-CuJKZCaE.js';
import { c as count } from './aggregate-CbMItvtT.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import 'zod';

const GET = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const members = await db.select({
    id: userOrganizations.id,
    userId: userOrganizations.userId,
    role: userOrganizations.role,
    createdAt: userOrganizations.createdAt,
    name: user.name,
    email: user.email,
    image: user.image
  }).from(userOrganizations).leftJoin(user, eq(userOrganizations.userId, user.id)).where(eq(userOrganizations.organizationId, orgId));
  const pendingInvites = await db.select({
    id: organizationInvitations.id,
    email: organizationInvitations.email,
    role: organizationInvitations.role,
    status: organizationInvitations.status,
    expiresAt: organizationInvitations.expiresAt,
    createdAt: organizationInvitations.createdAt
  }).from(organizationInvitations).where(
    and(
      eq(organizationInvitations.organizationId, orgId),
      eq(organizationInvitations.status, "pending")
    )
  );
  const isPaid = hasActivePaidAccess(locals.subscription);
  return json({
    members: members.map((m) => ({
      ...m,
      isCurrentUser: m.userId === locals.session?.user.id
    })),
    pendingInvites,
    memberLimit: isPaid ? null : TRIAL_MEMBER_LIMIT,
    canInviteMore: isPaid || members.length + pendingInvites.length < TRIAL_MEMBER_LIMIT
  });
};
const POST = async ({ request, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  const [userMembership] = await db.select({ role: userOrganizations.role }).from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, orgId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  if (!userMembership) {
    throw error(403, "You are not a member of this organization");
  }
  requireInvitePermission(userMembership.role);
  if (!hasActivePaidAccess(locals.subscription)) {
    const [{ value: currentMemberCount }] = await db.select({ value: count() }).from(userOrganizations).where(eq(userOrganizations.organizationId, orgId));
    const [{ value: pendingInviteCount }] = await db.select({ value: count() }).from(organizationInvitations).where(
      and(
        eq(organizationInvitations.organizationId, orgId),
        eq(organizationInvitations.status, "pending")
      )
    );
    if (currentMemberCount + pendingInviteCount >= TRIAL_MEMBER_LIMIT) {
      throw error(
        403,
        `Trial plans are limited to ${TRIAL_MEMBER_LIMIT} team members. Upgrade to invite more.`
      );
    }
  }
  const result = InviteTeamMemberSchema.safeParse(await request.json());
  if (!result.success) throw error(400, "Invalid input");
  const body = result.data;
  const { email, role } = body;
  const [existingUser] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
  if (existingUser) {
    const [existingMember] = await db.select().from(userOrganizations).where(
      and(
        eq(userOrganizations.organizationId, orgId),
        eq(userOrganizations.userId, existingUser.id)
      )
    ).limit(1);
    if (existingMember) {
      throw error(400, "User is already a member of this organization");
    }
  }
  const [existingInvite] = await db.select().from(organizationInvitations).where(
    and(
      eq(organizationInvitations.organizationId, orgId),
      eq(organizationInvitations.email, email),
      eq(organizationInvitations.status, "pending")
    )
  ).limit(1);
  if (existingInvite) {
    throw error(400, "An invitation has already been sent to this email");
  }
  const token = crypto.randomUUID();
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const [invitation] = await db.insert(organizationInvitations).values({
    organizationId: orgId,
    email,
    role,
    token,
    invitedBy: locals.session.user.id,
    expiresAt
  }).returning();
  const origin = private_env.ORIGIN || "http://localhost:5173";
  const inviteLink = `${origin}/invite/${token}`;
  const inviterName = locals.session?.user?.name ?? locals.session?.user?.email ?? "A team member";
  sendInviteEmail({
    to: email,
    inviterName,
    organizationName: locals.organization?.name ?? "your organization",
    inviteLink,
    role,
    expiresAt: invitation.expiresAt
  }).catch(console.error);
  return json({
    invitation: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt
    },
    inviteLink
  });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-CgUTyEGC.js.map
