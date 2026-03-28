<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'success' | 'warning' | 'danger' | 'info' | 'default';

	let {
		variant = 'default',
		class: className = '',
		children
	}: {
		variant?: Variant;
		class?: string;
		children: Snippet;
	} = $props();

	const variants: Record<Variant, string> = {
		success: 'bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]',
		warning: 'bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]',
		danger: 'bg-[var(--danger-light)] text-[var(--danger)] border-[var(--danger)]',
		info: 'bg-[var(--info-light)] text-[var(--info)] border-[var(--info)]',
		default: 'bg-[var(--background-alt)] text-[var(--foreground-muted)] border-[var(--border)]'
	};
</script>

<span
	class="inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2 py-0.5 text-xs font-medium {variants[
		variant
	]} {className}"
>
	{@render children()}
</span>
