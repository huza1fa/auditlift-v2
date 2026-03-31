import { error } from '@sveltejs/kit';
import type { UserRole } from './db/schema';

const ROLE_HIERARCHY: Record<UserRole, number> = {
	owner: 4,
	admin: 3,
	member: 2,
	viewer: 1
};

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
