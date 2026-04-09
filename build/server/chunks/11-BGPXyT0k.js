import { r as redirect } from './index-wpIsICWW.js';
import { d as db, p as policies, i as and, j as isNull, e as eq, k as desc } from './index2-C4rYKX5Z.js';
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
  const policyList = await db.select().from(policies).where(and(eq(policies.organizationId, locals.organizationId), isNull(policies.archivedAt))).orderBy(desc(policies.createdAt));
  return { policies: policyList };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CoGSY_rr.js')).default;
const server_id = "src/routes/(app)/policies/+page.server.ts";
const imports = ["_app/immutable/nodes/11.BVL0g9p5.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/B66p6nCB.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/BdiVR5nC.js","_app/immutable/chunks/en4d4uem.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/BX63xdyG.js","_app/immutable/chunks/CDHoFBpk.js","_app/immutable/chunks/BX8eh26r.js","_app/immutable/chunks/CstPM5qL.js","_app/immutable/chunks/C4lyDYbo.js","_app/immutable/chunks/8JVPSuNb.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/B6md9Z8L.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BqR5w0Vn.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-BGPXyT0k.js.map
