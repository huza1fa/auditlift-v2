import { r as redirect } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq, c as controls, p as policies, g as sql, h as evidence, i as and, j as isNull } from './index2-BGADDK3r.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const load = async ({ locals, url }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const orgId = locals.organizationId;
  const orgFrameworks = await db.select({ frameworkId: organizationFrameworks.frameworkId, framework: frameworks }).from(organizationFrameworks).innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id)).where(eq(organizationFrameworks.organizationId, orgId));
  if (orgFrameworks.length === 0) return { controls: [], framework: null, frameworks: [] };
  const selectedFrameworkSlug = url.searchParams.get("framework");
  let selectedFramework = orgFrameworks[0];
  if (selectedFrameworkSlug) {
    const found = orgFrameworks.find((f) => f.framework.slug === selectedFrameworkSlug);
    if (found) selectedFramework = found;
  }
  const controlsWithCounts = await db.select({
    id: controls.id,
    frameworkId: controls.frameworkId,
    code: controls.code,
    title: controls.title,
    description: controls.description,
    whyItMatters: controls.whyItMatters,
    whatAuditorExpects: controls.whatAuditorExpects,
    category: controls.category,
    createdAt: controls.createdAt,
    updatedAt: controls.updatedAt,
    evidenceCount: sql`count(distinct ${evidence.id})::int`,
    policyCount: sql`count(distinct ${policies.id})::int`
  }).from(controls).leftJoin(
    evidence,
    and(
      eq(evidence.controlId, controls.id),
      eq(evidence.organizationId, orgId),
      isNull(evidence.deletedAt),
      eq(evidence.status, "active")
    )
  ).leftJoin(
    policies,
    and(
      eq(policies.controlId, controls.id),
      eq(policies.organizationId, orgId),
      isNull(policies.archivedAt)
    )
  ).where(eq(controls.frameworkId, selectedFramework.frameworkId)).groupBy(controls.id);
  const result = controlsWithCounts.map((c) => ({
    id: c.id,
    frameworkId: c.frameworkId,
    code: c.code,
    title: c.title,
    description: c.description,
    whyItMatters: c.whyItMatters,
    whatAuditorExpects: c.whatAuditorExpects,
    category: c.category,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    evidenceCount: c.evidenceCount ?? 0,
    policyCount: c.policyCount ?? 0,
    complete: (c.evidenceCount ?? 0) > 0 || (c.policyCount ?? 0) > 0
  }));
  return {
    controls: result,
    framework: selectedFramework.framework,
    frameworks: orgFrameworks.map((f) => f.framework)
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bq2_pkAa.js')).default;
const server_id = "src/routes/(app)/controls/+page.server.ts";
const imports = ["_app/immutable/nodes/5.DNf-exGa.js","_app/immutable/chunks/IeieXNp_.js","_app/immutable/chunks/1oeAXw7e.js","_app/immutable/chunks/C6UkpnRT.js","_app/immutable/chunks/bwukILhv.js","_app/immutable/chunks/D3gf1KUH.js","_app/immutable/chunks/9nS58d2P.js","_app/immutable/chunks/VMAnGNGo.js","_app/immutable/chunks/X6zJqc5b.js","_app/immutable/chunks/FANyrLaU.js","_app/immutable/chunks/CwC6AaZu.js","_app/immutable/chunks/DhRHngn4.js","_app/immutable/chunks/Gxkg43H1.js","_app/immutable/chunks/BrpzeA9M.js","_app/immutable/chunks/DbDxeITt.js","_app/immutable/chunks/eEFtYnTo.js","_app/immutable/chunks/-lbl0OOQ.js","_app/immutable/chunks/BNIpjahG.js","_app/immutable/chunks/D-rah5pG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-BVTXh5Hb.js.map
