import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, h as evidence } from './index2-CrtZLkpF.js';
import { s as sanitizeFilename, v as validateFileType, A as ALLOWED_MIME_TYPES, a as validateFileSize, M as MAX_FILE_SIZE, g as generateStorageKey, b as getPresignedUploadUrl } from './storage-uhHqgdeh.js';
import { a as hasActiveAccess } from './billing-CuJKZCaE.js';
import { P as PresignEvidenceSchema } from './validation-CH6LL-Nw.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';
import '@aws-sdk/client-s3';
import '@aws-sdk/s3-request-presigner';
import 'zod';

const POST = async ({ request, locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to upload evidence.");
  }
  const result = PresignEvidenceSchema.safeParse(await request.json());
  if (!result.success) throw error(400, "Invalid input");
  const { controlId, filename, mimeType, sizeBytes } = result.data;
  const safeFilename = sanitizeFilename(filename);
  if (!validateFileType(mimeType)) {
    throw error(400, `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`);
  }
  if (!validateFileSize(sizeBytes)) {
    throw error(400, `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  const storageKey = generateStorageKey(orgId, controlId, mimeType);
  const uploadUrl = await getPresignedUploadUrl(storageKey, mimeType);
  try {
    const [newEvidence] = await db.insert(evidence).values({
      organizationId: orgId,
      controlId,
      filename: safeFilename,
      storageKey,
      mimeType,
      sizeBytes,
      status: "pending",
      uploadedBy: locals.session.user.id
    }).returning({ id: evidence.id });
    return json({
      evidenceId: newEvidence.id,
      uploadUrl,
      storageKey
    });
  } catch (err) {
    console.error("Failed to create pending evidence record:", err);
    throw error(500, "Failed to initiate upload");
  }
};

export { POST };
//# sourceMappingURL=_server.ts-Dsf6GsiM.js.map
