import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userOrganizations } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { canRemoveMembers, canChangeRole, requireMinimumRole } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;
	const targetUserId = params.userId;

	if (!targetUserId) {
		throw error(400, 'User ID is required');
	}

	// Get current user's role
	const [currentUserMembership] = await db
		.select({ role: userOrganizations.role, userId: userOrganizations.userId })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, orgId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	if (!currentUserMembership) {
		throw error(403, 'You are not a member of this organization');
	}

	// Get target user's role
	const [targetUserMembership] = await db
		.select({ role: userOrganizations.role, userId: userOrganizations.userId })
		.from(userOrganizations)
		.where(
			and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
		)
		.limit(1);

	if (!targetUserMembership) {
		throw error(404, 'User not found in this organization');
	}

	const targetRole = targetUserMembership.role as UserRole;
	const currentRole = currentUserMembership.role as UserRole;

	// Check permission
	if (!canChangeRole(currentRole, targetRole, targetUserId, locals.session.user.id)) {
		throw error(403, "You do not have permission to change this user's role");
	}

	const body = await request.json();
	const { role } = body;

	if (!role || !['admin', 'member', 'viewer'].includes(role)) {
		throw error(400, 'Invalid role. Must be admin, member, or viewer');
	}

	// Can't change owner's role
	if (targetRole === 'owner') {
		throw error(403, "Cannot change the owner's role");
	}

	await db
		.update(userOrganizations)
		.set({ role: role as UserRole, updatedAt: new Date() })
		.where(
			and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
		);

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;
	const targetUserId = params.userId;

	if (!targetUserId) {
		throw error(400, 'User ID is required');
	}

	// Can't remove yourself
	if (targetUserId === locals.session.user.id) {
		throw error(400, 'You cannot remove yourself. Transfer ownership first.');
	}

	// Get current user's role
	const [currentUserMembership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, orgId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	if (!currentUserMembership) {
		throw error(403, 'You are not a member of this organization');
	}

	requireMinimumRole(currentUserMembership.role as UserRole, 'admin');

	// Get target user's role
	const [targetUserMembership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(
			and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
		)
		.limit(1);

	if (!targetUserMembership) {
		throw error(404, 'User not found in this organization');
	}

	// Can't remove owner
	if (targetUserMembership.role === 'owner') {
		throw error(403, 'Cannot remove the owner');
	}

	await db
		.delete(userOrganizations)
		.where(
			and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, targetUserId))
		);

	return json({ success: true });
};
