import { error } from "@sveltejs/kit";
import { d as db, q as questionnaires, j as questionnaireQuestions, p as policies } from "../../../../../../chunks/index2.js";
import { and, eq, inArray } from "drizzle-orm";
import { a as hasActivePaidAccess } from "../../../../../../chunks/billing.js";
function escapeCsvField(value) {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}
function buildCsvRow(fields) {
  return fields.map(escapeCsvField).join(",");
}
const GET = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActivePaidAccess(locals.subscription)) {
    throw error(402, "Upgrade to export questionnaire answers.");
  }
  const { id } = params;
  const [questionnaire] = await db.select().from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  const questions = await db.select().from(questionnaireQuestions).where(
    and(
      eq(questionnaireQuestions.questionnaireId, id),
      eq(questionnaireQuestions.organizationId, orgId)
    )
  ).orderBy(questionnaireQuestions.order);
  const allPolicyIds = [
    ...new Set(questions.flatMap((q) => q.mappedPolicyIds ?? []))
  ];
  const policyMap = /* @__PURE__ */ new Map();
  if (allPolicyIds.length > 0) {
    const policyRows = await db.select({ id: policies.id, title: policies.title }).from(policies).where(and(eq(policies.organizationId, orgId), inArray(policies.id, allPolicyIds)));
    for (const row of policyRows) {
      policyMap.set(row.id, row.title);
    }
  }
  const header = buildCsvRow([
    "Section",
    "#",
    "Question",
    "Answer",
    "Confidence",
    "Source Policies",
    "Gap Remediation"
  ]);
  const rows = questions.map((q) => {
    const answer = (q.userEditedAnswer ?? q.generatedAnswer ?? "").trim();
    const sourcePolicies = (q.mappedPolicyIds ?? []).map((pid) => policyMap.get(pid) ?? pid).join("; ");
    const gapRemediation = q.gapRemediation ?? "";
    const confidence = q.confidence ?? "unprocessed";
    return buildCsvRow([
      q.sectionName ?? "",
      q.questionNumber ?? "",
      q.questionText,
      answer,
      confidence,
      sourcePolicies,
      gapRemediation
    ]);
  });
  const csvContent = [header, ...rows].join("\r\n");
  const safeFilename = questionnaire.filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "");
  const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const exportFilename = `questionnaire-answers-${safeFilename}-${dateStr}.csv`;
  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${exportFilename}"`,
      "Cache-Control": "no-store"
    }
  });
};
export {
  GET
};
