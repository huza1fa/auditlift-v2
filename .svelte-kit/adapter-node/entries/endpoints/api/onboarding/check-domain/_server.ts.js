import { error, json } from "@sveltejs/kit";
import { d as db, g as organizations, u as userOrganizations } from "../../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
import { e as extractDomainFromEmail } from "../../../../../chunks/auth-utils.js";
const GET = async ({ locals }) => {
  if (!locals.session) {
    throw error(401, "Unauthorized");
  }
  const email = locals.session.user.email;
  const domain = extractDomainFromEmail(email);
  if (!domain) {
    return json({
      hasExistingOrg: false,
      domain: null,
      message: "Personal email domain - you can create a new organization"
    });
  }
  const [existingOrg] = await db.select({
    id: organizations.id,
    name: organizations.name,
    domain: organizations.domain
  }).from(organizations).where(eq(organizations.domain, domain)).limit(1);
  if (!existingOrg) {
    return json({
      hasExistingOrg: false,
      domain,
      message: "No organization found with this domain"
    });
  }
  const [existingMembership] = await db.select().from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, existingOrg.id),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  if (existingMembership) {
    return json({
      hasExistingOrg: true,
      isMember: true,
      domain,
      organization: {
        id: existingOrg.id,
        name: existingOrg.name
      },
      message: "You are already a member of this organization"
    });
  }
  return json({
    hasExistingOrg: true,
    isMember: false,
    domain,
    organization: {
      id: existingOrg.id,
      name: existingOrg.name
    },
    message: "An organization with this domain already exists. You need an invitation to join."
  });
};
export {
  GET
};
