import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand,
	GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { error } from '@sveltejs/kit';

let _s3Client: S3Client | null = null;
let _bucketName: string | null = null;

function getS3(): { client: S3Client; bucket: string } {
	if (_s3Client && _bucketName) return { client: _s3Client, bucket: _bucketName };

	const endpoint = process.env.BUCKET_ENDPOINT;
	const region = process.env.BUCKET_REGION || 'us-east-1';
	const bucket = process.env.BUCKET_NAME || process.env.S3_BUCKET_NAME;
	const accessKey = process.env.BUCKET_ACCESS_KEY;
	const secretKey = process.env.BUCKET_SECRET_KEY;

	if (!bucket) {
		throw new Error('Missing S3 configuration: BUCKET_NAME is required');
	}

	// Railway / S3-compatible mode: explicit endpoint + credentials
	if (endpoint) {
		if (!accessKey || !secretKey) {
			throw new Error(
				`Missing S3 credentials: BUCKET_ACCESS_KEY and BUCKET_SECRET_KEY are required when BUCKET_ENDPOINT is set`
			);
		}
		_s3Client = new S3Client({
			endpoint,
			region,
			credentials: { accessKeyId: accessKey, secretAccessKey: secretKey }
		});
	} else {
		// AWS native mode: uses IAM instance profile or default credential chain
		_s3Client = new S3Client({ region });
	}

	_bucketName = bucket;
	return { client: _s3Client, bucket: _bucketName };
}

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

const MIME_TO_EXT: Record<string, string> = {
	'application/pdf': 'pdf',
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'text/csv': 'csv',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

export function sanitizeFilename(filename: string): string {
	// Strip directory traversal, null bytes, limit to basename only
	const base = filename.split(/[/\\]/).pop() ?? 'file';
	return base
		.replace(/[^\w.\-]/g, '_')
		.replace(/\.{2,}/g, '.')
		.slice(0, 255);
}

export function generateStorageKey(orgId: string, controlId: string, mimeType: string): string {
	const ext = MIME_TO_EXT[mimeType] ?? 'bin';
	const uuid = crypto.randomUUID();
	return `${orgId}/${controlId}/${uuid}.${ext}`;
}

export async function getPresignedUploadUrl(
	storageKey: string,
	mimeType: string,
	expiresIn: number = 3600
): Promise<string> {
	const { client, bucket } = getS3();
	const command = new PutObjectCommand({ Bucket: bucket, Key: storageKey, ContentType: mimeType });
	return getSignedUrl(client, command, { expiresIn });
}

export async function getPresignedDownloadUrl(
	storageKey: string,
	expiresIn: number = 3600
): Promise<string> {
	const { client, bucket } = getS3();
	const command = new GetObjectCommand({ Bucket: bucket, Key: storageKey });
	return getSignedUrl(client, command, { expiresIn });
}

export async function deleteFile(storageKey: string): Promise<void> {
	try {
		const { client, bucket } = getS3();
		await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: storageKey }));
	} catch (err) {
		console.error('Failed to delete file from S3:', err);
		throw error(500, 'Failed to delete file from storage');
	}
}

export async function fileExists(storageKey: string): Promise<boolean> {
	try {
		const { client, bucket } = getS3();
		await client.send(new HeadObjectCommand({ Bucket: bucket, Key: storageKey }));
		return true;
	} catch {
		return false;
	}
}

export async function downloadFile(storageKey: string): Promise<Buffer> {
	const { client, bucket } = getS3();
	const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: storageKey }));
	if (!response.Body) throw error(404, `File not found: ${storageKey}`);
	const bytes = await response.Body.transformToByteArray();
	return Buffer.from(bytes);
}
