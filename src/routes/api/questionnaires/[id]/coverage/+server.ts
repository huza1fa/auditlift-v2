import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	controls,
	frameworks,
	organizationFrameworks,
	questionnaires,
	questionnaireQuestions
} from '$lib/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: RequestHandler = async ({ locals, params }) => {
	const { organizationId: orgId } = await requireOrganizationRole(locals);
	const questionnaireId = params.id;

	const [questionnaire] = await db
		.select({ id: questionnaires.id })
		.from(questionnaires)
		.where(and(eq(questionnaires.id, questionnaireId), eq(questionnaires.organizationId, orgId)))
		.limit(1);
	if (!questionnaire) throw error(404, 'Questionnaire not found');

	const questions = await db
		.select({ mappedControlIds: questionnaireQuestions.mappedControlIds })
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.questionnaireId, questionnaireId),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		);
	const mappedControlIds = [
		...new Set(
			questions
				.flatMap((question) => (question.mappedControlIds as string[]) ?? [])
				.filter((controlId) => UUID_RE.test(controlId))
		)
	];

	if (mappedControlIds.length === 0) return json({ coverageByFramework: [] });

	const [mappedControls, enrolledFrameworkRows] = await Promise.all([
		db
			.select({
				id: controls.id,
				frameworkId: controls.frameworkId,
				code: controls.code,
				title: controls.title,
				category: controls.category,
				frameworkName: frameworks.name,
				frameworkSlug: frameworks.slug
			})
			.from(controls)
			.innerJoin(frameworks, eq(controls.frameworkId, frameworks.id))
			.where(inArray(controls.id, mappedControlIds)),
		db
			.select({ frameworkId: organizationFrameworks.frameworkId })
			.from(organizationFrameworks)
			.where(eq(organizationFrameworks.organizationId, orgId))
	]);

	const enrolledFrameworkIds = new Set(enrolledFrameworkRows.map((row) => row.frameworkId));
	if (mappedControls.length === 0) return json({ coverageByFramework: [] });

	const frameworkIds = [...new Set(mappedControls.map((control) => control.frameworkId))];
	const frameworkControlCounts = await db
		.select({ frameworkId: controls.frameworkId })
		.from(controls)
		.where(inArray(controls.frameworkId, frameworkIds));
	const totalControlsByFramework = new Map<string, number>();
	for (const control of frameworkControlCounts) {
		totalControlsByFramework.set(
			control.frameworkId,
			(totalControlsByFramework.get(control.frameworkId) ?? 0) + 1
		);
	}

	const coverageByFramework = new Map<
		string,
		{
			frameworkId: string;
			frameworkName: string;
			frameworkSlug: string;
			controlsCovered: number;
			totalControls: number;
			coveragePct: number;
			coveredControls: Array<{ id: string; code: string; title: string; category: string }>;
			orgHasFramework: boolean;
		}
	>();
	for (const control of mappedControls) {
		let coverage = coverageByFramework.get(control.frameworkId);
		if (!coverage) {
			const totalControls = totalControlsByFramework.get(control.frameworkId) ?? 0;
			coverage = {
				frameworkId: control.frameworkId,
				frameworkName: control.frameworkName,
				frameworkSlug: control.frameworkSlug,
				controlsCovered: 0,
				totalControls,
				coveragePct: 0,
				coveredControls: [],
				orgHasFramework: enrolledFrameworkIds.has(control.frameworkId)
			};
			coverageByFramework.set(control.frameworkId, coverage);
		}
		coverage.coveredControls.push({
			id: control.id,
			code: control.code,
			title: control.title,
			category: control.category
		});
	}

	const result = [...coverageByFramework.values()]
		.map((coverage) => ({
			...coverage,
			controlsCovered: coverage.coveredControls.length,
			coveragePct: coverage.totalControls
				? Math.round((coverage.coveredControls.length / coverage.totalControls) * 100)
				: 0,
			coveredControls: coverage.coveredControls.sort((a, b) => a.code.localeCompare(b.code))
		}))
		.sort((a, b) => a.frameworkName.localeCompare(b.frameworkName));

	return json({ coverageByFramework: result });
};
