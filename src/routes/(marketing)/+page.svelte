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
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import ConsultingModal from '$lib/components/consulting/ConsultingModal.svelte';
	import LeadMagnetModal from '$lib/components/consulting/LeadMagnetModal.svelte';
	import SEO from '$lib/components/marketing/SEO.svelte';
	import FAQ from '$lib/components/marketing/FAQ.svelte';
	import { product, productFAQs, solutions } from '$lib/data/marketing';
	import { faqSchema, organizationSchema, softwareSchema } from '$lib/seo';

	let pricingPlan = $state<'monthly' | 'yearly'>('monthly');

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
				'Create a deal workspace and upload the customer questionnaire. Auditlift identifies what can be answered now and what needs review.'
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
</script>

<SEO
	title="Security Questionnaire Automation for Startups | AuditLift"
	description="AI-assisted security questionnaire software for B2B SaaS teams. Draft cited answers, reuse approved responses, and review buyer-specific gaps. From $149/month."
	path="/"
	schemas={[
		organizationSchema,
		{
			'@type': 'WebSite',
			'@id': `${product.url}/#website`,
			url: `${product.url}/`,
			name: product.name,
			publisher: { '@id': `${product.url}/#organization` }
		},
		softwareSchema,
		faqSchema(productFAQs)
	]}
/>

