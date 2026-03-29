import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userOrganizations, organizationInvitations, organizations } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		redirect(302, '/login');
	}

	const orgId = locals.organizationId;

	// Get organization
	const [org] = await db
		.select({
			id: organizations.id,
			name: organizations.name,
			domain: organizations.domain
		})
		.from(organizations)
		.where(eq(organizations.id, orgId))
		.limit(1);

	// Get current user's role
	const [currentMembership] = await db
		.select({
			role: userOrganizations.role,
			userId: userOrganizations.userId
		})
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, orgId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	// Get all members
	const members = await db
		.select({
			id: userOrganizations.id,
			userId: userOrganizations.userId,
			role: userOrganizations.role,
			createdAt: userOrganizations.createdAt
		})
		.from(userOrganizations)
		.where(eq(userOrganizations.organizationId, orgId));

	// Get pending invitations
	const pendingInvites = await db
		.select({
			id: organizationInvitations.id,
			email: organizationInvitations.email,
			role: organizationInvitations.role,
			expiresAt: organizationInvitations.expiresAt,
			createdAt: organizationInvitations.createdAt
		})
		.from(organizationInvitations)
		.where(
			and(
				eq(organizationInvitations.organizationId, orgId),
				eq(organizationInvitations.status, 'pending')
			)
		);

	return {
		organization: org,
		currentUser: {
			id: locals.session.user.id,
			name: locals.session.user.name,
			email: locals.session.user.email,
			image: locals.session.user.image,
			role: currentMembership?.role || 'member'
		},
		members: members.map((m) => ({
			...m,
			isCurrentUser: m.userId === locals.session?.user.id
		})),
		pendingInvites
	};
};
