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
const imports = ["_app/immutable/nodes/15.C1fuYxY-.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/f_6DPdZv.js","_app/immutable/chunks/rUg4D0S3.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/BpHR7QeB.js","_app/immutable/chunks/zWQAIHPg.js","_app/immutable/chunks/hHjxOlmU.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/D4VMwjv9.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-jpX5WQS5.js.map
