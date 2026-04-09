import { error, json } from "@sveltejs/kit";
import { d as db, a as organizationInvitations, b as organizations, u as userOrganizations } from "../../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
const GET = async ({ params, locals }) => {
  const token = params.token;
  if (!token) {
    throw error(400, "Token is required");
  }
  const [invitation] = await db.select().from(organizationInvitations).where(eq(organizationInvitations.token, token)).limit(1);
  if (!invitation) {
    throw error(404, "Invitation not found");
  }
  if (invitation.status !== "pending") {
    throw error(400, "This invitation has already been processed");
  }
  if (/* @__PURE__ */ new Date() > invitation.expiresAt) {
    throw error(400, "This invitation has expired");
  }
  const [org] = await db.select({
    id: organizations.id,
    name: organizations.name
  }).from(organizations).where(eq(organizations.id, invitation.organizationId)).limit(1);
  if (!org) {
    throw error(404, "Organization not found");
  }
  const isLoggedIn = locals.session && locals.session.user.email === invitation.email;
  return json({
    invitation: {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt
    },
    organization: {
      id: org.id,
      name: org.name
    },
    isLoggedIn,
    matchingEmail: locals.session?.user.email === invitation.email
  });
};
const POST = async ({ params, request, locals }) => {
  const token = params.token;
  if (!token) {
    throw error(400, "Token is required");
  }
  if (!locals.session) {
    throw error(401, "You must be logged in to respond to this invitation");
  }
  const body = await request.json();
  const { action } = body;
  if (!action || !["accept", "decline"].includes(action)) {
    throw error(400, "Action must be accept or decline");
  }
  const [invitation] = await db.select().from(organizationInvitations).where(eq(organizationInvitations.token, token)).limit(1);
  if (!invitation) {
    throw error(404, "Invitation not found");
  }
  if (invitation.status !== "pending") {
    throw error(400, "This invitation has already been processed");
  }
  if (/* @__PURE__ */ new Date() > invitation.expiresAt) {
    throw error(400, "This invitation has expired");
  }
  if (locals.session.user.email !== invitation.email) {
    throw error(403, "This invitation was sent to a different email address");
  }
  if (action === "decline") {
    await db.update(organizationInvitations).set({ status: "declined" }).where(eq(organizationInvitations.id, invitation.id));
    return json({ success: true, message: "Invitation declined" });
  }
  const [existingMembership] = await db.select().from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, invitation.organizationId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  if (existingMembership) {
    throw error(400, "You are already a member of this organization");
  }
  await db.insert(userOrganizations).values({
    userId: locals.session.user.id,
    organizationId: invitation.organizationId,
    role: invitation.role
  });
  await db.update(organizationInvitations).set({ status: "accepted" }).where(eq(organizationInvitations.id, invitation.id));
  return json({
    success: true,
    message: "You have joined the organization",
    organizationId: invitation.organizationId
  });
};
export {
  GET,
  POST
};
