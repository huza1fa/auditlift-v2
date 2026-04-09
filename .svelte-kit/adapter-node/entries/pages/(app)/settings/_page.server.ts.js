import { redirect } from "@sveltejs/kit";
import { d as db, s as subscriptions, u as userOrganizations } from "../../../../chunks/index2.js";
import { eq, and } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.organizationId, locals.organizationId)).limit(1);
  const [membership] = await db.select({ role: userOrganizations.role }).from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, locals.organizationId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  return {
    organization: locals.organization,
    subscription: subscription ?? null,
    userRole: membership?.role ?? "member"
  };
};
export {
  load
};
