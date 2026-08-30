import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { deals } from '$lib/server/db/schema';
import { requireActiveOrganizationRole } from '$lib/server/auth-utils';
import { logActivity } from '$lib/server/activity';

const UpdateDealSchema = z.object({
	status: z.enum(['active', 'submitted', 'won', 'lost', 'archived']).optional(),
	deadlineAt: z.string().datetime().nullable().optional(),
	notes: z.string().trim().max(4000).nullable().optional()
});

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const { organizationId, userId, userEmail } = await requireActiveOrganizationRole(locals);
	const parsed = UpdateDealSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success || Object.keys(parsed.data).length === 0)
		throw error(400, 'Invalid deal update.');
	const updates: {
		status?: 'active' | 'submitted' | 'won' | 'lost' | 'archived';
		deadlineAt?: Date | null;
		notes?: string | null;
		updatedAt: Date;
	} = { updatedAt: new Date() };
	if (parsed.data.status !== undefined) updates.status = parsed.data.status;
	if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;
	if (parsed.data.deadlineAt !== undefined)
		updates.deadlineAt = parsed.data.deadlineAt ? new Date(parsed.data.deadlineAt) : null;
	const [deal] = await db
		.update(deals)
		.set(updates)
		.where(and(eq(deals.id, params.id), eq(deals.organizationId, organizationId)))
		.returning();
	if (!deal) throw error(404, 'Deal not found.');
	await logActivity({
		organizationId,
		userId,
		userName: locals.session!.user.name ?? userEmail,
		action: 'deal.update',
		entityType: 'deal',
		entityId: deal.id,
		entityName: deal.name,
		details: parsed.data.status ? `Status changed to ${parsed.data.status}` : 'Deal updated'
	});
	return json({ deal });
};
