import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq } from './index2-C4rYKX5Z.js';
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
  const allFrameworks = await db.select().from(frameworks);
  const orgFrameworks = await db.select().from(organizationFrameworks).where(eq(organizationFrameworks.organizationId, locals.organizationId));
  const activeIds = new Set(orgFrameworks.map((f) => f.frameworkId));
  return {
    frameworks: allFrameworks.map((f) => ({ ...f, active: activeIds.has(f.id) }))
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 10;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bh0kqx1y.js')).default;
const server_id = "src/routes/(app)/frameworks/+page.server.ts";
const imports = ["_app/immutable/nodes/10.C39k4I64.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/CJHQ0HkA.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-BjWGBYy0.js.map
