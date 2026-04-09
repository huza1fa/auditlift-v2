import { PutObjectCommand, GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { e as error } from './index-wpIsICWW.js';

let _s3Client = null;
let _bucketName = null;
function getS3() {
  if (_s3Client && _bucketName) return { client: _s3Client, bucket: _bucketName };
  const endpoint = process.env.BUCKET_ENDPOINT;
  const region = process.env.BUCKET_REGION || "auto";
  const bucket = process.env.BUCKET_NAME;
  const accessKey = process.env.BUCKET_ACCESS_KEY;
  const secretKey = process.env.BUCKET_SECRET_KEY;
  if (!endpoint || !bucket || !accessKey || !secretKey) {
    throw new Error(
      `Missing S3 configuration: ${JSON.stringify({ endpoint: !!endpoint, bucket: !!bucket, accessKey: !!accessKey, secretKey: !!secretKey })}`
    );
  }
  _s3Client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey }
  });
  _bucketName = bucket;
  return { client: _s3Client, bucket: _bucketName };
}
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
function validateFileType(mimeType) {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}
function validateFileSize(size) {
  return size > 0 && size <= MAX_FILE_SIZE;
}
const MIME_TO_EXT = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "text/csv": "csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
};
function sanitizeFilename(filename) {
  const base = filename.split(/[/\\]/).pop() ?? "file";
  return base.replace(/[^\w.\-]/g, "_").replace(/\.{2,}/g, ".").slice(0, 255);
}
function generateStorageKey(orgId, controlId, mimeType) {
  const ext = MIME_TO_EXT[mimeType] ?? "bin";
  const uuid = crypto.randomUUID();
  return `${orgId}/${controlId}/${uuid}.${ext}`;
}
async function getPresignedUploadUrl(storageKey, mimeType, expiresIn = 3600) {
  const { client, bucket } = getS3();
  const command = new PutObjectCommand({ Bucket: bucket, Key: storageKey, ContentType: mimeType });
  return getSignedUrl(client, command, { expiresIn });
}
async function getPresignedDownloadUrl(storageKey, expiresIn = 3600) {
  const { client, bucket } = getS3();
  const command = new GetObjectCommand({ Bucket: bucket, Key: storageKey });
  return getSignedUrl(client, command, { expiresIn });
}
async function fileExists(storageKey) {
  try {
    const { client, bucket } = getS3();
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: storageKey }));
    return true;
  } catch {
    return false;
  }
}
async function downloadFile(storageKey) {
  const { client, bucket } = getS3();
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: storageKey }));
  if (!response.Body) throw error(404, `File not found: ${storageKey}`);
  const bytes = await response.Body.transformToByteArray();
  return Buffer.from(bytes);
}

export { ALLOWED_MIME_TYPES as A, MAX_FILE_SIZE as M, validateFileSize as a, getPresignedUploadUrl as b, getPresignedDownloadUrl as c, downloadFile as d, fileExists as f, generateStorageKey as g, sanitizeFilename as s, validateFileType as v };
//# sourceMappingURL=storage-uhHqgdeh.js.map
