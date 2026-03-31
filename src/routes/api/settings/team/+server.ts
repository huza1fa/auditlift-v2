import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userOrganizations, organizationInvitations, organizations } from '$lib/server/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { requireInvitePermission, canInvite } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';
import { sendInviteEmail } from '$lib/server/email';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;

	// Get team members
	const members = await db
		.select({
			id: userOrganizations.id,
			userId: userOrganizations.userId,
			role: userOrganizations.role,
			createdAt: userOrganizations.createdAt,
			name: locals.session.user.name,
			email: locals.session.user.email,
			image: locals.session.user.image
		})
		.from(userOrganizations)
		.where(eq(userOrganizations.organizationId, orgId));

	// Get pending invitations
	const pendingInvites = await db
		.select({
			id: organizationInvitations.id,
			email: organizationInvitations.email,
			role: organizationInvitations.role,
			status: organizationInvitations.status,
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

	return json({
		members: members.map((m) => ({
			...m,
			isCurrentUser: m.userId === locals.session?.user.id
		})),
		pendingInvites
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;

	// Get user's role
	const [userMembership] = await db
		.select({ role: userOrganizations.role })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, orgId),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	if (!userMembership) {
		throw error(403, 'You are not a member of this organization');
	}

	requireInvitePermission(userMembership.role as UserRole);

	const body = await request.json();
	const { email, role = 'member' } = body;

	if (!email) {
		throw error(400, 'Email is required');
	}

	// Validate role - can't invite as owner
	if (role === 'owner') {
		throw error(400, 'Cannot invite someone as owner');
	}

	// Check if user is already a member
	const [existingMember] = await db
		.select()
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, orgId),
				eq(userOrganizations.userId, email) // Note: this might need userId lookup
			)
		)
		.limit(1);

	if (existingMember) {
		throw error(400, 'User is already a member of this organization');
	}

	// Check for existing pending invitation
	const [existingInvite] = await db
		.select()
		.from(organizationInvitations)
		.where(
			and(
				eq(organizationInvitations.organizationId, orgId),
				eq(organizationInvitations.email, email),
				eq(organizationInvitations.status, 'pending')
			)
		)
		.limit(1);

	if (existingInvite) {
		throw error(400, 'An invitation has already been sent to this email');
	}

	// Generate invite token
	const token = crypto.randomUUID();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

	const [invitation] = await db
		.insert(organizationInvitations)
		.values({
			organizationId: orgId,
			email,
			role: role as UserRole,
			token,
			invitedBy: locals.session.user.id,
			expiresAt
		})
		.returning();

	const origin = process.env.ORIGIN || 'http://localhost:5173';
	const inviteLink = `${origin}/invite/${token}`;

	const inviterName = locals.session?.user?.name ?? locals.session?.user?.email ?? 'A team member';

	sendInviteEmail({
		to: email,
		inviterName,
		organizationName: locals.organization?.name ?? 'your organization',
		inviteLink,
		role: role as string,
		expiresAt: invitation.expiresAt
	}).catch(console.error);

	return json({
		invitation: {
			id: invitation.id,
			email: invitation.email,
			role: invitation.role,
			expiresAt: invitation.expiresAt
		},
		inviteLink
	});
};
