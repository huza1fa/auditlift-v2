import { r as redirect } from './index-wpIsICWW.js';
import { d as db, t as activityLogs, e as eq, k as desc } from './index2-BGADDK3r.js';
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
const imports = ["_app/immutable/nodes/15.zV_0tMUF.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/uAfJ0NmM.js","_app/immutable/chunks/D-fJ0yj3.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/Cw4o8BYs.js","_app/immutable/chunks/RO9Q9ZT8.js","_app/immutable/chunks/CeR0PS5m.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/BNIpjahG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-DtF7Iu_I.js.map
