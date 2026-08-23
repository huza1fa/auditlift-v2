import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import {
	questionnaires,
	questionnaireQuestions,
	questionnaireProcessingJobs,
	organizations,
	subscriptions
} from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import { hasActiveAccess, hasActivePaidAccess } from '$lib/server/billing';
import { checkRateLimit } from '$lib/server/rate-limit';
import {
	parseQuestionnaire,
	parseRawText,
	ScannedPdfError
} from '$lib/server/questionnaire-parser';
import { captureServerEvent } from '$lib/server/posthog';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';

const MAX_QUESTIONNAIRE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RAW_TEXT_LENGTH = 500_000;

type QuestionnaireFormat = 'xlsx' | 'csv' | 'pdf' | 'docx' | 'text';

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
	const region = env.BUCKET_REGION || 'us-east-1';
	const bucket = env.BUCKET_NAME || env.S3_BUCKET_NAME;
	const accessKey = env.BUCKET_ACCESS_KEY;
	const secretKey = env.BUCKET_SECRET_KEY;

	if (!bucket) {
		throw error(503, 'Storage is not configured');
	}

	// Railway / S3-compatible mode: explicit endpoint + credentials
	if (endpoint) {
		if (!accessKey || !secretKey) {
			throw error(503, 'Storage is not configured');
		}
		const client = new S3Client({
			endpoint,
			region,
			credentials: { accessKeyId: accessKey, secretAccessKey: secretKey }
		});
		return { client, bucket };
	}

	// AWS native mode: uses IAM instance profile or default credential chain
	const client = new S3Client({ region });
	return { client, bucket };
}

const rawTextSchema = z.object({
	title: z.string().trim().min(1).max(200),
	rawText: z.string().min(20).max(MAX_RAW_TEXT_LENGTH)
});

