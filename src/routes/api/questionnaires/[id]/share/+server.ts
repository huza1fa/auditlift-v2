import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { questionnaires } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { hasActivePaidAccess } from '$lib/server/billing';
import { captureServerEvent } from '$lib/server/posthog';
import { requireOrganizationRole } from '$lib/server/auth-utils';

type ShareResponse = {
	shareToken: string | null;
	sharedAt: Date | null;
};

export const POST: RequestHandler = async ({ locals, params }) => {
	const { organizationId: orgId } = await requireOrganizationRole(
		locals,
		'member',
		'Viewers cannot share questionnaires'
	);

	// 2. Billing check — sharing is a paid-only feature
	if (!hasActivePaidAccess(locals.subscription)) {
		throw error(402, 'Upgrade to enable questionnaire sharing.');
	}

	const { id } = params;

	// 3. Load the questionnaire scoped to this org
	const [questionnaire] = await db
		.select({
			id: questionnaires.id,
			status: questionnaires.status,
			shareToken: questionnaires.shareToken,
			sharedAt: questionnaires.sharedAt
		})
		.from(questionnaires)
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)))
		.limit(1);

	if (!questionnaire) {
		throw error(404, 'Questionnaire not found');
	}

	// 4. Only ready questionnaires can be shared
	if (questionnaire.status !== 'ready') {
		throw error(400, 'Questionnaire must be fully processed before sharing.');
	}

	// 5. Toggle sharing
	let shareToken: string | null;
	let sharedAt: Date | null;

	if (questionnaire.shareToken === null) {
		// Enable sharing — generate a fresh token
		shareToken = crypto.randomUUID();
		sharedAt = new Date();
	} else {
		// Disable sharing — clear both fields
		shareToken = null;
		sharedAt = null;
	}

	// 6. Persist the updated share state, scoped to org as a safety net
	await db
		.update(questionnaires)
		.set({ shareToken, sharedAt })
		.where(and(eq(questionnaires.id, id), eq(questionnaires.organizationId, orgId)));

	await captureServerEvent({
		event: 'questionnaire_share_toggled',
		properties: {
			questionnaire_id: id,
			enabled: shareToken !== null,
			org_id: orgId
		},
		groups: { organization: orgId }
	});

	const response: ShareResponse = { shareToken, sharedAt };
	return json(response);
};
