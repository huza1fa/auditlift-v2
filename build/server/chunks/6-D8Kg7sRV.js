import { r as redirect, e as error } from './index-wpIsICWW.js';
import { d as db, c as controls, e as eq, i as and, b as organizationFrameworks, h as evidence, j as isNull, p as policies, g as sql } from './index2-C4rYKX5Z.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-DSUx0u_T.js')).default;
const server_id = "src/routes/(app)/controls/[controlId]/+page.server.ts";
const imports = ["_app/immutable/nodes/6.C7w17u2U.js","_app/immutable/chunks/u3-ufisP.js","_app/immutable/chunks/DODTOTXo.js","_app/immutable/chunks/BgMuiJsk.js","_app/immutable/chunks/yATu7jPC.js","_app/immutable/chunks/CdejSs_f.js","_app/immutable/chunks/Dkwvs-kV.js","_app/immutable/chunks/4kmpTIx1.js","_app/immutable/chunks/LkH2v93T.js","_app/immutable/chunks/C9Wu3rvq.js","_app/immutable/chunks/f5v9q4r1.js","_app/immutable/chunks/D5iaXmX5.js","_app/immutable/chunks/DZtEn_RL.js","_app/immutable/chunks/Cox_fmk7.js","_app/immutable/chunks/BdiVR5nC.js","_app/immutable/chunks/en4d4uem.js","_app/immutable/chunks/xG9_ORX8.js","_app/immutable/chunks/BML22FUE.js","_app/immutable/chunks/CstPM5qL.js","_app/immutable/chunks/C4lyDYbo.js","_app/immutable/chunks/BgNQN0s0.js","_app/immutable/chunks/CCDPLzFg.js","_app/immutable/chunks/DPR90k8v.js","_app/immutable/chunks/BCwKIzTR.js","_app/immutable/chunks/CsO9MnRP.js","_app/immutable/chunks/DgJLreGn.js","_app/immutable/chunks/8JVPSuNb.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-D8Kg7sRV.js.map
