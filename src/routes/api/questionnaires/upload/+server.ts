import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { questionnaires, questionnaireQuestions } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import { hasActivePaidAccess } from '$lib/server/billing';
import { checkRateLimit } from '$lib/server/rate-limit';
import { parseQuestionnaire } from '$lib/server/questionnaire-parser';
import { processQuestionnaire } from '$lib/server/questionnaire-processor';

const MAX_QUESTIONNAIRE_SIZE = 5 * 1024 * 1024; // 5MB

type QuestionnaireFormat = 'xlsx' | 'csv' | 'pdf' | 'docx';

const FORMAT_MIME: Record<string, QuestionnaireFormat> = {
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
	'application/vnd.ms-excel': 'xlsx',
	'text/csv': 'csv',
	'application/csv': 'csv',
	'application/pdf': 'pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

const EXT_FORMAT: Record<string, QuestionnaireFormat> = {
	xlsx: 'xlsx',
	csv: 'csv',
	pdf: 'pdf',
	docx: 'docx'
};

function detectFormat(filename: string, mimeType: string): QuestionnaireFormat | null {
	const ext = filename.split('.').pop()?.toLowerCase() ?? '';
	return EXT_FORMAT[ext] ?? FORMAT_MIME[mimeType] ?? null;
}

const MAGIC_NUMBERS: Record<string, number[][]> = {
	pdf: [[0x25, 0x50, 0x44, 0x46]], // %PDF
	xlsx: [
		[0x50, 0x4b, 0x03, 0x04],
		[0x50, 0x4b, 0x05, 0x06]
	], // ZIP (xlsx is a zip)
	csv: [], // no magic bytes — text format, skip
	docx: [
		[0x50, 0x4b, 0x03, 0x04],
		[0x50, 0x4b, 0x05, 0x06]
	] // ZIP (docx is a zip)
};

function validateMagicNumbers(buffer: Buffer, format: string): boolean {
	const signatures = MAGIC_NUMBERS[format];
	if (!signatures || signatures.length === 0) return true; // csv — no check needed
	return signatures.some((sig) => sig.every((byte, i) => buffer[i] === byte));
}

function getS3Client(): { client: S3Client; bucket: string } {
	const endpoint = env.BUCKET_ENDPOINT;
	const region = env.BUCKET_REGION || 'auto';
	const bucket = env.BUCKET_NAME;
	const accessKey = env.BUCKET_ACCESS_KEY;
	const secretKey = env.BUCKET_SECRET_KEY;

	if (!endpoint || !bucket || !accessKey || !secretKey) {
		throw error(503, 'Storage is not configured');
	}

	const client = new S3Client({
		endpoint,
		region,
		credentials: { accessKeyId: accessKey, secretAccessKey: secretKey }
	});

	return { client, bucket };
}

export const POST: RequestHandler = async ({ request, locals }) => {
	// 1. Auth check
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	// 2. Rate limit — 20 uploads per org per hour
	if (!checkRateLimit(`q-upload:${orgId}`, 20, 60 * 60 * 1000)) {
		throw error(429, 'Too many uploads. Please wait before uploading more questionnaires.');
	}

	// 3. Trial questionnaire limit — paid users get unlimited, trial users get 1
	if (!hasActivePaidAccess(locals.subscription)) {
		const [{ value: existingCount }] = await db
			.select({ value: count() })
			.from(questionnaires)
			.where(eq(questionnaires.organizationId, orgId));

		if (existingCount >= 1) {
			throw error(402, 'Trial limit reached. Upgrade to upload more questionnaires.');
		}
	}

	// 4. Parse multipart form data
	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		throw error(400, 'Invalid form data');
	}

	const fileEntry = formData.get('file');
	if (!fileEntry || !(fileEntry instanceof File)) {
		throw error(400, 'Missing file field in form data');
	}

	const file = fileEntry;

	// 4. Validate format and size
	const format = detectFormat(file.name, file.type);
	if (!format) {
		throw error(400, 'Unsupported file format. Allowed: xlsx, csv, pdf, docx');
	}

	if (file.size > MAX_QUESTIONNAIRE_SIZE) {
		throw error(400, 'File too large. Maximum size is 5MB');
	}

	if (file.size === 0) {
		throw error(400, 'File is empty');
	}

	// 5. Parse file into questions
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	if (!validateMagicNumbers(buffer, format)) {
		throw error(400, 'File content does not match the declared format');
	}

	let parsedQuestions: Awaited<ReturnType<typeof parseQuestionnaire>>;
	try {
		parsedQuestions = await parseQuestionnaire(buffer, format);
	} catch (parseErr) {
		console.error('[questionnaire-upload] Parse error:', parseErr);
		throw error(422, 'Failed to parse file. Ensure it is a valid questionnaire document.');
	}

	// 6. Must have at least one question
	if (parsedQuestions.length === 0) {
		throw error(400, 'No questions found in file');
	}

	// 7. Upload raw file to R2
	const fileExt = file.name.split('.').pop()?.toLowerCase() ?? format;
	const storageUuid = crypto.randomUUID();
	const storageKey = `questionnaires/${orgId}/${storageUuid}.${fileExt}`;

	try {
		const { client, bucket } = getS3Client();
		await client.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: storageKey,
				Body: buffer,
				ContentType: file.type || 'application/octet-stream',
				ContentLength: file.size
			})
		);
	} catch (uploadErr) {
		console.error('[questionnaire-upload] R2 upload error:', uploadErr);
		throw error(500, 'Failed to store file. Please try again.');
	}

	// 8. Insert questionnaire row
	const [questionnaire] = await db
		.insert(questionnaires)
		.values({
			organizationId: orgId,
			filename: file.name,
			storageKey,
			sourceFormat: format,
			status: 'processing',
			totalQuestions: parsedQuestions.length,
			answeredCount: 0,
			gapCount: 0,
			dealReadinessScore: 0
		})
		.returning();

	// 9. Bulk insert all parsed questions
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

	// 10. Fire-and-forget: process questionnaire with AI
	processQuestionnaire(questionnaire.id, orgId).catch(console.error);

	// 11. Return initial state
	return json(
		{
			id: questionnaire.id,
			totalQuestions: parsedQuestions.length,
			status: 'processing'
		},
		{ status: 201 }
	);
};
