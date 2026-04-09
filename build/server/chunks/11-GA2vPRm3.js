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
const component = async () => component_cache ??= (await import('./_page.svelte-Cm1PlG1H.js')).default;
const server_id = "src/routes/(app)/policies/+page.server.ts";
const imports = ["_app/immutable/nodes/11.DGzGAT6Z.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/CvJ76tB6.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/CL6cXeDj.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/B1IiGnj1.js","_app/immutable/chunks/DSuTUhAQ.js","_app/immutable/chunks/BpHR7QeB.js","_app/immutable/chunks/DAjDy0qh.js","_app/immutable/chunks/zWQAIHPg.js","_app/immutable/chunks/8OJed41S.js","_app/immutable/chunks/XVWDnIXh.js","_app/immutable/chunks/hHjxOlmU.js","_app/immutable/chunks/C0R6Hy8-.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/BpEak5nx.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BqR5w0Vn.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-GA2vPRm3.js.map
