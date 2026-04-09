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
const imports = ["_app/immutable/nodes/9.De0x4evg.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/Cr8RfznP.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/C2VPDMdJ.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/Be1CXUWO.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/B6md9Z8L.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-BYNrgTXu.js.map
