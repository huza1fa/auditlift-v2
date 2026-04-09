import { r as redirect } from './index-wpIsICWW.js';
import { d as db, t as activityLogs, e as eq, k as desc } from './index2-C4rYKX5Z.js';
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
  const logs = await db.select().from(activityLogs).where(eq(activityLogs.organizationId, locals.organizationId)).orderBy(desc(activityLogs.createdAt)).limit(50);
  return { logs };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Br7Bdj5D.js')).default;
const server_id = "src/routes/(app)/settings/activity/+page.server.ts";
const imports = ["_app/immutable/nodes/15.yzmhHgQ3.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/BE_qY0Hl.js","_app/immutable/chunks/Cm3S0HSC.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/CDHoFBpk.js","_app/immutable/chunks/C4lyDYbo.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/CCDPLzFg.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-BQipgiUr.js.map
