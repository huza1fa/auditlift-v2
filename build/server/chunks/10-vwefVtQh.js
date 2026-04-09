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
const imports = ["_app/immutable/nodes/10.C8nz_xQF.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/khj6Ofq9.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-vwefVtQh.js.map
