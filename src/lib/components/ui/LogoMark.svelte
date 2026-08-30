<script lang="ts">
	let {
		size = 20,
		class: className = '',
		tone = 'brand'
	}: {
		size?: number;
		class?: string;
		tone?: 'brand' | 'inverse';
	} = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class="logo-mark {tone === 'inverse' ? 'logo-mark--inverse' : ''} {className}"
	aria-hidden="true"
>
	<path
		d="M4.5 17.75L10.1 6.25L13.65 13.2L16.1 9.35L19.5 17.75"
		stroke="currentColor"
		stroke-width="2.35"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M16.1 9.35H19.5V12.75"
		stroke="currentColor"
		stroke-width="2.35"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

<style>
	.logo-mark {
		display: block;
		color: var(--brand);
	}

	.logo-mark--inverse {
		color: var(--brand-foreground);
	}
</style>
