import { r as redirect } from './index-wpIsICWW.js';
import { i as isReadOnly } from './billing-CuJKZCaE.js';
import { d as db, o as organizations, e as eq } from './index2-CrtZLkpF.js';
import { sendTrialExpiringEmail, sendTrialExpiredEmail } from './email-cUsGqBbo.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals, url }) => {
  if (!locals.session) {
    redirect(302, "/login");
  }
  if (!locals.organization || !locals.organization.onboardingComplete) {
    redirect(302, "/onboarding");
  }
  const readOnly = isReadOnly(locals.subscription, locals.organization?.trialEndsAt ?? null);
  const org = locals.organization;
  if (org.trialEndsAt && locals.session?.user) {
    const daysLeft = Math.ceil((org.trialEndsAt.getTime() - Date.now()) / 864e5);
    const user = locals.session.user;
    if (daysLeft <= 3 && daysLeft > 0 && !org.trialReminderSentAt) {
      sendTrialExpiringEmail({
        to: user.email,
        name: user.name ?? "",
        organizationName: org.name,
        daysLeft,
        trialEndsAt: org.trialEndsAt
      }).then(
        () => db.update(organizations).set({ trialReminderSentAt: /* @__PURE__ */ new Date() }).where(eq(organizations.id, org.id))
      ).catch(console.error);
    }
    if (daysLeft <= 0 && !org.trialExpiredEmailSentAt) {
      sendTrialExpiredEmail({
        to: user.email,
        name: user.name ?? "",
        organizationName: org.name
      }).then(
        () => db.update(organizations).set({ trialExpiredEmailSentAt: /* @__PURE__ */ new Date() }).where(eq(organizations.id, org.id))
      ).catch(console.error);
    }
  }
  return {
    user: locals.session.user,
    organization: locals.organization,
    subscription: locals.subscription,
    isReadOnly: readOnly
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-Cu7OvVmo.js')).default;
const server_id = "src/routes/(app)/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.BItqdY74.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/DVaPL7Nh.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/C6zEEx4p.js","_app/immutable/chunks/ftKWDiwK.js","_app/immutable/chunks/BVzCchKO.js","_app/immutable/chunks/AoZNdXks.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/DHdeVOIy.js","_app/immutable/chunks/8ivS15n9.js","_app/immutable/chunks/BXf5cY5b.js","_app/immutable/chunks/BvEs9fp0.js","_app/immutable/chunks/CIYP2E6N.js","_app/immutable/chunks/BMowMJzi.js","_app/immutable/chunks/DV7-d68W.js","_app/immutable/chunks/Dg_k2E4Y.js","_app/immutable/chunks/CEcNqGI_.js","_app/immutable/chunks/lpvZEjax.js","_app/immutable/chunks/Iq2x8nIK.js","_app/immutable/chunks/Dmx2quEY.js","_app/immutable/chunks/B85-Hpe-.js"];
const stylesheets = ["_app/immutable/assets/2.gDBYKr0l.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-SNMi_hKg.js.map
