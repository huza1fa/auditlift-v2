import type { RequestHandler } from './$types';
import { sitemapXml } from '$lib/search-discovery';

export const GET: RequestHandler = async () => {
	return new Response(sitemapXml(), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
};
