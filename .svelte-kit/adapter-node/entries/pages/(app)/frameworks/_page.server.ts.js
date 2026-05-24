import { redirect } from "@sveltejs/kit";
import { d as db, f as frameworks, o as organizationFrameworks } from "../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const allFrameworks = await db.select().from(frameworks);
  const orgFrameworks = await db.select().from(organizationFrameworks).where(eq(organizationFrameworks.organizationId, locals.organizationId));
  const activeIds = new Set(orgFrameworks.map((f) => f.frameworkId));
  return {
    frameworks: allFrameworks.map((f) => ({ ...f, active: activeIds.has(f.id) }))
  };
};
export {
  load
};
