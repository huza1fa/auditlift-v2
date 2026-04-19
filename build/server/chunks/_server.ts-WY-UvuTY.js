import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, q as questionnaires, i as and, e as eq } from './index2-BGADDK3r.js';
import { a as hasActiveAccess } from './billing-CuJKZCaE.js';
import { c as checkRateLimit } from './rate-limit-C2Tknidw.js';
import { r as reprocessQuestionnaire } from './questionnaire-processor-eeQMMrfW.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';
import '@ai-sdk/openai';
import 'ai';
import 'zod';

const POST = async ({ params, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt)) {
    throw error(402, "Your trial has expired. Please upgrade to continue.");
  }
  if (!checkRateLimit(`reprocess:${orgId}`, 5, 60 * 60 * 1e3)) {
    throw error(429, "Too many reprocess requests. Please wait before trying again.");
  }
  const questionnaireId = params.id;
  if (!questionnaireId) {
    throw error(400, "Missing questionnaire ID");
  }
  const [questionnaire] = await db.select({ id: questionnaires.id, status: questionnaires.status }).from(questionnaires).where(
    and(eq(questionnaires.id, questionnaireId), eq(questionnaires.organizationId, orgId))
  ).limit(1);
  if (!questionnaire) {
    throw error(404, "Questionnaire not found");
  }
  if (questionnaire.status === "processing") {
    throw error(409, "Questionnaire is already being processed. Please wait for it to complete.");
  }
  reprocessQuestionnaire(questionnaireId, orgId).catch(console.error);
  return json({ success: true });
};

export { POST };
//# sourceMappingURL=_server.ts-WY-UvuTY.js.map
