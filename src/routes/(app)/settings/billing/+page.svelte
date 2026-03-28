<script lang="ts">
	import { CreditCard, ArrowLeft } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<a
		href="/settings"
		class="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
	>
		<ArrowLeft size={16} /> Back to Settings
	</a>

	<h1 class="text-2xl font-bold text-[var(--foreground)]">Billing</h1>

	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<CreditCard size={24} color="var(--brand)" />
			<div>
				<h2 class="font-semibold text-[var(--foreground)]">Current Plan</h2>
				<Badge variant={data.subscription?.status === 'active' ? 'success' : 'warning'}>
					{data.subscription?.status ?? 'Trial'}
				</Badge>
			</div>
		</div>

		{#if data.organization.trialEndsAt}
			<p class="mb-4 text-sm text-[var(--foreground-muted)]">
				Your trial ends on {new Date(data.organization.trialEndsAt).toLocaleDateString('en-US', {
					dateStyle: 'long'
				})}.
			</p>
		{/if}

		<div class="mb-4 rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
			<p class="font-semibold text-[var(--foreground)]">AuditLift Pro</p>
			<p class="my-1 text-2xl font-bold text-[var(--foreground)]">
				$99<span class="text-sm font-normal text-[var(--foreground-muted)]">/month</span>
			</p>
			<ul class="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
				<li>✓ Unlimited controls &amp; evidence</li>
				<li>✓ Policy generator</li>
				<li>✓ Auditor export</li>
				<li>✓ Email support</li>
			</ul>
		</div>

		<Button>
			<CreditCard size={16} /> Upgrade to Pro
		</Button>
		<p class="mt-2 text-xs text-[var(--foreground-muted)]">Stripe integration coming soon.</p>
	</Card>
</div>
