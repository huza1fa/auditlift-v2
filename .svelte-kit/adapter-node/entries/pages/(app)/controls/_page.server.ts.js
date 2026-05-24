import { redirect } from "@sveltejs/kit";
import { d as db, f as frameworks, o as organizationFrameworks, a as controls, p as policies, e as evidence } from "../../../../chunks/index2.js";
import { eq, sql, and, isNull } from "drizzle-orm";
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
export {
  load
};
