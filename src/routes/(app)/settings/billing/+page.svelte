<script lang="ts">
	import { CreditCard, ArrowLeft, Check, ShieldCheck, Warning } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let { data } = $props();

	let loading = $state<'monthly' | 'yearly' | 'portal' | null>(null);
	let errorMsg = $state('');

	const isActive = $derived(data.subscription?.status === 'active');
	const isPastDue = $derived(data.subscription?.status === 'past_due');
	const isCanceled = $derived(data.subscription?.status === 'canceled');
	const isTrial = $derived(!data.subscription || data.subscription?.status === 'trialing');

	const trialDaysLeft = $derived.by(() => {
		if (!data.organization?.trialEndsAt) return 0;
		const days = Math.ceil(
			(new Date(data.organization.trialEndsAt).getTime() - Date.now()) / 86400000
		);
		return Math.max(0, days);
	});

	const trialExpired = $derived(isTrial && trialDaysLeft <= 0);

	const periodEnd = $derived.by(() => {
		if (!data.subscription?.currentPeriodEnd) return null;
		return new Date(data.subscription.currentPeriodEnd).toLocaleDateString('en-US', {
			dateStyle: 'long'
		});
	});

	async function startCheckout(interval: 'monthly' | 'yearly') {
		loading = interval;
		errorMsg = '';
		try {
			const res = await fetch('/api/billing/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ interval })
			});
			const body = await res.json();
			if (!res.ok) throw new Error(body.message || 'Failed to start checkout');
			window.location.href = body.url;
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Something went wrong';
			loading = null;
		}
	}

	async function openPortal() {
		loading = 'portal';
		errorMsg = '';
		try {
			const res = await fetch('/api/billing/portal', { method: 'POST' });
			const body = await res.json();
			if (!res.ok) throw new Error(body.message || 'Failed to open portal');
			window.location.href = body.url;
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Something went wrong';
			loading = null;
		}
	}
</script>

