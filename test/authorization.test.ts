import { describe, expect, it } from 'vitest';

import {
	canChangeRole,
	canDeleteOrganization,
	canInvite,
	canManageRoles,
	canRemoveMembers,
	hasMinimumRole
} from '../src/lib/server/authorization';

describe('organization authorization helpers', () => {
	it('enforces the complete role hierarchy', () => {
		expect(hasMinimumRole('owner', 'owner')).toBe(true);
		expect(hasMinimumRole('owner', 'admin')).toBe(true);
		expect(hasMinimumRole('admin', 'member')).toBe(true);
		expect(hasMinimumRole('member', 'viewer')).toBe(true);
		expect(hasMinimumRole('viewer', 'member')).toBe(false);
		expect(hasMinimumRole('member', 'admin')).toBe(false);
		expect(hasMinimumRole('admin', 'owner')).toBe(false);
	});

	it('limits member management and organization deletion to privileged roles', () => {
		for (const role of ['owner', 'admin'] as const) {
			expect(canInvite(role)).toBe(true);
			expect(canManageRoles(role)).toBe(true);
			expect(canRemoveMembers(role)).toBe(true);
		}

		for (const role of ['member', 'viewer'] as const) {
			expect(canInvite(role)).toBe(false);
			expect(canManageRoles(role)).toBe(false);
			expect(canRemoveMembers(role)).toBe(false);
		}

		expect(canDeleteOrganization('owner')).toBe(true);
		expect(canDeleteOrganization('admin')).toBe(false);
		expect(canDeleteOrganization('member')).toBe(false);
		expect(canDeleteOrganization('viewer')).toBe(false);
	});

	it('prevents self-demotion and owner promotion by non-owners', () => {
		expect(canChangeRole('owner', 'admin', 'user-1', 'user-1')).toBe(false);
		expect(canChangeRole('admin', 'owner', 'user-2', 'user-1')).toBe(false);
		expect(canChangeRole('member', 'viewer', 'user-2', 'user-1')).toBe(false);
		expect(canChangeRole('admin', 'member', 'user-2', 'user-1')).toBe(true);
		expect(canChangeRole('owner', 'owner', 'user-2', 'user-1')).toBe(true);
	});
});
