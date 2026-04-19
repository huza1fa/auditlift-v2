import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { organizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { SystemDescriptionSchema } from '$lib/server/validation';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	const [org] = await db
		.select({ systemDescription: organizations.systemDescription })
		.from(organizations)
		.where(eq(organizations.id, locals.organizationId))
		.limit(1);

	if (!org) throw error(404, 'Organization not found');

	return json({ systemDescription: org.systemDescription ?? {} });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.organizationId) {
		throw error(401, 'Unauthorized');
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}
	const result = SystemDescriptionSchema.safeParse(body);
	if (!result.success) {
		throw error(400, 'Invalid input');
	}

	await db
		.update(organizations)
		.set({
			systemDescription: result.data,
			updatedAt: new Date()
		})
		.where(eq(organizations.id, locals.organizationId));

	return json({ success: true, systemDescription: result.data });
};
