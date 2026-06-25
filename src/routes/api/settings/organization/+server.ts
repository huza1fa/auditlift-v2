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
	subscriptions,
	questionnaires,
	questionnaireQuestions,
	consultingRequests
} from '$lib/server/db/schema';
import { user } from '$lib/server/db/auth.schema';
import { eq, and } from 'drizzle-orm';
import { requireOrgDeletionPermission } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';
import { deleteFilesByPrefix } from '$lib/server/storage';

export const DELETE: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;
	const userId = locals.session.user.id;

	// Get user's role
	const [membership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(and(eq(userOrganizations.organizationId, orgId), eq(userOrganizations.userId, userId)))
		.limit(1);

	if (!membership) {
		throw error(403, 'You are not a member of this organization');
	}

	requireOrgDeletionPermission(membership.role as UserRole);

	try {
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
			await tx
				.delete(questionnaireQuestions)
				.where(eq(questionnaireQuestions.organizationId, orgId));
			await tx.delete(questionnaires).where(eq(questionnaires.organizationId, orgId));
			await tx.delete(userOrganizations).where(eq(userOrganizations.organizationId, orgId));
			await tx.delete(consultingRequests).where(eq(consultingRequests.organizationId, orgId));
			// Organization row must be last — all FK children are deleted above
			await tx.delete(organizations).where(eq(organizations.id, orgId));
		});
	} catch (err) {
		console.error('[org-delete] Database transaction failed:', err);
		throw error(500, 'Failed to delete organization due to a database error. Please try again or contact support.');
	}

	// Best-effort cleanup of S3 files owned by this org
	try {
		await deleteFilesByPrefix(`${orgId}/`);
		await deleteFilesByPrefix(`questionnaires/${orgId}/`);
	} catch (err) {
		console.error(`[org-delete] Failed to clean up S3 files for org ${orgId}:`, err);
	}

	// Delete the owner's user account — sessions/accounts cascade automatically via FK
	try {
		await db.delete(user).where(eq(user.id, userId));
	} catch (err) {
		console.error('[org-delete] Failed to delete user account:', err);
		// Don't throw here — the org is already deleted, user can be cleaned up later
	}

	return json({ success: true });
};
