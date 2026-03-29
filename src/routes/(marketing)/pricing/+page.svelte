<script lang="ts">
	import { Check, ArrowRight } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let plan = $state<'monthly' | 'yearly'>('monthly');

	const monthlyPrice = 290;
	const yearlyPrice = 2958;
	const yearlyPerMonth = $derived(Math.round(yearlyPrice / 12));

	const features = [
		'Unlimited controls & evidence',
		'AI-powered policy generator',
		'SOC 2, PCI-DSS, ISO 27001',
		'Auditor-ready export package',
		'Team management & invites',
		'Priority email support',
		'Readiness score dashboard',
		'10-day free trial'
	];
</script>

<svelte:head>
	<title>Pricing - AuditLift</title>
</svelte:head>

<!-- Nav -->
<nav
	class="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm"
>
	<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
		<a href="/" class="flex items-center gap-2 no-underline">
			<LogoMark size={20} />
			<span class="text-[15px] font-semibold tracking-tight text-[var(--foreground)]"
				>AuditLift</span
			>
		</a>
		<div class="flex items-center gap-3">
			<ThemeToggle />
			<a
				href="/login"
				class="text-[13px] font-medium text-[var(--foreground-muted)] no-underline transition-colors hover:text-[var(--foreground)]"
			>
				Sign in
			</a>
			<a
				href="/login"
				class="rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-[13px] font-medium text-white no-underline transition-colors hover:bg-[var(--brand-hover)]"
			>
				Start free trial
			</a>
		</div>
	</div>
</nav>

<div class="flex min-h-screen flex-col bg-[var(--background)]">
	<section class="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-32 pb-24 text-center">
		<h1 class="mb-3 text-4xl font-bold tracking-tight text-[var(--foreground)]">
			Simple, transparent pricing
		</h1>
		<p class="mb-10 max-w-md text-[15px] text-[var(--foreground-muted)]">
			No hidden fees. No per-seat pricing. Just everything you need to pass your audit.
		</p>

		<!-- Toggle -->
		<div
			class="mb-10 inline-flex items-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-alt)] p-1"
		>
			<button
				onclick={() => (plan = 'monthly')}
				class="cursor-pointer rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all
				{plan === 'monthly'
					? 'bg-white text-[var(--foreground)] shadow-sm'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				Monthly
			</button>
			<button
				onclick={() => (plan = 'yearly')}
				class="flex cursor-pointer items-center gap-2 rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all
				{plan === 'yearly'
					? 'bg-white text-[var(--foreground)] shadow-sm'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				Yearly
				<span
					class="rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]"
				>
					Save 15%
				</span>
			</button>
		</div>

		<!-- Pricing Card -->
		<Card class="w-full max-w-md p-8">
			<div class="mb-6 text-left">
				<p class="text-[13px] font-medium text-[var(--foreground-muted)]">AuditLift Pro</p>
				<div class="mt-1 flex items-baseline gap-1">
					<span class="text-4xl font-bold tracking-tight text-[var(--foreground)]">
						${plan === 'monthly' ? monthlyPrice : yearlyPerMonth}
					</span>
					<span class="text-[15px] text-[var(--foreground-muted)]">/month</span>
				</div>
				{#if plan === 'yearly'}
					<p class="mt-1 text-[13px] text-[var(--foreground-muted)]">
						${yearlyPrice}/year — billed annually
					</p>
				{/if}
				<p class="mt-4 text-[13px] text-[var(--foreground-muted)]">
					10-day free trial included. No credit card required.
				</p>
			</div>

			<div class="mb-8 space-y-3">
				{#each features as feature}
					<div class="flex items-center gap-3">
						<div
							class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--success-light)]"
						>
							<Check size={12} color="var(--success)" weight="bold" />
						</div>
						<span class="text-[14px] text-[var(--foreground)]">{feature}</span>
					</div>
				{/each}
			</div>

			<a
				href="/login"
				class="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-5 py-3 text-[14px] font-medium text-white no-underline transition-colors hover:bg-[var(--brand-hover)]"
			>
				Start your free trial
				<ArrowRight size={16} />
			</a>
		</Card>

		<!-- Trust line -->
		<p class="mt-8 text-[12px] text-[var(--foreground-subtle)]">
			Trusted by startups building SOC 2, PCI-DSS, and ISO 27001 programs.
		</p>
	</section>

	<!-- Footer -->
	<footer class="border-t border-[var(--border)] py-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6">
			<p class="text-[12px] text-[var(--foreground-subtle)]">
				© 2026 AuditLift. All rights reserved.
			</p>
			<div class="flex items-center gap-4">
				<a
					href="/"
					class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]"
					>Home</a
				>
				<a
					href="/pricing"
					class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]"
					>Pricing</a
				>
			</div>
		</div>
	</footer>
</div>
