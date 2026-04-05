import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires, questionnaireQuestions } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { hasActiveAccess } from '$lib/server/billing';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;
	const { id } = params;

	const [questionnaire] = await db
		.select()
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) throw error(404, 'Questionnaire not found');

	await db
		.delete(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.questionnaireId, id),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		);

	await db
		.delete(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)));

	return json({ success: true });
};

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}
	const orgId = locals.organizationId;

	if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
		throw error(402, 'Trial expired. Upgrade to access questionnaires.');
	}

	const { id } = params;

	const [questionnaire] = await db
		.select()
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) {
		throw error(404, 'Questionnaire not found');
	}

	const questions = await db
		.select()
		.from(questionnaireQuestions)
		.where(
			and(
				eq(questionnaireQuestions.questionnaireId, id),
				eq(questionnaireQuestions.organizationId, orgId)
			)
		)
		.orderBy(asc(questionnaireQuestions.order));

	return json({ questionnaire, questions });
};
