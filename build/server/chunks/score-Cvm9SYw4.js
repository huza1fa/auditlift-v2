import { d as db, c as controls, p as policies, g as sql, h as evidence, i as and, j as isNull, e as eq, G as readinessScores, r as readinessSnapshots, k as desc } from './index2-CrtZLkpF.js';

async function computeReadinessScore(orgId, frameworkId) {
  const rows = await db.select({
    id: controls.id,
    code: controls.code,
    title: controls.title,
    category: controls.category,
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
  ).where(eq(controls.frameworkId, frameworkId)).groupBy(controls.id);
  if (rows.length === 0) {
    return { score: 0, totalControls: 0, completedControls: 0, blockers: [] };
  }
  const completed = rows.filter((r) => (r.evidenceCount ?? 0) > 0 || (r.policyCount ?? 0) > 0);
  const blockerItems = rows.filter((r) => (r.evidenceCount ?? 0) === 0 && (r.policyCount ?? 0) === 0).map((r) => ({ id: r.id, code: r.code, title: r.title, category: r.category }));
  const score = Math.round(completed.length / rows.length * 100);
  try {
    await db.insert(readinessScores).values({
      organizationId: orgId,
      frameworkId,
      score,
      blockerCount: blockerItems.length,
      computedAt: /* @__PURE__ */ new Date()
    }).onConflictDoUpdate({
      target: [readinessScores.organizationId, readinessScores.frameworkId],
      set: { score, blockerCount: blockerItems.length, computedAt: /* @__PURE__ */ new Date() }
    });
    const [lastSnap] = await db.select({ snapshotAt: readinessSnapshots.snapshotAt }).from(readinessSnapshots).where(
      and(
        eq(readinessSnapshots.organizationId, orgId),
        eq(readinessSnapshots.frameworkId, frameworkId)
      )
    ).orderBy(desc(readinessSnapshots.snapshotAt)).limit(1);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
    if (!lastSnap || lastSnap.snapshotAt < oneDayAgo) {
      await db.insert(readinessSnapshots).values({ organizationId: orgId, frameworkId, score });
    }
  } catch {
  }
  return {
    score,
    totalControls: rows.length,
    completedControls: completed.length,
    blockers: blockerItems
  };
}

export { computeReadinessScore as c };
//# sourceMappingURL=score-Cvm9SYw4.js.map
