import { blogPosts } from './data/blog';
import { product, productFAQs, solutions } from './data/marketing';
import { canonicalUrl } from './seo';

export function publicSearchPages() {
	return [
		{ path: '/' },
		{ path: '/pricing' },
		{ path: '/blog' },
		...solutions.map(({ slug }) => ({ path: `/solutions/${slug}` })),
		...blogPosts.map(({ slug, date }) => ({ path: `/blog/${slug}`, published: date }))
	];
}

function escapeXml(value: string) {
	return value.replace(/[<>&"']/g, (character) => {
		const entities: Record<string, string> = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&quot;',
			"'": '&apos;'
		};
		return entities[character];
	});
}

export function sitemapXml() {
	// Publication dates are not modification dates. Only add lastmod when we track real edits.
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicSearchPages()
	.map(({ path }) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`)
	.join('\n')}
</urlset>`;
}

export function llmsText() {
	return `# ${product.name}

> ${product.description}

AuditLift is a web application for founders, operations leads, and small security teams at early-stage B2B SaaS companies. Its primary workflow is responding to enterprise buyer security questionnaires, not issuing audit reports or certifications.

## Product capabilities

${product.features.map((feature) => `- ${feature}`).join('\n')}

Questionnaire imports: Excel (.xlsx), CSV, PDF, and Word (.docx). AI-assisted answers and policy drafts require human review before use. Source citations help reviewers check claims; they do not independently verify that controls operate.

## Product pages

- [Home](${canonicalUrl('/')}): Product overview, features, and frequently asked questions.
- [Pricing](${canonicalUrl('/pricing')}): Current plans, billing, and trial details.
${solutions.map((solution) => `- [${solution.headline}](${canonicalUrl(`/solutions/${solution.slug}`)}): ${solution.description}`).join('\n')}

## Pricing and limitations

${productFAQs[5].answer}

${productFAQs[4].answer}

AuditLift starts with buyer reviews and reusable answers. Teams needing a formal audit program or continuous infrastructure monitoring should evaluate those requirements separately. No deal outcome, audit result, or certification is guaranteed.

## Guides

- [All guides](${canonicalUrl('/blog')})
${blogPosts.map((post) => `- [${post.title}](${canonicalUrl(`/blog/${post.slug}`)})`).join('\n')}

## Other public information

- [Privacy policy](${canonicalUrl('/privacy')})
- [Terms of service](${canonicalUrl('/terms')})
- [XML sitemap](${canonicalUrl('/sitemap.xml')})
- Contact: hello@auditlift.app

Public marketing pages are the sources for this summary. Private workspaces, questionnaire share links, account pages, and API routes are not public product documentation. See robots.txt for crawl rules.
`;
}

export function isPrivateSearchPath(path: string) {
	const privatePaths = [
		'/dashboard',
		'/activity',
		'/answer-library',
		'/deals',
		'/questionnaires',
		'/frameworks',
		'/controls',
		'/policies',
		'/evidence',
		'/export',
		'/settings',
		'/onboarding',
		'/api',
		'/login',
		'/forgot-password',
		'/reset-password',
		'/invite',
		'/share'
	];
	return privatePaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
