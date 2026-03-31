import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { policies } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const policyId = params.id;
	if (!policyId) {
		throw error(400, 'Missing policy ID');
	}

	const body = await request.json();
	const { content, title } = body as { content?: string; title?: string };

	if (!content && !title) {
		throw error(400, 'Nothing to update');
	}

	const [existing] = await db
		.select()
		.from(policies)
		.where(and(eq(policies.id, policyId), eq(policies.organizationId, locals.organizationId)))
		.limit(1);

	if (!existing) {
		throw error(404, 'Policy not found');
	}

	const updates: Record<string, unknown> = {
		updatedAt: new Date(),
		editedAt: new Date()
	};

	if (content !== undefined) updates.content = content;
	if (title !== undefined) updates.title = title;

	const [updated] = await db
		.update(policies)
		.set(updates)
		.where(eq(policies.id, policyId))
		.returning();

	return json({ policy: updated });
};
