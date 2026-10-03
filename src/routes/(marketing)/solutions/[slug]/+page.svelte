<script lang="ts">
	import { ArrowRight, Check } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import SEO from '$lib/components/marketing/SEO.svelte';
	import FAQ from '$lib/components/marketing/FAQ.svelte';
	import { solutions } from '$lib/data/marketing';
	import { breadcrumbSchema, faqSchema } from '$lib/seo';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const solution = $derived(data.solution);
</script>

<SEO
	title={solution.title}
	description={solution.description}
	path={`/solutions/${solution.slug}`}
	schemas={[
		faqSchema(solution.faqs),
		breadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: solution.headline, path: `/solutions/${solution.slug}` }
		])
	]}
/>

<nav class="site-nav" aria-label="Main navigation">
	<a href="/" class="logo"><LogoMark size={20} /><span>AuditLift</span></a>
	<div class="nav-actions">
		<a href="/pricing">Pricing</a>
		<a href="/blog">Guides</a>
		<ThemeToggle />
		<a href="/login" class="button">Start free trial</a>
	</div>
</nav>

<main>
	<article>
		<header class="hero">
			<a class="back-link" href="/">Home / Solutions</a>
			<p class="eyebrow">Built for early-stage B2B SaaS teams</p>
			<h1>{solution.headline}</h1>
			<p class="summary">{solution.summary}</p>
			<div class="hero-actions">
				<a href="/login" class="button">Start free trial <ArrowRight size={16} /></a>
				<a href="/pricing">Compare plans</a>
			</div>
			<p class="trial-note">
				<Check size={15} />10-day trial · No credit card required · From $149 USD/month
			</p>
		</header>

		<section class="content-section" aria-labelledby="when-heading">
			<h2 id="when-heading">When to use AuditLift</h2>
			<p>{solution.whenToUse}</p>
		</section>

		<section class="content-section" aria-labelledby="workflow-heading">
			<h2 id="workflow-heading">How the workflow works</h2>
			<ol class="workflow">
				{#each solution.steps as step (step.title)}
					<li>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</li>
				{/each}
			</ol>
		</section>

		<section class="content-section" aria-labelledby="faq-heading">
			<h2 id="faq-heading">Frequently asked questions</h2>
			<FAQ items={solution.faqs} />
		</section>
	</article>

	<aside class="content-section" aria-labelledby="related-heading">
		<h2 id="related-heading">Related AuditLift workflows</h2>
		<ul class="related-links">
			{#each solutions.filter((item) => item.slug !== solution.slug) as related (related.slug)}
				<li><a href="/solutions/{related.slug}">{related.headline} <ArrowRight size={16} /></a></li>
			{/each}
		</ul>
		<p>
			Learn more in our <a href="/blog">security questionnaire and compliance readiness guides</a>.
		</p>
	</aside>
</main>

<footer>
	<p>© 2026 AuditLift</p>
	<nav aria-label="Footer navigation">
		<a href="/">Home</a><a href="/pricing">Pricing</a><a href="/blog">Guides</a>
		<a href="/privacy">Privacy</a><a href="/terms">Terms</a>
	</nav>
</footer>

<style>
	.site-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		max-width: 72rem;
		margin: 0 auto;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--border);
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: var(--foreground);
		text-decoration: none;
	}
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.875rem;
	}
	main {
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}
	a {
		color: var(--brand);
		text-underline-offset: 0.2em;
	}
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--brand);
		color: white;
		border-radius: var(--radius);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.875rem;
	}
	.button:hover {
		background: var(--brand-hover);
	}
	.hero {
		padding: 4rem 0 3rem;
		max-width: 52rem;
	}
	.back-link {
		font-size: 0.8125rem;
	}
	.eyebrow {
		margin-top: 2rem;
		color: var(--brand);
		font-size: 0.8125rem;
		font-weight: 600;
	}
	h1 {
		margin: 0.875rem 0 1.25rem;
		font-size: clamp(2.25rem, 5vw, 3.5rem);
		line-height: 1.12;
		letter-spacing: -0.035em;
		font-weight: 700;
		color: var(--foreground);
	}
	.summary {
		font-size: 1.125rem;
	}
	p {
		line-height: 1.8;
		color: var(--foreground-muted);
	}
	.hero-actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.25rem;
		margin-top: 1.5rem;
	}
	.trial-note {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 0.8125rem;
	}
	.content-section {
		max-width: 48rem;
		padding: 2rem 0;
		border-top: 1px solid var(--border);
	}
	h2 {
		font-size: 1.625rem;
		font-weight: 600;
		letter-spacing: -0.025em;
		margin-bottom: 1rem;
		color: var(--foreground);
	}
	h3 {
		font-size: 1.0625rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--foreground);
	}
	.workflow {
		padding-left: 1.5rem;
	}
	.workflow li {
		padding: 0.75rem 0 0.75rem 0.5rem;
	}
	.workflow li::marker {
		color: var(--brand);
		font-weight: 600;
	}
	.related-links {
		padding: 0;
		list-style: none;
	}
	.related-links a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.5rem 0;
	}
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		max-width: 72rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
		border-top: 1px solid var(--border);
		font-size: 0.8125rem;
	}
	footer nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	@media (max-width: 600px) {
		.site-nav {
			flex-wrap: wrap;
		}
		.nav-actions {
			gap: 0.75rem;
			flex-wrap: wrap;
		}
		.hero {
			padding-top: 2.5rem;
		}
		.trial-note {
			align-items: flex-start;
		}
	}
</style>
