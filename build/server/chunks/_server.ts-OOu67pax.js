import { e as error, j as json } from './index-wpIsICWW.js';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import { d as db, q as questionnaires, e as eq, l as questionnaireQuestions, i as and, o as organizations, s as subscriptions, p as policies, b as organizationFrameworks, c as controls, m as inArray } from './index2-C4rYKX5Z.js';
import { h as hasActivePaidAccess } from './billing-DpV-ct2L.js';
import { c as checkRateLimit } from './rate-limit-C2Tknidw.js';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { getDocumentProxy, extractText } from 'unpdf';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { c as count } from './aggregate-D-tQqRQs.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';

const MAX_QUESTIONS = 200;
function normalizeText(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function detectQuestionNumber(line) {
  const match = line.match(/^([Qq]?\d+[.):\s])\s*(.+)/);
  if (!match) return null;
  return { number: match[1].trim(), text: match[2].trim() };
}
function looksLikeSectionHeader(line) {
  if (line.length > 80) return false;
  if (/^[IVXLCDM]+\.?\s+\w/.test(line)) return true;
  if (/^[A-Z][A-Z\s]{4,}$/.test(line)) return true;
  if (/^Section\s+\d+/i.test(line)) return true;
  if (/^Part\s+\d+/i.test(line)) return true;
  if (/^[A-Z]\.\s+\w/.test(line)) return true;
  return false;
}
function parseTextLines(rawText) {
  const lines = normalizeText(rawText).split("\n");
  const questions = [];
  let currentSection = null;
  let order = 0;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (looksLikeSectionHeader(line) && line.length < 80) {
      currentSection = line;
      continue;
    }
    if (line.length < 20) continue;
    const numbered = detectQuestionNumber(line);
    if (numbered) {
      questions.push({
        sectionName: currentSection,
        questionNumber: numbered.number,
        questionText: numbered.text,
        order: order++
      });
    } else {
      if (line.endsWith("?") || line.length >= 40) {
        questions.push({
          sectionName: currentSection,
          questionNumber: null,
          questionText: line,
          order: order++
        });
      }
    }
    if (questions.length >= MAX_QUESTIONS) break;
  }
  return questions;
}
async function parseXlsxOrCsv(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const questions = [];
  let currentSection = null;
  let order = 0;
  for (const row of rows) {
    if (!Array.isArray(row)) continue;
    const col0 = String(row[0] ?? "").trim();
    const col1 = row[1] !== void 0 ? String(row[1]).trim() : null;
    if (!col0) continue;
    const questionText = col0;
    const sectionHint = col1 && col1.length > 0 ? col1 : null;
    if (sectionHint) {
      currentSection = sectionHint;
    }
    if (questionText.length < 20) continue;
    const numbered = detectQuestionNumber(questionText);
    if (numbered) {
      questions.push({
        sectionName: currentSection,
        questionNumber: numbered.number,
        questionText: numbered.text,
        order: order++
      });
    } else {
      questions.push({
        sectionName: currentSection,
        questionNumber: null,
        questionText,
        order: order++
      });
    }
    if (questions.length >= MAX_QUESTIONS) break;
  }
  return questions;
}
async function parseDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return parseTextLines(result.value);
}
function preprocessPdfText(text) {
  return text.replace(/[ \t]+/g, " ").replace(/([^0-9\n]) (\d{1,3}[.)]\s)/g, "$1\n$2").replace(/([a-z?!,]) ((?:Section|Part)\s+\d)/gi, "$1\n$2");
}
async function parsePdf(buffer) {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return parseTextLines(preprocessPdfText(text));
}
async function parseQuestionnaire(buffer, format) {
  switch (format) {
    case "xlsx":
    case "csv":
      return parseXlsxOrCsv(buffer);
    case "docx":
      return parseDocx(buffer);
    case "pdf":
      return parsePdf(buffer);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
const TRIAL_QUESTION_LIMIT = 15;
const QuestionClassificationSchema = z.object({
  domain: z.string(),
  confidence: z.enum(["high", "medium", "low", "gap"]),
  answer: z.string().nullable(),
  gapReason: z.string().nullable(),
  gapRemediation: z.string().nullable(),
  mappedPolicyIds: z.array(z.string()),
  mappedControlIds: z.array(z.string())
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
    const [org] = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.organizationId, organizationId)).limit(1);
    const orgName = org?.name ?? "the organization";
    const isPaid = hasActivePaidAccess(subscription ?? null);
    const processLimit = isPaid ? questions.length : Math.min(TRIAL_QUESTION_LIMIT, questions.length);
    const questionsToProcess = questions.slice(0, processLimit);
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
    for (const question of questionsToProcess) {
      try {
        const classification = await classifyQuestion(
          question.questionText,
          orgName,
          policyContext,
          controlContext
        );
        const validPolicyIds = new Set(policyContext.map((p) => p.id));
        const validControlIds = new Set(controlContext.map((c) => c.id));
        const safePolicyIds = classification.mappedPolicyIds.filter((id) => validPolicyIds.has(id));
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
        }).where(eq(questionnaireQuestions.id, question.id));
      } catch (questionErr) {
        console.error(
          `[questionnaire-processor] Failed to process question ${question.id}:`,
          questionErr
        );
        await db.update(questionnaireQuestions).set({
          confidence: "gap",
          gapReason: "Processing failed due to an internal error.",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(questionnaireQuestions.id, question.id));
      }
    }
    const processedQuestions = await db.select({
      confidence: questionnaireQuestions.confidence
    }).from(questionnaireQuestions).where(
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
    const totalProcessed = processLimit;
    const dealReadinessScore = totalProcessed > 0 ? Math.min(
      100,
      Math.round((highCount * 100 + mediumCount * 70 + lowCount * 40) / totalProcessed)
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
  } catch (err) {
    console.error("[questionnaire-processor] Fatal error:", err);
    await db.update(questionnaires).set({
      status: "error",
      errorMessage: err instanceof Error ? err.message : "Unknown error occurred",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(questionnaires.id, questionnaireId));
  }
}
const MAX_QUESTIONNAIRE_SIZE = 5 * 1024 * 1024;
const FORMAT_MIME = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xlsx",
  "text/csv": "csv",
  "application/csv": "csv",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
};
const EXT_FORMAT = {
  xlsx: "xlsx",
  csv: "csv",
  pdf: "pdf",
  docx: "docx"
};
function detectFormat(filename, mimeType) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_FORMAT[ext] ?? FORMAT_MIME[mimeType] ?? null;
}
const MAGIC_NUMBERS = {
  pdf: [[37, 80, 68, 70]],
  // %PDF
  xlsx: [
    [80, 75, 3, 4],
    [80, 75, 5, 6]
  ],
  // ZIP (xlsx is a zip)
  csv: [],
  // no magic bytes — text format, skip
  docx: [
    [80, 75, 3, 4],
    [80, 75, 5, 6]
  ]
  // ZIP (docx is a zip)
};
function validateMagicNumbers(buffer, format) {
  const signatures = MAGIC_NUMBERS[format];
  if (!signatures || signatures.length === 0) return true;
  return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte));
}
function getS3Client() {
  const endpoint = private_env.BUCKET_ENDPOINT;
  const region = private_env.BUCKET_REGION || "auto";
  const bucket = private_env.BUCKET_NAME;
  const accessKey = private_env.BUCKET_ACCESS_KEY;
  const secretKey = private_env.BUCKET_SECRET_KEY;
  if (!endpoint || !bucket || !accessKey || !secretKey) {
    throw error(503, "Storage is not configured");
  }
  const client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey }
  });
  return { client, bucket };
}
const POST = async ({ request, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!checkRateLimit(`q-upload:${orgId}`, 20, 60 * 60 * 1e3)) {
    throw error(429, "Too many uploads. Please wait before uploading more questionnaires.");
  }
  if (!hasActivePaidAccess(locals.subscription)) {
    const [{ value: existingCount }] = await db.select({ value: count() }).from(questionnaires).where(eq(questionnaires.organizationId, orgId));
    if (existingCount >= 1) {
      throw error(402, "Trial limit reached. Upgrade to upload more questionnaires.");
    }
  }
  let formData;
  try {
    formData = await request.formData();
  } catch {
    throw error(400, "Invalid form data");
  }
  const fileEntry = formData.get("file");
  if (!fileEntry || !(fileEntry instanceof File)) {
    throw error(400, "Missing file field in form data");
  }
  const file = fileEntry;
  const format = detectFormat(file.name, file.type);
  if (!format) {
    throw error(400, "Unsupported file format. Allowed: xlsx, csv, pdf, docx");
  }
  if (file.size > MAX_QUESTIONNAIRE_SIZE) {
    throw error(400, "File too large. Maximum size is 5MB");
  }
  if (file.size === 0) {
    throw error(400, "File is empty");
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (!validateMagicNumbers(buffer, format)) {
    throw error(400, "File content does not match the declared format");
  }
  let parsedQuestions;
  try {
    parsedQuestions = await parseQuestionnaire(buffer, format);
  } catch (parseErr) {
    console.error("[questionnaire-upload] Parse error:", parseErr);
    throw error(422, "Failed to parse file. Ensure it is a valid questionnaire document.");
  }
  if (parsedQuestions.length === 0) {
    throw error(400, "No questions found in file");
  }
  const fileExt = file.name.split(".").pop()?.toLowerCase() ?? format;
  const storageUuid = crypto.randomUUID();
  const storageKey = `questionnaires/${orgId}/${storageUuid}.${fileExt}`;
  try {
    const { client, bucket } = getS3Client();
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: storageKey,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        ContentLength: file.size
      })
    );
  } catch (uploadErr) {
    console.error("[questionnaire-upload] R2 upload error:", uploadErr);
    throw error(500, "Failed to store file. Please try again.");
  }
  const [questionnaire] = await db.insert(questionnaires).values({
    organizationId: orgId,
    filename: file.name,
    storageKey,
    sourceFormat: format,
    status: "processing",
    totalQuestions: parsedQuestions.length,
    answeredCount: 0,
    gapCount: 0,
    dealReadinessScore: 0
  }).returning();
  await db.insert(questionnaireQuestions).values(
    parsedQuestions.map((q) => ({
      questionnaireId: questionnaire.id,
      organizationId: orgId,
      sectionName: q.sectionName,
      questionNumber: q.questionNumber,
      questionText: q.questionText,
      order: q.order
    }))
  );
  processQuestionnaire(questionnaire.id, orgId).catch(console.error);
  return json(
    {
      id: questionnaire.id,
      totalQuestions: parsedQuestions.length,
      status: "processing"
    },
    { status: 201 }
  );
};

export { POST };
//# sourceMappingURL=_server.ts-OOu67pax.js.map
