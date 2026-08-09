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
import { eq } from 'drizzle-orm';
import { requireOrganizationRole } from '$lib/server/auth-utils';
import { deleteFilesByPrefix } from '$lib/server/storage';

export const DELETE: RequestHandler = async ({ locals }) => {
	const { organizationId: orgId } = await requireOrganizationRole(
		locals,
		'owner',
		'Only the organization owner can delete the organization'
	);

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
			await tx
				.delete(organizationFrameworks)
				.where(eq(organizationFrameworks.organizationId, orgId));
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
		throw error(
			500,
			'Failed to delete organization due to a database error. Please try again or contact support.'
		);
	}

	// Best-effort cleanup of S3 files owned by this org
	try {
		await deleteFilesByPrefix(`${orgId}/`);
		await deleteFilesByPrefix(`questionnaires/${orgId}/`);
	} catch (err) {
		console.error(`[org-delete] Failed to clean up S3 files for org ${orgId}:`, err);
	}

	return json({ success: true });
};
