import { redirect } from "@sveltejs/kit";
import { d as db, h as activityLogs } from "../../../../../chunks/index2.js";
import { eq, desc } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const logs = await db.select().from(activityLogs).where(eq(activityLogs.organizationId, locals.organizationId)).orderBy(desc(activityLogs.createdAt)).limit(50);
  return { logs };
};
export {
  load
};
