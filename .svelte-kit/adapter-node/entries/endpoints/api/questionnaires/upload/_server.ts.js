import { error, json } from "@sveltejs/kit";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { b as private_env } from "../../../../../chunks/shared-server.js";
import { d as db, q as questionnaires, j as questionnaireQuestions } from "../../../../../chunks/index2.js";
import { count, eq } from "drizzle-orm";
import { a as hasActivePaidAccess } from "../../../../../chunks/billing.js";
import { c as checkRateLimit } from "../../../../../chunks/rate-limit.js";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { getDocumentProxy, extractText } from "unpdf";
import { p as processQuestionnaire } from "../../../../../chunks/questionnaire-processor.js";
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
export {
  POST
};
