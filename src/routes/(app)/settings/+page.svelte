<script lang="ts">
	import { Buildings, CreditCard } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-[var(--foreground)]">Settings</h1>

	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<Buildings size={20} color="var(--brand)" />
			<h2 class="font-semibold text-[var(--foreground)]">Organization</h2>
		</div>
		<div class="grid grid-cols-2 gap-4 text-sm">
			<div>
				<p class="text-[var(--foreground-muted)]">Name</p>
				<p class="font-medium text-[var(--foreground)]">{data.organization.name}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Slug</p>
				<p class="font-medium text-[var(--foreground)]">{data.organization.slug}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Industry</p>
				<p class="font-medium text-[var(--foreground)]">{data.organization.industry ?? '—'}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Team size</p>
				<p class="font-medium text-[var(--foreground)]">{data.organization.teamSize ?? '—'}</p>
			</div>
		</div>
	</Card>

	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<CreditCard size={20} color="var(--brand)" />
			<h2 class="font-semibold text-[var(--foreground)]">Billing</h2>
		</div>
		<div class="flex items-center gap-3">
			<Badge variant={data.subscription?.status === 'active' ? 'success' : 'warning'}>
				{data.subscription?.status ?? 'No subscription'}
			</Badge>
			{#if data.organization.trialEndsAt}
				<span class="text-sm text-[var(--foreground-muted)]">
					Trial ends {new Date(data.organization.trialEndsAt).toLocaleDateString()}
				</span>
			{/if}
		</div>
		<p class="mt-4 text-sm text-[var(--foreground-muted)]">Stripe billing portal coming soon.</p>
	</Card>
</div>
