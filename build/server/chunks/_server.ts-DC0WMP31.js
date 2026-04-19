import { e as error } from './index-wpIsICWW.js';
import { d as db, f as frameworks, b as organizationFrameworks, e as eq, c as controls, i as and, m as inArray, h as evidence, j as isNull, p as policies } from './index2-BGADDK3r.js';
import { h as hasActivePaidAccess } from './billing-CuJKZCaE.js';
import { E as ExportSchema } from './validation-ChD5gXmu.js';
import archiver from 'archiver';
import { g as generatePolicyPdf } from './pdf-DlnJb9i1.js';
import { d as downloadFile } from './storage-uhHqgdeh.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';
import 'zod';
import 'pdf-lib';
import '@aws-sdk/client-s3';
import '@aws-sdk/s3-request-presigner';

const POST = async ({ locals, request }) => {
  if (!locals.session || !locals.organizationId) throw error(401, "Unauthorized");
  if (!hasActivePaidAccess(locals.subscription)) {
    throw error(402, "Active subscription required to export");
  }
  if (locals.subscription && locals.subscription.organizationId !== locals.organizationId) {
    throw error(403, "Forbidden");
  }
  const orgId = locals.organizationId;
  const org = locals.organization;
  const bodyRaw = await request.json().catch(() => ({}));
  const bodyResult = ExportSchema.safeParse(bodyRaw);
  if (!bodyResult.success) throw error(400, "Invalid input");
  const { policyIds, evidenceIds } = bodyResult.data;
  const [orgFramework] = await db.select({ framework: frameworks }).from(organizationFrameworks).innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id)).where(eq(organizationFrameworks.organizationId, orgId)).limit(1);
  const allControls = orgFramework ? await db.select().from(controls).where(eq(controls.frameworkId, orgFramework.framework.id)) : [];
  const evidenceWhere = evidenceIds && evidenceIds.length > 0 ? and(
    eq(evidence.organizationId, orgId),
    eq(evidence.status, "active"),
    isNull(evidence.deletedAt),
    inArray(evidence.id, evidenceIds)
  ) : and(
    eq(evidence.organizationId, orgId),
    eq(evidence.status, "active"),
    isNull(evidence.deletedAt)
  );
  const allEvidence = await db.select().from(evidence).where(evidenceWhere);
  const policiesWhere = policyIds && policyIds.length > 0 ? and(
    eq(policies.organizationId, orgId),
    isNull(policies.archivedAt),
    inArray(policies.id, policyIds)
  ) : and(eq(policies.organizationId, orgId), isNull(policies.archivedAt));
  const allPolicies = await db.select().from(policies).where(policiesWhere);
  const archive = archiver("zip", { zlib: { level: 9 } });
  const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const folderName = `AuditLift-Export-${org.slug}-${date}`;
  const csvLines = ["Control ID,Code,Title,Category,Status,Evidence Count,Policy Count"];
  for (const control of allControls) {
    const ev = allEvidence.filter((e) => e.controlId === control.id);
    const pol = allPolicies.filter((p) => p.controlId === control.id);
    const status = ev.length > 0 || pol.length > 0 ? "Complete" : "Incomplete";
    csvLines.push(
      `${control.id},"${control.code}","${control.title}","${control.category}",${status},${ev.length},${pol.length}`
    );
  }
  archive.append(csvLines.join("\n"), { name: `${folderName}/control-mapping.csv` });
  const companyName = org.name ?? "AuditLift";
  for (const policy of allPolicies) {
    const safeFilename = policy.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    const pdfBytes = await generatePolicyPdf(policy.title, policy.content, companyName);
    archive.append(Buffer.from(pdfBytes), { name: `${folderName}/Policies/${safeFilename}.pdf` });
  }
  for (const ev of allEvidence) {
    const control = allControls.find((c) => c.id === ev.controlId);
    const controlCode = control?.code ?? "unknown";
    try {
      const fileBuffer = await downloadFile(ev.storageKey);
      archive.append(fileBuffer, {
        name: `${folderName}/Evidence/${controlCode}/${ev.filename}`
      });
    } catch (err) {
      console.warn(`[Export] Failed to download evidence ${ev.id}: ${err}`);
    }
  }
  archive.finalize();
  const chunks = [];
  await new Promise((resolve, reject) => {
    archive.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    archive.on("end", resolve);
    archive.on("error", reject);
  });
  const buffer = Buffer.concat(chunks);
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${folderName}.zip"`,
      "Content-Length": buffer.length.toString()
    }
  });
};

export { POST };
//# sourceMappingURL=_server.ts-DC0WMP31.js.map
