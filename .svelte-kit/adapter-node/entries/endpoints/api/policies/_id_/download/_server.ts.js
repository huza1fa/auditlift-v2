import { error } from "@sveltejs/kit";
import { d as db, p as policies } from "../../../../../../chunks/index2.js";
import { and, eq } from "drizzle-orm";
import { g as generatePolicyPdf } from "../../../../../../chunks/pdf.js";
const GET = async ({ locals, params }) => {
  if (!locals.session || !locals.organizationId) {
    throw error(401, "Unauthorized");
  }
  const policyId = params.id;
  if (!policyId) {
    throw error(400, "Missing policy ID");
  }
  const [policy] = await db.select().from(policies).where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId))).limit(1);
  if (!policy) {
    throw error(404, "Policy not found");
  }
  const companyName = locals.organization?.name ?? "AuditLift";
  const pdfBytes = await generatePolicyPdf(policy.title, policy.content, companyName);
  const safeFilename = policy.title.replace(/[^a-zA-Z0-9_-]/g, "_");
  return new Response(new Blob([Buffer.from(pdfBytes)], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeFilename}.pdf"`,
      "Content-Length": pdfBytes.length.toString()
    }
  });
};
export {
  GET
};
