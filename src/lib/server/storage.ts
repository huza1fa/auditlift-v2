import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	DeleteObjectsCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { error } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';

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

export async function uploadBuffer(
	storageKey: string,
	buffer: Buffer,
	mimeType: string
): Promise<void> {
	const { client, bucket } = getS3();
	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: storageKey,
			Body: buffer,
			ContentType: mimeType
		})
	);
}

export async function getPresignedUploadPost(
	storageKey: string,
	mimeType: string,
	checksumSha256: string,
	expiresIn: number = 900
): Promise<{ url: string; fields: Record<string, string> }> {
	const { client, bucket } = getS3();
	return createPresignedPost(client, {
		Bucket: bucket,
		Key: storageKey,
		Expires: expiresIn,
		Fields: {
			'Content-Type': mimeType,
			'x-amz-meta-sha256': checksumSha256
		},
		Conditions: [
			{ 'Content-Type': mimeType },
			{ 'x-amz-meta-sha256': checksumSha256 },
			['content-length-range', 1, MAX_FILE_SIZE]
		]
	});
}

export async function getFileMetadata(storageKey: string): Promise<{
	contentLength?: number;
	contentType?: string;
	metadata?: Record<string, string>;
}> {
	const { client, bucket } = getS3();
	const response = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: storageKey }));
	return {
		contentLength: response.ContentLength,
		contentType: response.ContentType,
		metadata: response.Metadata
	};
}

export function calculateSha256(buffer: Buffer): string {
	return createHash('sha256').update(buffer).digest('base64');
}

export function hasValidFileSignature(buffer: Buffer, mimeType: AllowedMimeType): boolean {
	switch (mimeType) {
		case 'application/pdf':
			return buffer.subarray(0, 5).equals(Buffer.from('%PDF-'));
		case 'image/png':
			return buffer
				.subarray(0, 8)
				.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
		case 'image/jpeg':
			return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
		case 'text/csv':
			return isValidUtf8Text(buffer);
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return isDocxPackage(buffer);
	}
}

function isValidUtf8Text(buffer: Buffer): boolean {
	try {
		const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
		// CSV does not have a file signature; valid UTF-8 text without NUL bytes is its safe equivalent.
		return text.trim().length > 0 && !text.includes('\0');
	} catch {
		return false;
	}
}

function isDocxPackage(buffer: Buffer): boolean {
	if (
		buffer.length < 4 ||
		buffer[0] !== 0x50 ||
		buffer[1] !== 0x4b ||
		buffer[2] !== 0x03 ||
		buffer[3] !== 0x04
	) {
		return false;
	}

	const minEocdOffset = Math.max(0, buffer.length - 0xffff - 22);
	let eocdOffset = -1;
	for (let offset = buffer.length - 22; offset >= minEocdOffset; offset--) {
		if (
			buffer.readUInt32LE(offset) === 0x06054b50 &&
			offset + 22 + buffer.readUInt16LE(offset + 20) === buffer.length
		) {
			eocdOffset = offset;
			break;
		}
	}
	if (eocdOffset === -1) return false;

	const centralDirectorySize = buffer.readUInt32LE(eocdOffset + 12);
	const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
	const centralDirectoryEnd = centralDirectoryOffset + centralDirectorySize;
	if (centralDirectoryEnd > eocdOffset || centralDirectoryEnd > buffer.length) return false;

	let offset = centralDirectoryOffset;
	const files = new Set<string>();
	while (offset < centralDirectoryEnd) {
		if (offset + 46 > centralDirectoryEnd || buffer.readUInt32LE(offset) !== 0x02014b50)
			return false;
		const filenameLength = buffer.readUInt16LE(offset + 28);
		const extraLength = buffer.readUInt16LE(offset + 30);
		const commentLength = buffer.readUInt16LE(offset + 32);
		const entryEnd = offset + 46 + filenameLength + extraLength + commentLength;
		if (entryEnd > centralDirectoryEnd) return false;
		files.add(buffer.subarray(offset + 46, offset + 46 + filenameLength).toString('utf8'));
		offset = entryEnd;
	}

	return files.has('[Content_Types].xml') && files.has('word/document.xml');
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

/** Returns the S3 object body without loading the full file into memory. */
export async function downloadFileStream(storageKey: string): Promise<Readable> {
	const { client, bucket } = getS3();
	const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: storageKey }));
	if (!response.Body) throw error(404, `File not found: ${storageKey}`);

	// This server-only helper runs with the Node S3 client, whose response body is a Node stream.
	return response.Body as Readable;
}

export async function deleteFilesByPrefix(prefix: string): Promise<void> {
	const { client, bucket } = getS3();
	let continuationToken: string | undefined;

	do {
		const listResponse = await client.send(
			new ListObjectsV2Command({
				Bucket: bucket,
				Prefix: prefix,
				ContinuationToken: continuationToken
			})
		);

		const objects = listResponse.Contents?.filter((obj) => obj.Key).map((obj) => ({
			Key: obj.Key!
		}));

		if (objects && objects.length > 0) {
			await client.send(
				new DeleteObjectsCommand({
					Bucket: bucket,
					Delete: { Objects: objects }
				})
			);
		}

		continuationToken = listResponse.NextContinuationToken;
	} while (continuationToken);
}
