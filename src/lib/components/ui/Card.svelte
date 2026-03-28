<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div
	class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow)] {className}"
>
	{@render children()}
</div>
