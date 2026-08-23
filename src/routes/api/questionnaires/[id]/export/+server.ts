import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires, questionnaireQuestions, policies } from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { hasActivePaidAccess } from '$lib/server/billing';
import { requireOrganizationRole } from '$lib/server/auth-utils';
import { logActivity } from '$lib/server/activity';

function escapeCsvField(value: string): string {
	// Wrap in double quotes, escape internal double quotes by doubling them
	const escaped = value.replace(/"/g, '""');
	return `"${escaped}"`;
}

function buildCsvRow(fields: string[]): string {
	return fields.map(escapeCsvField).join(',');
}

export const GET: RequestHandler = async ({ locals, params }) => {
	const { organizationId: orgId, userId } = await requireOrganizationRole(locals);

	// Export is a paid-only feature
	if (!hasActivePaidAccess(locals.subscription)) {
		throw error(402, 'Upgrade to export questionnaire answers.');
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

	// Build a safe filename
	const safeFilename = questionnaire.filename
		.replace(/[^a-zA-Z0-9._-]/g, '_')
		.replace(/\.[^.]+$/, '');
	const dateStr = new Date().toISOString().slice(0, 10);
	const exportFilename = `questionnaire-answers-${safeFilename}-${dateStr}.csv`;

	logActivity({
		organizationId: orgId,
		userId,
		userName: locals.session!.user.name ?? locals.session!.user.email,
		action: 'questionnaire.export',
		entityType: 'questionnaire',
		entityId: id,
		entityName: questionnaire.filename,
		details: `${questions.length} questions exported`
	}).catch(console.error);

	return new Response(csvContent, {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${exportFilename}"`,
			'Cache-Control': 'no-store'
		}
	});
};
