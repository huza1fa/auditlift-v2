import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq } from './index2-BGADDK3r.js';
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
const imports = ["_app/immutable/nodes/10.C0U6D_e8.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/B69-cLJ0.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-_rJT9vQa.js.map
