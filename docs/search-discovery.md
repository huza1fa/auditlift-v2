# Search and AI discovery

AuditLift's public pages are server-rendered so a crawler can read product descriptions, workflow steps, FAQs, pricing, and guide content without JavaScript. Solution pages target specific needs rather than promising rankings or telling AI tools to recommend the product.

## Content sources

- `src/lib/data/marketing.ts`: product facts, visible FAQs, and solution page content.
- `src/lib/components/marketing/SEO.svelte`: canonical URLs, search metadata, social cards, and safely serialized JSON-LD.
- `src/lib/seo.ts`: organization, software, subscription offers, FAQ, and breadcrumb schemas.
- `src/lib/search-discovery.ts`: public URL inventory, sitemap, optional `llms.txt` summary, and private route indexing policy.
- `src/lib/data/blog.ts`: published guides. New guides are automatically included in the sitemap and `llms.txt`.
- `static/og.png`: 1200 × 630 social preview; regenerate with `swift scripts/generate-social-preview.swift` on macOS.

Keep prices and capabilities in sync with the actual product and billing configuration. Only publish customer stories, outcome statistics, logos, and testimonials that can be substantiated and used with permission. Do not add made-up review ratings to structured data. FAQ markup helps describe the page, but Google generally reserves FAQ rich results for authoritative government and health sites.

`llms.txt` is an optional, emerging convention. It is not a ranking signal guaranteed by Google, OpenAI, or other AI search providers. Searchable HTML, useful first-party content, normal crawl access, and external reputation remain the foundation.

## After deployment

1. Check `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/og.png`, `/blog`, and each `/solutions/...` URL return HTTP 200 anonymously.
2. View page source to confirm a single canonical, descriptive title, visible answer content, and valid JSON-LD. Check an unknown solution slug returns 404. Private app pages and `/share/...` responses should include `X-Robots-Tag: noindex, nofollow, noarchive`; robots guidance is not authorization.
3. Verify Cloudflare bot/WAF rules do not challenge legitimate search crawlers. In particular, allow verified Googlebot, Bingbot, OAI-SearchBot, and PerplexityBot to access public marketing content. Training-crawler permission is a separate policy decision; this change does not add special training-bot rules. User-agent spoofing alone is not crawler verification.
4. Verify `https://auditlift.app` in Google Search Console and Bing Webmaster Tools and submit `https://auditlift.app/sitemap.xml`. Use URL inspection to request indexing of important new pages.
5. Validate schema with Schema.org's validator and Google's Rich Results Test. Valid markup does not guarantee a rich result.
6. Build credible external mentions: accurate product profiles, real customer case studies, relevant startup/security communities, and useful independent reviews. Avoid purchased or fabricated recommendations.
7. Monitor indexed pages, relevant search queries, organic signups, and AI-search referral traffic. Record the date, provider, and prompts used for manual recommendation checks; recommendations vary and are not guaranteed.

The sitemap intentionally excludes the existing noindex legal pages, account pages, and tokenized customer shares. It does not invent `lastmod` dates from request time or article publication dates.

Run `npm test -- test/search-discovery.test.ts` (or the equivalent Bun command) to check discovery metadata, public URL coverage, private route rules, safe JSON-LD, and social asset dimensions.
