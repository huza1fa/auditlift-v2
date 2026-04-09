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
const imports = ["_app/immutable/nodes/14.BmvFfe5y.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/Buyedc_J.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/BvNIOfSW.js","_app/immutable/chunks/hHjxOlmU.js","_app/immutable/chunks/5ZyVvjnc.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/CmvkKI0s.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-ChyMLb9h.js.map
