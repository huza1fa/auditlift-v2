import { r as redirect } from './index-wpIsICWW.js';
import { d as db, s as subscriptions, e as eq, u as userOrganizations, i as and } from './index2-C4rYKX5Z.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.organizationId, locals.organizationId)).limit(1);
  const [membership] = await db.select({ role: userOrganizations.role }).from(userOrganizations).where(
    and(
      eq(userOrganizations.organizationId, locals.organizationId),
      eq(userOrganizations.userId, locals.session.user.id)
    )
  ).limit(1);
  return {
    organization: locals.organization,
    subscription: subscription ?? null,
    userRole: membership?.role ?? "member"
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-yA-4DxWk.js')).default;
const server_id = "src/routes/(app)/settings/+page.server.ts";
const imports = ["_app/immutable/nodes/14.NcIOT50R.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/C33NHl2q.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/D6Hx5MbU.js","_app/immutable/chunks/C4lyDYbo.js","_app/immutable/chunks/VtrdIure.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/BgNQN0s0.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-0I5YM9r8.js.map
