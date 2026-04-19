import { r as redirect } from './index-wpIsICWW.js';
import { d as db, p as policies, i as and, j as isNull, e as eq, k as desc } from './index2-BGADDK3r.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-DGVXMuX3.js')).default;
const server_id = "src/routes/(app)/policies/+page.server.ts";
const imports = ["_app/immutable/nodes/11.Qj7FWlaI.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/DvhUYIy2.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/CwC6AaZu.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/Bg53rCtA.js","_app/immutable/chunks/U1Th6Ard.js","_app/immutable/chunks/Cw4o8BYs.js","_app/immutable/chunks/Bd-g-mim.js","_app/immutable/chunks/RO9Q9ZT8.js","_app/immutable/chunks/d8wuMd_x.js","_app/immutable/chunks/DhJR0AOY.js","_app/immutable/chunks/CeR0PS5m.js","_app/immutable/chunks/BAU21WYp.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/DmSCWmPh.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BqR5w0Vn.js","_app/immutable/chunks/BVhrlIEL.js","_app/immutable/chunks/lY-74J4r.js","_app/immutable/chunks/pVCgLvoe.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-tFFxAzDo.js.map
