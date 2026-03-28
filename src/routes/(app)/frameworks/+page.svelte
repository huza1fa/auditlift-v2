<script lang="ts">
	import { ShieldCheck } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();

	async function activate(frameworkId: string) {
		const framework = data.frameworks.find((f) => f.id === frameworkId);
		await fetch('/api/onboarding/framework', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ frameworkSlug: framework?.slug })
		});
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-[var(--foreground)]">Compliance Frameworks</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		{#each data.frameworks as framework (framework.id)}
			<Card class="p-6">
				<div class="mb-3 flex items-start justify-between">
					<ShieldCheck size={24} color="var(--brand)" weight="fill" />
					{#if framework.recommended}
						<Badge variant="info">⭐ Most Popular</Badge>
					{/if}
				</div>
				<h2 class="mb-1 font-semibold text-[var(--foreground)]">{framework.name}</h2>
				<p class="mb-4 text-sm text-[var(--foreground-muted)]">{framework.description}</p>
				{#if framework.active}
					<Badge variant="success">Active</Badge>
				{:else}
					<Button variant="secondary" size="sm" onclick={() => activate(framework.id)}>
						Activate
					</Button>
				{/if}
			</Card>
		{/each}
	</div>
</div>
