import { error, json } from "@sveltejs/kit";
import { d as db, g as organizations } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { S as SystemDescriptionSchema } from "../../../../../chunks/validation.js";
const GET = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const [org] = await db.select({ systemDescription: organizations.systemDescription }).from(organizations).where(eq(organizations.id, locals.organizationId)).limit(1);
  if (!org) throw error(404, "Organization not found");
  return json({ systemDescription: org.systemDescription ?? {} });
};
const PUT = async ({ request, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  let body;
  try {
    body = await request.json();
  } catch {
    throw error(400, "Invalid JSON");
  }
  const result = SystemDescriptionSchema.safeParse(body);
  if (!result.success) {
    throw error(400, "Invalid input");
  }
  await db.update(organizations).set({
    systemDescription: result.data,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(organizations.id, locals.organizationId));
  return json({ success: true, systemDescription: result.data });
};
export {
  GET,
  PUT
};
