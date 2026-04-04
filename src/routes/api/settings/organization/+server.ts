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
	readinessSnapshots,
	activityLogs,
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

	// Delete all organization data in a single transaction to prevent partial deletes
	await db.transaction(async (tx) => {
		await tx.delete(activityLogs).where(eq(activityLogs.organizationId, orgId));
		await tx
			.delete(organizationInvitations)
			.where(eq(organizationInvitations.organizationId, orgId));
		await tx.delete(evidence).where(eq(evidence.organizationId, orgId));
		await tx.delete(policies).where(eq(policies.organizationId, orgId));
		await tx.delete(readinessSnapshots).where(eq(readinessSnapshots.organizationId, orgId));
		await tx.delete(readinessScores).where(eq(readinessScores.organizationId, orgId));
		await tx.delete(organizationFrameworks).where(eq(organizationFrameworks.organizationId, orgId));
		await tx.delete(subscriptions).where(eq(subscriptions.organizationId, orgId));
		await tx.delete(userOrganizations).where(eq(userOrganizations.organizationId, orgId));
		// Organization row must be last — all FK children are deleted above
		await tx.delete(organizations).where(eq(organizations.id, orgId));
	});

	return json({ success: true });
};
