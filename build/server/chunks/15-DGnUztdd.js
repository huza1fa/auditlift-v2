import { r as redirect } from './index-wpIsICWW.js';
import { d as db, t as activityLogs, e as eq, k as desc } from './index2-CrtZLkpF.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-CRr4pyrW.js')).default;
const server_id = "src/routes/(app)/settings/activity/+page.server.ts";
const imports = ["_app/immutable/nodes/15.sgU8Y6LL.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/DVaPL7Nh.js","_app/immutable/chunks/JGVrELUD.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/BXf5cY5b.js","_app/immutable/chunks/DxKX1im5.js","_app/immutable/chunks/DbeiFq9X.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/jmpbzBok.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-DGnUztdd.js.map
