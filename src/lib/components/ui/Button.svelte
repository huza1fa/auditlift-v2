<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	} = $props();

	const base =
		'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius)] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:opacity-50 disabled:pointer-events-none';

	const sizes: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const variants: Record<Variant, string> = {
		primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-sm',
		secondary:
			'bg-white text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--background-alt)] shadow-sm',
		ghost: 'bg-transparent text-[var(--foreground-muted)] hover:bg-[var(--background-alt)]',
		danger: 'bg-[var(--danger)] text-white hover:opacity-90 shadow-sm'
	};
</script>

<button {type} {disabled} class="{base} {sizes[size]} {variants[variant]} {className}" {onclick}>
	{@render children()}
</button>