<div class="space-y-6">
	<a
		href="/settings"
		class="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
	>
		<ArrowLeft size={16} /> Back to Settings
	</a>

	<h1 class="text-2xl font-bold text-[var(--foreground)]">Billing</h1>

	{#if trialExpired}
		<!-- Trial expired warning -->
		<div
			class="rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-light)] p-4"
		>
			<div class="flex items-center gap-3">
				<Warning size={20} color="var(--danger)" weight="fill" />
				<div>
					<p class="font-semibold text-[var(--danger)]">Your free trial has expired</p>
					<p class="text-sm text-[var(--foreground-muted)]">
						Choose a plan below to continue using AuditLift.
					</p>
				</div>
			</div>
		</div>
	{:else if isTrial && trialDaysLeft > 0}
		<!-- Trial active -->
		<Card class="p-4">
			<div class="flex items-center gap-3">
				<ShieldCheck size={20} color="var(--brand)" weight="fill" />
				<div>
					<p class="font-semibold text-[var(--foreground)]">
						Free trial — {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
					</p>
					<p class="text-sm text-[var(--foreground-muted)]">
						Choose a plan now so you don't lose access when the trial ends.
					</p>
				</div>
			</div>
		</Card>
	{/if}

	{#if isPastDue}
		<!-- Past due warning -->
		<div
			class="rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] p-4"
		>
			<div class="flex items-center gap-3">
				<Warning size={20} color="var(--warning)" weight="fill" />
				<div>
					<p class="font-semibold text-[var(--warning)]">Payment failed</p>
					<p class="text-sm text-[var(--foreground-muted)]">
						Please update your payment method to restore access.
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Current subscription status -->
	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<CreditCard size={24} color="var(--brand)" />
			<div>
				<h2 class="font-semibold text-[var(--foreground)]">Current Plan</h2>
				<div class="mt-1 flex items-center gap-2">
					<Badge
						variant={isActive ? 'success' : isPastDue ? 'warning' : isCanceled ? 'danger' : 'info'}
					>
						{isActive
							? 'Active'
							: isPastDue
								? 'Past Due'
								: isCanceled
									? 'Canceled'
									: isTrial
										? 'Trial'
										: (data.subscription?.status ?? 'Trial')}
					</Badge>
					{#if data.subscription?.cancelAtPeriodEnd}
						<Badge variant="warning">Cancels at period end</Badge>
					{/if}
				</div>
			</div>
		</div>

		{#if isActive && periodEnd}
			<p class="mb-4 text-sm text-[var(--foreground-muted)]">
				{data.subscription?.cancelAtPeriodEnd
					? `Your subscription ends on ${periodEnd}.`
					: `Your next billing date is ${periodEnd}.`}
			</p>
		{/if}

		<!-- Plan options -->
		<div class="grid gap-4 md:grid-cols-2">
			<!-- Monthly -->
			<div
				class="rounded-[var(--radius-lg)] border border-[var(--border)] p-4 transition-all
				{isActive && !data.subscription?.cancelAtPeriodEnd
					? 'border-[var(--brand)] bg-[var(--brand-light)]'
					: ''}"
			>
				<div class="mb-3 flex items-center justify-between">
					<p class="font-semibold text-[var(--foreground)]">Monthly</p>
					{#if isActive && !data.subscription?.cancelAtPeriodEnd}
						<Badge variant="success">
							<Check size={10} weight="bold" /> Active
						</Badge>
					{/if}
				</div>
				<p class="mb-3 text-2xl font-bold text-[var(--foreground)]">
					$290<span class="text-sm font-normal text-[var(--foreground-muted)]">/month</span>
				</p>
				<ul class="mb-4 space-y-1.5 text-sm text-[var(--foreground-muted)]">
					<li class="flex items-center gap-2">
						<Check size={14} color="var(--success)" weight="bold" /> Unlimited controls & evidence
					</li>
					<li class="flex items-center gap-2">
						<Check size={14} color="var(--success)" weight="bold" /> AI policy generator
					</li>
					<li class="flex items-center gap-2">
						<Check size={14} color="var(--success)" weight="bold" /> Auditor export
					</li>
					<li class="flex items-center gap-2">
						<Check size={14} color="var(--success)" weight="bold" /> Email support
					</li>
				</ul>
				{#if !isActive || data.subscription?.cancelAtPeriodEnd}
					<Button
						class="w-full"
						onclick={() => startCheckout('monthly')}
						disabled={loading !== null}
					>
						{loading === 'monthly' ? 'Redirecting...' : 'Choose Monthly'}
					</Button>
				{/if}
			</div>

			<!-- Yearly -->
			<div
				class="relative rounded-[var(--radius-lg)] border p-4 transition-all
				{isActive && data.subscription?.cancelAtPeriodEnd ? '' : 'border-[var(--border)]'}
				{isActive && !data.subscription?.cancelAtPeriodEnd && periodEnd ? '' : 'border-[var(--border)]'}"
			>
				<div class="absolute -top-2.5 right-4">
					<Badge variant="success">Save 15%</Badge>
				</div>
				<div class="mb-3 flex items-center justify-between">
					<p class="font-semibold text-[var(--foreground)]">Yearly</p>
				</div>
				<p class="mb-1 text-2xl font-bold text-[var(--foreground)]">
					$247<span class="text-sm font-normal text-[var(--foreground-muted)]">/month</span>
				</p>
				<p class="mb-3 text-sm text-[var(--foreground-muted)]">$2,958/year billed annually</p>
				<ul class="mb-4 space-y-1.5 text-sm text-[var(--foreground-muted)]">
					<li class="flex items-center gap-2">
						<Check size={14} color="var(--success)" weight="bold" /> Everything in Monthly
					</li>
					<li class="flex items-center gap-2">
						<Check size={14} color="var(--success)" weight="bold" /> Save $622/year
					</li>
					<li class="flex items-center gap-2">
						<Check size={14} color="var(--success)" weight="bold" /> Priority support
					</li>
				</ul>
				<Button
					variant="secondary"
					class="w-full"
					onclick={() => startCheckout('yearly')}
					disabled={loading !== null}
				>
					{loading === 'yearly' ? 'Redirecting...' : 'Choose Yearly'}
				</Button>
			</div>
		</div>
	</Card>

	<!-- Manage subscription -->
	{#if isActive && data.subscription?.stripeCustomerId}
		<Card class="p-6">
			<h2 class="mb-2 font-semibold text-[var(--foreground)]">Manage Subscription</h2>
			<p class="mb-4 text-sm text-[var(--foreground-muted)]">
				Update your payment method, view invoices, or cancel your subscription.
			</p>
			<Button variant="secondary" onclick={openPortal} disabled={loading !== null}>
				{loading === 'portal' ? 'Opening...' : 'Manage billing'}
			</Button>
		</Card>
	{/if}

	{#if errorMsg}
		<p class="text-sm text-[var(--danger)]">{errorMsg}</p>
	{/if}
</div>
