import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { extractDomainFromEmail } from '$lib/server/auth-utils';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session) {
		throw error(401, 'Unauthorized');
	}

	const email = locals.session.user.email;
	const domain = extractDomainFromEmail(email);

	if (!domain) {
		return json({
			hasExistingOrg: false,
			domain: null,
			message: 'Personal email domain - you can create a new organization'
		});
	}

	// Check if org exists with this domain
	const [existingOrg] = await db
		.select({
			id: organizations.id,
			name: organizations.name,
			domain: organizations.domain
		})
		.from(organizations)
		.where(eq(organizations.domain, domain))
		.limit(1);

	if (!existingOrg) {
		return json({
			hasExistingOrg: false,
			domain,
			message: 'No organization found with this domain'
		});
	}

	// Check if user is already a member
	const [existingMembership] = await db
		.select()
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, existingOrg.id),
				eq(userOrganizations.userId, locals.session.user.id)
			)
		)
		.limit(1);

	if (existingMembership) {
		return json({
			hasExistingOrg: true,
			isMember: true,
			domain,
			organization: {
				id: existingOrg.id,
				name: existingOrg.name
			},
			message: 'You are already a member of this organization'
		});
	}

	return json({
		hasExistingOrg: true,
		isMember: false,
		domain,
		organization: {
			id: existingOrg.id,
			name: existingOrg.name
		},
		message: 'An organization with this domain already exists. You need an invitation to join.'
	});
};
