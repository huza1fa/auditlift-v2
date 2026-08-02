<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.svelte';
	import { captureEvent } from '$lib/posthog';
	import './layout.css';
	import favicon from '/favicon.ico';

	let { children } = $props();

	onMount(() => {
		theme.init();
	});

	$effect(() => {
		captureEvent('$pageview', { $current_url: page.url.href });
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
