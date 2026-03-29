import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations, userOrganizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { extractDomainFromEmail } from '$lib/server/auth-utils';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session) throw error(401, 'Unauthorized');

	const { name, website, industry } = await request.json();
	if (!name?.trim()) throw error(400, 'Company name required');

	// Check if user already has an org
	const [existingUserOrg] = await db
		.select()
		.from(userOrganizations)
		.where(eq(userOrganizations.userId, locals.session.user.id))
		.limit(1);

	if (existingUserOrg) {
		// Update existing org
		await db
			.update(organizations)
			.set({ name: name.trim(), website: website?.trim() || null, industry: industry || null })
			.where(eq(organizations.id, existingUserOrg.organizationId));
		return json({ organizationId: existingUserOrg.organizationId });
	}

	// Extract domain from email
	const email = locals.session.user.email || '';
	const domain = extractDomainFromEmail(email);

	// Create slug from name
	const slug =
		name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') +
		'-' +
		Date.now().toString(36);

	const trialEndsAt = new Date();
	trialEndsAt.setDate(trialEndsAt.getDate() + 10);

	const [org] = await db
		.insert(organizations)
		.values({
			name: name.trim(),
			slug,
			domain, // Store domain if available (personal emails return null)
			website: website?.trim() || null,
			industry: industry || null,
			trialEndsAt,
			onboardingComplete: false
		})
		.returning();

	// First user is always the owner
	await db.insert(userOrganizations).values({
		userId: locals.session.user.id,
		organizationId: org.id,
		role: 'owner'
	});

	// Create trial subscription record
	const { subscriptions } = await import('$lib/server/db/schema');
	await db.insert(subscriptions).values({
		organizationId: org.id,
		status: 'trialing',
		currentPeriodEnd: trialEndsAt
	});

	return json({ organizationId: org.id });
};
