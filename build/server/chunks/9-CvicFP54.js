import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq, p as policies, i as and, j as isNull, k as desc, c as controls, h as evidence } from './index2-C4rYKX5Z.js';
import { h as hasActivePaidAccess } from './billing-DpV-ct2L.js';
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
  const orgId = locals.organizationId;
  const canExport = hasActivePaidAccess(locals.subscription);
  const [orgFramework] = await db.select({ framework: frameworks }).from(organizationFrameworks).innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id)).where(eq(organizationFrameworks.organizationId, orgId)).limit(1);
  const policyList = await db.select({
    id: policies.id,
    title: policies.title,
    type: policies.type,
    isCustom: policies.isCustom
  }).from(policies).where(and(eq(policies.organizationId, orgId), isNull(policies.archivedAt))).orderBy(desc(policies.createdAt));
  const evidenceList = await db.select({
    id: evidence.id,
    filename: evidence.filename,
    sizeBytes: evidence.sizeBytes,
    controlId: evidence.controlId,
    controlCode: controls.code
  }).from(evidence).leftJoin(controls, eq(evidence.controlId, controls.id)).where(
    and(
      eq(evidence.organizationId, orgId),
      eq(evidence.status, "active"),
      isNull(evidence.deletedAt)
    )
  );
  return {
    canExport,
    framework: orgFramework?.framework ?? null,
    policyList,
    evidenceList
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B4ae3mPa.js')).default;
const server_id = "src/routes/(app)/export/+page.server.ts";
const imports = ["_app/immutable/nodes/9.O03r0gJX.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/CuUG55jY.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/5d3bG9tP.js","_app/immutable/chunks/BpHR7QeB.js","_app/immutable/chunks/B20ojI6c.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/BpEak5nx.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-CvicFP54.js.map
