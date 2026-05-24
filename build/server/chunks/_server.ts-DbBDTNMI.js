import { e as error, j as json } from './index-wpIsICWW.js';
import { d as db, q as questionnaires, e as eq, k as desc } from './index2-CrtZLkpF.js';
import { a as hasActiveAccess } from './billing-CuJKZCaE.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

const GET = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const orgId = locals.organizationId;
  if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
    throw error(402, "Trial expired. Upgrade to access questionnaires.");
  }
  const rows = await db.select({
    id: questionnaires.id,
    filename: questionnaires.filename,
    status: questionnaires.status,
    totalQuestions: questionnaires.totalQuestions,
    answeredCount: questionnaires.answeredCount,
    gapCount: questionnaires.gapCount,
    highCount: questionnaires.highCount,
    mediumCount: questionnaires.mediumCount,
    lowCount: questionnaires.lowCount,
    dealReadinessScore: questionnaires.dealReadinessScore,
    sourceFormat: questionnaires.sourceFormat,
    createdAt: questionnaires.createdAt
  }).from(questionnaires).where(eq(questionnaires.organizationId, orgId)).orderBy(desc(questionnaires.createdAt));
  return json({ questionnaires: rows });
};

export { GET };
//# sourceMappingURL=_server.ts-DbBDTNMI.js.map
