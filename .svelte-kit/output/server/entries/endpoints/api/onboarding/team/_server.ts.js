import { error, json } from "@sveltejs/kit";
import { d as db, u as userOrganizations, g as organizations } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const POST = async ({ request, locals }) => {
  if (!locals.session) throw error(401, "Unauthorized");
  const { teamSize } = await request.json();
  const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (!userOrg) throw error(400, "No organization found");
  await db.update(organizations).set({ teamSize }).where(eq(organizations.id, userOrg.organizationId));
  return json({ ok: true });
};
export {
  POST
};
