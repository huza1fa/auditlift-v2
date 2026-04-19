import { d as db, i as questionnaireQuestions, q as questionnaires, b as organizations, s as subscriptions, p as policies, o as organizationFrameworks, c as controls } from "./index2.js";
import { and, eq, inArray } from "drizzle-orm";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { b as private_env } from "./shared-server.js";
import { a as hasActivePaidAccess } from "./billing.js";
const TRIAL_QUESTION_LIMIT = 15;
const BATCH_SIZE = 5;
const PARALLEL_BATCHES = 3;
const QuestionClassificationSchema = z.object({
  domain: z.string(),
  confidence: z.enum(["high", "medium", "low", "gap"]),
  answer: z.string().nullable(),
  gapReason: z.string().nullable(),
  gapRemediation: z.string().nullable(),
  mappedPolicyIds: z.array(z.string()),
  mappedControlIds: z.array(z.string())
});
const BatchClassificationSchema = z.object({
  results: z.array(QuestionClassificationSchema)
});
function getOpenRouterClient() {
  const apiKey = private_env.OPEN_ROUTER_API_KEY;
  if (!apiKey) throw new Error("OPEN_ROUTER_API_KEY is not configured");
  return createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    headers: {
      "HTTP-Referer": "https://auditlift.app",
      "X-Title": "AuditLift"
    }
  });
}
async function classifyQuestion(questionText, orgName, policyContext, controlContext) {
  const openrouter = getOpenRouterClient();
  const policiesList = policyContext.map((p) => `- [${p.id}] ${p.title}: ${p.contentSnippet}`).join("\n");
  const controlsList = controlContext.map((c) => `- [${c.id}] ${c.code} ${c.title} (${c.category}): ${c.whatAuditorExpects}`).join("\n");
  const hasOrgContext = policyContext.length > 0 || controlContext.length > 0;
  const prompt = `You are helping answer a security questionnaire on behalf of ${orgName}.

${hasOrgContext ? `Use the provided policies and controls as your primary source. You may supplement with general industry-standard security practices when the provided context is incomplete.

Available policies:
${policiesList || "(none)"}

Available controls:
${controlsList || "(none)"}` : `${orgName} has not yet generated policies or mapped controls. Draft a reasonable answer based on industry-standard security practices (SOC 2, ISO 27001, NIST) that a typical SaaS company would follow. The answer will be marked as low confidence so the user can review and customize it.`}

<question>${questionText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</question>

Instructions:
- domain: classify this question into one of: access_control, data_security, incident_response, vendor_management, business_continuity, cryptography, physical_security, other
- confidence:
    high = answered directly from a specific org policy with concrete detail
    medium = answered from related org policies/controls but inferred
    low = answered using general security best practices (no org-specific policy found)
    gap = question requires org-specific data (e.g. specific vendor names, exact employee counts, custom SLAs) that cannot be drafted generically
- answer: draft a helpful answer. Use "low" confidence for general-practice answers. Only return null for true gaps that need specific org data.
- gapReason: why this cannot be answered even generically (only for gap). null otherwise.
- gapRemediation: specific action to resolve this gap e.g. "Generate an Access Control Policy" or "Upload MFA evidence for CC6.1". null if high/medium/low confidence.
- mappedPolicyIds: array of policy IDs you used (from the list above, empty if none)
- mappedControlIds: array of control IDs you used (from the list above, empty if none)`;
  const result = await generateObject({
    model: openrouter("openai/gpt-4o-mini"),
    schema: QuestionClassificationSchema,
    prompt
  });
  return result.object;
}
async function classifyQuestionBatch(questions, orgName, policyContext, controlContext) {
  if (questions.length === 0) return [];
  if (questions.length === 1) {
    const classification = await classifyQuestion(
      questions[0].questionText,
      orgName,
      policyContext,
      controlContext
    );
    return [{ questionId: questions[0].id, classification }];
  }
  const openrouter = getOpenRouterClient();
  const policiesList = policyContext.map((p) => `- [${p.id}] ${p.title}: ${p.contentSnippet}`).join("\n");
  const controlsList = controlContext.map((c) => `- [${c.id}] ${c.code} ${c.title} (${c.category}): ${c.whatAuditorExpects}`).join("\n");
  const hasOrgContext = policyContext.length > 0 || controlContext.length > 0;
  const questionsList = questions.map(
    (q, i) => `<question index="${i}">${q.questionText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</question>`
  ).join("\n");
  const prompt = `You are helping answer a security questionnaire on behalf of ${orgName}.

${hasOrgContext ? `Use the provided policies and controls as your primary source. Supplement with general industry-standard security practices when the provided context is incomplete.

Available policies:
${policiesList || "(none)"}

Available controls:
${controlsList || "(none)"}` : `${orgName} has not yet generated policies or mapped controls. Draft reasonable answers based on industry-standard security practices (SOC 2, ISO 27001, NIST). Answers will be marked as low confidence.`}

Classify and answer each of these ${questions.length} questions. Return a "results" array with exactly ${questions.length} items, one per question, in the same order.

${questionsList}

For each question return:
- domain: one of access_control, data_security, incident_response, vendor_management, business_continuity, cryptography, physical_security, vulnerability_management, change_management, privacy, remote_work, ai_usage, data_retention, general, other
- confidence: high | medium | low | gap
- answer: draft answer (null only for gaps)
- gapReason: why it can't be answered (null unless gap)
- gapRemediation: action to fix the gap (null unless gap)
- mappedPolicyIds: policy IDs used (from list above)
- mappedControlIds: control IDs used (from list above)`;
  try {
    const result = await generateObject({
      model: openrouter("openai/gpt-4o-mini"),
      schema: BatchClassificationSchema,
      prompt
    });
    const results = result.object.results;
    if (results.length === questions.length) {
      return questions.map((q, i) => ({
        questionId: q.id,
        classification: results[i]
      }));
    }
    console.warn(
      `[questionnaire-processor] Batch returned ${results.length} results for ${questions.length} questions, falling back to individual`
    );
  } catch (batchErr) {
    console.warn("[questionnaire-processor] Batch classification failed, falling back:", batchErr);
  }
  const fallbackResults = [];
  for (const q of questions) {
    const classification = await classifyQuestion(q.questionText, orgName, policyContext, controlContext);
    fallbackResults.push({ questionId: q.id, classification });
  }
  return fallbackResults;
}
async function loadProcessingContext(organizationId) {
  const [org] = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
  const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.organizationId, organizationId)).limit(1);
  const orgName = org?.name ?? "the organization";
  const isPaid = hasActivePaidAccess(subscription ?? null);
  const orgPolicies = await db.select({
    id: policies.id,
    title: policies.title,
    type: policies.type,
    content: policies.content,
    archivedAt: policies.archivedAt
  }).from(policies).where(eq(policies.organizationId, organizationId));
  const policyContext = orgPolicies.filter((p) => p.archivedAt === null).map((p) => ({
    id: p.id,
    title: p.title,
    contentSnippet: p.content.slice(0, 500)
  }));
  const orgFrameworkRows = await db.select({ frameworkId: organizationFrameworks.frameworkId }).from(organizationFrameworks).where(eq(organizationFrameworks.organizationId, organizationId));
  const frameworkIds = orgFrameworkRows.map((r) => r.frameworkId);
  const orgControls = frameworkIds.length > 0 ? await db.select({
    id: controls.id,
    code: controls.code,
    title: controls.title,
    category: controls.category,
    whatAuditorExpects: controls.whatAuditorExpects
  }).from(controls).where(inArray(controls.frameworkId, frameworkIds)) : [];
  const controlContext = orgControls.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    category: c.category,
    whatAuditorExpects: c.whatAuditorExpects
  }));
  return { orgName, isPaid, policyContext, controlContext };
}
async function computeAndSaveStats(questionnaireId, organizationId, processedCount) {
  const processedQuestions = await db.select({ confidence: questionnaireQuestions.confidence }).from(questionnaireQuestions).where(
    and(
      eq(questionnaireQuestions.questionnaireId, questionnaireId),
      eq(questionnaireQuestions.organizationId, organizationId)
    )
  );
  const totalQuestions = processedQuestions.length;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let gapCount = 0;
  for (const q of processedQuestions) {
    if (q.confidence === "high") highCount++;
    else if (q.confidence === "medium") mediumCount++;
    else if (q.confidence === "low") lowCount++;
    else if (q.confidence === "gap") gapCount++;
  }
  const answeredCount = highCount + mediumCount + lowCount;
  const dealReadinessScore = processedCount > 0 ? Math.min(
    100,
    Math.round((highCount * 100 + mediumCount * 70 + lowCount * 40) / processedCount)
  ) : 0;
  await db.update(questionnaires).set({
    status: "ready",
    totalQuestions,
    answeredCount,
    gapCount,
    highCount,
    mediumCount,
    lowCount,
    dealReadinessScore,
    errorMessage: null,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(questionnaires.id, questionnaireId));
}
async function processQuestionnaire(questionnaireId, organizationId) {
  try {
    const questions = await db.select().from(questionnaireQuestions).where(
      and(
        eq(questionnaireQuestions.questionnaireId, questionnaireId),
        eq(questionnaireQuestions.organizationId, organizationId)
      )
    ).orderBy(questionnaireQuestions.order);
    if (questions.length === 0) {
      await db.update(questionnaires).set({ status: "ready", updatedAt: /* @__PURE__ */ new Date() }).where(eq(questionnaires.id, questionnaireId));
      return;
    }
    const { orgName, isPaid, policyContext, controlContext } = await loadProcessingContext(organizationId);
    const processLimit = isPaid ? questions.length : Math.min(TRIAL_QUESTION_LIMIT, questions.length);
    const questionsToProcess = questions.slice(0, processLimit);
    const validPolicyIds = new Set(policyContext.map((p) => p.id));
    const validControlIds = new Set(controlContext.map((c) => c.id));
    const batches = [];
    for (let i = 0; i < questionsToProcess.length; i += BATCH_SIZE) {
      batches.push(questionsToProcess.slice(i, i + BATCH_SIZE));
    }
    for (let i = 0; i < batches.length; i += PARALLEL_BATCHES) {
      const parallelBatches = batches.slice(i, i + PARALLEL_BATCHES);
      const batchResults = await Promise.allSettled(
        parallelBatches.map(
          (batch) => classifyQuestionBatch(
            batch.map((q) => ({ id: q.id, questionText: q.questionText })),
            orgName,
            policyContext,
            controlContext
          )
        )
      );
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          for (const { questionId, classification } of result.value) {
            const safePolicyIds = classification.mappedPolicyIds.filter(
              (id) => validPolicyIds.has(id)
            );
            const safeControlIds = classification.mappedControlIds.filter(
              (id) => validControlIds.has(id)
            );
            await db.update(questionnaireQuestions).set({
              domain: classification.domain,
              confidence: classification.confidence,
              generatedAnswer: classification.answer,
              gapReason: classification.gapReason,
              gapRemediation: classification.gapRemediation,
              mappedPolicyIds: safePolicyIds,
              mappedControlIds: safeControlIds,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(questionnaireQuestions.id, questionId));
          }
        } else {
          console.error("[questionnaire-processor] Batch failed:", result.reason);
          const failedBatch = parallelBatches[batchResults.indexOf(result)];
          if (failedBatch) {
            for (const question of failedBatch) {
              await db.update(questionnaireQuestions).set({
                confidence: "gap",
                gapReason: "Processing failed due to an internal error.",
                updatedAt: /* @__PURE__ */ new Date()
              }).where(eq(questionnaireQuestions.id, question.id));
            }
          }
        }
      }
    }
    await computeAndSaveStats(questionnaireId, organizationId, processLimit);
  } catch (err) {
    console.error("[questionnaire-processor] Fatal error:", err);
    await db.update(questionnaires).set({
      status: "error",
      errorMessage: err instanceof Error ? err.message : "Unknown error occurred",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(questionnaires.id, questionnaireId));
  }
}
async function reprocessQuestionnaire(questionnaireId, organizationId) {
  try {
    await db.update(questionnaires).set({ status: "processing", updatedAt: /* @__PURE__ */ new Date() }).where(
      and(
        eq(questionnaires.id, questionnaireId),
        eq(questionnaires.organizationId, organizationId)
      )
    );
    const allQuestions = await db.select().from(questionnaireQuestions).where(
      and(
        eq(questionnaireQuestions.questionnaireId, questionnaireId),
        eq(questionnaireQuestions.organizationId, organizationId)
      )
    ).orderBy(questionnaireQuestions.order);
    const REPROCESS_CONFIDENCES = /* @__PURE__ */ new Set(["gap", "low", "medium"]);
    const eligibleQuestions = allQuestions.filter(
      (q) => q.userEditedAnswer === null && q.confidence !== null && REPROCESS_CONFIDENCES.has(q.confidence)
    );
    if (eligibleQuestions.length === 0) {
      await db.update(questionnaires).set({ status: "ready", updatedAt: /* @__PURE__ */ new Date() }).where(eq(questionnaires.id, questionnaireId));
      return;
    }
    const { orgName, isPaid, policyContext, controlContext } = await loadProcessingContext(organizationId);
    const processLimit = isPaid ? eligibleQuestions.length : Math.min(TRIAL_QUESTION_LIMIT, eligibleQuestions.length);
    const questionsToProcess = eligibleQuestions.slice(0, processLimit);
    const validPolicyIds = new Set(policyContext.map((p) => p.id));
    const validControlIds = new Set(controlContext.map((c) => c.id));
    const batches = [];
    for (let i = 0; i < questionsToProcess.length; i += BATCH_SIZE) {
      batches.push(questionsToProcess.slice(i, i + BATCH_SIZE));
    }
    for (let i = 0; i < batches.length; i += PARALLEL_BATCHES) {
      const parallelBatches = batches.slice(i, i + PARALLEL_BATCHES);
      const batchResults = await Promise.allSettled(
        parallelBatches.map(
          (batch) => classifyQuestionBatch(
            batch.map((q) => ({ id: q.id, questionText: q.questionText })),
            orgName,
            policyContext,
            controlContext
          )
        )
      );
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          for (const { questionId, classification } of result.value) {
            const safePolicyIds = classification.mappedPolicyIds.filter(
              (id) => validPolicyIds.has(id)
            );
            const safeControlIds = classification.mappedControlIds.filter(
              (id) => validControlIds.has(id)
            );
            await db.update(questionnaireQuestions).set({
              domain: classification.domain,
              confidence: classification.confidence,
              generatedAnswer: classification.answer,
              gapReason: classification.gapReason,
              gapRemediation: classification.gapRemediation,
              mappedPolicyIds: safePolicyIds,
              mappedControlIds: safeControlIds,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(
              and(
                eq(questionnaireQuestions.id, questionId),
                eq(questionnaireQuestions.organizationId, organizationId)
              )
            );
          }
        } else {
          console.error("[questionnaire-processor] reprocess batch failed:", result.reason);
          const failedBatch = parallelBatches[batchResults.indexOf(result)];
          if (failedBatch) {
            for (const question of failedBatch) {
              await db.update(questionnaireQuestions).set({
                confidence: "gap",
                gapReason: "Reprocessing failed due to an internal error.",
                updatedAt: /* @__PURE__ */ new Date()
              }).where(
                and(
                  eq(questionnaireQuestions.id, question.id),
                  eq(questionnaireQuestions.organizationId, organizationId)
                )
              );
            }
          }
        }
      }
    }
    await computeAndSaveStats(questionnaireId, organizationId, allQuestions.length);
  } catch (err) {
    console.error("[questionnaire-processor] reprocess fatal error:", err);
    await db.update(questionnaires).set({
      status: "error",
      errorMessage: err instanceof Error ? err.message : "Unknown error occurred",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(questionnaires.id, questionnaireId));
  }
}
export {
  processQuestionnaire as p,
  reprocessQuestionnaire as r
};
