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
const imports = ["_app/immutable/nodes/6.BwI4PI1F.js","_app/immutable/chunks/C4-OglNa.js","_app/immutable/chunks/BpQeBFz6.js","_app/immutable/chunks/DL1dF8Co.js","_app/immutable/chunks/wva3lzuF.js","_app/immutable/chunks/DDNgD1vj.js","_app/immutable/chunks/D7VKJyCS.js","_app/immutable/chunks/G6ebqmrI.js","_app/immutable/chunks/BTtrAdVo.js","_app/immutable/chunks/BTY1pAFb.js","_app/immutable/chunks/Btx_7kBT.js","_app/immutable/chunks/Vngg9s5X.js","_app/immutable/chunks/BvC1F4lZ.js","_app/immutable/chunks/B7Ssuz1w.js","_app/immutable/chunks/B1IiGnj1.js","_app/immutable/chunks/DSuTUhAQ.js","_app/immutable/chunks/BpHR7QeB.js","_app/immutable/chunks/kq4G5j6i.js","_app/immutable/chunks/XVWDnIXh.js","_app/immutable/chunks/hHjxOlmU.js","_app/immutable/chunks/CmvkKI0s.js","_app/immutable/chunks/D4VMwjv9.js","_app/immutable/chunks/Cz2kTad7.js","_app/immutable/chunks/DdQ4hoYq.js","_app/immutable/chunks/Crlif-6b.js","_app/immutable/chunks/DT1URhXK.js","_app/immutable/chunks/C0R6Hy8-.js","_app/immutable/chunks/-lbl0OOQ.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-DCVhQzPb.js.map
