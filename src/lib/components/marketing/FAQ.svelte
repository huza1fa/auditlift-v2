<script lang="ts">
	import type { FAQ } from '$lib/data/marketing';
	let { items }: { items: FAQ[] } = $props();
</script>

<div class="faq-list">
	{#each items as item (item.question)}
		<section class="faq-item">
			<h3>{item.question}</h3>
			<p>{item.answer}</p>
		</section>
	{/each}
</div>

<style>
	.faq-list {
		max-width: 48rem;
		margin: 0 auto;
	}
	.faq-item {
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--border);
	}
	h3 {
		margin: 0 0 0.625rem;
		font-size: 1.0625rem;
		font-weight: 600;
		color: var(--foreground);
	}
	p {
		margin: 0;
		line-height: 1.8;
		font-size: 0.9375rem;
		color: var(--foreground-muted);
	}
</style>
