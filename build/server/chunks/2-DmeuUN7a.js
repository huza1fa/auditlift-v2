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
const imports = ["_app/immutable/nodes/2.BF7ek8-D.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/BE_qY0Hl.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/B4AD-UjT.js","_app/immutable/chunks/BKEoGZbz.js","_app/immutable/chunks/l7U8ITNg.js","_app/immutable/chunks/CA1HKMk9.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/nglKhGsV.js","_app/immutable/chunks/Cr8RfznP.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/CLB3M1ek.js","_app/immutable/chunks/BtuYMSAc.js","_app/immutable/chunks/UiNaD5DC.js","_app/immutable/chunks/CsO9MnRP.js","_app/immutable/chunks/B060-HDF.js","_app/immutable/chunks/VtrdIure.js","_app/immutable/chunks/8JVPSuNb.js","_app/immutable/chunks/B6md9Z8L.js","_app/immutable/chunks/Cox_fmk7.js","_app/immutable/chunks/B85-Hpe-.js"];
const stylesheets = ["_app/immutable/assets/2.gDBYKr0l.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-DmeuUN7a.js.map
