import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireActiveOrganizationRole, requireMinimumRole } from '$lib/server/auth-utils';
import { checkRateLimit } from '$lib/server/rate-limit';
import { UpdateOrganizationFactSchema } from '$lib/server/validation';
import { deleteOrganizationFact, updateOrganizationFact } from '$lib/server/organization-facts';

function isDuplicateFactError(exception: unknown): boolean {
	return (
		typeof exception === 'object' &&
		exception !== null &&
		'code' in exception &&
		exception.code === '23505'
	);
}

function requireFactId(id: string | undefined): string {
	if (
		!id ||
		!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
	) {
		throw error(400, 'Invalid fact ID');
	}
	return id;
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { organizationId, userId, role } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot update organization facts'
	);
	const factId = requireFactId(params.id);

	if (!(await checkRateLimit(`organization-facts:write:${organizationId}:${userId}`, 30, 60 * 1000))) {
		throw error(429, 'Too many fact changes. Please wait before trying again.');
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}
	const parsed = UpdateOrganizationFactSchema.safeParse(body);
	if (!parsed.success) throw error(400, 'Invalid input');

	if (parsed.data.status !== undefined) {
		requireMinimumRole(role, 'admin', 'Only admins and owners can change fact verification');
	}
	const changesFactContent =
		parsed.data.category !== undefined ||
		parsed.data.label !== undefined ||
		parsed.data.value !== undefined ||
		parsed.data.sourceDetail !== undefined;

	let fact;
	try {
		fact = await updateOrganizationFact({
			organizationId,
			factId,
			actorUserId: userId,
			...parsed.data,
			// A changed fact must be reviewed again unless an admin explicitly sets its status.
			...(changesFactContent && parsed.data.status === undefined ? { status: 'pending' } : {})
		});
	} catch (exception) {
		if (isDuplicateFactError(exception)) {
			throw error(409, 'A fact with this category and label already exists');
		}
		throw exception;
	}
	if (!fact) throw error(404, 'Organization fact not found');

	return json({ fact });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { organizationId, userId } = await requireActiveOrganizationRole(
		locals,
		'admin',
		'Only admins and owners can delete organization facts'
	);
	const factId = requireFactId(params.id);

	if (!(await checkRateLimit(`organization-facts:delete:${organizationId}:${userId}`, 10, 60 * 1000))) {
		throw error(429, 'Too many fact deletions. Please wait before trying again.');
	}

	const fact = await deleteOrganizationFact(organizationId, factId);
	if (!fact) throw error(404, 'Organization fact not found');

	return json({ success: true });
};
