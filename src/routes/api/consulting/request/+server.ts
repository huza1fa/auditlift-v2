import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { consultingRequests } from '$lib/server/db/schema';
import { captureServerEvent } from '$lib/server/posthog';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();

	const { name, email, company, topic, message } = body;

	if (!name || typeof name !== 'string' || name.trim().length === 0) {
		throw error(400, 'Name is required');
	}
	if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw error(400, 'A valid email is required');
	}
	if (!topic || typeof topic !== 'string') {
		throw error(400, 'Topic is required');
	}

	const allowedTopics = [
		'questionnaire-help',
		'soc2-readiness',
		'iso27001-readiness',
		'vciso-advisory',
		'general-compliance',
		'other'
	];
	if (!allowedTopics.includes(topic)) {
		throw error(400, 'Invalid topic');
	}

	// Optionally link to org if user is logged in
	const organizationId = locals.organizationId ?? null;

	await db.insert(consultingRequests).values({
		organizationId,
		name: name.trim(),
		email: email.trim().toLowerCase(),
		company: company?.trim() || null,
		topic,
		message: message?.trim() || null
	});

	const userId = locals.session?.user?.id ?? email;
	captureServerEvent({
		event: 'consulting_requested',
		distinctId: userId,
		properties: {
			name: name.trim(),
			email: email.trim().toLowerCase(),
			company: company?.trim() || null,
			topic,
			org_id: organizationId,
			is_logged_in: !!locals.session
		},
		groups: organizationId ? { organization: organizationId } : undefined
	});

	return json({ success: true });
};
