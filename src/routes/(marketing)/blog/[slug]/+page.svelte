<script lang="ts">
	import { ArrowLeft, ArrowRight, Calendar, Clock, ShareNetwork } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';

	let { data } = $props();
	const post = $derived(data.post);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function shareOnTwitter() {
		const text = encodeURIComponent(post.title);
		const url = encodeURIComponent(`https://auditlift.app/blog/${post.slug}`);
		window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
	}

	function shareOnLinkedIn() {
		const url = encodeURIComponent(`https://auditlift.app/blog/${post.slug}`);
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
	}

	function copyLink() {
		navigator.clipboard.writeText(`https://auditlift.app/blog/${post.slug}`);
	}
</script>

<svelte:head>
	<title>{post.title} — Auditlift Blog</title>
	<meta name="description" content={post.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.excerpt} />
	<meta property="og:url" content="https://auditlift.app/blog/{post.slug}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.excerpt} />
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
	<article class="blog-post">
		<div class="blog-post-inner">
			<a href="/blog" class="back-link">
				<ArrowLeft size={14} weight="bold" />
				All posts
			</a>

			<div class="blog-post-meta">
				<span class="blog-meta-item">
					<Calendar size={14} />
					{formatDate(post.date)}
				</span>
				<span class="blog-meta-item">
					<Clock size={14} />
					{post.readTime}
				</span>
			</div>

			<h1 class="blog-post-title">{post.title}</h1>
			<p class="blog-post-excerpt">{post.excerpt}</p>

			<div class="blog-share">
				<button class="share-btn" onclick={shareOnTwitter} aria-label="Share on Twitter">
					<ShareNetwork size={14} />
					Twitter
				</button>
				<button class="share-btn" onclick={shareOnLinkedIn} aria-label="Share on LinkedIn">
					<ShareNetwork size={14} />
					LinkedIn
				</button>
				<button class="share-btn" onclick={copyLink} aria-label="Copy link">
					<ShareNetwork size={14} />
					Copy link
				</button>
			</div>

			<div class="blog-post-content">
				{#each post.content.split('\n\n') as paragraph}
					{#if paragraph.startsWith('## ')}
						<h2>{paragraph.replace('## ', '')}</h2>
					{:else if paragraph.startsWith('- ')}
						<ul>
							{#each paragraph.split('\n') as item}
								{#if item.startsWith('- ')}
									<li>{item.replace('- ', '')}</li>
								{/if}
							{/each}
						</ul>
					{:else if /^\d+\./.test(paragraph)}
						<ol>
							{#each paragraph.split('\n') as item}
								{#if /^\d+\./.test(item)}
									<li>{item.replace(/^\d+\.\s*/, '')}</li>
								{/if}
							{/each}
						</ol>
					{:else}
						<p>{paragraph}</p>
					{/if}
				{/each}
			</div>

			<div class="blog-cta">
				<p class="blog-cta-text">{post.ctaText}</p>
				<a href={post.ctaHref} class="btn-primary btn-lg">
					Get started
					<ArrowRight size={16} weight="bold" />
				</a>
			</div>
		</div>
	</article>

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
	.btn-primary.btn-lg {
		padding: 0.6875rem 1.375rem;
		font-size: 0.9375rem;
		border-radius: var(--radius-lg, var(--radius));
	}

	.page-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100svh;
		background: var(--background);
	}

	.blog-post {
		padding: 7rem 1.5rem 4rem;
		flex: 1;
	}
	.blog-post-inner {
		max-width: 42rem;
		margin: 0 auto;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--brand);
		text-decoration: none;
		margin-bottom: 1.5rem;
		transition: opacity 0.15s;
	}
	.back-link:hover {
		opacity: 0.8;
	}
	.blog-post-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.blog-meta-item {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		color: var(--foreground-subtle);
	}
	.blog-post-title {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--foreground);
		margin: 0 0 1rem;
		line-height: 1.2;
	}
	.blog-post-excerpt {
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--foreground-muted);
		margin: 0 0 1.5rem;
	}
	.blog-share {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}
	.share-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--background-elevated);
		color: var(--foreground-muted);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}
	.share-btn:hover {
		border-color: var(--foreground-muted);
		color: var(--foreground);
	}

	.blog-post-content {
		font-size: 1rem;
		line-height: 1.75;
		color: var(--foreground);
	}
	.blog-post-content :global(h2) {
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--foreground);
		margin: 2.5rem 0 1rem;
	}
	.blog-post-content :global(p) {
		margin: 0 0 1.25rem;
		color: var(--foreground-muted);
	}
	.blog-post-content :global(ul),
	.blog-post-content :global(ol) {
		margin: 0 0 1.25rem 1.25rem;
		padding: 0;
		color: var(--foreground-muted);
	}
	.blog-post-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.blog-cta {
		margin-top: 3rem;
		padding: 2rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		background: var(--background-subtle);
		text-align: center;
	}
	.blog-cta-text {
		font-size: 1.0625rem;
		font-weight: 500;
		color: var(--foreground);
		margin: 0 0 1rem;
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
