// @ts-nocheck
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { frameworks } from '$lib/server/db/schema';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (!locals.session) redirect(302, '/login');
	if (locals.organization?.onboardingComplete) redirect(302, '/dashboard');

	const allFrameworks = await db
		.select({
			id: frameworks.id,
			slug: frameworks.slug,
			name: frameworks.name,
			description: frameworks.description,
			recommended: frameworks.recommended
		})
		.from(frameworks);

	return { frameworks: allFrameworks };
};
