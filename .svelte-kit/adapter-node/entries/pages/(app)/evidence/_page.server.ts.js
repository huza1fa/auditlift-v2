import { redirect } from "@sveltejs/kit";
import { d as db, a as controls, e as evidence } from "../../../../chunks/index2.js";
import { eq, and, isNull } from "drizzle-orm";
const load = async ({ locals }) => {
  if (!locals.session || !locals.organizationId) redirect(302, "/login");
  const evidenceList = await db.select({
    id: evidence.id,
    filename: evidence.filename,
    mimeType: evidence.mimeType,
    sizeBytes: evidence.sizeBytes,
    notes: evidence.notes,
    createdAt: evidence.createdAt,
    controlId: evidence.controlId,
    controlCode: controls.code,
    controlTitle: controls.title
  }).from(evidence).leftJoin(controls, eq(evidence.controlId, controls.id)).where(
    and(
      eq(evidence.organizationId, locals.organizationId),
      eq(evidence.status, "active"),
      isNull(evidence.deletedAt)
    )
  );
  return { evidenceList };
};
export {
  load
};