export const POST: RequestHandler = async ({ request, locals }) => {
	const { organizationId: orgId } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot upload questionnaires',
		'Your trial has expired. Please upgrade to continue.'
	);

	if (!(await checkRateLimit(`q-upload:${orgId}`, 20, 60 * 60 * 1000))) {
		throw error(429, 'Too many uploads. Please wait before uploading more questionnaires.');
	}

	const contentType = request.headers.get('content-type') ?? '';

	let format: QuestionnaireFormat;
	let filename: string;
	let fileContentType: string;
	let buffer: Buffer;
	let parsed: Awaited<ReturnType<typeof parseQuestionnaire>>;

	if (contentType.includes('application/json')) {
		let body: unknown;
		try {
			body = await request.json();
		} catch {
			throw error(400, 'Invalid JSON body');
		}
		const result = rawTextSchema.safeParse(body);
		if (!result.success) {
			throw error(400, 'Provide a title (1-200 chars) and the questionnaire text.');
		}

		format = 'text';
		filename = `${result.data.title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'pasted-questionnaire'}.txt`;
		fileContentType = 'text/plain';
		buffer = Buffer.from(result.data.rawText, 'utf-8');
		parsed = parseRawText(result.data.rawText);
	} else {
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
		const detected = detectFormat(file.name, file.type);
		if (!detected || detected === 'text') {
			throw error(400, 'Unsupported file format. Allowed: xlsx, csv, pdf, docx');
		}
		format = detected;

		if (file.size > MAX_QUESTIONNAIRE_SIZE) {
			throw error(400, 'File too large. Maximum size is 5MB');
		}
		if (file.size === 0) {
			throw error(400, 'File is empty');
		}

		buffer = Buffer.from(await file.arrayBuffer());
		filename = file.name;
		fileContentType = file.type || 'application/octet-stream';

		if (!validateMagicNumbers(buffer, format)) {
			throw error(400, 'File content does not match the declared format');
		}

		try {
			parsed = await parseQuestionnaire(buffer, format);
		} catch (parseErr) {
			console.error('[questionnaire-upload] Parse error:', parseErr);
			if (parseErr instanceof ScannedPdfError) {
				throw error(422, parseErr.message);
			}
			throw error(422, 'Failed to parse file. Ensure it is a valid questionnaire document.');
		}
	}

	if (parsed.questions.length === 0) {
		throw error(
			400,
			format === 'pdf'
				? 'No questions found in PDF. If it is a scanned document, paste the questions as text instead.'
				: 'No questions found in file'
		);
	}

	// 7. Upload raw file to S3. The database transaction below compensates by deleting
	// this object when the durable questionnaire setup cannot be committed.
	const fileExt = filename.split('.').pop()?.toLowerCase() ?? format;
	const storageUuid = crypto.randomUUID();
	const storageKey = `questionnaires/${orgId}/${storageUuid}.${fileExt}`;
	let storage: ReturnType<typeof getS3Client>;

	try {
		storage = getS3Client();
		await storage.client.send(
			new PutObjectCommand({
				Bucket: storage.bucket,
				Key: storageKey,
				Body: buffer,
				ContentType: fileContentType,
				ContentLength: buffer.length
			})
		);
	} catch (uploadErr) {
		console.error('[questionnaire-upload] R2 upload error:', uploadErr);
		throw error(500, 'Failed to store file. Please try again.');
	}

	let questionnaire: typeof questionnaires.$inferSelect;
	try {
		questionnaire = await db.transaction(async (tx) => {
			// Lock the org row so concurrent trial uploads cannot both consume its quota.
			const [organization] = await tx
				.select({ id: organizations.id, trialEndsAt: organizations.trialEndsAt })
				.from(organizations)
				.where(eq(organizations.id, orgId))
				.limit(1)
				.for('update');

			if (!organization) throw error(404, 'Organization not found');

			const [subscription] = await tx
				.select()
				.from(subscriptions)
				.where(eq(subscriptions.organizationId, orgId))
				.limit(1);

			if (!hasActiveAccess(subscription, organization.trialEndsAt)) {
				throw error(402, 'Your trial has expired. Please upgrade to continue.');
			}

			if (!hasActivePaidAccess(subscription)) {
				const [{ value: existingCount }] = await tx
					.select({ value: count() })
					.from(questionnaires)
					.where(eq(questionnaires.organizationId, orgId));

				if (Number(existingCount) >= 1) {
					throw error(402, 'Trial limit reached. Upgrade to upload more questionnaires.');
				}
			}

			const [createdQuestionnaire] = await tx
				.insert(questionnaires)
				.values({
					organizationId: orgId,
					filename,
					storageKey,
					sourceFormat: format,
					status: 'processing',
					totalQuestions: parsed.questions.length,
					answeredCount: 0,
					gapCount: 0,
					dealReadinessScore: 0
				})
				.returning();

			await tx.insert(questionnaireQuestions).values(
				parsed.questions.map((q) => ({
					questionnaireId: createdQuestionnaire.id,
					organizationId: orgId,
					sectionName: q.sectionName,
					questionNumber: q.questionNumber,
					questionText: q.questionText,
					order: q.order
				}))
			);

			await tx.insert(questionnaireProcessingJobs).values({
				questionnaireId: createdQuestionnaire.id,
				organizationId: orgId,
				kind: 'initial',
				status: 'queued'
			});

			return createdQuestionnaire;
		});
	} catch (setupError) {
		try {
			await storage.client.send(
				new DeleteObjectCommand({ Bucket: storage.bucket, Key: storageKey })
			);
		} catch (cleanupError) {
			console.error('[questionnaire-upload] S3 cleanup error:', cleanupError);
		}
		throw setupError;
	}

	// 11. Analytics
	try {
		await captureServerEvent({
			event: 'questionnaire_uploaded',
			properties: {
				org_id: orgId,
				format,
				question_count: parsed.questions.length,
				file_size_bytes: buffer.length,
				is_trial: !hasActivePaidAccess(locals.subscription)
			},
			groups: { organization: orgId }
		});
	} catch (analyticsError) {
		console.error('[questionnaire-upload] Analytics error:', analyticsError);
	}

	return json(
		{
			id: questionnaire.id,
			organizationId: orgId,
			filename,
			storageKey,
			sourceFormat: format,
			status: 'processing' as const,
			totalQuestions: parsed.questions.length,
			answeredCount: 0,
			gapCount: 0,
			dealReadinessScore: 0,
			highCount: 0,
			mediumCount: 0,
			lowCount: 0,
			truncated: parsed.truncated,
			totalDetected: parsed.totalDetected,
			warnings: parsed.warnings,
			errorMessage: null,
			shareToken: null,
			sharedAt: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		},
		{ status: 201 }
	);
};
