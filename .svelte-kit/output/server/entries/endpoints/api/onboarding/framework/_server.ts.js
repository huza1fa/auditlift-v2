import { error, json } from "@sveltejs/kit";
import { d as db, u as userOrganizations, f as frameworks, o as organizationFrameworks } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const POST = async ({ request, locals }) => {
  if (!locals.session) throw error(401, "Unauthorized");
  const { frameworkSlug } = await request.json();
  const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (!userOrg) throw error(400, "No organization found");
  const [framework] = await db.select().from(frameworks).where(eq(frameworks.slug, frameworkSlug)).limit(1);
  if (!framework) throw error(404, "Framework not found");
  await db.insert(organizationFrameworks).values({
    organizationId: userOrg.organizationId,
    frameworkId: framework.id
  }).onConflictDoNothing();
  return json({ ok: true });
};
export {
  POST
};
