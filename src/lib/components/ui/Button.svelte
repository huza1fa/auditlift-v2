<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Spinner } from 'phosphor-svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		ariaLabel,
		class: className = '',
		onclick,
		children
	}: {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		ariaLabel?: string;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	} = $props();

	const isDisabled = $derived(disabled || loading);

	const base =
		'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius)] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:opacity-50 disabled:pointer-events-none';

	const sizes: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const spinnerSizes: Record<Size, number> = {
		sm: 14,
		md: 16,
		lg: 20
	};

	const variants: Record<Variant, string> = {
		primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-sm',
		secondary:
			'bg-[var(--background-elevated)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--background-alt)] shadow-sm',
		ghost: 'bg-transparent text-[var(--foreground-muted)] hover:bg-[var(--background-alt)]',
		danger: 'bg-[var(--danger)] text-white hover:opacity-90 shadow-sm'
	};
</script>

<button
	{type}
	aria-label={ariaLabel}
	disabled={isDisabled}
	class="{base} {sizes[size]} {variants[variant]} {className}"
	{onclick}
>
	{#if loading}
		<Spinner size={spinnerSizes[size]} class="animate-spin" />
	{/if}
	{@render children()}
</button>
