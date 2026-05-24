import { r as redirect } from './index-wpIsICWW.js';
import { d as db, s as subscriptions, e as eq, u as userOrganizations, i as and } from './index2-CrtZLkpF.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-CBz_jdt5.js')).default;
const server_id = "src/routes/(app)/settings/+page.server.ts";
const imports = ["_app/immutable/nodes/14.DXkotNHA.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/DZjzTWpt.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/CI5OGqu9.js","_app/immutable/chunks/DbeiFq9X.js","_app/immutable/chunks/CEcNqGI_.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/jmpbzBok.js","_app/immutable/chunks/CTM0yUCp.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-CMrqEiDo.js.map
