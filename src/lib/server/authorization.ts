import type { UserRole } from './db/schema';

export type { UserRole } from './db/schema';

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
	if (targetUserId === actorUserId) return false;
	if (targetRole === 'owner') return actorRole === 'owner';
	return actorRole === 'owner' || actorRole === 'admin';
}
