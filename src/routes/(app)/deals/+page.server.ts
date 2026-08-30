import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { deals, questionnaires } from '$lib/server/db/schema';
import { isReadOnly } from '$lib/server/billing';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) redirect(302, '/login');

	const dealRows = await db
		.select()
		.from(deals)
		.where(eq(deals.organizationId, locals.organizationId))
		.orderBy(desc(deals.updatedAt));
	const questionnaireRows = await db
		.select({ dealId: questionnaires.dealId, status: questionnaires.status })
		.from(questionnaires)
		.where(and(eq(questionnaires.organizationId, locals.organizationId)));
	const counts = new Map<string, { questionnaires: number; ready: number }>();
	for (const questionnaire of questionnaireRows) {
		if (!questionnaire.dealId) continue;
		const count = counts.get(questionnaire.dealId) ?? { questionnaires: 0, ready: 0 };
		count.questionnaires++;
		if (questionnaire.status === 'ready') count.ready++;
		counts.set(questionnaire.dealId, count);
	}

	return {
		deals: dealRows.map((deal) => ({
			...deal,
			...(counts.get(deal.id) ?? { questionnaires: 0, ready: 0 })
		})),
		canEdit: !isReadOnly(locals.subscription, locals.organization?.trialEndsAt ?? null)
	};
};
