import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, u as userOrganizations, e as eq, o as organizations } from './index2-C4rYKX5Z.js';
import { sendWelcomeEmail } from './email-cUsGqBbo.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const POST = async ({ request, locals }) => {
  if (!locals.session) throw error(401, "Unauthorized");
  const body = await request.json().catch(() => ({}));
  const intent = body?.intent === "questionnaire" ? "questionnaire" : "compliance";
  const [userOrg] = await db.select().from(userOrganizations).where(eq(userOrganizations.userId, locals.session.user.id)).limit(1);
  if (!userOrg) throw error(400, "No organization found");
  const [org] = await db.select().from(organizations).where(eq(organizations.id, userOrg.organizationId)).limit(1);
  if (!org) throw error(400, "Organization not found");
  const shouldSendEmail = !org.onboardingComplete;
  await db.update(organizations).set({ onboardingComplete: true }).where(eq(organizations.id, userOrg.organizationId));
  if (shouldSendEmail) {
    sendWelcomeEmail({
      to: locals.session.user.email ?? "",
      name: locals.session.user.name ?? "",
      organizationName: org.name,
      trialEndsAt: org.trialEndsAt ?? null
    }).catch(console.error);
  }
  const redirectTo = intent === "questionnaire" ? "/questionnaires?tour=1" : "/dashboard?tour=1";
  return json({ ok: true, redirectTo });
};

export { POST };
//# sourceMappingURL=_server.ts-CTyngrGy.js.map
