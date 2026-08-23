import { json, error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizationInvitations, userOrganizations, organizations } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { logActivity } from '$lib/server/activity';

export const GET: RequestHandler = async ({ params, locals }) => {
	const token = params.token;

	if (!token) {
		throw error(400, 'Token is required');
	}

	const [invitation] = await db
		.select()
		.from(organizationInvitations)
		.where(eq(organizationInvitations.token, token))
		.limit(1);

	if (!invitation) {
		throw error(404, 'Invitation not found');
	}

	if (invitation.status !== 'pending') {
		throw error(400, 'This invitation has already been processed');
	}

	if (new Date() > invitation.expiresAt) {
		throw error(400, 'This invitation has expired');
	}

	// Get organization details
	const [org] = await db
		.select({
			id: organizations.id,
			name: organizations.name
		})
		.from(organizations)
		.where(eq(organizations.id, invitation.organizationId))
		.limit(1);

	if (!org) {
		throw error(404, 'Organization not found');
	}

	// Check if user is already logged in and is the invited user
	const isLoggedIn = locals.session && locals.session.user.email === invitation.email;

	return json({
		invitation: {
			id: invitation.id,
			email: invitation.email,
			role: invitation.role,
			expiresAt: invitation.expiresAt
		},
		organization: {
			id: org.id,
			name: org.name
		},
		isLoggedIn,
		matchingEmail: locals.session?.user.email === invitation.email
	});
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const token = params.token;

	if (!token) {
		throw error(400, 'Token is required');
	}

	// Must be logged in to accept
	if (!locals.session) {
		throw error(401, 'You must be logged in to respond to this invitation');
	}

	const body = await request.json();
	const { action } = body;

	if (!action || !['accept', 'decline'].includes(action)) {
		throw error(400, 'Action must be accept or decline');
	}

	const [invitation] = await db
		.select()
		.from(organizationInvitations)
		.where(eq(organizationInvitations.token, token))
		.limit(1);

	if (!invitation) {
		throw error(404, 'Invitation not found');
	}

	if (invitation.status !== 'pending') {
		throw error(400, 'This invitation has already been processed');
	}

	if (new Date() > invitation.expiresAt) {
		throw error(400, 'This invitation has expired');
	}

	// Verify email matches
	if (locals.session.user.email !== invitation.email) {
		throw error(403, 'This invitation was sent to a different email address');
	}

	// Require a verified email so someone cannot claim an address they don't own
	if (!locals.session.user.emailVerified) {
		throw error(
			403,
			'Verify your email address before accepting this invitation. Check your inbox for a verification link, or sign in with a social provider.'
		);
	}

	if (action === 'decline') {
		await db
			.update(organizationInvitations)
			.set({ status: 'declined' })
			.where(eq(organizationInvitations.id, invitation.id));

		return json({ success: true, message: 'Invitation declined' });
	}

	// Accept - add user to organization
	const [existingMembership] = await db
		.select()
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, invitation.organizationId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	if (existingMembership) {
		throw error(400, 'You are already a member of this organization');
	}

	await db.insert(userOrganizations).values({
		userId: locals.session.user.id,
		organizationId: invitation.organizationId,
		role: invitation.role
	});

	await db
		.update(organizationInvitations)
		.set({ status: 'accepted' })
		.where(eq(organizationInvitations.id, invitation.id));

	await logActivity({
		organizationId: invitation.organizationId,
		userId: locals.session.user.id,
		userName: locals.session.user.name ?? locals.session.user.email,
		action: 'team.joined',
		entityType: 'user',
		entityId: locals.session.user.id,
		entityName: locals.session.user.email,
		details: `role: ${invitation.role}, invited by ${invitation.invitedBy}`
	});

	return json({
		success: true,
		message: 'You have joined the organization',
		organizationId: invitation.organizationId
	});
};
