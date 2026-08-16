import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	requireActiveOrganizationRole,
	requireMinimumRole,
	requireOrganizationRole
} from '$lib/server/auth-utils';
import { checkRateLimit } from '$lib/server/rate-limit';
import { CreateOrganizationFactSchema } from '$lib/server/validation';
import { createOrganizationFact, listOrganizationFacts } from '$lib/server/organization-facts';

function isDuplicateFactError(exception: unknown): boolean {
	return (
		typeof exception === 'object' &&
		exception !== null &&
		'code' in exception &&
		exception.code === '23505'
	);
}

export const GET: RequestHandler = async ({ locals }) => {
	const { organizationId } = await requireOrganizationRole(locals, 'viewer');
	return json({ facts: await listOrganizationFacts(organizationId) });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { organizationId, userId, role } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot create organization facts'
	);

	if (!checkRateLimit(`organization-facts:write:${organizationId}:${userId}`, 30, 60 * 1000)) {
		throw error(429, 'Too many fact changes. Please wait before trying again.');
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}
	const parsed = CreateOrganizationFactSchema.safeParse(body);
	if (!parsed.success) throw error(400, 'Invalid input');

	if (parsed.data.status !== undefined) {
		requireMinimumRole(role, 'admin', 'Only admins and owners can verify organization facts');
	}

	let fact;
	try {
		fact = await createOrganizationFact({
			organizationId,
			actorUserId: userId,
			...parsed.data,
			source: 'manual'
		});
	} catch (exception) {
		if (isDuplicateFactError(exception)) {
			throw error(409, 'A fact with this category and label already exists');
		}
		throw exception;
	}

	return json({ fact }, { status: 201 });
};
