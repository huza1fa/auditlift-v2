<script lang="ts">
	import { CheckSquare, FileText, DownloadSimple } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';

	const features = [
		{
			icon: CheckSquare,
			title: 'Pre-mapped Controls',
			description: 'SOC 2, PCI-DSS, and ISO 27001 controls pre-loaded and ready to fill in.'
		},
		{
			icon: FileText,
			title: 'Policy Generator',
			description: 'AI-generated, audit-grade policies tailored to your stack in seconds.'
		},
		{
			icon: DownloadSimple,
			title: 'Auditor Export',
			description: 'One-click ZIP package your auditor can actually open and use.'
		}
	];

	function scrollToFeatures() {
		document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<!-- Nav -->
<nav
	class="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm"
>
	<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
		<a href="/" class="flex items-center gap-2 no-underline">
			<LogoMark size={20} />
			<span class="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">AuditLift</span>
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
	<!-- Hero -->
	<section class="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-32 pb-24 text-center">
		<!-- Compliance pill -->
		<div
			class="mb-6 inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-[12px] text-[var(--foreground-muted)]"
		>
			SOC 2 · PCI-DSS · ISO 27001
		</div>

		<!-- Headline -->
		<h1
			class="mb-4 max-w-2xl text-4xl font-bold tracking-tight text-[var(--foreground)]"
		>
			Get audit-ready without the $20K consultant
		</h1>

		<!-- Subheadline -->
		<p class="mt-4 max-w-xl text-[15px] text-[var(--foreground-muted)]">
			Pre-mapped controls, AI-generated policies, and a clean export your auditor can actually use.
		</p>

		<!-- CTA row -->
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="/login"
				class="rounded-[var(--radius)] bg-[var(--brand)] px-5 py-2.5 text-[14px] font-medium text-white no-underline transition-colors hover:bg-[var(--brand-hover)]"
			>
				Start free trial →
			</a>
			<button
				onclick={scrollToFeatures}
				class="cursor-pointer rounded-[var(--radius)] border border-[var(--border)] bg-transparent px-5 py-2.5 text-[14px] font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
			>
				See how it works
			</button>
		</div>

		<!-- Static mockup card -->
		<div
			class="mt-14 w-full max-w-sm rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-6"
		>
			<div class="mb-4 flex items-center justify-between">
				<div class="text-left">
					<p class="text-[11px] font-medium uppercase tracking-widest text-[var(--foreground-subtle)]">
						SOC 2 Readiness
					</p>
					<p class="mt-1 text-[22px] font-bold text-[var(--foreground)]">73%</p>
					<p class="text-[12px] text-[var(--foreground-muted)]">4 controls remaining</p>
				</div>
				<!-- Readiness ring -->
				<div class="relative h-14 w-14">
					<svg class="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
						<circle cx="28" cy="28" r="22" fill="none" stroke="var(--border)" stroke-width="5" />
						<circle
							cx="28"
							cy="28"
							r="22"
							fill="none"
							stroke="var(--brand)"
							stroke-width="5"
							stroke-linecap="round"
							stroke-dasharray="138.2"
							stroke-dashoffset="37.3"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-[11px] font-bold text-[var(--brand)]">73%</span>
					</div>
				</div>
			</div>
			<p class="mt-2 text-center text-[12px] text-[var(--foreground-muted)]">
				73% audit ready · 4 controls remaining
			</p>
		</div>
	</section>

	<!-- Features -->
	<section
		id="features"
		class="border-y border-[var(--border)] bg-[var(--background-subtle)] py-20"
	>
		<div class="mx-auto max-w-6xl px-6">
			<p
				class="mb-12 text-center text-[11px] font-medium uppercase tracking-widest text-[var(--foreground-subtle)]"
			>
				How it works
			</p>
			<div class="grid grid-cols-1 gap-10 md:grid-cols-3">
				{#each features as feature}
					<div class="flex flex-col">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-[var(--border)]"
						>
							<feature.icon size={16} color="var(--foreground-muted)" />
						</div>
						<h3 class="mt-3 text-[14px] font-semibold text-[var(--foreground)]">{feature.title}</h3>
						<p class="mt-1 text-[13px] text-[var(--foreground-muted)]">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Social proof strip -->
	<section class="border-b border-[var(--border)] py-12">
		<div class="mx-auto max-w-3xl px-6 text-center">
			<p class="text-[13px] text-[var(--foreground-muted)]">
				Built for early-stage SaaS teams closing enterprise deals
			</p>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="py-20">
		<div class="mx-auto max-w-xl px-6 text-center">
			<h2 class="text-[28px] font-bold tracking-tight text-[var(--foreground)]">
				Ready to get compliant?
			</h2>
			<p class="mt-3 text-[14px] text-[var(--foreground-muted)]">
				Start your 10-day free trial. No credit card required.
			</p>
			<a
				href="/login"
				class="mt-8 inline-flex rounded-[var(--radius)] bg-[var(--brand)] px-6 py-3 text-[14px] font-medium text-white no-underline transition-colors hover:bg-[var(--brand-hover)]"
			>
				Get started free →
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-[var(--border)] py-6">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6">
			<div class="flex items-center gap-2">
				<LogoMark size={14} />
				<span class="text-[13px] font-medium text-[var(--foreground-muted)]">AuditLift</span>
				<span class="text-[13px] text-[var(--foreground-subtle)]">&copy; 2026</span>
			</div>
			<ThemeToggle />
		</div>
	</footer>
</div>
