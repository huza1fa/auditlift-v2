import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	organizations,
	userOrganizations,
	organizationInvitations,
	evidence,
	policies,
	organizationFrameworks,
	readinessScores,
	subscriptions
} from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireOrgDeletionPermission } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';

export const DELETE: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;

	// Get user's role
	const [membership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, orgId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	if (!membership) {
		throw error(403, 'You are not a member of this organization');
	}

	requireOrgDeletionPermission(membership.role as UserRole);

	// Delete all organization data in correct order (respecting foreign keys)
	await db.delete(organizationInvitations).where(eq(organizationInvitations.organizationId, orgId));
	await db.delete(evidence).where(eq(evidence.organizationId, orgId));
	await db.delete(policies).where(eq(policies.organizationId, orgId));
	await db.delete(readinessScores).where(eq(readinessScores.organizationId, orgId));
	await db.delete(organizationFrameworks).where(eq(organizationFrameworks.organizationId, orgId));
	await db.delete(subscriptions).where(eq(subscriptions.organizationId, orgId));
	await db.delete(userOrganizations).where(eq(userOrganizations.organizationId, orgId));
	await db.delete(organizations).where(eq(organizations.id, orgId));

	return json({ success: true });
};
