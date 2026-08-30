<script lang="ts">
	import { ArrowRight, Calendar, Clock } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { blogPosts } from '$lib/data/blog';

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blog — Auditlift</title>
	<meta
		name="description"
		content="Practical guides for SaaS founders navigating enterprise security reviews, SOC 2 readiness, and compliance without consultants."
	/>
</svelte:head>

<nav class="nav-bar">
	<div class="nav-inner">
		<a href="/" class="nav-logo">
			<LogoMark size={20} />
			<span class="nav-logo-text">Auditlift</span>
		</a>
		<div class="nav-actions">
			<ThemeToggle />
			<a href="/login" class="nav-signin">Sign in</a>
			<a href="/login" class="btn-primary">Start free trial</a>
		</div>
	</div>
</nav>

<div class="page-wrapper">
	<section class="blog-hero">
		<div class="blog-hero-inner">
			<p class="blog-hero-label">Auditlift Blog</p>
			<h1 class="blog-hero-title">Practical compliance for SaaS founders</h1>
			<p class="blog-hero-sub">
				No fluff. No consultant jargon. Just actionable guides on security questionnaires, SOC 2,
				and closing enterprise deals faster.
			</p>
		</div>
	</section>

	<section class="blog-list">
		<div class="blog-list-inner">
			{#each blogPosts as post (post.slug)}
				<article class="blog-card">
					<div class="blog-card-meta">
						<span class="blog-meta-item">
							<Calendar size={14} />
							{formatDate(post.date)}
						</span>
						<span class="blog-meta-item">
							<Clock size={14} />
							{post.readTime}
						</span>
					</div>
					<h2 class="blog-card-title">
						<a href="/blog/{post.slug}">{post.title}</a>
					</h2>
					<p class="blog-card-excerpt">{post.excerpt}</p>
					<a href="/blog/{post.slug}" class="blog-card-link">
						Read post
						<ArrowRight size={14} weight="bold" />
					</a>
				</article>
			{/each}
		</div>
	</section>

	<footer class="site-footer">
		<div class="footer-inner">
			<div class="footer-logo">
				<LogoMark size={16} />
				<span class="footer-logo-text">Auditlift</span>
				<span class="footer-copy">&copy; 2026</span>
			</div>
			<nav class="footer-links" aria-label="Footer navigation">
				<a href="/" class="footer-link">Home</a>
				<a href="/blog" class="footer-link">Blog</a>
				<a href="/privacy" class="footer-link">Privacy</a>
				<a href="/terms" class="footer-link">Terms</a>
				<a href="/login" class="footer-link">Sign in</a>
			</nav>
			<ThemeToggle />
		</div>
	</footer>
</div>

<style>
	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		border-bottom: 1px solid var(--border);
		background: color-mix(in srgb, var(--background) 85%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}
	.nav-inner {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 3.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.nav-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}
	.nav-logo-text {
		font-size: 0.9375rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--foreground);
	}
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.nav-signin {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--foreground-muted);
		text-decoration: none;
		transition: color 0.15s;
	}
	.nav-signin:hover {
		color: var(--foreground);
	}
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.4375rem 0.875rem;
		background: var(--brand);
		color: #fff;
		border: none;
		border-radius: var(--radius);
		font-size: 0.8125rem;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition:
			background 0.15s,
			opacity 0.15s;
		white-space: nowrap;
	}
	.btn-primary:hover {
		background: var(--brand-hover, color-mix(in srgb, var(--brand) 85%, #000));
	}

	.page-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100svh;
		background: var(--background);
	}

	.blog-hero {
		padding: 8rem 1.5rem 3rem;
		border-bottom: 1px solid var(--border);
		background-image: radial-gradient(
			ellipse 80% 50% at 50% -10%,
			color-mix(in srgb, var(--brand) 8%, transparent),
			transparent
		);
	}
	.blog-hero-inner {
		max-width: 48rem;
		margin: 0 auto;
		text-align: center;
	}
	.blog-hero-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--brand);
		margin: 0 0 0.75rem;
	}
	.blog-hero-title {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--foreground);
		margin: 0 0 1rem;
	}
	.blog-hero-sub {
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--foreground-muted);
		margin: 0;
	}

	.blog-list {
		padding: 3rem 1.5rem;
		flex: 1;
	}
	.blog-list-inner {
		max-width: 48rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.blog-card {
		padding: 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		background: var(--background-elevated);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.blog-card:hover {
		border-color: color-mix(in srgb, var(--brand) 40%, var(--border));
		box-shadow: 0 4px 16px color-mix(in srgb, var(--brand) 8%, transparent);
	}
	.blog-card-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}
	.blog-meta-item {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		color: var(--foreground-subtle);
	}
	.blog-card-title {
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--foreground);
		margin: 0 0 0.5rem;
	}
	.blog-card-title a {
		color: inherit;
		text-decoration: none;
		transition: color 0.15s;
	}
	.blog-card-title a:hover {
		color: var(--brand);
	}
	.blog-card-excerpt {
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--foreground-muted);
		margin: 0 0 1rem;
	}
	.blog-card-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--brand);
		text-decoration: none;
		transition: opacity 0.15s;
	}
	.blog-card-link:hover {
		opacity: 0.8;
	}

	.site-footer {
		border-top: 1px solid var(--border);
		padding: 1.5rem;
	}
	.footer-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.footer-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.footer-logo-text {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--foreground-muted);
	}
	.footer-copy {
		font-size: 0.875rem;
		color: var(--foreground-subtle);
	}
	.footer-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.footer-link {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.625rem;
		font-size: 0.8125rem;
		color: var(--foreground-muted);
		text-decoration: none;
		border-radius: var(--radius);
		transition: color 0.15s;
	}
	.footer-link:hover {
		color: var(--foreground);
	}

	@media (max-width: 640px) {
		.footer-inner {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
		.footer-links {
			flex-wrap: wrap;
			justify-content: center;
		}
	}
</style>
