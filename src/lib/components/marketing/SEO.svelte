<script lang="ts">
	import { canonicalUrl, serializeJsonLd } from '$lib/seo';
	import { product } from '$lib/data/marketing';

	let {
		title,
		description,
		path,
		type = 'website',
		schemas = [],
		publishedTime
	}: {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		schemas?: Record<string, unknown>[];
		publishedTime?: string;
	} = $props();

	const url = $derived(canonicalUrl(path));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={url} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={product.name} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={`${product.url}/og.png`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="AuditLift — Source-backed security questionnaire answers for B2B SaaS teams"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={`${product.url}/og.png`} />
	<meta
		name="twitter:image:alt"
		content="AuditLift — Source-backed security questionnaire answers for B2B SaaS teams"
	/>
	{#if publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if schemas.length}
		{@html `<script type="application/ld+json">${serializeJsonLd({ '@context': 'https://schema.org', '@graph': schemas })}</script>`}
	{/if}
</svelte:head>
