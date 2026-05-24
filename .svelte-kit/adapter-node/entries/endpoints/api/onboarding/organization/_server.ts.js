import { error, json } from "@sveltejs/kit";
import { d as db, u as userOrganizations, g as organizations } from "../../../../../chunks/index2.js";
import { eq } from "drizzle-orm";
import { e as extractDomainFromEmail } from "../../../../../chunks/auth-utils.js";
import { O as OrganizationSchema } from "../../../../../chunks/validation.js";
const POST = async ({ request, locals }) => {
  if (!locals.session) throw error(401, "Unauthorized");
  const parseResult = OrganizationSchema.safeParse(await request.json());
  if (!parseResult.success) throw error(400, "Invalid input");
  const { name, website, industry } = parseResult.data;
  const [existingUserOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (existingUserOrg) {
    await db.update(organizations).set({ name: name.trim(), website: website?.trim() || null, industry: industry || null }).where(eq(organizations.id, existingUserOrg.organizationId));
    return json({ organizationId: existingUserOrg.organizationId });
  }
  const email = locals.session.user.email || "";
  const domain = extractDomainFromEmail(email);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
  const trialEndsAt = /* @__PURE__ */ new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);
  const [org] = await db.insert(organizations).values({
    name: name.trim(),
    slug,
    domain,
    // Store domain if available (personal emails return null)
    website: website?.trim() || null,
    industry: industry || null,
    trialEndsAt,
    onboardingComplete: false
  }).returning();
  await db.insert(userOrganizations).values({
    userId: locals.session.user.id,
    organizationId: org.id,
    role: "owner"
  });
  const { subscriptions } = await import("../../../../../chunks/index2.js").then((n) => n.k);
  await db.insert(subscriptions).values({
    organizationId: org.id,
    status: "trialing",
    currentPeriodEnd: trialEndsAt
  });
  return json({ organizationId: org.id });
};
export {
  POST
};
