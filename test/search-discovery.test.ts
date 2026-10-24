import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { blogPosts } from '../src/lib/data/blog';
import { productFAQs, solutions } from '../src/lib/data/marketing';
import { canonicalUrl, faqSchema, serializeJsonLd, softwareSchema } from '../src/lib/seo';
import {
	isPrivateSearchPath,
	llmsText,
	publicSearchPages,
	sitemapXml
} from '../src/lib/search-discovery';

describe('public search discovery', () => {
	it('includes every guide and solution, but no noindex or private pages', () => {
		const paths = publicSearchPages().map(({ path }) => path);
		expect(new Set(paths).size).toBe(paths.length);
		for (const post of blogPosts) expect(paths).toContain(`/blog/${post.slug}`);
		for (const solution of solutions) expect(paths).toContain(`/solutions/${solution.slug}`);
		expect(paths).toContain('/blog');
		expect(paths).toContain('/pricing');
		expect(paths).not.toContain('/privacy');
		expect(paths).not.toContain('/terms');
		expect(paths.some(isPrivateSearchPath)).toBe(false);
	});

	it('generates canonical sitemap URLs without invented modification dates', () => {
		const xml = sitemapXml();
		expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
		for (const { path } of publicSearchPages())
			expect(xml).toContain(`<loc>${canonicalUrl(path)}</loc>`);
		expect(xml).not.toContain('<lastmod>');
	});

	it('keeps the optional AI summary aligned with the public product content', () => {
		const text = llmsText();
		expect(text).toContain(productFAQs[5].answer);
		expect(text).toContain(productFAQs[4].answer);
		for (const { path } of publicSearchPages()) expect(text).toContain(canonicalUrl(path));
	});

	it('uses the exact visible answers in FAQ structured data', () => {
		const schema = faqSchema(productFAQs);
		expect(schema.mainEntity.map((item) => item.acceptedAnswer.text)).toEqual(
			productFAQs.map((item) => item.answer)
		);
	});

	it('describes subscription offers as monthly USD prices', () => {
		expect(softwareSchema.offers.map((offer) => offer.price)).toEqual(['49.00', '99.00']);
		for (const offer of softwareSchema.offers) {
			expect(offer.priceCurrency).toBe('USD');
			expect(offer.priceSpecification.unitText).toBe('month');
			expect(offer.url).toBe('https://auditlift.app/pricing');
		}
	});

	it('removes query strings, fragments, external origins, and trailing slashes from canonicals', () => {
		expect(canonicalUrl('/')).toBe('https://auditlift.app/');
		expect(canonicalUrl('/pricing/?utm_source=search#plans')).toBe('https://auditlift.app/pricing');
		expect(canonicalUrl('https://example.com/blog?tracking=1')).toBe('https://auditlift.app/blog');
	});

	it('escapes script-closing markup without changing structured data values', () => {
		const value = { text: '</script><script>alert("example")</script>' };
		const json = serializeJsonLd(value);
		expect(json).not.toContain('<');
		expect(JSON.parse(json)).toEqual(value);
	});

	it('marks private routes and token links noindex, without catching solution names', () => {
		const paths = [
			'/dashboard',
			'/activity',
			'/answer-library',
			'/deals',
			'/questionnaires/123',
			'/frameworks',
			'/share/token',
			'/invite/token',
			'/settings/team',
			'/api/auth/session',
			'/login'
		];
		const robots = readFileSync(new URL('../static/robots.txt', import.meta.url), 'utf8');
		for (const path of paths) {
			expect(isPrivateSearchPath(path)).toBe(true);
			expect(robots).toContain(`Disallow: /${path.split('/')[1]}`);
		}
		for (const { path } of publicSearchPages()) expect(isPrivateSearchPath(path)).toBe(false);
		expect(isPrivateSearchPath('/questionnaires-public')).toBe(false);
		expect(robots).toContain('Sitemap: https://auditlift.app/sitemap.xml');
		expect(robots).not.toContain('Disallow: /\n');
	});

	it('ships the social preview image referenced by marketing metadata', () => {
		const png = readFileSync(new URL('../static/og.png', import.meta.url));
		expect(png.subarray(1, 4).toString()).toBe('PNG');
		expect(png.readUInt32BE(16)).toBe(1200);
		expect(png.readUInt32BE(20)).toBe(630);
	});
});