<!-- Nav -->
<nav class="nav-bar">
	<div class="nav-inner">
		<a href="/" class="nav-logo">
			<LogoMark size={20} />
			<span class="nav-logo-text">Auditlift</span>
		</a>
		<div class="nav-links">
			<a class="nav-link" href="#features">Features</a>
			<a class="nav-link" href="/pricing">Pricing</a>
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
			<div class="hero-copy">
				<div class="eyebrow-pill">
					<span class="eyebrow-dot"></span>Built for the enterprise deal cycle
				</div>

				<h1 class="hero-headline">
					Answer security questionnaires with <span>source-backed confidence.</span>
				</h1>

				<p class="hero-subheadline">
					AuditLift is AI-assisted security questionnaire software for B2B SaaS startups. Draft
					cited answers from your policies, evidence, and company facts, review the gaps, and reuse
					approved responses for your next enterprise buyer.
				</p>

				<div class="hero-cta-row">
					<a href="/login" class="btn-primary btn-lg">
						Start free trial
						<ArrowRight size={16} weight="bold" />
					</a>
					<a class="btn-ghost btn-lg" href="#features">Explore the workflow</a>
				</div>
				<p class="hero-note">
					<Check size={15} weight="bold" />10-day free trial · No credit card required
				</p>
			</div>

			<div class="hero-product" aria-label="Auditlift questionnaire workspace preview">
				<div class="product-window">
					<div class="product-toolbar">
						<div class="window-dots" aria-hidden="true">
							<span></span><span></span><span></span>
						</div>
						<span class="product-toolbar-title">Questionnaire workspace</span>
						<span class="product-status">Saved</span>
					</div>
					<div class="product-layout">
						<aside class="product-sidebar">
							<p class="sidebar-label">Active deal</p>
							<p class="sidebar-deal">Enterprise renewal</p>
							<div class="sidebar-progress"><span></span></div>
							<p class="sidebar-progress-text">22 of 24 answers ready</p>
							<div class="sidebar-nav-item active"><span></span>Questionnaire</div>
							<div class="sidebar-nav-item"><span></span>Answer library</div>
							<div class="sidebar-nav-item"><span></span>Evidence</div>
						</aside>
						<div class="product-main">
							<div class="question-heading">
								<div>
									<p class="question-kicker">Question 14 of 24</p>
									<p class="question-title">How do you manage security incidents?</p>
								</div>
								<span class="ready-badge"><Check size={12} weight="bold" />Ready to send</span>
							</div>
							<div class="answer-card">
								<p class="answer-label">Suggested answer</p>
								<p class="answer-text">
									We maintain a documented incident response process, with defined roles, escalation
									paths, and post-incident review requirements.
								</p>
								<div class="source-row">
									<span class="source-label">Cited sources</span>
									<span class="source-chip">Incident Response Policy</span>
									<span class="source-chip">Company fact</span>
								</div>
							</div>
							<div class="review-alert">
								<span class="alert-mark">!</span>
								<div>
									<strong>One related gap needs review</strong><span
										>Recovery-time objective is missing from your sources.</span
									>
								</div>
								<ArrowRight size={15} weight="bold" />
							</div>
						</div>
					</div>
				</div>
				<div class="product-proof" aria-hidden="true">
					<span><Check size={14} weight="bold" />Source-backed</span>
					<span><Check size={14} weight="bold" />Gap-aware</span>
					<span><Check size={14} weight="bold" />Ready to export</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Trusted by -->
	<section class="trusted-bar">
		<div class="trusted-inner">
			<p class="trusted-label">Trusted by teams at</p>
			<div class="trusted-logos">
				<span class="trusted-logo">Devrex Digital</span>
				<span class="trusted-logo">AWFCA</span>
				<span class="trusted-logo">Getherap Outcome</span>
				<span class="trusted-logo">Intern Insider``</span>
			</div>
		</div>
	</section>

	<!-- Stats bar -->
	<section class="stats-bar">
		<div class="stats-inner">
			<div class="stat-item">
				<p class="stat-value">Source-backed answers</p>
				<p class="stat-label">Review citations before you send</p>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<p class="stat-value">From $149/mo</p>
				<p class="stat-label">No per-seat pricing</p>
			</div>
			<div class="stat-divider" aria-hidden="true"></div>
			<div class="stat-item">
				<p class="stat-value">SOC 2 + PCI-DSS + ISO 27001</p>
				<p class="stat-label">Build a framework readiness foundation</p>
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
						"Auditlift turned what used to be a two-week fire drill into a single afternoon. We
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
						"We are selling into health tech - the compliance bar is brutal. Auditlift helped us
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
				<h2 class="section-headline">
					A security questionnaire workspace, not another spreadsheet
				</h2>
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
				<h2 class="section-headline">From buyer questionnaire to reviewed response</h2>
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

			<!-- Pricing details -->
			<div class="competitor-compare">
				<p class="competitor-compare-text">
					Prices in USD. Starter is $1,431/year and Growth is $2,870/year when billed annually.
					<a href="/pricing" class="competitor-name">Compare plans and included features</a>.
				</p>
			</div>
		</div>
	</section>

	<section class="features-section" aria-labelledby="solutions-heading">
		<div class="section-inner">
			<div class="section-header">
				<p class="section-label">Built around your next buyer review</p>
				<h2 id="solutions-heading" class="section-headline">Where AuditLift fits your workflow</h2>
			</div>
			<div class="features-grid">
				{#each solutions as solution (solution.slug)}
					<article class="feature-card">
						<h3 class="feature-title">
							<a class="solution-link" href="/solutions/{solution.slug}">{solution.headline}</a>
						</h3>
						<p class="feature-description">{solution.summary}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="faq" class="steps-section" aria-labelledby="faq-heading">
		<div class="section-inner">
			<div class="section-header">
				<p class="section-label">Product questions, answered</p>
				<h2 id="faq-heading" class="section-headline">Security questionnaire software FAQ</h2>
			</div>
			<FAQ items={productFAQs} />
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
				<span class="footer-logo-text">Auditlift</span>
				<span class="footer-copy">&copy; 2026</span>
			</div>
			<nav class="footer-links" aria-label="Footer navigation">
				<a href="/" class="footer-link">Home</a>
				<a class="footer-link" href="#features">Features</a>
				<a class="footer-link" href="/pricing">Pricing</a>
				<a class="footer-link" href="#solutions-heading">Solutions</a>
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
	.solution-link {
		color: var(--foreground);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.solution-link:hover {
		color: var(--brand);
	}

	/* =====================
	   NAV
	   ===================== */
	.nav-bar {
		position: fixed;
		top: 0.75rem;
		left: 50%;
		z-index: 50;
		width: min(calc(100% - 2rem), 72rem);
		transform: translateX(-50%);
		border: 1px solid color-mix(in srgb, var(--border) 82%, transparent);
		border-radius: var(--radius-xl);
		background: color-mix(in srgb, var(--background-elevated) 82%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: 0 8px 28px color-mix(in srgb, #000 7%, transparent);
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
		text-decoration: none;
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
		padding: 10rem 1.5rem 7rem;
		display: flex;
		justify-content: center;
		background-image: radial-gradient(
			ellipse 65% 70% at 78% 35%,
			color-mix(in srgb, var(--brand) 13%, transparent),
			transparent
		);
	}

	.hero-blob {
		pointer-events: none;
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
			ellipse 55% 70% at 10% 5%,
			color-mix(in srgb, var(--brand) 7%, transparent),
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
		display: grid;
		grid-template-columns: minmax(0, 0.94fr) minmax(28rem, 1.06fr);
		align-items: center;
		gap: clamp(3rem, 7vw, 7rem);
		max-width: 72rem;
		width: 100%;
	}
	.hero-copy {
		text-align: left;
	}

	.eyebrow-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-full, 9999px);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--foreground-muted);
		background: color-mix(in srgb, var(--brand) 8%, var(--background));
		margin-bottom: 1.25rem;
		letter-spacing: 0.03em;
	}
	.eyebrow-dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--brand);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand) 15%, transparent);
	}

	.hero-headline {
		font-size: clamp(2.75rem, 5vw, 4.5rem);
		font-weight: 800;
		letter-spacing: -0.055em;
		line-height: 1.02;
		color: var(--foreground);
		margin: 0 0 1.5rem;
	}
	.hero-headline span {
		color: var(--brand);
	}

	.hero-subheadline {
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--foreground-muted);
		max-width: 33rem;
		margin: 0 0 2rem;
	}

	.hero-cta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	.hero-note {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		color: var(--foreground-subtle);
		font-size: 0.8125rem;
	}
	.hero-note :global(svg) {
		color: var(--success);
	}

	.hero-product {
		position: relative;
		width: 100%;
		filter: drop-shadow(0 24px 48px color-mix(in srgb, var(--brand) 16%, transparent));
	}
	.product-window {
		background: var(--background-elevated);
		border: 1px solid color-mix(in srgb, var(--border) 80%, var(--brand));
		border-radius: 1rem;
		overflow: hidden;
	}
	.product-toolbar {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem;
		border-bottom: 1px solid var(--border);
		background: color-mix(in srgb, var(--background-subtle) 80%, var(--background));
	}
	.window-dots {
		display: flex;
		gap: 0.3rem;
	}
	.window-dots span {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--border);
	}
	.window-dots span:first-child {
		background: color-mix(in srgb, var(--warning) 70%, var(--border));
	}
	.product-toolbar-title {
		color: var(--foreground-muted);
		font-size: 0.6875rem;
		font-weight: 600;
	}
	.product-status {
		margin-left: auto;
		color: var(--success);
		font-size: 0.6875rem;
		font-weight: 600;
	}
	.product-layout {
		display: grid;
		grid-template-columns: 9.5rem minmax(0, 1fr);
		min-height: 20rem;
	}
	.product-sidebar {
		padding: 1.25rem 0.75rem;
		background: color-mix(in srgb, var(--background-subtle) 72%, var(--background));
		border-right: 1px solid var(--border);
	}
	.sidebar-label,
	.question-kicker,
	.answer-label,
	.source-label {
		margin: 0;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--foreground-subtle);
	}
	.sidebar-deal {
		margin: 0.35rem 0 1rem;
		font-size: 0.75rem;
		font-weight: 650;
		color: var(--foreground);
	}
	.sidebar-progress {
		height: 0.3rem;
		overflow: hidden;
		border-radius: 999px;
		background: var(--border);
	}
	.sidebar-progress span {
		display: block;
		width: 82%;
		height: 100%;
		border-radius: inherit;
		background: var(--brand);
	}
	.sidebar-progress-text {
		margin: 0.35rem 0 1.25rem;
		font-size: 0.625rem;
		color: var(--foreground-subtle);
	}
	.sidebar-nav-item {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem;
		margin: 0 -0.2rem 0.15rem;
		border-radius: 0.375rem;
		font-size: 0.6875rem;
		color: var(--foreground-muted);
	}
	.sidebar-nav-item span {
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 50%;
		background: var(--border);
	}
	.sidebar-nav-item.active {
		background: color-mix(in srgb, var(--brand) 11%, transparent);
		color: var(--brand);
		font-weight: 600;
	}
	.sidebar-nav-item.active span {
		background: var(--brand);
	}
	.product-main {
		padding: 1.25rem;
	}
	.question-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	.question-title {
		margin: 0.3rem 0 0;
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: -0.015em;
		color: var(--foreground);
	}
	.ready-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		flex-shrink: 0;
		padding: 0.25rem 0.45rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--success) 13%, transparent);
		color: var(--success);
		font-size: 0.625rem;
		font-weight: 650;
	}
	.answer-card {
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 0.625rem;
		background: var(--background);
	}
	.answer-text {
		margin: 0.5rem 0 0.85rem;
		color: var(--foreground-muted);
		font-size: 0.75rem;
		line-height: 1.65;
	}
	.source-row {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		flex-wrap: wrap;
		padding-top: 0.7rem;
		border-top: 1px solid var(--border);
	}
	.source-label {
		margin-right: 0.1rem;
	}
	.source-chip {
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		background: color-mix(in srgb, var(--brand) 10%, transparent);
		color: var(--brand);
		font-size: 0.6rem;
		font-weight: 600;
	}
	.review-alert {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.55rem;
		align-items: center;
		padding: 0.65rem 0.75rem;
		margin-top: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--warning) 35%, var(--border));
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--warning) 7%, transparent);
		color: var(--foreground-muted);
	}
	.alert-mark {
		display: grid;
		place-items: center;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--warning);
		color: var(--background);
		font-size: 0.625rem;
		font-weight: 800;
	}
	.review-alert strong,
	.review-alert span {
		display: block;
	}
	.review-alert strong {
		color: var(--foreground);
		font-size: 0.65rem;
	}
	.review-alert div span {
		margin-top: 0.15rem;
		font-size: 0.6rem;
		line-height: 1.35;
	}
	.review-alert :global(svg) {
		color: var(--warning);
	}
	.product-proof {
		display: flex;
		justify-content: center;
		gap: 0.4rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}
	.product-proof span {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--foreground-muted);
		font-size: 0.6875rem;
	}
	.product-proof :global(svg) {
		color: var(--success);
	}

	/* =====================
	   STATS BAR
	   ===================== */
	.stats-bar {
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		padding: 2rem 1.5rem;
	}

	.stats-inner {
		max-width: 56rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 0;
		flex-wrap: wrap;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl);
		background: var(--background-elevated);
		box-shadow: 0 8px 24px color-mix(in srgb, var(--brand) 5%, transparent);
		overflow: hidden;
	}

	.stat-item {
		text-align: center;
		flex: 1;
		min-width: 8rem;
		padding: 1.125rem 1.5rem;
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

	#features,
	#pricing {
		scroll-margin-top: 6rem;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: 1.5rem;
	}

	.feature-card {
		padding: 1.625rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		background: var(--background-elevated);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.feature-card:hover {
		border-color: color-mix(in srgb, var(--brand) 40%, var(--border));
		box-shadow: 0 4px 16px color-mix(in srgb, var(--brand) 8%, transparent);
		transform: translateY(-2px);
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
		padding: 1.75rem 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-xl, 1rem);
		background: var(--background-elevated);
		box-shadow: 0 4px 16px color-mix(in srgb, var(--brand) 5%, transparent);
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
		padding: 5rem 1.5rem;
	}

	.final-cta-inner {
		position: relative;
		overflow: hidden;
		max-width: 52rem;
		margin: 0 auto;
		padding: clamp(3rem, 7vw, 5rem) 1.5rem;
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 82% 15%, rgb(255 255 255 / 0.18), transparent 26%),
			linear-gradient(135deg, var(--brand), color-mix(in srgb, var(--brand) 72%, #203b25));
		box-shadow: 0 20px 46px color-mix(in srgb, var(--brand) 23%, transparent);
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
		color: #fff;
		margin: 0;
	}

	.final-cta-sub {
		font-size: 1rem;
		color: rgb(255 255 255 / 0.78);
		margin: 0;
	}

	.final-cta-advisory {
		font-size: 0.875rem;
		color: rgb(255 255 255 / 0.72);
		margin: 0.5rem 0 0;
	}

	.advisory-link {
		background: none;
		border: none;
		cursor: pointer;
		color: #fff;
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

	.final-cta-inner .btn-primary {
		background: var(--background-elevated);
		color: var(--brand);
		box-shadow: 0 4px 14px rgb(0 0 0 / 0.12);
	}

	.final-cta-inner .btn-primary:hover {
		background: #fff;
	}

	/* =====================
	   TRUSTED BY
	   ===================== */
	.trusted-bar {
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
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
		opacity: 0.76;
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
	@media (max-width: 900px) {
		.hero-section {
			padding-top: 8.25rem;
		}
		.hero-content {
			grid-template-columns: minmax(0, 38rem);
			justify-content: center;
			gap: 3.5rem;
		}
		.hero-copy {
			text-align: center;
		}
		.hero-subheadline {
			margin-left: auto;
			margin-right: auto;
		}
		.hero-cta-row {
			justify-content: center;
		}
		.hero-note {
			justify-content: center;
		}
		.hero-product {
			max-width: 38rem;
			margin: 0 auto;
		}
	}

	@media (max-width: 640px) {
		.nav-inner {
			padding: 0 1rem;
		}

		.hero-section {
			padding: 7.25rem 1rem 4rem;
		}
		.hero-content {
			gap: 2.75rem;
		}
		.hero-headline {
			font-size: clamp(2.5rem, 12vw, 3.25rem);
		}
		.hero-subheadline {
			font-size: 1rem;
		}
		.hero-cta-row {
			width: 100%;
		}
		.hero-cta-row > * {
			flex: 1;
			justify-content: center;
		}
		.hero-note {
			font-size: 0.75rem;
		}
		.product-layout {
			grid-template-columns: minmax(0, 1fr);
			min-height: 0;
		}
		.product-sidebar {
			display: none;
		}
		.product-main {
			padding: 1rem;
		}
		.question-heading {
			align-items: center;
		}
		.question-title {
			font-size: 0.8125rem;
		}
		.review-alert {
			padding: 0.6rem;
		}
		.product-proof {
			margin-top: 0.75rem;
		}

		.nav-links {
			display: none;
		}

		.stat-divider {
			display: none;
		}

		.stats-inner {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.stat-item {
			min-width: 0;
			padding: 1rem 0.35rem;
		}

		.stat-value {
			font-size: 0.875rem;
		}

		.stat-label {
			font-size: 0.6875rem;
			line-height: 1.4;
		}

		.features-grid,
		.testimonials-grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.features-section,
		.testimonials-section,
		.lead-magnet-section,
		.steps-section,
		.pricing-section {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}

		.section-inner {
			padding: 0 1rem;
		}

		.section-header {
			margin-bottom: 2.5rem;
		}

		.trusted-logos {
			gap: 1rem 1.5rem;
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

	@media (max-width: 380px) {
		.nav-signin {
			display: none;
		}

		.nav-actions {
			gap: 0.4rem;
		}

		.hero-cta-row {
			flex-direction: column;
		}

		.hero-cta-row > * {
			width: 100%;
		}

		.pricing-card-body {
			padding: 1.5rem;
		}
	}
</style>
