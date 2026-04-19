import { r as redirect } from './index-wpIsICWW.js';
import { i as isReadOnly } from './billing-CuJKZCaE.js';
import { d as db, o as organizations, e as eq } from './index2-BGADDK3r.js';
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
const component = async () => component_cache ??= (await import('./_layout.svelte-LIDlKmed.js')).default;
const server_id = "src/routes/(app)/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.BROx8B0F.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/uAfJ0NmM.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/BVhrlIEL.js","_app/immutable/chunks/lY-74J4r.js","_app/immutable/chunks/pVCgLvoe.js","_app/immutable/chunks/BRTuafyp.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/eEFtYnTo.js","_app/immutable/chunks/B6qRuksm.js","_app/immutable/chunks/Cw4o8BYs.js","_app/immutable/chunks/DUQCiiZn.js","_app/immutable/chunks/BcMUhafR.js","_app/immutable/chunks/DVQDMECg.js","_app/immutable/chunks/DbDxeITt.js","_app/immutable/chunks/C2HthWRl.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/BAU21WYp.js","_app/immutable/chunks/DmSCWmPh.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/B85-Hpe-.js"];
const stylesheets = ["_app/immutable/assets/2.gDBYKr0l.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-D17aojK-.js.map
