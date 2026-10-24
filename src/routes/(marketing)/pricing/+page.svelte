<script lang="ts">
	import { planPrices } from '$lib/pricing';
	import { Check, ArrowRight, Envelope, Handshake } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import ConsultingModal from '$lib/components/consulting/ConsultingModal.svelte';
	import * as m from '$lib/paraglide/messages';
	import SEO from '$lib/components/marketing/SEO.svelte';
	import FAQ from '$lib/components/marketing/FAQ.svelte';
	import { productFAQs } from '$lib/data/marketing';
	import { breadcrumbSchema, faqSchema, organizationSchema, softwareSchema } from '$lib/seo';

	const pricingFAQs = [productFAQs[5], productFAQs[4]];

	let billing = $state<'monthly' | 'yearly'>('monthly');
	let consultingOpen = $state(false);

	const plans = [
		{
			id: 'starter',
			name: 'Starter',
			description:
				'For founders who need a defensible, reusable answer base for their first enterprise security reviews.',
			monthlyPrice: planPrices.starter.monthly,
			yearlyPrice: planPrices.starter.yearly,
			highlighted: false,
			cta: 'Start free trial',
			ctaHref: '/login',
			features: [
				'1 compliance framework (SOC 2)',
				'Unlimited controls & evidence',
				'AI-powered policy generator',
				'Approved answer library',
				'Auditor-ready export package',
				'Up to 5 team members',
				'Email support',
				'Readiness score dashboard',
				'10-day free trial'
			]
		},
		{
			id: 'growth',
			name: 'Growth',
			description:
				'For teams managing a growing pipeline of buyer security reviews and reusable company knowledge.',
			monthlyPrice: planPrices.growth.monthly,
			yearlyPrice: planPrices.growth.yearly,
			highlighted: true,
			cta: 'Start free trial',
			ctaHref: '/login',
			features: [
				'All 3 frameworks (SOC 2, PCI-DSS, ISO 27001)',
				'Unlimited controls & evidence',
				'AI-powered policy generator',
				'Approved answer library & deal workspaces',
				'Auditor-ready export package',
				'Unlimited team members',
				'Priority email support',
				'Readiness score dashboard',
				'10-day free trial'
			]
		}
	];
</script>

<SEO
	title="Security Questionnaire Software Pricing | AuditLift"
	description={`AuditLift Starter is $${planPrices.starter.monthly} USD/month; Growth is $${planPrices.growth.monthly} USD/month. Compare security questionnaire and compliance readiness features. Try free for 10 days.`}
	path="/pricing"
	schemas={[
		organizationSchema,
		softwareSchema,
		faqSchema(pricingFAQs),
		breadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: 'Pricing', path: '/pricing' }
		])
	]}
/>

<!-- Nav -->
<nav
	class="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm"
>
	<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
		<a href="/" class="flex items-center gap-2 no-underline">
			<LogoMark size={20} />
			<span class="text-[15px] font-semibold tracking-tight text-[var(--foreground)]"
				>Auditlift</span
			>
		</a>
		<div class="flex items-center gap-3">
			<ThemeToggle />
			<a
				href="/login"
				class="hidden text-[13px] font-medium text-[var(--foreground-muted)] no-underline hover:text-[var(--foreground)] sm:inline"
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
				Security questionnaire software pricing
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
					? 'bg-[var(--background-elevated)] text-[var(--foreground)] shadow-sm'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				Monthly
			</button>
			<button
				onclick={() => (billing = 'yearly')}
				class="flex cursor-pointer items-center gap-2 rounded-[var(--radius-full)] px-4 py-1.5 text-[13px] font-medium transition-all {billing ===
				'yearly'
					? 'bg-[var(--background-elevated)] text-[var(--foreground)] shadow-sm'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				Yearly
				<span
					class="rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]"
					>{m.pricing_annual_bonus()}</span
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
						{#each plan.features as feature (feature)}
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
						For larger teams with complex security review requirements, SSO, and dedicated
						onboarding.
					</p>
				</div>

				<div class="mb-8 flex-1 space-y-3">
					{#each ['Everything in Growth', 'SSO / SAML', 'Dedicated onboarding', 'SLA & uptime guarantees', 'Custom contract & billing', 'Priority phone support'] as feature (feature)}
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
			Built for the deal cycle before you need heavyweight compliance automation. Auditlift gets you
			<strong>buyer-response ready from ${planPrices.starter.monthly}/mo</strong> — focused on helping
			you respond and close.
		</p>
		<p class="mt-3 text-center text-[13px] text-[var(--foreground-muted)]">
			All prices in USD. Annual billing: Starter ${planPrices.starter.yearly}/year; Growth ${planPrices
				.growth.yearly}/year. The 10-day free trial requires no credit card and includes one
			completed questionnaire export.
		</p>

		<section class="mt-14 w-full" aria-labelledby="pricing-faq">
			<h2 id="pricing-faq" class="mb-4 text-center text-2xl font-semibold text-[var(--foreground)]">
				Pricing and readiness questions
			</h2>
			<FAQ items={pricingFAQs} />
			<p class="mt-6 text-center text-[14px]">
				<a href="/solutions/security-questionnaire-automation" class="text-[var(--brand)]"
					>Explore the security questionnaire workflow</a
				>
			</p>
		</section>

		<!-- Advisory CTA -->
		<div
			class="mt-14 flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-10 text-center sm:flex-row sm:text-left"
		>
			<div
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-light)]"
			>
				<Handshake size={24} color="var(--brand)" />
			</div>
			<div class="flex-1">
				<p class="text-[15px] font-semibold text-[var(--foreground)]">
					{m.consulting_cta_pricing_headline()}
				</p>
				<p class="mt-1 text-[13px] text-[var(--foreground-muted)]">
					{m.consulting_cta_pricing_body()}
				</p>
			</div>
			<button
				onclick={() => (consultingOpen = true)}
				class="shrink-0 rounded-[var(--radius)] border border-[var(--brand)] bg-transparent px-5 py-2.5 text-[14px] font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white"
			>
				{m.consulting_cta_pricing_button()}
			</button>
		</div>

		<ConsultingModal bind:open={consultingOpen} />
	</section>

	<footer class="border-t border-[var(--border)] py-8">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6">
			<p class="text-[12px] text-[var(--foreground-subtle)]">
				© 2026 Auditlift. All rights reserved.
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
