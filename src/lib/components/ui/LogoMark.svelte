<script lang="ts">
	let {
		size = 20,
		class: className = ''
	}: {
		size?: number;
		class?: string;
	} = $props();
</script>

<!--
  Geometric shield mark — angular hexagon with inner facet.
  Pure straight lines, no curves. Reads as shield at any size.
-->
<svg
	width={size}
	height={size}
	viewBox="0 0 20 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={className}
	aria-hidden="true"
>
	<!-- Outer shield polygon -->
	<path d="M10 1L19 5V14L10 23L1 14V5L10 1Z" fill="var(--brand)" />
	<!-- Inner facet — creates depth and geometric character -->
	<path
		d="M10 5L15.5 7.5V13L10 18.5L4.5 13V7.5L10 5Z"
		fill="var(--brand-foreground)"
		opacity="0.15"
	/>
	<!-- Center mark — small diamond -->
	<path d="M10 8.5L12.5 11L10 13.5L7.5 11L10 8.5Z" fill="var(--brand-foreground)" opacity="0.5" />
</svg>
