import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq } from './index2-CrtZLkpF.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-DDatcq9e.js')).default;
const server_id = "src/routes/(app)/frameworks/+page.server.ts";
const imports = ["_app/immutable/nodes/10.BuqFIb9E.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/BkY_wzAx.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/jmpbzBok.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-gWAJlnkp.js.map
