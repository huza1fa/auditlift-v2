import { error, json } from "@sveltejs/kit";
import { b as private_env } from "../../../../../chunks/shared-server.js";
import { d as db, l as user, u as userOrganizations, a as organizationInvitations } from "../../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
import { a as requireInvitePermission } from "../../../../../chunks/auth-utils.js";
import { sendInviteEmail } from "../../../../../chunks/email.js";
import { b as InviteTeamMemberSchema } from "../../../../../chunks/validation.js";
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
  return json({
    members: members.map((m) => ({
      ...m,
      isCurrentUser: m.userId === locals.session?.user.id
    })),
    pendingInvites
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
export {
  GET,
  POST
};
