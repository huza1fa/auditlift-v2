import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	controls,
	evidence,
	policies,
	organizationFrameworks,
	frameworks
} from '$lib/server/db/schema';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import { hasActivePaidAccess } from '$lib/server/billing';
import { ExportSchema } from '$lib/server/validation';
import archiver from 'archiver';
import { generatePolicyPdf } from '$lib/server/pdf';
import { downloadFile } from '$lib/server/storage';
import { captureServerEvent } from '$lib/server/posthog';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.session || !locals.organizationId) throw error(401, 'Unauthorized');

	// Gate: active subscription only (no trial export)
	if (!hasActivePaidAccess(locals.subscription)) {
		throw error(402, 'Active subscription required to export');
	}

	// Verify subscription belongs to requesting org
	if (locals.subscription && locals.subscription.organizationId !== locals.organizationId) {
		throw error(403, 'Forbidden');
	}

	const orgId = locals.organizationId;
	const org = locals.organization!;

	const bodyRaw = await request.json().catch(() => ({}));
	const bodyResult = ExportSchema.safeParse(bodyRaw);
	if (!bodyResult.success) throw error(400, 'Invalid input');
	const { policyIds, evidenceIds } = bodyResult.data;

	// Get org's framework
	const [orgFramework] = await db
		.select({ framework: frameworks })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.limit(1);

	// Get all controls
	const allControls = orgFramework
		? await db.select().from(controls).where(eq(controls.frameworkId, orgFramework.framework.id))
		: [];

	// Get evidence — filtered by selection if provided, always excluding soft-deleted
	const evidenceWhere =
		evidenceIds && evidenceIds.length > 0
			? and(
					eq(evidence.organizationId, orgId),
					eq(evidence.status, 'active'),
					isNull(evidence.deletedAt),
					inArray(evidence.id, evidenceIds)
				)
			: and(
					eq(evidence.organizationId, orgId),
					eq(evidence.status, 'active'),
					isNull(evidence.deletedAt)
				);

	const allEvidence = await db.select().from(evidence).where(evidenceWhere);

	// Get policies — filtered by selection if provided, always excluding archived
	const policiesWhere =
		policyIds && policyIds.length > 0
			? and(
					eq(policies.organizationId, orgId),
					isNull(policies.archivedAt),
					inArray(policies.id, policyIds)
				)
			: and(eq(policies.organizationId, orgId), isNull(policies.archivedAt));

	const allPolicies = await db.select().from(policies).where(policiesWhere);

	// Build ZIP
	const archive = archiver('zip', { zlib: { level: 9 } });

	const date = new Date().toISOString().split('T')[0];
	const folderName = `AuditLift-Export-${org.slug}-${date}`;

	// control-mapping.csv
	const csvLines = ['Control ID,Code,Title,Category,Status,Evidence Count,Policy Count'];
	for (const control of allControls) {
		const ev = allEvidence.filter((e) => e.controlId === control.id);
		const pol = allPolicies.filter((p) => p.controlId === control.id);
		const status = ev.length > 0 || pol.length > 0 ? 'Complete' : 'Incomplete';
		csvLines.push(
			`${control.id},"${control.code}","${control.title}","${control.category}",${status},${ev.length},${pol.length}`
		);
	}
	archive.append(csvLines.join('\n'), { name: `${folderName}/control-mapping.csv` });

	// Policies as PDF
	const companyName = org.name ?? 'AuditLift';
	for (const policy of allPolicies) {
		const safeFilename = policy.title.replace(/[^a-zA-Z0-9_-]/g, '_');
		const pdfBytes = await generatePolicyPdf(policy.title, policy.content, companyName);
		archive.append(Buffer.from(pdfBytes), { name: `${folderName}/Policies/${safeFilename}.pdf` });
	}

	// Evidence files from S3
	for (const ev of allEvidence) {
		const control = allControls.find((c) => c.id === ev.controlId);
		const controlCode = control?.code ?? 'unknown';
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

	// Convert archiver to Response
	const chunks: Buffer[] = [];
	await new Promise<void>((resolve, reject) => {
		archive.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		archive.on('end', resolve);
		archive.on('error', reject);
	});

	const buffer = Buffer.concat(chunks);

	captureServerEvent({
		event: 'export_created',
		distinctId: locals.session.user.id,
		properties: {
			org_id: orgId,
			policy_count: allPolicies.length,
			evidence_count: allEvidence.length,
			control_count: allControls.length
		},
		groups: { organization: orgId }
	});

	return new Response(buffer, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${folderName}.zip"`,
			'Content-Length': buffer.length.toString()
		}
	});
};
