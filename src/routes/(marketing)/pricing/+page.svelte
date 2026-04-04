<script lang="ts">
	import { Check, ArrowRight, Envelope } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let billing = $state<'monthly' | 'yearly'>('monthly');

	const plans = [
		{
			id: 'starter',
			name: 'Starter',
			description: 'Perfect for founders getting audit-ready for the first time.',
			monthlyPrice: 149,
			yearlyPrice: 1431,
			highlighted: false,
			cta: 'Start free trial',
			ctaHref: '/login',
			features: [
				'1 compliance framework (SOC 2)',
				'Unlimited controls & evidence',
				'AI-powered policy generator',
				'Auditor-ready export package',
				'Up to 5 team members',
				'Email support',
				'Readiness score dashboard',
				'14-day free trial'
			]
		},
		{
			id: 'growth',
			name: 'Growth',
			description: 'For teams scaling compliance across multiple frameworks.',
			monthlyPrice: 299,
			yearlyPrice: 2870,
			highlighted: true,
			cta: 'Start free trial',
			ctaHref: '/login',
			features: [
				'All 3 frameworks (SOC 2, PCI-DSS, ISO 27001)',
				'Unlimited controls & evidence',
				'AI-powered policy generator',
				'Auditor-ready export package',
				'Unlimited team members',
				'Priority email support',
				'Readiness score dashboard',
				'14-day free trial'
			]
		}
	];
</script>

<svelte:head>
	<title>Pricing — AuditLift | SOC 2 Compliance Software</title>
	<meta
		name="description"
		content="Simple, flat-rate pricing for SOC 2, PCI-DSS, and ISO 27001 compliance. Starter from $149/mo. No per-seat pricing. Cancel anytime. 14-day free trial included."
	/>
	<link rel="canonical" href="https://auditlift.app/pricing" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://auditlift.app/pricing" />
	<meta property="og:site_name" content="AuditLift" />
	<meta property="og:title" content="Pricing — AuditLift | SOC 2 Compliance Software" />
	<meta
		property="og:description"
		content="SOC 2 compliance from $149/mo. No per-seat pricing. All 3 frameworks on Growth. 14-day free trial."
	/>
	<meta property="og:image" content="https://auditlift.app/og.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Pricing — AuditLift" />
	<meta
		name="twitter:description"
		content="SOC 2 compliance from $149/mo. No per-seat pricing. 14-day free trial."
	/>
	<meta name="twitter:image" content="https://auditlift.app/og.png" />
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
				class="text-[13px] font-medium text-[var(--foreground-muted)] no-underline hover:text-[var(--foreground)]"
				>Sign in</a
			>
			<a
				href="/login"
				class="rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-[13px] font-medium text-white no-underline hover:bg-[var(--brand-hover)]"
				>Start free trial</a
			>
		</div>
	</div>
</nav>

