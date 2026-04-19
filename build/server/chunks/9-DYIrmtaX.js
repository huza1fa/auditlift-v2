import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq, p as policies, i as and, j as isNull, k as desc, c as controls, h as evidence } from './index2-BGADDK3r.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-B4ae3mPa.js')).default;
const server_id = "src/routes/(app)/export/+page.server.ts";
const imports = ["_app/immutable/nodes/9.BDY1jR9U.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/B6qRuksm.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/BSoQHozz.js","_app/immutable/chunks/Cw4o8BYs.js","_app/immutable/chunks/FWjO53TG.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/DmSCWmPh.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-DYIrmtaX.js.map
