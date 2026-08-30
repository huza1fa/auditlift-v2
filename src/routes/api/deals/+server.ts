import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { deals, userOrganizations } from '$lib/server/db/schema';
import { requireActiveOrganizationRole, requireOrganizationRole } from '$lib/server/auth-utils';
import { logActivity } from '$lib/server/activity';

const CreateDealSchema = z.object({
	customerName: z.string().trim().min(1).max(160),
	name: z.string().trim().min(1).max(200),
	deadlineAt: z.string().datetime().nullable().optional(),
	ownerId: z.string().min(1).nullable().optional(),
	notes: z.string().trim().max(4000).nullable().optional()
});

async function assertMember(organizationId: string, userId: string | null | undefined) {
	if (!userId) return null;
	const [member] = await db
		.select({ userId: userOrganizations.userId })
		.from(userOrganizations)
		.where(
			and(
				eq(userOrganizations.organizationId, organizationId),
				eq(userOrganizations.userId, userId)
			)
		)
		.limit(1);
	if (!member) throw error(400, 'The selected owner is not a member of this organization.');
	return userId;
}

export const GET: RequestHandler = async ({ locals }) => {
	const { organizationId } = await requireOrganizationRole(locals);
	const rows = await db
		.select()
		.from(deals)
		.where(eq(deals.organizationId, organizationId))
		.orderBy(desc(deals.updatedAt));
	return json({ deals: rows });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { organizationId, userId, userEmail } = await requireActiveOrganizationRole(
		locals,
		'member',
		'Viewers cannot create deals',
		'Trial expired. Upgrade to create deals.'
	);
	const body = await request.json().catch(() => null);
	const parsed = CreateDealSchema.safeParse(body);
	if (!parsed.success) throw error(400, 'Enter a customer and a clear deal name.');
	const ownerId = await assertMember(organizationId, parsed.data.ownerId);
	const [deal] = await db
		.insert(deals)
		.values({
			organizationId,
			customerName: parsed.data.customerName,
			name: parsed.data.name,
			deadlineAt: parsed.data.deadlineAt ? new Date(parsed.data.deadlineAt) : null,
			ownerId,
			notes: parsed.data.notes ?? null
		})
		.returning();
	await logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name ?? userEmail,
		action: 'deal.create',
		entityType: 'deal',
		entityId: deal.id,
		entityName: deal.name,
		details: `Security review opened for ${deal.customerName}`
	});
	return json({ deal }, { status: 201 });
};
