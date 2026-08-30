<script lang="ts">
	import {
		Check,
		ArrowRight,
		CheckSquare,
		FileText,
		FolderOpen,
		DownloadSimple,
		Users,
		ChartBar,
		Quotes,
		Download
	} from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import ConsultingModal from '$lib/components/consulting/ConsultingModal.svelte';
	import LeadMagnetModal from '$lib/components/consulting/LeadMagnetModal.svelte';
	import * as m from '$lib/paraglide/messages';

	let pricingPlan = $state<'monthly' | 'yearly'>('monthly');

	const headlines = [
		{ line1: 'Return security questionnaires', line2: 'before the deal stalls' },
		{ line1: 'Answer buyer security reviews', line2: 'with claims you can defend' },
		{ line1: 'Turn every finished review', line2: 'into your next advantage' },
		{ line1: 'Build buyer trust', line2: 'while you close deals' }
	];

	let headlineIndex = $state(0);
	let headlineVisible = $state(true);

	onMount(() => {
		const interval = setInterval(() => {
			headlineVisible = false;
			setTimeout(() => {
				headlineIndex = (headlineIndex + 1) % headlines.length;
				headlineVisible = true;
			}, 400);
		}, 3500);
		return () => clearInterval(interval);
	});

	const pricingPlans = [
		{
			id: 'starter',
			name: 'Starter',
			monthlyPrice: 149,
			yearlyPrice: 1431,
			features: [
				'1 framework (SOC 2)',
				'Unlimited evidence & policies',
				'Up to 5 team members',
				'Auditor export',
				'10-day free trial'
			]
		},
		{
			id: 'growth',
			name: 'Growth',
			monthlyPrice: 299,
			yearlyPrice: 2870,
			highlighted: true,
			features: [
				'All 3 frameworks',
				'Unlimited evidence & policies',
				'Unlimited team members',
				'Auditor export',
				'10-day free trial'
			]
		}
	];

	const features = [
		{
			icon: CheckSquare,
			title: 'Cited Answer Workspace',
			description:
				'Every answer is tied back to an approved policy, evidence source, or confirmed company fact — so reviewers know exactly what they can send.',
			iconBg: 'feature-icon-brand'
		},
		{
			icon: FileText,
			title: 'Reusable Answer Library',
			description:
				'Approve the answers your team trusts. The next buyer review starts with proven company language, not a blank page.',
			iconBg: 'feature-icon-success'
		},
		{
			icon: FolderOpen,
			title: 'Policies & Evidence',
			description:
				'Keep your proof organized and tagged to controls. Share instantly when a prospect asks for it.',
			iconBg: 'feature-icon-info'
		},
		{
			icon: ChartBar,
			title: 'Deal-Critical Gaps',
			description:
				'Know which missing facts, policies, or evidence block this buyer — and what to resolve before the deadline.',
			iconBg: 'feature-icon-warning'
		},
		{
			icon: Users,
			title: 'Deal Workspaces',
			description:
				'Keep each customer security review, deadline, questionnaire, and submission status in one clear place.',
			iconBg: 'feature-icon-brand'
		},
		{
			icon: DownloadSimple,
			title: 'Security Package Export',
			description:
				'One-click export of a clean, organized package - for auditors, prospects, or enterprise security reviews.',
			iconBg: 'feature-icon-success'
		}
	];

	const steps = [
		{
			number: '01',
			title: 'Open the buyer review',
			description:
				'Create a deal workspace and upload the customer questionnaire. AuditLift identifies what can be answered now and what needs review.'
		},
		{
			number: '02',
			title: 'Review only what matters',
			description:
				'Confirm buyer-specific facts, attach supporting evidence, and approve reusable answers for the next security review.'
		},
		{
			number: '03',
			title: 'Send a defensible response',
			description:
				'Export a clear response package, then reuse the work you validated when the next enterprise buyer asks the same questions.'
		}
	];

	let consultingOpen = $state(false);
	let leadMagnetOpen = $state(false);
	let leadMagnetResource = $state<'soc2-checklist' | 'security-review-template' | null>(null);

	function openLeadMagnet(resource: 'soc2-checklist' | 'security-review-template') {
		leadMagnetResource = resource;
		leadMagnetOpen = true;
	}

	function scrollTo(id: string) {
		document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>AuditLift - Security Questionnaires That Keep Deals Moving</title>
	<meta
		name="description"
		content="Return buyer-ready security questionnaires with cited answers, approved company knowledge, and exact next steps for any gaps. Built for B2B SaaS teams winning enterprise deals."
	/>
	<link rel="canonical" href="https://auditlift.app" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://auditlift.app" />
	<meta property="og:site_name" content="AuditLift" />
	<meta property="og:title" content="AuditLift - Win Deals Faster with Security Readiness" />
	<meta
		property="og:description"
		content="Return buyer-ready security questionnaires with cited answers, approved company knowledge, and exact next steps for any gaps."
	/>
	<meta property="og:image" content="https://auditlift.app/og.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@auditlift" />
	<meta name="twitter:title" content="AuditLift - Win Deals Faster with Security Readiness" />
	<meta
		name="twitter:description"
		content="Complete buyer security questionnaires with cited, reusable answers. Built for the enterprise deal cycle."
	/>
	<meta name="twitter:image" content="https://auditlift.app/og.png" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': 'https://auditlift.app/#organization',
				name: 'AuditLift',
				url: 'https://auditlift.app',
				email: 'hello@auditlift.app',
				description:
					'Buyer security-response workspace that helps teams complete questionnaires with cited answers, approved company knowledge, and clear gap remediation.'
			},
			{
				'@type': 'WebSite',
				'@id': 'https://auditlift.app/#website',
				url: 'https://auditlift.app',
				name: 'AuditLift',
				publisher: { '@id': 'https://auditlift.app/#organization' }
			},
			{
				'@type': 'SoftwareApplication',
				name: 'AuditLift',
				applicationCategory: 'BusinessApplication',
				operatingSystem: 'Web',
				url: 'https://auditlift.app',
				description:
					'Complete buyer security questionnaires with cited answers, approved company knowledge, and clear next steps for gaps.',
				offers: [
					{
						'@type': 'Offer',
						name: 'Starter',
						price: '149.00',
						priceCurrency: 'USD',
						description: '1 compliance framework, up to 5 team members, 10-day free trial'
					},
					{
						'@type': 'Offer',
						name: 'Growth',
						price: '299.00',
						priceCurrency: 'USD',
						description: 'All 3 frameworks, unlimited team members, 10-day free trial'
					}
				]
			}
		]
	})}</script>`}
</svelte:head>

<!-- Nav -->
<nav class="nav-bar">
	<div class="nav-inner">
		<a href="/" class="nav-logo">
			<LogoMark size={20} />
			<span class="nav-logo-text">AuditLift</span>
		</a>
		<div class="nav-links">
			<button class="nav-link" onclick={() => scrollTo('#features')}>Features</button>
			<button class="nav-link" onclick={() => scrollTo('#pricing')}>Pricing</button>
			<a href="/blog" class="nav-link">Blog</a>
		</div>
		<div class="nav-actions">
			<ThemeToggle />
			<a href="/login" class="nav-signin">Sign in</a>
			<a href="/login" class="btn-primary">Start free trial</a>
		</div>
	</div>
</nav>

<div class="page-wrapper">
	<!-- Hero -->
	<section class="hero-section">
		<div class="hero-blob" aria-hidden="true"></div>
		<div class="hero-dots" aria-hidden="true"></div>
		<div class="hero-content">
			<!-- Eyebrow pill -->
			<div class="eyebrow-pill">SOC 2 · PCI-DSS · ISO 27001</div>

			<!-- Headline -->
			<h1
				class="hero-headline"
				class:headline-visible={headlineVisible}
				class:headline-hidden={!headlineVisible}
			>
				{headlines[headlineIndex].line1}<br />{headlines[headlineIndex].line2}
			</h1>

			<!-- Subheadline -->
			<p class="hero-subheadline">
				AuditLift turns your approved policies, evidence, and company facts into cited answers for
				buyer security reviews. Close the few gaps that matter, send a defensible response, and keep
				the approved answers for the next deal.
			</p>

			<!-- CTA row -->
			<div class="hero-cta-row">
				<a href="/login" class="btn-primary btn-lg">
					Start free trial
					<ArrowRight size={16} weight="bold" />
				</a>
				<button class="btn-ghost btn-lg" onclick={() => scrollTo('#pricing')}>View pricing</button>
			</div>

			<!-- Hero mockup card -->
			<div class="hero-card-wrapper">
				<div class="hero-card">
					<!-- Card header -->
					<div class="hero-card-header">
						<div class="hero-card-title-group">
							<p class="hero-card-label">SOC 2 Readiness</p>
							<p class="hero-card-score">73%</p>
						</div>
						<!-- Progress ring -->
						<div class="progress-ring-wrapper">
							<svg class="progress-ring" viewBox="0 0 56 56" aria-hidden="true">
								<circle
									cx="28"
									cy="28"
									r="22"
									fill="none"
									stroke="var(--border)"
									stroke-width="5"
								/>
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
							<span class="progress-ring-label">73%</span>
						</div>
					</div>

					<!-- Controls list -->
					<div class="hero-controls-list">
						<div class="hero-control-item">
							<span class="control-status-dot control-done">
								<Check size={10} weight="bold" />
							</span>
							<span class="control-id">CC6.1</span>
							<span class="control-name">Access Control</span>
							<span class="control-badge control-badge-done">Done</span>
						</div>
						<div class="hero-control-item">
							<span class="control-status-dot control-done">
								<Check size={10} weight="bold" />
							</span>
							<span class="control-id">CC7.2</span>
							<span class="control-name">System Monitoring</span>
							<span class="control-badge control-badge-done">Done</span>
						</div>
						<div class="hero-control-item">
							<span class="control-status-dot control-pending"></span>
							<span class="control-id">CC8.1</span>
							<span class="control-name">Change Management</span>
							<span class="control-badge control-badge-pending">Pending</span>
						</div>
					</div>

					<!-- Card footer -->
					<div class="hero-card-footer">
						<span>4 controls remaining</span>
						<span class="hero-card-footer-dot">·</span>
						<span>Updated just now</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Trusted by -->
	<section class="trusted-bar">
		<div class="trusted-inner">
			<p class="trusted-label">Trusted by teams at</p>
			<div class="trusted-logos">
				<span class="trusted-logo">Devrex</span>
				<span class="trusted-logo">AWFCA</span>
				<span class="trusted-logo">Getherap</span>
				<span class="trusted-logo">Outcome</span>
			</div>
		</div>
	</section>

	<!-- Stats bar -->
	<section class="stats-bar">
		<div class="stats-inner">
			<div class="stat-item">
				<p class="stat-value">30 days or less</p>
				<p class="stat-label">Average time to audit-ready</p>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<p class="stat-value">From $149/mo</p>
				<p class="stat-label">No per-seat pricing</p>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<p class="stat-value">SOC 2 + PCI + ISO</p>
				<p class="stat-label">All major frameworks</p>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="testimonials-section">
		<div class="section-inner">
			<div class="section-header">
				<p class="section-label">Beta feedback</p>
				<h2 class="section-headline">What early users are saying</h2>
			</div>
			<div class="testimonials-grid">
				<div class="testimonial-card">
					<Quotes size={20} class="testimonial-quote-icon" />
					<p class="testimonial-text">
						"AuditLift turned what used to be a two-week fire drill into a single afternoon. We
						answered a 60-question security review in under three hours and closed the deal."
					</p>
					<div class="testimonial-author">
						<p class="testimonial-name">Morgan</p>
						<p class="testimonial-role">Northeastern University</p>
					</div>
				</div>
				<div class="testimonial-card">
					<Quotes size={20} class="testimonial-quote-icon" />
					<p class="testimonial-text">
						"The policy generator alone saved us thousands in consultant fees. We had draft SOC 2
						policies tailored to our stack within an hour."
					</p>
					<div class="testimonial-author">
						<p class="testimonial-name">Ahmad</p>
						<p class="testimonial-role">Data analytics firm</p>
					</div>
				</div>
				<div class="testimonial-card">
					<Quotes size={20} class="testimonial-quote-icon" />
					<p class="testimonial-text">
						"We are selling into health tech - the compliance bar is brutal. AuditLift helped us
						understand exactly what we needed before the buyer even asked."
					</p>
					<div class="testimonial-author">
						<p class="testimonial-name">Stephen</p>
						<p class="testimonial-role">Health tech startup</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Lead Magnet -->
	<section class="lead-magnet-section">
		<div class="section-inner">
			<div class="section-header">
				<p class="section-label">Free resources</p>
				<h2 class="section-headline">Downloadable guides to get you started</h2>
			</div>
			<div class="lead-magnet-grid">
				<div class="lead-magnet-card">
					<div class="lead-magnet-icon-box">
						<FileText size={24} />
					</div>
					<h3 class="lead-magnet-title">SOC 2 Checklist for SaaS Startups</h3>
					<p class="lead-magnet-description">
						A practical 47-point checklist covering the policies, evidence, and controls you need
						before your first SOC 2 audit.
					</p>
					<button
						type="button"
						class="lead-magnet-btn"
						onclick={() => openLeadMagnet('soc2-checklist')}
					>
						<Download size={16} />
						Download free
					</button>
				</div>
				<div class="lead-magnet-card">
					<div class="lead-magnet-icon-box">
						<CheckSquare size={24} />
					</div>
					<h3 class="lead-magnet-title">10-Question Enterprise Security Review</h3>
					<p class="lead-magnet-description">
						The exact 10 questions every enterprise buyer asks first. Pre-answer them before the
						full questionnaire lands.
					</p>
					<button
						type="button"
						class="lead-magnet-btn"
						onclick={() => openLeadMagnet('security-review-template')}
					>
						<Download size={16} />
						Download free
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Features -->
	<section id="features" class="features-section">
		<div class="section-inner">
			<div class="section-header">
				<p class="section-label">Everything you need</p>
				<h2 class="section-headline">Everything you need to get audit-ready</h2>
			</div>
			<div class="features-grid">
				{#each features as feature (feature.title)}
					<div class="feature-card">
						<div class="feature-icon-box {feature.iconBg}">
							<feature.icon size={20} />
						</div>
						<h3 class="feature-title">{feature.title}</h3>
						<p class="feature-description">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section class="steps-section">
		<div class="section-inner">
			<div class="section-header">
				<p class="section-label">Simple process</p>
				<h2 class="section-headline">Three steps to audit-ready</h2>
			</div>
			<div class="steps-row">
				{#each steps as step, i (step.number)}
					<div class="step-item">
						<div class="step-number-circle">{step.number}</div>
						<h3 class="step-title">{step.title}</h3>
						<p class="step-description">{step.description}</p>
					</div>
					{#if i < steps.length - 1}
						<div class="step-arrow" aria-hidden="true">
							<ArrowRight size={20} />
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing -->
	<section id="pricing" class="pricing-section">
		<div class="section-inner">
			<div class="section-header">
				<p class="section-label">Simple pricing</p>
				<h2 class="section-headline">Transparent pricing, no surprises</h2>
			</div>

			<!-- Toggle -->
			<div class="pricing-toggle-wrapper">
				<button
					class="pricing-toggle-btn"
					class:active={pricingPlan === 'monthly'}
					onclick={() => (pricingPlan = 'monthly')}
				>
					Monthly
				</button>
				<button
					class="pricing-toggle-btn"
					class:active={pricingPlan === 'yearly'}
					onclick={() => (pricingPlan = 'yearly')}
				>
					Yearly
					<span class="pricing-save-badge">Save 20%</span>
				</button>
			</div>

			<!-- Pricing cards -->
			<div class="pricing-cards-grid">
				{#each pricingPlans as plan (plan.id)}
					<div class="pricing-card {plan.highlighted ? 'pricing-card--highlighted' : ''}">
						<div class="pricing-card-body">
							<div class="pricing-card-header">
								<div>
									<p class="pricing-plan-name">{plan.name}</p>
								</div>
								<div class="pricing-price-group">
									<span class="pricing-price">
										${pricingPlan === 'monthly'
											? plan.monthlyPrice
											: Math.round(plan.yearlyPrice / 12)}
									</span>
									<span class="pricing-price-period">/mo</span>
								</div>
							</div>
							{#if pricingPlan === 'yearly'}
								<p class="pricing-yearly-note">
									${plan.yearlyPrice.toLocaleString()}/yr billed annually
								</p>
							{/if}
							<ul class="pricing-features-list">
								{#each plan.features as item (item)}
									<li class="pricing-feature-item">
										<span class="pricing-check-icon"><Check size={14} weight="bold" /></span>
										{item}
									</li>
								{/each}
							</ul>
							<a href="/login" class="btn-primary pricing-cta-btn">Start free trial</a>
							<p class="pricing-trial-note">10-day free trial. No credit card required.</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Competitor compare -->
			<div class="competitor-compare">
				<p class="competitor-compare-text">
					Enterprise compliance tools typically cost <span class="competitor-name"
						>$7,500–$15,000/yr</span
					>. AuditLift starts at <span class="competitor-name">$149/mo</span>.
				</p>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="final-cta-section">
		<div class="final-cta-inner">
			<h2 class="final-cta-headline">Don't let security questions kill another deal.</h2>
			<p class="final-cta-sub">
				Know exactly where you stand. Respond with confidence. Close faster.
			</p>
			<a href="/login" class="btn-primary btn-lg">
				Get started free
				<ArrowRight size={16} weight="bold" />
			</a>
			<p class="final-cta-advisory">
				Or grab our <button
					type="button"
					class="advisory-link"
					onclick={() => openLeadMagnet('soc2-checklist')}>free SOC 2 checklist</button
				> to get started today.
			</p>
		</div>
	</section>

	<ConsultingModal bind:open={consultingOpen} />
	<LeadMagnetModal bind:open={leadMagnetOpen} bind:resource={leadMagnetResource} />

	<!-- Footer -->
	<footer class="site-footer">
		<div class="footer-inner">
			<div class="footer-logo">
				<LogoMark size={16} />
				<span class="footer-logo-text">AuditLift</span>
				<span class="footer-copy">&copy; 2026</span>
			</div>
			<nav class="footer-links" aria-label="Footer navigation">
				<a href="/" class="footer-link">Home</a>
				<button class="footer-link" onclick={() => scrollTo('#features')}>Features</button>
				<button class="footer-link" onclick={() => scrollTo('#pricing')}>Pricing</button>
				<a href="/blog" class="footer-link">Blog</a>
				<a href="/privacy" class="footer-link">Privacy</a>
				<a href="/terms" class="footer-link">Terms</a>
				<a href="/login" class="footer-link">Sign in</a>
			</nav>
			<ThemeToggle />
		</div>
	</footer>
</div>

<style>
	/* =====================
	   NAV
	   ===================== */
	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		border-bottom: 1px solid var(--border);
		background: color-mix(in srgb, var(--background) 85%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	.nav-inner {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 3.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	.nav-logo-text {
		font-size: 0.9375rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--foreground);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav-link {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--foreground-muted);
		border-radius: var(--radius);
		transition:
			color 0.15s,
			background 0.15s;
	}

	.nav-link:hover {
		color: var(--foreground);
		background: var(--background-subtle);
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.nav-signin {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--foreground-muted);
		text-decoration: none;
		transition: color 0.15s;
	}

	.nav-signin:hover {
		color: var(--foreground);
	}

	/* =====================
	   BUTTONS
	   ===================== */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.4375rem 0.875rem;
		background: var(--brand);
		color: #fff;
		border: none;
		border-radius: var(--radius);
		font-size: 0.8125rem;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition:
			background 0.15s,
			opacity 0.15s;
		white-space: nowrap;
	}

	.btn-primary:hover {
		background: var(--brand-hover, color-mix(in srgb, var(--brand) 85%, #000));
	}

	.btn-primary.btn-lg {
		padding: 0.6875rem 1.375rem;
		font-size: 0.9375rem;
		border-radius: var(--radius-lg, var(--radius));
	}

	.btn-ghost {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.4375rem 0.875rem;
		background: transparent;
		color: var(--foreground-muted);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		font-size: 0.8125rem;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s,
			background 0.15s;
	}

	.btn-ghost:hover {
		border-color: var(--foreground-muted);
		color: var(--foreground);
		background: var(--background-subtle);
	}

	.btn-ghost.btn-lg {
		padding: 0.6875rem 1.375rem;
		font-size: 0.9375rem;
		border-radius: var(--radius-lg, var(--radius));
	}

	/* =====================
	   PAGE WRAPPER
	   ===================== */
	.page-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100svh;
		background: var(--background);
	}

	/* =====================
	   HERO
	   ===================== */
	.hero-section {
		position: relative;
		overflow: hidden;
		padding: 8rem 1.5rem 5rem;
		display: flex;
		justify-content: center;
		background-image: radial-gradient(
			ellipse 80% 50% at 50% -10%,
			color-mix(in srgb, var(--brand) 10%, transparent),
			transparent
		);
	}

	.hero-blob {
		pointer-events: none;
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
			ellipse 60% 40% at 70% 60%,
			color-mix(in srgb, var(--brand) 6%, transparent),
			transparent
		);
	}

	.hero-dots {
		pointer-events: none;
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
		background-size: 28px 28px;
		opacity: 0.5;
		mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 42rem;
		width: 100%;
	}

	.eyebrow-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.875rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-full, 9999px);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--foreground-muted);
		background: color-mix(in srgb, var(--brand) 8%, var(--background));
		margin-bottom: 1.5rem;
		letter-spacing: 0.03em;
	}

	.hero-headline {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1.08;
		color: var(--foreground);
		margin: 0 0 1.25rem;
		transition:
			opacity 0.4s ease,
			transform 0.4s ease;
	}
	.headline-visible {
		opacity: 1;
		transform: translateY(0);
	}
	.headline-hidden {
		opacity: 0;
		transform: translateY(8px);
	}

	.hero-subheadline {
		font-size: 1.0625rem;
		line-height: 1.65;
		color: var(--foreground-muted);
		max-width: 36rem;
		margin: 0 0 2.25rem;
	}

	.hero-cta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 3.5rem;
	}

	/* Hero card */
	.hero-card-wrapper {
		width: 100%;
		max-width: 24rem;
		filter: drop-shadow(0 16px 40px color-mix(in srgb, var(--brand) 15%, transparent));
	}

	.hero-card {
		background: var(--background-elevated);
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		overflow: hidden;
	}

	.hero-card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 1.25rem 1.25rem 1rem;
		border-bottom: 1px solid var(--border);
	}

	.hero-card-title-group {
		text-align: left;
	}

	.hero-card-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--foreground-subtle);
		margin: 0 0 0.25rem;
	}

	.hero-card-score {
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--foreground);
		margin: 0;
		letter-spacing: -0.03em;
	}

	.progress-ring-wrapper {
		position: relative;
		width: 3.5rem;
		height: 3.5rem;
		flex-shrink: 0;
	}

	.progress-ring {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}

	.progress-ring-label {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--brand);
	}

	/* Controls list */
	.hero-controls-list {
		padding: 0.75rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.hero-control-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.625rem;
		border-radius: var(--radius);
		background: var(--background-subtle);
		font-size: 0.8125rem;
	}

	.control-status-dot {
		width: 1.125rem;
		height: 1.125rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.control-done {
		background: color-mix(in srgb, var(--success) 15%, transparent);
		color: var(--success);
	}

	.control-pending {
		background: color-mix(in srgb, var(--warning) 20%, transparent);
		border: 1.5px solid var(--warning);
	}

	.control-id {
		font-weight: 600;
		color: var(--foreground);
		font-variant-numeric: tabular-nums;
		font-size: 0.75rem;
	}

	.control-name {
		flex: 1;
		text-align: left;
		color: var(--foreground-muted);
	}

	.control-badge {
		padding: 0.125rem 0.5rem;
		border-radius: var(--radius-full, 9999px);
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.control-badge-done {
		background: color-mix(in srgb, var(--success) 12%, transparent);
		color: var(--success);
	}

	.control-badge-pending {
		background: color-mix(in srgb, var(--warning) 15%, transparent);
		color: var(--warning);
	}

	.hero-card-footer {
		padding: 0.625rem 1.25rem;
		border-top: 1px solid var(--border);
		font-size: 0.75rem;
		color: var(--foreground-subtle);
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.hero-card-footer-dot {
		opacity: 0.4;
	}

	/* =====================
	   STATS BAR
	   ===================== */
	.stats-bar {
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		background: var(--background-subtle);
		padding: 2rem 1.5rem;
	}

	.stats-inner {
		max-width: 48rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.stat-item {
		text-align: center;
		flex: 1;
		min-width: 8rem;
	}

	.stat-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--foreground);
		margin: 0 0 0.25rem;
		letter-spacing: -0.02em;
	}

	.stat-label {
		font-size: 0.8125rem;
		color: var(--foreground-muted);
		margin: 0;
	}

	.stat-divider {
		width: 1px;
		height: 2.5rem;
		background: var(--border);
		flex-shrink: 0;
	}

	/* =====================
	   SHARED SECTION STYLES
	   ===================== */
	.section-inner {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.section-header {
		text-align: center;
		margin-bottom: 3.5rem;
	}

	.section-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--brand);
		margin: 0 0 0.75rem;
	}

	.section-headline {
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--foreground);
		margin: 0;
	}

	/* =====================
	   FEATURES
	   ===================== */
	.features-section {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: 1.5rem;
	}

	.feature-card {
		padding: 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		background: var(--background-elevated);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.feature-card:hover {
		border-color: color-mix(in srgb, var(--brand) 40%, var(--border));
		box-shadow: 0 4px 16px color-mix(in srgb, var(--brand) 8%, transparent);
	}

	.feature-icon-box {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-lg, 0.75rem);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.feature-icon-brand {
		background: color-mix(in srgb, var(--brand) 15%, transparent);
		color: var(--brand);
	}

	.feature-icon-success {
		background: color-mix(in srgb, var(--success) 15%, transparent);
		color: var(--success);
	}

	.feature-icon-info {
		background: color-mix(in srgb, var(--info) 15%, transparent);
		color: var(--info);
	}

	.feature-icon-warning {
		background: color-mix(in srgb, var(--warning) 15%, transparent);
		color: var(--warning);
	}

	.feature-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 0 0 0.5rem;
	}

	.feature-description {
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--foreground-muted);
		margin: 0;
	}

	/* =====================
	   HOW IT WORKS
	   ===================== */
	.steps-section {
		padding: 5rem 1.5rem;
		background: var(--background-subtle);
		border-bottom: 1px solid var(--border);
	}

	.steps-row {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.step-item {
		flex: 1;
		min-width: 12rem;
		max-width: 20rem;
		text-align: center;
		padding: 1.5rem;
	}

	.step-number-circle {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--brand) 12%, var(--background));
		border: 2px solid color-mix(in srgb, var(--brand) 30%, var(--border));
		color: var(--brand);
		font-size: 0.875rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1rem;
		letter-spacing: 0.02em;
	}

	.step-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 0 0 0.5rem;
	}

	.step-description {
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--foreground-muted);
		margin: 0;
	}

	.step-arrow {
		display: flex;
		align-items: center;
		padding-top: 1.5rem;
		color: var(--foreground-subtle);
		flex-shrink: 0;
	}

	/* =====================
	   PRICING
	   ===================== */
	.pricing-section {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.pricing-toggle-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		margin-bottom: 2.5rem;
		background: var(--background-subtle);
		border: 1px solid var(--border);
		border-radius: var(--radius-full, 9999px);
		padding: 0.25rem;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.pricing-toggle-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4375rem 1.125rem;
		border: none;
		border-radius: var(--radius-full, 9999px);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
		background: transparent;
		color: var(--foreground-muted);
	}

	.pricing-toggle-btn.active {
		background: var(--background-elevated);
		color: var(--foreground);
		box-shadow: 0 1px 4px color-mix(in srgb, #000 8%, transparent);
	}

	.pricing-save-badge {
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 0.1rem 0.4rem;
		border-radius: var(--radius-full, 9999px);
		background: color-mix(in srgb, var(--brand) 15%, transparent);
		color: var(--brand);
	}

	.pricing-cards-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		max-width: 52rem;
		margin: 0 auto;
	}

	@media (max-width: 640px) {
		.pricing-cards-grid {
			grid-template-columns: 1fr;
		}
	}

	.pricing-card {
		border-radius: var(--radius-xl, 1rem);
		border: 1px solid var(--border);
		overflow: hidden;
		box-shadow: 0 4px 20px color-mix(in srgb, var(--brand) 8%, transparent);
	}

	.pricing-card--highlighted {
		border-color: var(--brand);
		box-shadow: 0 8px 40px color-mix(in srgb, var(--brand) 15%, transparent);
	}

	.pricing-card-body {
		background: var(--background-elevated);
		padding: 2rem;
	}

	.pricing-card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1.25rem;
		gap: 1rem;
	}

	.pricing-plan-name {
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--foreground);
		margin: 0 0 0.25rem;
	}

	.pricing-plan-tagline {
		font-size: 0.875rem;
		color: var(--foreground-muted);
		margin: 0;
	}

	.pricing-price-group {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.pricing-price {
		font-size: 2.25rem;
		font-weight: 800;
		color: var(--foreground);
		letter-spacing: -0.04em;
	}

	.pricing-price-period {
		font-size: 0.9375rem;
		color: var(--foreground-muted);
	}

	.pricing-yearly-note {
		font-size: 0.8125rem;
		color: var(--brand);
		font-weight: 500;
		margin: -0.75rem 0 1.25rem;
	}

	.pricing-features-list {
		list-style: none;
		padding: 1.25rem 0 0;
		margin: 0 0 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		border-top: 1px solid var(--border);
	}

	.pricing-feature-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-size: 0.875rem;
		color: var(--foreground-muted);
	}

	.pricing-check-icon {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--success) 12%, transparent);
		color: var(--success);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.pricing-cta-btn {
		width: 100%;
		justify-content: center;
		padding: 0.75rem;
		font-size: 0.9375rem;
		border-radius: var(--radius-lg, var(--radius));
	}

	.pricing-trial-note {
		text-align: center;
		font-size: 0.8125rem;
		color: var(--foreground-subtle);
		margin: 0.875rem 0 0;
	}

	.competitor-compare {
		text-align: center;
		margin-top: 2rem;
	}

	.competitor-compare-text {
		font-size: 0.875rem;
		color: var(--foreground-muted);
		margin: 0;
	}

	.competitor-name {
		color: var(--foreground);
		font-weight: 500;
	}

	/* =====================
	   FINAL CTA
	   ===================== */
	.final-cta-section {
		padding: 6rem 1.5rem;
		background-image: radial-gradient(
			ellipse 70% 60% at 50% 50%,
			color-mix(in srgb, var(--brand) 8%, transparent),
			transparent
		);
	}

	.final-cta-inner {
		max-width: 36rem;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.final-cta-headline {
		font-size: clamp(1.75rem, 3.5vw, 2.25rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--foreground);
		margin: 0;
	}

	.final-cta-sub {
		font-size: 1rem;
		color: var(--foreground-muted);
		margin: 0;
	}

	.final-cta-advisory {
		font-size: 0.875rem;
		color: var(--foreground-muted);
		margin: 0.5rem 0 0;
	}

	.advisory-link {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--brand);
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 2px;
		font-size: inherit;
		padding: 0;
		transition: opacity 0.15s;
	}

	.advisory-link:hover {
		opacity: 0.8;
	}

	/* =====================
	   TRUSTED BY
	   ===================== */
	.trusted-bar {
		border-bottom: 1px solid var(--border);
		background: var(--background-subtle);
		padding: 1.5rem;
	}
	.trusted-inner {
		max-width: 48rem;
		margin: 0 auto;
		text-align: center;
	}
	.trusted-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--foreground-subtle);
		margin: 0 0 0.75rem;
	}
	.trusted-logos {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2.5rem;
		flex-wrap: wrap;
	}
	.trusted-logo {
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--foreground-muted);
		opacity: 0.7;
		transition: opacity 0.2s;
	}
	.trusted-logo:hover {
		opacity: 1;
	}

	/* =====================
	   TESTIMONIALS
	   ===================== */
	.testimonials-section {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid var(--border);
		background: var(--background);
	}
	.testimonials-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: 1.5rem;
	}
	.testimonial-card {
		padding: 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		background: var(--background-elevated);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.testimonial-card:hover {
		border-color: color-mix(in srgb, var(--brand) 40%, var(--border));
		box-shadow: 0 4px 16px color-mix(in srgb, var(--brand) 8%, transparent);
	}
	.testimonial-quote-icon {
		color: var(--brand);
		margin-bottom: 0.75rem;
		opacity: 0.6;
	}
	.testimonial-text {
		font-size: 0.9375rem;
		line-height: 1.65;
		color: var(--foreground);
		margin: 0 0 1.25rem;
	}
	.testimonial-author {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
	}
	.testimonial-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 0;
	}
	.testimonial-role {
		font-size: 0.8125rem;
		color: var(--foreground-muted);
		margin: 0.125rem 0 0;
	}

	/* =====================
	   LEAD MAGNET
	   ===================== */
	.lead-magnet-section {
		padding: 5rem 1.5rem;
		border-bottom: 1px solid var(--border);
		background: var(--background-subtle);
	}
	.lead-magnet-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		max-width: 52rem;
		margin: 0 auto;
	}
	@media (max-width: 640px) {
		.lead-magnet-grid {
			grid-template-columns: 1fr;
		}
	}
	.lead-magnet-card {
		padding: 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		background: var(--background-elevated);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.lead-magnet-card:hover {
		border-color: color-mix(in srgb, var(--brand) 40%, var(--border));
		box-shadow: 0 4px 16px color-mix(in srgb, var(--brand) 8%, transparent);
	}
	.lead-magnet-icon-box {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-lg, 0.75rem);
		background: color-mix(in srgb, var(--brand) 15%, transparent);
		color: var(--brand);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}
	.lead-magnet-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 0 0 0.5rem;
	}
	.lead-magnet-description {
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--foreground-muted);
		margin: 0 0 1.25rem;
	}
	.lead-magnet-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		background: var(--brand);
		color: #fff;
		border: none;
		border-radius: var(--radius);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}
	.lead-magnet-btn:hover {
		background: var(--brand-hover, color-mix(in srgb, var(--brand) 85%, #000));
	}

	/* =====================
	   FOOTER
	   ===================== */
	.site-footer {
		border-top: 1px solid var(--border);
		padding: 1.5rem;
	}

	.footer-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.footer-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.footer-logo-text {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--foreground-muted);
	}

	.footer-copy {
		font-size: 0.875rem;
		color: var(--foreground-subtle);
	}

	.footer-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.footer-link {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.625rem;
		font-size: 0.8125rem;
		color: var(--foreground-muted);
		text-decoration: none;
		border-radius: var(--radius);
		transition: color 0.15s;
	}

	.footer-link:hover {
		color: var(--foreground);
	}

	/* =====================
	   RESPONSIVE
	   ===================== */
	@media (max-width: 640px) {
		.nav-links {
			display: none;
		}

		.stat-divider {
			display: none;
		}

		.stats-inner {
			justify-content: center;
		}

		.step-arrow {
			display: none;
		}

		.steps-row {
			flex-direction: column;
			align-items: center;
		}

		.footer-inner {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.footer-links {
			flex-wrap: wrap;
			justify-content: center;
		}
	}
</style>
