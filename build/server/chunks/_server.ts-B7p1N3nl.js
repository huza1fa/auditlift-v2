import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, q as questionnaires, i as and, e as eq, l as questionnaireQuestions } from './index2-BGADDK3r.js';
import { a as hasActiveAccess } from './billing-CuJKZCaE.js';
import { c as checkRateLimit } from './rate-limit-C2Tknidw.js';
import { I as ImproveAnswerSchema } from './validation-ChD5gXmu.js';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import 'zod';

function getOpenRouterClient() {
  const apiKey = private_env.OPEN_ROUTER_API_KEY;
  if (!apiKey) throw error(503, "AI improvement is not configured");
  return createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    headers: {
      "HTTP-Referer": "https://auditlift.app",
      "X-Title": "AuditLift"
    }
  });
}
const POST = async ({ locals, params, request }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to improve answers with AI.");
  }
  if (!checkRateLimit(`improve:${orgId}`, 30, 60 * 60 * 1e3)) {
    throw error(429, "Too many answer improvements. Please wait before trying again.");
  }
  const { id, qid } = params;
  let body;
  try {
    body = await request.json();
  } catch {
    throw error(400, "Invalid JSON body");
  }
  const parsed = ImproveAnswerSchema.safeParse(body);
  if (!parsed.success) {
    throw error(400, "Invalid input: refinementPrompt must be between 1 and 500 characters");
  }
  const { refinementPrompt } = parsed.data;
  const [questionnaire] = await db.select({ id: questionnaires.id }).from(questionnaires).where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId))).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  const [existing] = await db.select().from(questionnaireQuestions).where(
    and(
      eq(questionnaireQuestions.id, qid),
      eq(questionnaireQuestions.questionnaireId, id),
      eq(questionnaireQuestions.organizationId, orgId)
    )
  ).limit(1);
  if (!existing) {
    throw error(404, "Question not found");
  }
  const currentAnswer = existing.userEditedAnswer ?? existing.generatedAnswer;
  if (!currentAnswer) {
    throw error(422, "No answer to improve — this question has not been answered yet");
  }
  const openrouter = getOpenRouterClient();
  let improvedAnswer;
  try {
    const result = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      prompt: `You are refining a security questionnaire answer.

<current_answer>
${currentAnswer.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
</current_answer>

<instruction>${refinementPrompt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</instruction>

Rewrite the answer applying the instruction. Preserve factual accuracy. Return only the revised answer text with no preamble, no explanation, and no markdown formatting.`
    });
    improvedAnswer = result.text.trim();
  } catch {
    throw error(502, "AI improvement failed. Please try again.");
  }
  await db.update(questionnaireQuestions).set({
    userEditedAnswer: improvedAnswer,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(questionnaireQuestions.id, qid));
  return json({ answer: improvedAnswer });
};

export { POST };
//# sourceMappingURL=_server.ts-B7p1N3nl.js.map
