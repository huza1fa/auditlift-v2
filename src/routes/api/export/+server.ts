import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	controls,
	evidence,
	policies,
	policyControls,
	organizationFrameworks,
	frameworks
} from '$lib/server/db/schema';
import { eq, and, isNull, inArray, asc, count, sql } from 'drizzle-orm';
import { hasActivePaidAccess } from '$lib/server/billing';
import { ExportSchema } from '$lib/server/validation';
import archiver from 'archiver';
import { stringify } from 'csv-stringify/sync';
import { generatePolicyPdf } from '$lib/server/pdf';
import { downloadFileStream, sanitizeFilename } from '$lib/server/storage';
import { captureServerEvent } from '$lib/server/posthog';
import { logActivity } from '$lib/server/activity';
import { Readable } from 'node:stream';

const MAX_EXPORT_FILES = 100;
const MAX_EXPORT_SOURCE_BYTES = 100 * 1024 * 1024;

type ExportControl = {
	id: string;
	code: string;
	title: string;
	category: string;
	frameworkName: string;
	frameworkSlug: string;
};

function appendArchiveEntry(
	archive: archiver.Archiver,
	source: string | Buffer | Readable,
	name: string
): Promise<void> {
	return new Promise((resolve, reject) => {
		const onEntry = () => {
			cleanup();
			resolve();
		};
		const onError = (err: Error) => {
			cleanup();
			reject(err);
		};
		const cleanup = () => {
			archive.off('entry', onEntry);
			archive.off('error', onError);
		};

		archive.once('entry', onEntry);
		archive.once('error', onError);
		archive.append(source, { name });
	});
}

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
	const actor = {
		userId: locals.session.user.id,
		userName: locals.session.user.name ?? locals.session.user.email
	};

	const bodyRaw = await request.json().catch(() => ({}));
	const bodyResult = ExportSchema.safeParse(bodyRaw);
	if (!bodyResult.success) throw error(400, 'Invalid input');
	const { policyIds, evidenceIds } = bodyResult.data;

	// Include every enrolled framework in a deterministic framework/control order.
	const enrolledFrameworks = await db
		.select({ id: frameworks.id, name: frameworks.name, slug: frameworks.slug })
		.from(organizationFrameworks)
		.innerJoin(frameworks, eq(organizationFrameworks.frameworkId, frameworks.id))
		.where(eq(organizationFrameworks.organizationId, orgId))
		.orderBy(asc(frameworks.name), asc(frameworks.slug));

	const frameworkIds = enrolledFrameworks.map((framework) => framework.id);
	const allControls: ExportControl[] = frameworkIds.length
		? await db
				.select({
					id: controls.id,
					code: controls.code,
					title: controls.title,
					category: controls.category,
					frameworkName: frameworks.name,
					frameworkSlug: frameworks.slug
				})
				.from(controls)
				.innerJoin(frameworks, eq(controls.frameworkId, frameworks.id))
				.where(inArray(controls.frameworkId, frameworkIds))
				.orderBy(asc(frameworks.name), asc(frameworks.slug), asc(controls.code))
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

	// Get policies — filtered by selection if provided, always excluding archived
	const policiesWhere =
		policyIds && policyIds.length > 0
			? and(
					eq(policies.organizationId, orgId),
					isNull(policies.archivedAt),
					inArray(policies.id, policyIds)
				)
			: and(eq(policies.organizationId, orgId), isNull(policies.archivedAt));

	const [[evidenceTotals], [policyTotals]] = await Promise.all([
		db
			.select({
				fileCount: count(),
				sourceBytes: sql<number>`coalesce(sum(${evidence.sizeBytes}), 0)::integer`
			})
			.from(evidence)
			.where(evidenceWhere),
		db
			.select({
				fileCount: count(),
				sourceBytes: sql<number>`coalesce(sum(octet_length(${policies.content})), 0)::integer`
			})
			.from(policies)
			.where(policiesWhere)
	]);

	const sourceFileCount = Number(evidenceTotals.fileCount) + Number(policyTotals.fileCount);
	if (sourceFileCount > MAX_EXPORT_FILES) {
		throw error(
			413,
			`Export includes ${sourceFileCount} files. Select no more than ${MAX_EXPORT_FILES} policies and evidence files.`
		);
	}

	const sourceBytes = Number(evidenceTotals.sourceBytes) + Number(policyTotals.sourceBytes);
	if (sourceBytes > MAX_EXPORT_SOURCE_BYTES) {
		throw error(
			413,
			`Export source data is ${(sourceBytes / 1024 / 1024).toFixed(1)} MB. Select fewer files to stay within the ${MAX_EXPORT_SOURCE_BYTES / 1024 / 1024} MB limit.`
		);
	}

	const [allEvidence, allPolicies, allPolicyControls] = await Promise.all([
		db.select().from(evidence).where(evidenceWhere),
		db.select().from(policies).where(policiesWhere),
		db
			.select({ policyId: policyControls.policyId, controlId: policyControls.controlId })
			.from(policyControls)
			.where(eq(policyControls.organizationId, orgId))
	]);

	const controlsById = new Map(allControls.map((control) => [control.id, control]));
	const evidenceCounts = new Map<string, number>();
	const policyCounts = new Map<string, number>();
	for (const item of allEvidence) {
		evidenceCounts.set(item.controlId, (evidenceCounts.get(item.controlId) ?? 0) + 1);
	}
	const exportedPolicyIds = new Set(allPolicies.map((policy) => policy.id));
	for (const mapping of allPolicyControls) {
		if (exportedPolicyIds.has(mapping.policyId)) {
			policyCounts.set(mapping.controlId, (policyCounts.get(mapping.controlId) ?? 0) + 1);
		}
	}

	// Archive output is streamed directly to the response; entries are appended serially to preserve
	// backpressure and ensure only one S3 object or generated PDF is in memory at a time.
	const archive = archiver('zip', { zlib: { level: 9 } });

	const date = new Date().toISOString().split('T')[0];
	const folderName = `Auditlift-Export-${org.slug}-${date}`;

	const csvRows = [
		[
			'Framework',
			'Control ID',
			'Code',
			'Title',
			'Category',
			'Status',
			'Evidence Count',
			'Policy Count'
		]
	];
	for (const control of allControls) {
		const evidenceCount = evidenceCounts.get(control.id) ?? 0;
		const policyCount = policyCounts.get(control.id) ?? 0;
		const status = evidenceCount > 0 || policyCount > 0 ? 'Complete' : 'Incomplete';
		csvRows.push([
			control.frameworkName,
			control.id,
			control.code,
			control.title,
			control.category,
			status,
			String(evidenceCount),
			String(policyCount)
		]);
	}

	void (async () => {
		try {
			await appendArchiveEntry(archive, stringify(csvRows), `${folderName}/control-mapping.csv`);

			const companyName = org.name ?? 'Auditlift';
			for (const policy of allPolicies) {
				const safeFilename = sanitizeFilename(policy.title).replace(/\.[^.]+$/, '') || 'policy';
				const pdfBytes = await generatePolicyPdf(policy.title, policy.content, companyName);
				await appendArchiveEntry(
					archive,
					Buffer.from(pdfBytes),
					`${folderName}/Policies/${safeFilename}-${policy.id}.pdf`
				);
			}

			for (const item of allEvidence) {
				const control = controlsById.get(item.controlId);
				const frameworkFolder = control?.frameworkSlug ?? 'unmapped';
				const controlFolder = control ? sanitizeFilename(control.code) : 'unknown';
				try {
					const fileStream = await downloadFileStream(item.storageKey);
					await appendArchiveEntry(
						archive,
						fileStream,
						`${folderName}/Evidence/${frameworkFolder}/${controlFolder}/${sanitizeFilename(item.filename)}`
					);
				} catch (err) {
					console.warn(`[Export] Failed to download evidence ${item.id}: ${err}`);
				}
			}

			await archive.finalize();
			void logActivity({
				organizationId: orgId,
				userId: actor.userId,
				userName: actor.userName,
				action: 'export.created',
				entityType: 'export',
				entityId: folderName,
				details: `${allPolicies.length} policies, ${allEvidence.length} evidence files, ${allControls.length} controls`
			}).catch((err) => console.warn(`[Export] Failed to log activity: ${err}`));
			void captureServerEvent({
				event: 'export_created',
				properties: {
					org_id: orgId,
					policy_count: allPolicies.length,
					evidence_count: allEvidence.length,
					control_count: allControls.length
				},
				groups: { organization: orgId }
			}).catch((err) => console.warn(`[Export] Failed to capture event: ${err}`));
		} catch (err) {
			archive.destroy(err instanceof Error ? err : new Error('Failed to build export archive'));
		}
	})();

	return new Response(Readable.toWeb(archive) as ReadableStream<Uint8Array>, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${folderName}.zip"`
		}
	});
};
