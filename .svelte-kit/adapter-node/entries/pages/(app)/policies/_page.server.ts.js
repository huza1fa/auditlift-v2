import { redirect } from "@sveltejs/kit";
import { d as db, p as policies } from "../../../../chunks/index2.js";
import { and, eq, isNull, desc } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const policyList = await db.select().from(policies).where(and(eq(policies.organizationId, locals.organizationId), isNull(policies.archivedAt))).orderBy(desc(policies.createdAt));
  return { policies: policyList };
};
export {
  load
};
