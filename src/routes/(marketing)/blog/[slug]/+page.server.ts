import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostBySlug } from '$lib/data/blog';

export const load: PageServerLoad = async ({ params }) => {
	const post = getPostBySlug(params.slug);
	if (!post) {
		error(404, 'Post not found');
	}
	return { post };
};