<div class="flex min-h-screen flex-col bg-[var(--background)]">
	<section class="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-32 pb-24">
		<div class="mb-3 text-center">
			<h1 class="text-4xl font-bold tracking-tight text-[var(--foreground)]">
				Simple, transparent pricing
			</h1>
			<p class="mt-3 text-[15px] text-[var(--foreground-muted)]">
				No hidden fees. No per-seat pricing. Cancel any time.
			</p>
		</div>

		<!-- Billing toggle -->
		<div
			class="my-8 inline-flex items-center rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-alt)] p-1"
		>
			<button
				onclick={() => (billing = 'monthly')}
				class="cursor-pointer rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all {billing ===
				'monthly'
					? 'bg-white text-[var(--foreground)] shadow-sm'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				Monthly
			</button>
			<button
				onclick={() => (billing = 'yearly')}
				class="flex cursor-pointer items-center gap-2 rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all {billing ===
				'yearly'
					? 'bg-white text-[var(--foreground)] shadow-sm'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				Yearly
				<span
					class="rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]"
					>Save 20%</span
				>
			</button>
		</div>

		<!-- Plan cards -->
		<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
			{#each plans as plan (plan.id)}
				<Card
					class="relative flex flex-col p-8 {plan.highlighted
						? 'border-[var(--brand)] ring-1 ring-[var(--brand)]'
						: ''}"
				>
					{#if plan.highlighted}
						<div class="absolute -top-3 left-1/2 -translate-x-1/2">
							<Badge variant="info">Most popular</Badge>
						</div>
					{/if}
					<div class="mb-6">
						<p
							class="text-[13px] font-semibold tracking-wider text-[var(--foreground-muted)] uppercase"
						>
							{plan.name}
						</p>
						<div class="mt-2 flex items-baseline gap-1">
							<span class="text-4xl font-bold tracking-tight text-[var(--foreground)]">
								${billing === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)}
							</span>
							<span class="text-[15px] text-[var(--foreground-muted)]">/mo</span>
						</div>
						{#if billing === 'yearly'}
							<p class="mt-1 text-[13px] text-[var(--foreground-muted)]">
								${plan.yearlyPrice}/yr billed annually
							</p>
						{/if}
						<p class="mt-3 text-[13px] text-[var(--foreground-muted)]">{plan.description}</p>
					</div>

					<div class="mb-8 flex-1 space-y-3">
						{#each plan.features as feature}
							<div class="flex items-start gap-3">
								<div
									class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--success-light)]"
								>
									<Check size={10} color="var(--success)" weight="bold" />
								</div>
								<span class="text-[13px] text-[var(--foreground)]">{feature}</span>
							</div>
						{/each}
					</div>

					<a
						href={plan.ctaHref}
						class="flex items-center justify-center gap-2 rounded-[var(--radius)] px-5 py-2.5 text-[14px] font-medium no-underline transition-colors {plan.highlighted
							? 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]'
							: 'border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-alt)]'}"
					>
						{plan.cta}
						<ArrowRight size={14} />
					</a>
				</Card>
			{/each}

			<!-- Enterprise card -->
			<Card class="flex flex-col p-8">
				<div class="mb-6">
					<p
						class="text-[13px] font-semibold tracking-wider text-[var(--foreground-muted)] uppercase"
					>
						Enterprise
					</p>
					<div class="mt-2">
						<span class="text-2xl font-bold text-[var(--foreground)]">Custom</span>
					</div>
					<p class="mt-3 text-[13px] text-[var(--foreground-muted)]">
						For larger teams with advanced security, SSO, and dedicated onboarding needs.
					</p>
				</div>

				<div class="mb-8 flex-1 space-y-3">
					{#each ['Everything in Growth', 'SSO / SAML', 'Dedicated onboarding', 'SLA & uptime guarantees', 'Custom contract & billing', 'Priority phone support'] as feature}
						<div class="flex items-start gap-3">
							<div
								class="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--success-light)]"
							>
								<Check size={10} color="var(--success)" weight="bold" />
							</div>
							<span class="text-[13px] text-[var(--foreground)]">{feature}</span>
						</div>
					{/each}
				</div>

				<a
					href="mailto:hello@auditlift.app"
					class="flex items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--border)] px-5 py-2.5 text-[14px] font-medium text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--background-alt)]"
				>
					<Envelope size={14} />
					Talk to us
				</a>
			</Card>
		</div>

		<!-- Anchor line -->
		<p class="mt-10 text-center text-[13px] text-[var(--foreground-muted)]">
			Enterprise compliance tools start at $7,500/yr or more. AuditLift gets you audit-ready from
			<strong>$149/mo</strong>.
		</p>
	</section>

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
				<a
					href="/privacy"
					class="text-[12px] text-[var(--foreground-subtle)] no-underline hover:text-[var(--foreground)]"
					>Privacy</a
				>
			</div>
		</div>
	</footer>
</div>
