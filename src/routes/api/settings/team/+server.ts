import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	userOrganizations,
	organizationInvitations,
	organizations,
	user
} from '$lib/server/db/schema';
import { eq, and, or, count } from 'drizzle-orm';
import { requireInvitePermission, canInvite } from '$lib/server/auth-utils';
import type { UserRole } from '$lib/server/db/schema';
import { sendInviteEmail } from '$lib/server/email';
import { InviteTeamMemberSchema } from '$lib/server/validation';
import { hasActivePaidAccess, TRIAL_MEMBER_LIMIT } from '$lib/server/billing';
import { logActivity } from '$lib/server/activity';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const orgId = locals.organizationId;

	// Get team members with their profile data via join to auth user table
	const members = await db
		.select({
			id: userOrganizations.id,
			userId: userOrganizations.userId,
			role: userOrganizations.role,
			createdAt: userOrganizations.createdAt,
			name: user.name,
			email: user.email,
			image: user.image
		})
		.from(userOrganizations)
		.leftJoin(user, eq(userOrganizations.userId, user.id))
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

	const isPaid = hasActivePaidAccess(locals.subscription);

	return json({
		members: members.map((m) => ({
			...m,
			isCurrentUser: m.userId === locals.session?.user.id
		})),
		pendingInvites,
		memberLimit: isPaid ? null : TRIAL_MEMBER_LIMIT,
		canInviteMore: isPaid || members.length + pendingInvites.length < TRIAL_MEMBER_LIMIT
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

	// Enforce member limit on trial plans
	if (!hasActivePaidAccess(locals.subscription)) {
		const [{ value: currentMemberCount }] = await db
			.select({ value: count() })
			.from(userOrganizations)
			.where(eq(userOrganizations.organizationId, orgId));

		const [{ value: pendingInviteCount }] = await db
			.select({ value: count() })
			.from(organizationInvitations)
			.where(
				and(
					eq(organizationInvitations.organizationId, orgId),
					eq(organizationInvitations.status, 'pending')
				)
			);

		if (currentMemberCount + pendingInviteCount >= TRIAL_MEMBER_LIMIT) {
			throw error(
				403,
				`Trial plans are limited to ${TRIAL_MEMBER_LIMIT} team members. Upgrade to invite more.`
			);
		}
	}

	const result = InviteTeamMemberSchema.safeParse(await request.json());
	if (!result.success) throw error(400, 'Invalid input');
	const body = result.data;
	const { email, role } = body;

	// Check if user is already a member by first resolving the email to a userId
	const [existingUser] = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, email))
		.limit(1);

	if (existingUser) {
		const [existingMember] = await db
			.select()
			.from(userOrganizations)
			.where(
				and(
					eq(userOrganizations.organizationId, orgId),
					eq(userOrganizations.userId, existingUser.id)
				)
			)
			.limit(1);

		if (existingMember) {
			throw error(400, 'User is already a member of this organization');
		}
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

	const origin = env.ORIGIN || 'http://localhost:5173';
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

	await logActivity({
		organizationId: orgId,
		userId: locals.session.user.id,
		userName: inviterName,
		action: 'team.invited',
		entityType: 'user',
		entityId: locals.session.user.id,
		entityName: email,
		details: `role: ${role}`
	});

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
