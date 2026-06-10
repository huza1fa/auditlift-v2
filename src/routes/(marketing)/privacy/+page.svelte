<script lang="ts">
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
</script>

<svelte:head>
	<title>Privacy Policy — AuditLift</title>
	<meta
		name="description"
		content="AuditLift privacy policy. Learn how we collect, use, and protect your data when using our compliance software."
	/>
	<link rel="canonical" href="https://auditlift.app/privacy" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://auditlift.app/privacy" />
	<meta property="og:title" content="Privacy Policy — AuditLift" />
	<meta property="og:description" content="How AuditLift collects, uses, and protects your data." />
	<meta name="robots" content="noindex" />
</svelte:head>

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
		</div>
	</div>
</nav>

<div class="min-h-screen bg-[var(--background)] pt-24 pb-20">
	<div class="mx-auto max-w-2xl px-6">
		<h1 class="mb-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">Privacy Policy</h1>
		<p class="mb-10 text-[14px] text-[var(--foreground-muted)]">Last updated: April 1, 2026</p>

		<div class="prose-section">
			<p>
				AuditLift ("we", "us", "our") is a compliance readiness tool for startups and SMBs. This
				policy explains what data we collect, how we use it, and your rights over it. We've written
				this to be readable, not just legally defensible.
			</p>
		</div>

		<section class="mt-10">
			<h2>What we collect</h2>
			<h3>Account information</h3>
			<p>
				When you sign up we collect your name, email address, and a hashed password (or, if you use
				GitHub OAuth, a token — we never see your GitHub password). We store your organization name,
				industry, team size, and the tech stack you describe during onboarding.
			</p>

			<h3>Compliance content</h3>
			<p>
				The core of the product. This includes evidence files you upload (screenshots, PDFs,
				certificates, logs), policies you generate or edit, and notes you attach to controls. This
				data belongs to you and is stored on your behalf.
			</p>

			<h3>Usage data</h3>
			<p>
				We log which features you use and when — for example, that a policy was generated or a
				control was marked complete. We do not record keystroke-level activity or sell behavioral
				data. We may use a product analytics tool (such as PostHog) to understand how the product is
				used in aggregate.
			</p>

			<h3>Payment information</h3>
			<p>
				Payments are processed by <strong>Stripe</strong>. We never see or store your full card
				number. We hold a Stripe Customer ID and Subscription ID to manage your billing status.
			</p>
		</section>

		<section class="mt-10">
			<h2>How we use your data</h2>
			<ul>
				<li>To provide and operate the AuditLift service</li>
				<li>
					To send transactional emails — welcome, trial reminders, billing receipts, password resets
				</li>
				<li>To compute your readiness score and generate your auditor export package</li>
				<li>To improve the product based on aggregate usage patterns</li>
				<li>To comply with legal obligations</li>
			</ul>
			<p>We do not sell your data. We do not use your compliance content to train AI models.</p>
		</section>

		<section class="mt-10">
			<h2>Data storage and security</h2>
			<p>
				AuditLift is hosted on <strong>AWS</strong> (US-based infrastructure). Uploaded evidence
				files are stored on <strong>AWS S3</strong> object storage. Data is encrypted in transit (TLS)
				and at rest. Access to production systems is limited to the engineering team and protected by
				MFA.
			</p>
			<p>
				We take compliance seriously — we use AuditLift ourselves to manage our own security
				posture.
			</p>
		</section>

		<section class="mt-10">
			<h2>Third-party services</h2>
			<p>We use the following third-party services to operate AuditLift:</p>
			<ul>
				<li><strong>Stripe</strong> — payment processing (stripe.com/privacy)</li>
				<li><strong>Resend</strong> — transactional email delivery (resend.com/privacy)</li>
				<li><strong>AWS</strong> — application hosting and file storage (aws.com/privacy)</li>
				<li>
					<strong>Cloudflare</strong> — DNS and DDoS protection (cloudflare.com/privacypolicy)
				</li>
				<li><strong>GitHub</strong> — optional OAuth sign-in (docs.github.com/privacy)</li>
			</ul>
			<p>Each of these providers has their own privacy policy governing how they handle data.</p>
		</section>

		<section class="mt-10">
			<h2>Data retention</h2>
			<p>
				We retain your data for as long as your account is active. If you delete your organization
				from within AuditLift, all associated data — evidence files, policies, controls progress —
				is permanently deleted within 30 days. If you simply cancel your subscription without
				deleting your account, your data is retained in read-only form for 90 days before deletion.
			</p>
		</section>

		<section class="mt-10">
			<h2>Your rights</h2>
			<p>Depending on where you are located, you may have the right to:</p>
			<ul>
				<li><strong>Access</strong> — request a copy of the data we hold about you</li>
				<li><strong>Correction</strong> — ask us to correct inaccurate data</li>
				<li><strong>Deletion</strong> — request deletion of your account and associated data</li>
				<li>
					<strong>Portability</strong> — export your compliance content via the Auditor Export feature
					at any time
				</li>
				<li>
					<strong>Objection</strong> — object to processing of your data for analytics purposes
				</li>
			</ul>
			<p>
				EU and UK users have these rights under GDPR. California residents have similar rights under
				CCPA. To exercise any of these rights, email us at
				<a href="mailto:hello@auditlift.app">hello@auditlift.app</a>.
			</p>
		</section>

		<section class="mt-10">
			<h2>Cookies</h2>
			<p>
				We use a session cookie to keep you signed in. We do not use tracking cookies or third-party
				advertising cookies. If we add analytics, it will use first-party cookies only.
			</p>
		</section>

		<section class="mt-10">
			<h2>Changes to this policy</h2>
			<p>
				If we make material changes to this policy, we'll notify you by email and update the "Last
				updated" date above. Continued use of AuditLift after changes constitutes acceptance of the
				updated policy.
			</p>
		</section>

		<section class="mt-10">
			<h2>Contact</h2>
			<p>
				Questions about this policy or your data? Email us at
				<a href="mailto:hello@auditlift.app">hello@auditlift.app</a>. We'll respond within 2
				business days.
			</p>
		</section>
	</div>
</div>

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

<style>
	h2 {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--foreground);
		margin-bottom: 0.75rem;
	}

	h3 {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--foreground);
		margin-top: 1.25rem;
		margin-bottom: 0.4rem;
	}

	p {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--foreground-muted);
		margin-bottom: 0.875rem;
	}

	ul {
		margin: 0.5rem 0 0.875rem 1.25rem;
		space-y: 0.25rem;
	}

	li {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--foreground-muted);
		margin-bottom: 0.25rem;
	}

	a {
		color: var(--brand);
		text-decoration: underline;
	}

	.prose-section p {
		font-size: 1rem;
	}

	section {
		border-top: 1px solid var(--border);
		padding-top: 2rem;
	}
</style>
