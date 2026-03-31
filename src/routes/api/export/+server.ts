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
import { eq } from 'drizzle-orm';
import { hasActiveAccess } from '$lib/server/billing';
import archiver from 'archiver';
import { generatePolicyPdf } from '$lib/server/pdf';
import { downloadFile } from '$lib/server/storage';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) throw error(401, 'Unauthorized');

	// Gate: active subscription only (no trial export)
	if (!hasActiveAccess(locals.subscription)) {
		throw error(402, 'Active subscription required to export');
	}

	const orgId = locals.organizationId;
	const org = locals.organization!;

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

	// Get all evidence
	const allEvidence = await db.select().from(evidence).where(eq(evidence.organizationId, orgId));

	// Get all policies
	const allPolicies = await db.select().from(policies).where(eq(policies.organizationId, orgId));

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

	return new Response(buffer, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${folderName}.zip"`,
			'Content-Length': buffer.length.toString()
		}
	});
};
