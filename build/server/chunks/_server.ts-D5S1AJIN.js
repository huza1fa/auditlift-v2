import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, u as userOrganizations, e as eq, o as organizations } from './index2-CrtZLkpF.js';
import { e as extractDomainFromEmail } from './auth-utils-BpQyI09M.js';
import { O as OrganizationSchema } from './validation-CH6LL-Nw.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';
import 'zod';

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
  const { subscriptions } = await import('./index2-CrtZLkpF.js').then(function (n) { return n.b5; }).then((n) => n.k);
  await db.insert(subscriptions).values({
    organizationId: org.id,
    status: "trialing",
    currentPeriodEnd: trialEndsAt
  });
  return json({ organizationId: org.id });
};

export { POST };
//# sourceMappingURL=_server.ts-D5S1AJIN.js.map
