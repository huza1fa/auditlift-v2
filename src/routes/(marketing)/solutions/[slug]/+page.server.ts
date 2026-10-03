import { error } from '@sveltejs/kit';
import { solutions } from '$lib/data/marketing';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const solution = solutions.find(({ slug }) => slug === params.slug);
	if (!solution) error(404, 'Solution not found');
	return { solution };
};
