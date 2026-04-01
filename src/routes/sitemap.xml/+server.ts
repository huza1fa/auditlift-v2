import type { RequestHandler } from './$types';

const DOMAIN = 'https://auditlift.app';

const pages = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/pricing', priority: '0.8', changefreq: 'monthly' },
	{ path: '/privacy', priority: '0.3', changefreq: 'yearly' }
];

export const GET: RequestHandler = async () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `  <url>
    <loc>${DOMAIN}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
