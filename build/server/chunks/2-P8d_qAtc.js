import { r as redirect } from './index-wpIsICWW.js';
import { i as isReadOnly } from './billing-DpV-ct2L.js';
import { d as db, o as organizations, e as eq } from './index2-C4rYKX5Z.js';
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
const component = async () => component_cache ??= (await import('./_layout.svelte-CG7ehbO9.js')).default;
const server_id = "src/routes/(app)/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.GC-7y9um.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/f_6DPdZv.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/CPo0FU61.js","_app/immutable/chunks/BPbtIwII.js","_app/immutable/chunks/BIwpEWWY.js","_app/immutable/chunks/z-7OK0ai.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/D_4SjgB0.js","_app/immutable/chunks/CuUG55jY.js","_app/immutable/chunks/BpHR7QeB.js","_app/immutable/chunks/BH9OUOv8.js","_app/immutable/chunks/l80McTsy.js","_app/immutable/chunks/DxW7cWuH.js","_app/immutable/chunks/Crlif-6b.js","_app/immutable/chunks/DVcxUPmm.js","_app/immutable/chunks/5ZyVvjnc.js","_app/immutable/chunks/C0R6Hy8-.js","_app/immutable/chunks/BpEak5nx.js","_app/immutable/chunks/B7Ssuz1w.js","_app/immutable/chunks/B85-Hpe-.js"];
const stylesheets = ["_app/immutable/assets/2.gDBYKr0l.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-P8d_qAtc.js.map
