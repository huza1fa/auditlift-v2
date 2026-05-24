import { error, json } from "@sveltejs/kit";
import { z } from "zod";
import { d as db, u as userOrganizations, g as organizations } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
const PostureSchema = z.object({
  securityTools: z.array(z.enum(["sso", "mdm", "password_manager", "ci_cd", "code_review"])).default([])
});
const POST = async ({ request, locals }) => {
  if (!locals.session) throw error(401, "Unauthorized");
  const result = PostureSchema.safeParse(await request.json());
  if (!result.success) throw error(400, "Invalid input");
  const { securityTools } = result.data;
  const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (!userOrg) throw error(400, "No organization found");
  await db.update(organizations).set({ securityTools }).where(eq(organizations.id, userOrg.organizationId));
  return json({ ok: true });
};
export {
  POST
};
