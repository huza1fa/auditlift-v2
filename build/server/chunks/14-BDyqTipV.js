import { r as redirect } from './index-wpIsICWW.js';
import { d as db, s as subscriptions, e as eq, u as userOrganizations, i as and } from './index2-BGADDK3r.js';
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
const imports = ["_app/immutable/nodes/14._SQsI0Aw.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/ChMAS9Cz.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/DQuKVh7U.js","_app/immutable/chunks/CeR0PS5m.js","_app/immutable/chunks/BVZvfCma.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/DiIfMaTF.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-BDyqTipV.js.map
