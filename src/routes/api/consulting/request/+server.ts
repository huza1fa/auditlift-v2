import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { consultingRequests } from '$lib/server/db/schema';
import { captureServerEvent } from '$lib/server/posthog';
import { checkRateLimit } from '$lib/server/rate-limit';
import { sendConsultingRequestNotification, sendConsultingConfirmation } from '$lib/server/email';

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
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

	// Rate limit: 3 submissions per IP per hour
	const ip = getClientAddress();
	if (!checkRateLimit(`consulting:${ip}`, 3, 60 * 60 * 1000)) {
		throw error(429, 'Too many requests. Please try again later.');
	}

	// Optionally link to org if user is logged in
	const organizationId = locals.organizationId ?? null;
	const normalizedEmail = email.trim().toLowerCase();

	await db.insert(consultingRequests).values({
		organizationId,
		name: name.trim(),
		email: normalizedEmail,
		company: company?.trim() || null,
		topic,
		message: message?.trim() || null
	});

	const userId = locals.session?.user?.id ?? normalizedEmail;
	captureServerEvent({
		event: 'consulting_requested',
		distinctId: userId,
		properties: {
			name: name.trim(),
			email: normalizedEmail,
			company: company?.trim() || null,
			topic,
			org_id: organizationId,
			is_logged_in: !!locals.session
		},
		groups: organizationId ? { organization: organizationId } : undefined
	});

	// Notify advisory team and confirm to requester (fire-and-forget)
	sendConsultingRequestNotification({
		name: name.trim(),
		email: normalizedEmail,
		company: company?.trim() || null,
		topic,
		message: message?.trim() || null,
		organizationId,
		isLoggedIn: !!locals.session
	}).catch((err) => console.error('[consulting] Advisory notification failed:', err));

	sendConsultingConfirmation({
		to: normalizedEmail,
		name: name.trim(),
		topic
	}).catch((err) => console.error('[consulting] Confirmation email failed:', err));

	return json({ success: true });
};
