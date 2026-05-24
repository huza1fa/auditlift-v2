import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq, p as policies, i as and, j as isNull, k as desc, c as controls, h as evidence } from './index2-CrtZLkpF.js';
import { h as hasActivePaidAccess } from './billing-CuJKZCaE.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-B7tjCnyO.js')).default;
const server_id = "src/routes/(app)/export/+page.server.ts";
const imports = ["_app/immutable/nodes/9.DrwNz8MS.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/8ivS15n9.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/Blg3ud9C.js","_app/immutable/chunks/BXf5cY5b.js","_app/immutable/chunks/DH0G0Jpj.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/Iq2x8nIK.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-DKolTvxF.js.map
