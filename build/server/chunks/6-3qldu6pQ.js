import { r as redirect, e as error } from './index-wpIsICWW.js';
import { d as db, c as controls, e as eq, i as and, b as organizationFrameworks, h as evidence, j as isNull, p as policies, g as sql } from './index2-BGADDK3r.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const orgId = locals.organizationId;
  const [control] = await db.select().from(controls).where(eq(controls.id, params.controlId)).limit(1);
  if (!control) throw error(404, "Control not found");
  const orgFramework = await db.query.organizationFrameworks.findFirst({
    where: and(
      eq(organizationFrameworks.organizationId, orgId),
      eq(organizationFrameworks.frameworkId, control.frameworkId)
    )
  });
  if (!orgFramework) throw error(404, "Control not found");
  const evidenceList = await db.select({
    id: evidence.id,
    filename: evidence.filename,
    mimeType: evidence.mimeType,
    sizeBytes: evidence.sizeBytes,
    createdAt: evidence.createdAt
  }).from(evidence).where(
    and(
      eq(evidence.organizationId, orgId),
      eq(evidence.controlId, control.id),
      eq(evidence.status, "active"),
      isNull(evidence.deletedAt)
    )
  );
  const linkedPolicies = await db.select().from(policies).where(
    and(
      eq(policies.organizationId, orgId),
      eq(policies.controlId, control.id),
      isNull(policies.archivedAt)
    )
  );
  const allControlsWithStatus = await db.select({
    id: controls.id,
    code: controls.code,
    title: controls.title,
    evidenceCount: sql`count(distinct ${evidence.id})::int`,
    policyCount: sql`count(distinct ${policies.id})::int`
  }).from(controls).leftJoin(
    evidence,
    and(
      eq(evidence.controlId, controls.id),
      eq(evidence.organizationId, orgId),
      eq(evidence.status, "active"),
      isNull(evidence.deletedAt)
    )
  ).leftJoin(
    policies,
    and(
      eq(policies.controlId, controls.id),
      eq(policies.organizationId, orgId),
      isNull(policies.archivedAt)
    )
  ).where(eq(controls.frameworkId, control.frameworkId)).groupBy(controls.id).orderBy(controls.code);
  const incomplete = allControlsWithStatus.filter(
    (c) => c.evidenceCount === 0 && c.policyCount === 0
  );
  const nextAfterCurrent = incomplete.find((c) => c.code > control.code);
  const nextIncompleteControl = nextAfterCurrent ?? incomplete[0] ?? null;
  const finalNext = nextIncompleteControl?.id === control.id ? incomplete[1] ?? null : nextIncompleteControl;
  return {
    control,
    evidenceList,
    linkedPolicies,
    isComplete: evidenceList.length > 0 || linkedPolicies.length > 0,
    nextIncompleteControl: finalNext ? { id: finalNext.id, code: finalNext.code, title: finalNext.title } : null
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Vhp_1rnh.js')).default;
const server_id = "src/routes/(app)/controls/[controlId]/+page.server.ts";
const imports = ["_app/immutable/nodes/6.ll0k9TiE.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/m3rTHpYV.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/Bg53rCtA.js","_app/immutable/chunks/U1Th6Ard.js","_app/immutable/chunks/Cw4o8BYs.js","_app/immutable/chunks/D_bHfS8v.js","_app/immutable/chunks/DhJR0AOY.js","_app/immutable/chunks/CeR0PS5m.js","_app/immutable/chunks/DiIfMaTF.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/D-rah5pG.js","_app/immutable/chunks/VnUabZk2.js","_app/immutable/chunks/DbDxeITt.js","_app/immutable/chunks/CpwUUCLt.js","_app/immutable/chunks/BAU21WYp.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-3qldu6pQ.js.map
