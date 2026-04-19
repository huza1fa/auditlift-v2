import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, q as questionnaires, i as and, e as eq, l as questionnaireQuestions, f as frameworks, c as controls, m as inArray } from './index2-BGADDK3r.js';
import { a as hasActiveAccess } from './billing-CuJKZCaE.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const GET = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to access questionnaire coverage.");
  }
  const id = params.id;
  if (!id) throw error(400, "Missing questionnaire id");
  const [questionnaire] = await db.select({ id: questionnaires.id, status: questionnaires.status }).from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  const questions = await db.select({ mappedControlIds: questionnaireQuestions.mappedControlIds }).from(questionnaireQuestions).where(
    and(
      eq(questionnaireQuestions.questionnaireId, id),
      eq(questionnaireQuestions.organizationId, orgId)
    )
  );
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const uniqueControlIds = [
    ...new Set(
      questions.flatMap((q) => q.mappedControlIds ?? []).filter((id2) => UUID_RE.test(id2))
    )
  ];
  if (uniqueControlIds.length === 0) {
    return json({ coverageByFramework: [] });
  }
  const controlRows = await db.select({
    controlId: controls.id,
    controlCode: controls.code,
    controlTitle: controls.title,
    controlCategory: controls.category,
    frameworkId: frameworks.id,
    frameworkName: frameworks.name,
    frameworkSlug: frameworks.slug
  }).from(controls).innerJoin(frameworks, eq(controls.frameworkId, frameworks.id)).where(inArray(controls.id, uniqueControlIds));
  const frameworkMap = /* @__PURE__ */ new Map();
  for (const row of controlRows) {
    if (!frameworkMap.has(row.frameworkId)) {
      frameworkMap.set(row.frameworkId, {
        frameworkId: row.frameworkId,
        frameworkName: row.frameworkName,
        frameworkSlug: row.frameworkSlug,
        coveredControls: []
      });
    }
    frameworkMap.get(row.frameworkId).coveredControls.push({
      id: row.controlId,
      code: row.controlCode,
      title: row.controlTitle,
      category: row.controlCategory
    });
  }
  const frameworkIds = [...frameworkMap.keys()];
  const totalCountRows = await db.select({ frameworkId: controls.frameworkId, controlId: controls.id }).from(controls).where(inArray(controls.frameworkId, frameworkIds));
  const totalByFramework = /* @__PURE__ */ new Map();
  for (const row of totalCountRows) {
    totalByFramework.set(row.frameworkId, (totalByFramework.get(row.frameworkId) ?? 0) + 1);
  }
  const coverageByFramework = [...frameworkMap.values()].map((fw) => {
    const controlsCovered = fw.coveredControls.length;
    const totalControls = totalByFramework.get(fw.frameworkId) ?? 0;
    const coveragePct = totalControls > 0 ? Math.round(controlsCovered / totalControls * 100) : 0;
    return {
      frameworkId: fw.frameworkId,
      frameworkName: fw.frameworkName,
      frameworkSlug: fw.frameworkSlug,
      controlsCovered,
      totalControls,
      coveragePct,
      coveredControls: fw.coveredControls
    };
  });
  return json({ coverageByFramework });
};

export { GET };
//# sourceMappingURL=_server.ts-Cdwpj_xw.js.map
