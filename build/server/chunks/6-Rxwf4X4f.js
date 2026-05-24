import { r as redirect, e as error } from './index-wpIsICWW.js';
import { d as db, c as controls, e as eq, i as and, b as organizationFrameworks, h as evidence, j as isNull, p as policies, g as sql } from './index2-CrtZLkpF.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-DX9LrfHI.js')).default;
const server_id = "src/routes/(app)/controls/[controlId]/+page.server.ts";
const imports = ["_app/immutable/nodes/6.CvZPfJUb.js","_app/immutable/chunks/6hRGlosO.js","_app/immutable/chunks/DG-NX5-C.js","_app/immutable/chunks/CSbf_lLl.js","_app/immutable/chunks/BYxhF197.js","_app/immutable/chunks/DmVIRT7x.js","_app/immutable/chunks/BcensY04.js","_app/immutable/chunks/DkMcTl26.js","_app/immutable/chunks/BsDKDu3n.js","_app/immutable/chunks/Bg9SeeTQ.js","_app/immutable/chunks/dig0x5_2.js","_app/immutable/chunks/BavwbSjU.js","_app/immutable/chunks/CZ5pcsRA.js","_app/immutable/chunks/Dmx2quEY.js","_app/immutable/chunks/D_1B8Fj-.js","_app/immutable/chunks/C6jKoof3.js","_app/immutable/chunks/BXf5cY5b.js","_app/immutable/chunks/C3KXob4M.js","_app/immutable/chunks/DS_rngR2.js","_app/immutable/chunks/DbeiFq9X.js","_app/immutable/chunks/CTM0yUCp.js","_app/immutable/chunks/jmpbzBok.js","_app/immutable/chunks/D8eZWso9.js","_app/immutable/chunks/CHvfzFc7.js","_app/immutable/chunks/DV7-d68W.js","_app/immutable/chunks/B3X34l_G.js","_app/immutable/chunks/lpvZEjax.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-Rxwf4X4f.js.map
