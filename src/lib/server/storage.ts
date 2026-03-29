import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { error } from '@sveltejs/kit';

const BUCKET_ENDPOINT = process.env.BUCKET_ENDPOINT;
const BUCKET_REGION = process.env.BUCKET_REGION || 'auto';
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY;
const BUCKET_SECRET_KEY = process.env.BUCKET_SECRET_KEY;

if (!BUCKET_ENDPOINT || !BUCKET_NAME || !BUCKET_ACCESS_KEY || !BUCKET_SECRET_KEY) {
	console.error('[Storage] Missing S3 bucket configuration:', {
		BUCKET_ENDPOINT: !!BUCKET_ENDPOINT,
		BUCKET_NAME: !!BUCKET_NAME,
		BUCKET_ACCESS_KEY: !!BUCKET_ACCESS_KEY,
		BUCKET_SECRET_KEY: !!BUCKET_SECRET_KEY
	});
	throw new Error('Missing S3 bucket configuration in environment variables');
}

const s3Client = new S3Client({
	endpoint: BUCKET_ENDPOINT,
	region: BUCKET_REGION,
	credentials: {
		accessKeyId: BUCKET_ACCESS_KEY,
		secretAccessKey: BUCKET_SECRET_KEY
	}
});

export const ALLOWED_MIME_TYPES = [
	'application/pdf',
	'image/png',
	'image/jpeg',
	'text/csv',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export function validateFileType(mimeType: string): mimeType is AllowedMimeType {
	return ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType);
}

export function validateFileSize(size: number): boolean {
	return size > 0 && size <= MAX_FILE_SIZE;
}

export function generateStorageKey(orgId: string, controlId: string, filename: string): string {
	const ext = filename.split('.').pop() || '';
	const uuid = crypto.randomUUID();
	return `${orgId}/${controlId}/${uuid}.${ext}`;
}

export async function getPresignedUploadUrl(
	storageKey: string,
	mimeType: string,
	expiresIn: number = 3600
): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: storageKey,
		ContentType: mimeType
	});
	const url = await getSignedUrl(s3Client, command, { expiresIn });
	return url;
}

export async function getPresignedDownloadUrl(
	storageKey: string,
	expiresIn: number = 3600
): Promise<string> {
	const command = new HeadObjectCommand({
		Bucket: BUCKET_NAME,
		Key: storageKey
	});
	const url = await getSignedUrl(s3Client, command, { expiresIn });
	return url;
}

export async function deleteFile(storageKey: string): Promise<void> {
	try {
		const command = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: storageKey
		});
		await s3Client.send(command);
	} catch (err) {
		console.error('Failed to delete file from S3:', err);
		throw error(500, 'Failed to delete file from storage');
	}
}

export async function fileExists(storageKey: string): Promise<boolean> {
	try {
		const command = new HeadObjectCommand({
			Bucket: BUCKET_NAME,
			Key: storageKey
		});
		await s3Client.send(command);
		return true;
	} catch {
		return false;
	}
}
