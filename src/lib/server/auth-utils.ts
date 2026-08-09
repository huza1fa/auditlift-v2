import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { hasActiveAccess } from './billing';
import { db } from './db';
import { userOrganizations, type UserRole } from './db/schema';

const ROLE_HIERARCHY: Record<UserRole, number> = {
	owner: 4,
	admin: 3,
	member: 2,
	viewer: 1
};

function isUserRole(role: string): role is UserRole {
	return role === 'owner' || role === 'admin' || role === 'member' || role === 'viewer';
}

/**
 * Resolves the caller's membership instead of trusting the organization selected
 * by the request hook. Use this for every organization-scoped API handler.
 */
export async function requireOrganizationRole(
	locals: App.Locals,
	minimumRole: UserRole = 'viewer',
	message: string = 'Insufficient permissions'
): Promise<{ organizationId: string; userId: string; userEmail: string; role: UserRole }> {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const organizationId = locals.organizationId;
	const userId = locals.session.user.id;
	const [membership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, organizationId),
				eq(userOrganizations.userId, userId)
			)
		)
		.limit(1);

	if (!membership || !isUserRole(membership.role)) {
		throw error(403, 'You are not a member of this organization');
	}

	if (!hasMinimumRole(membership.role, minimumRole)) {
		throw error(403, message);
	}

	return { organizationId, userId, userEmail: locals.session.user.email, role: membership.role };
}

/** Enforces both role-based write access and an active trial or subscription. */
export async function requireActiveOrganizationRole(
	locals: App.Locals,
	minimumRole: UserRole = 'member',
	roleMessage: string = 'Insufficient permissions',
	accessMessage: string = 'Trial expired. Upgrade to continue.'
): Promise<{ organizationId: string; userId: string; userEmail: string; role: UserRole }> {
	const context = await requireOrganizationRole(locals, minimumRole, roleMessage);

	if (!hasActiveAccess(locals.subscription, locals.organization?.trialEndsAt ?? null)) {
		throw error(402, accessMessage);
	}

	return context;
}

export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
	return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

export function canInvite(role: UserRole): boolean {
	return role === 'owner' || role === 'admin';
}

export function canManageRoles(role: UserRole): boolean {
	return role === 'owner' || role === 'admin';
}

export function canRemoveMembers(role: UserRole): boolean {
	return role === 'owner' || role === 'admin';
}

export function canDeleteOrganization(role: UserRole): boolean {
	return role === 'owner';
}

export function canChangeRole(
	actorRole: UserRole,
	targetRole: UserRole,
	targetUserId: string,
	actorUserId: string
): boolean {
	// Cannot change own role
	if (targetUserId === actorUserId) {
		return false;
	}

	// Only owner can change owner role
	if (targetRole === 'owner') {
		return actorRole === 'owner';
	}

	// Owner and admin can change other roles
	return actorRole === 'owner' || actorRole === 'admin';
}

export function requireMinimumRole(
	role: UserRole,
	minimumRole: UserRole,
	message: string = 'Insufficient permissions'
): void {
	if (!hasMinimumRole(role, minimumRole)) {
		throw error(403, message);
	}
}

export function requireInvitePermission(
	role: UserRole,
	message: string = 'You do not have permission to invite members'
): void {
	if (!canInvite(role)) {
		throw error(403, message);
	}
}

export function requireOrgDeletionPermission(
	role: UserRole,
	message: string = 'Only the organization owner can delete the organization'
): void {
	if (!canDeleteOrganization(role)) {
		throw error(403, message);
	}
}

export function extractDomainFromEmail(email: string): string | null {
	const parts = email.split('@');
	if (parts.length !== 2) return null;
	const domain = parts[1].toLowerCase();
	// Skip common personal email domains
	const personalDomains = [
		'gmail.com',
		'yahoo.com',
		'hotmail.com',
		'outlook.com',
		'icloud.com',
		'protonmail.com',
		'proton.me',
		'users.noreply.github.com' // GitHub private email proxy
	];
	if (personalDomains.includes(domain)) return null;
	return domain;
}
