import { error } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	organizations,
	questionnaires,
	questionnaireQuestions,
	policies
} from '$lib/server/db/schema';
import { eq, and, gt, inArray, isNull } from 'drizzle-orm';
import { hasActivePaidAccess, hasTrialQuestionnaireExportAvailable } from '$lib/server/billing';
import { requireOrganizationRole } from '$lib/server/auth-utils';
import { logActivity } from '$lib/server/activity';
import { downloadFile } from '$lib/server/storage';
import { loadKnowledgeFreshness } from '$lib/server/knowledge-freshness';
import {
	writeAnswersToCsv,
	writeAnswersToXlsx,
	type ReturnAnswer,
	type SpreadsheetSourceLocation
} from '$lib/server/questionnaire-return';

function escapeCsvField(value: string): string {
	// Wrap in double quotes, escape internal double quotes by doubling them
	const escaped = value.replace(/"/g, '""');
	return `"${escaped}"`;
}

function buildCsvRow(fields: string[]): string {
	return fields.map(escapeCsvField).join(',');
}

function isSpreadsheetSourceLocation(value: unknown): value is SpreadsheetSourceLocation {
	if (!value || typeof value !== 'object') return false;
	const location = value as Record<string, unknown>;
	return (
		typeof location.sheetName === 'string' &&
		typeof location.questionCell === 'string' &&
		(typeof location.answerCell === 'string' || location.answerCell === null)
	);
}

/**
 * Atomically reserves the organization's one trial export. The reservation is
 * finalized only after the response is successfully constructed, and released
 * by its unique claim ID if construction fails.
 */
async function claimTrialQuestionnaireExport(organizationId: string): Promise<string | null> {
	const claimId = randomUUID();
	const [claimed] = await db
		.update(organizations)
		.set({
			trialQuestionnaireExportedAt: new Date(),
			trialQuestionnaireExportClaimId: claimId,
			updatedAt: new Date()
		})
		.where(
			and(
				eq(organizations.id, organizationId),
				isNull(organizations.trialQuestionnaireExportedAt),
				gt(organizations.trialEndsAt, new Date())
			)
		)
		.returning({ id: organizations.id });

	return claimed ? claimId : null;
}

async function finalizeTrialQuestionnaireExport(
	organizationId: string,
	claimId: string
): Promise<void> {
	await db
		.update(organizations)
		.set({ trialQuestionnaireExportClaimId: null, updatedAt: new Date() })
		.where(
			and(
				eq(organizations.id, organizationId),
				eq(organizations.trialQuestionnaireExportClaimId, claimId)
			)
		);
}

async function releaseTrialQuestionnaireExport(
	organizationId: string,
	claimId: string
): Promise<void> {
	await db
		.update(organizations)
		.set({
			trialQuestionnaireExportedAt: null,
			trialQuestionnaireExportClaimId: null,
			updatedAt: new Date()
		})
		.where(
			and(
				eq(organizations.id, organizationId),
				eq(organizations.trialQuestionnaireExportClaimId, claimId)
			)
		);
}

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const { organizationId: orgId, userId } = await requireOrganizationRole(locals);

	const hasPaidAccess = hasActivePaidAccess(locals.subscription);
	if (
		!hasPaidAccess &&
		!hasTrialQuestionnaireExportAvailable(
			locals.subscription,
			locals.organization?.trialEndsAt,
			locals.organization?.trialQuestionnaireExportedAt
		)
	) {
		throw error(
			402,
			'Your trial questionnaire export is no longer available. Upgrade to export additional questionnaires.'
		);
	}

	const { id } = params;

	// Verify questionnaire ownership
	const [questionnaire] = await db
		.select()
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) {
		throw error(404, 'Questionnaire not found');
	}

	// Fetch all questions
	const questions = await db
		.select()
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.questionnaireId, id),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		)
		.orderBy(questionnaireQuestions.order);

	const freshness = await loadKnowledgeFreshness(orgId);
	const warningCount = questions.filter(
		(question) => freshness.citationIssues(question.citations, id).length > 0
	).length;
	const reviewToken = freshness.reviewToken(questions);
	// Check before claiming the one trial export. An acknowledgement is bound to
	// these exact answers and source versions, and never changes the answers.
	if (warningCount > 0 && url.searchParams.get('acknowledgeFreshness') !== reviewToken) {
		return new Response(
			JSON.stringify({
				code: 'ANSWER_REVIEW_REQUIRED',
				warningCount,
				reviewToken,
				message:
					'Some answers cite changed or unavailable sources. Review them before exporting, or explicitly acknowledge the warning.'
			}),
			{ status: 409, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
		);
	}

	const nativeAnswers: ReturnAnswer[] = [];
	let canReturnNativeFile =
		questionnaire.sourceFormat === 'xlsx' || questionnaire.sourceFormat === 'csv';
	for (const question of questions) {
		const answer = (question.userEditedAnswer ?? question.generatedAnswer ?? '').trim();
		const sourceLocation = question.sourceLocation;
		if (!answer || !isSpreadsheetSourceLocation(sourceLocation) || !sourceLocation.answerCell) {
			canReturnNativeFile = false;
			break;
		}
		nativeAnswers.push({ answer, sourceLocation });
	}

	const safeFilename = questionnaire.filename
		.replace(/[^a-zA-Z0-9._-]/g, '_')
		.replace(/\.[^.]+$/, '');
	const dateStr = new Date().toISOString().slice(0, 10);
	const trialExportClaimId = hasPaidAccess ? null : await claimTrialQuestionnaireExport(orgId);

	if (!hasPaidAccess && !trialExportClaimId) {
		throw error(
			402,
			'Your trial questionnaire export has already been used. Upgrade to export additional questionnaires.'
		);
	}

	try {
		if (canReturnNativeFile) {
			try {
				const original = await downloadFile(questionnaire.storageKey);
				const isXlsx = questionnaire.sourceFormat === 'xlsx';
				const body = isXlsx
					? await writeAnswersToXlsx(original, nativeAnswers)
					: writeAnswersToCsv(original, nativeAnswers);
				const extension = isXlsx ? 'xlsx' : 'csv';
				const contentType = isXlsx
					? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					: 'text/csv; charset=utf-8';

				if (trialExportClaimId) {
					await finalizeTrialQuestionnaireExport(orgId, trialExportClaimId);
				}

				logActivity({
					organizationId: orgId,
					userId,
					userName: locals.session!.user.name ?? locals.session!.user.email,
					action: 'questionnaire.export',
					entityType: 'questionnaire',
					entityId: id,
					entityName: questionnaire.filename,
					details: `${questions.length} answers returned in the original ${extension.toUpperCase()} template${trialExportClaimId ? ' (trial export)' : ''}`
				}).catch(console.error);

				return new Response(new Uint8Array(body), {
					status: 200,
					headers: {
						'Content-Type': contentType,
						'Content-Disposition': `attachment; filename="completed-${safeFilename}-${dateStr}.${extension}"`,
						'Cache-Control': 'no-store',
						'X-AuditLift-Export-Mode': 'native'
					}
				});
			} catch (cause) {
				console.error('Failed to build native questionnaire export:', cause);
				throw error(500, 'Could not return answers to the original spreadsheet. Please try again.');
			}
		}

		// Collect all referenced policy IDs across all questions
		const allPolicyIds = [
			...new Set(questions.flatMap((q) => (q.mappedPolicyIds as string[]) ?? []))
		];

		// Fetch policy titles for those IDs (scoped to org)
		const policyMap = new Map<string, string>();
		if (allPolicyIds.length > 0) {
			const policyRows = await db
				.select({ id: policies.id, title: policies.title })
				.from(policies)
				.where(and(eq(policies.organizationId, orgId), inArray(policies.id, allPolicyIds)));
			for (const row of policyRows) {
				policyMap.set(row.id, row.title);
			}
		}

		// Build CSV
		const header = buildCsvRow([
			'Section',
			'#',
			'Question',
			'Answer',
			'Confidence',
			'Source Policies',
			'Gap Remediation'
		]);

		const rows = questions.map((q) => {
			const answer = (q.userEditedAnswer ?? q.generatedAnswer ?? '').trim();
			const sourcePolicies = ((q.mappedPolicyIds as string[]) ?? [])
				.map((pid) => policyMap.get(pid) ?? pid)
				.join('; ');
			const gapRemediation = q.gapRemediation ?? '';
			const confidence = q.confidence ?? 'unprocessed';

			return buildCsvRow([
				q.sectionName ?? '',
				q.questionNumber ?? '',
				q.questionText,
				answer,
				confidence,
				sourcePolicies,
				gapRemediation
			]);
		});

		const csvContent = [header, ...rows].join('\r\n');

		const exportFilename = `questionnaire-answers-${safeFilename}-${dateStr}.csv`;

		if (trialExportClaimId) {
			await finalizeTrialQuestionnaireExport(orgId, trialExportClaimId);
		}

		logActivity({
			organizationId: orgId,
			userId,
			userName: locals.session!.user.name ?? locals.session!.user.email,
			action: 'questionnaire.export',
			entityType: 'questionnaire',
			entityId: id,
			entityName: questionnaire.filename,
			details: `${questions.length} questions exported as a review CSV${trialExportClaimId ? ' (trial export)' : ''}`
		}).catch(console.error);

		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="${exportFilename}"`,
				'Cache-Control': 'no-store',
				'X-AuditLift-Export-Mode': 'review'
			}
		});
	} catch (cause) {
		if (trialExportClaimId) {
			await releaseTrialQuestionnaireExport(orgId, trialExportClaimId).catch((releaseCause) => {
				console.error('Failed to release trial questionnaire export claim:', releaseCause);
			});
		}
		throw cause;
	}
};
