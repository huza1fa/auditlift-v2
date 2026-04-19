<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import {
		ShieldCheck,
		Check,
		User,
		Users,
		Buildings,
		ArrowRight,
		ArrowLeft,
		Cloud,
		Database,
		FileText,
		Shield
	} from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { PageData } from './$types';

	// 1. Props
	let { data }: { data: PageData } = $props();

	// 2. Local state
	let step = $state(1);
	let intent = $state<'questionnaire' | 'compliance' | null>(null);

	// Step 1 state
	let companyName = $state('');
	let website = $state('');
	let industry = $state('SaaS');

	// Step 2 state
	let teamSize = $state('');
	const teamOptions = [
		{ value: '1', label: 'Just me', sub: 'Solo founder', icon: User },
		{ value: '2-10', label: '2–10 people', sub: 'Small team', icon: Users },
		{ value: '11-50', label: '11–50 people', sub: 'Growing company', icon: Buildings },
		{ value: '50+', label: '50+ people', sub: 'Enterprise', icon: Buildings }
	];

	// Step 3 state — tech stack (shared, moved up)
	let stack = $state<string[]>([]);
	const stackOptions = ['AWS', 'GCP', 'Azure', 'GitHub', 'GitLab', 'Vercel', 'Cloudflare', 'Other'];

	// Step 4 state — data & customers
	let dataTypes = $state<string[]>([]);
	let customerType = $state('');
	let geoReach = $state('');
	let productType = $state('');

	const dataTypeOptions = [
		{ value: 'pii', label: 'Personal data (PII)', sub: 'Names, emails, addresses of users' },
		{ value: 'phi', label: 'Health data (PHI)', sub: 'Medical records, diagnoses' },
		{ value: 'financial', label: 'Financial data', sub: 'Payment cards, bank details' },
		{ value: 'business', label: 'Business data only', sub: 'No personal or sensitive data' }
	];

	const customerTypeOptions = [
		{ value: 'b2b', label: 'B2B', sub: 'Businesses & teams' },
		{ value: 'b2c', label: 'B2C', sub: 'Individual consumers' },
		{ value: 'enterprise', label: 'Enterprise / Gov', sub: 'Large orgs & government' },
		{ value: 'internal', label: 'Internal tool', sub: 'Used by your team only' }
	];

	const geoReachOptions = [
		{ value: 'us', label: 'US only', sub: 'No international users' },
		{ value: 'eu', label: 'Europe / UK', sub: 'GDPR applies' },
		{ value: 'global', label: 'Global', sub: 'Users worldwide' }
	];

	const productTypeOptions = [
		{ value: 'saas', label: 'SaaS web app', sub: 'Browser-based product' },
		{ value: 'api', label: 'API / platform', sub: 'Developer-facing service' },
		{ value: 'mobile', label: 'Mobile app', sub: 'iOS or Android' },
		{ value: 'internal', label: 'Internal tool', sub: 'Used only within the company' }
	];

	// Step 5 state — security posture
	let securityTools = $state<string[]>([]);

	const securityToolOptions = [
		{
			value: 'sso',
			label: 'SSO / Identity provider',
			sub: 'e.g. Okta, Google Workspace, Azure AD'
		},
		{ value: 'mdm', label: 'MDM', sub: 'Mobile/device management' },
		{ value: 'password_manager', label: 'Password manager', sub: 'e.g. 1Password, Bitwarden' },
		{ value: 'ci_cd', label: 'CI/CD pipeline', sub: 'Automated deployments' },
		{ value: 'code_review', label: 'Code review process', sub: 'PR reviews before merge' }
	];

	// Step 7 state — framework (Path B only)
	let framework = $state(
		data.frameworks.find((f) => f.recommended)?.slug ?? data.frameworks[0]?.slug ?? ''
	);

	let loading = $state(false);
	let errorMsg = $state('');
	let domainBlocked = $state(false);
	let domainBlockMsg = $state('');

	// 3. Derived values
	// Path A (questionnaire): steps 1-2-3-4-5-6-done (6 visible steps)
	// Path B (compliance):    steps 1-2-3-4-5-6-7-done (7 visible steps)
	// Before intent is chosen, show 6 as default (will update on step 6 selection)
	const totalSteps = $derived(intent === 'compliance' ? 7 : 6);

	// The completion step number depends on path
	const completionStep = $derived(intent === 'compliance' ? 8 : 7);

	const frameworkLabel = $derived(
		data.frameworks.find((f) => f.slug === framework)?.name ?? framework
	);
	const teamLabel = $derived(teamOptions.find((t) => t.value === teamSize)?.label ?? teamSize);

	const intentLabel = $derived(
		intent === 'questionnaire'
			? m.onboarding_intent_questionnaire_title()
			: intent === 'compliance'
				? m.onboarding_intent_compliance_title()
				: ''
	);

	// Is the current step the completion summary step?
	const isCompletionStep = $derived(step === completionStep);

	// 4. Effects — none needed

	// 5. Event handlers
	function toggleStack(item: string) {
		if (stack.includes(item)) {
			stack = stack.filter((s) => s !== item);
		} else {
			stack = [...stack, item];
		}
	}

	function toggleDataType(value: string) {
		if (dataTypes.includes(value)) {
			dataTypes = dataTypes.filter((d) => d !== value);
		} else if (value === 'business') {
			// "Business data only" is exclusive — deselect all others
			dataTypes = ['business'];
		} else {
			// Selecting a sensitive type removes "business data only"
			dataTypes = [...dataTypes.filter((d) => d !== 'business'), value];
		}
	}

	function toggleSecurityTool(value: string) {
		if (securityTools.includes(value)) {
			securityTools = securityTools.filter((t) => t !== value);
		} else {
			securityTools = [...securityTools, value];
		}
	}

	async function next() {
		errorMsg = '';
		domainBlocked = false;
		domainBlockMsg = '';
		loading = true;

		try {
			if (step === 1) {
				if (!companyName.trim()) {
					errorMsg = m.onboarding_error_company_required();
					loading = false;
					return;
				}

				const domainRes = await fetch('/api/onboarding/check-domain');
				if (domainRes.ok) {
					const domainData = await domainRes.json();
					if (domainData.hasExistingOrg && !domainData.isMember) {
						domainBlocked = true;
						domainBlockMsg = `An organization for ${domainData.domain} already exists on AuditLift. Ask your team admin to send you an invite.`;
						loading = false;
						return;
					}
				}

				const res = await fetch('/api/onboarding/organization', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: companyName, website: website.trim() || null, industry })
				});
				if (!res.ok) throw new Error('Failed to save');
			} else if (step === 2) {
				if (!teamSize) {
					errorMsg = m.onboarding_error_team_required();
					loading = false;
					return;
				}
				await fetch('/api/onboarding/team', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ teamSize })
				});
			} else if (step === 3) {
				// Tech stack — optional, just save and proceed
				await fetch('/api/onboarding/stack', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ stack })
				});
			} else if (step === 4) {
				// NEW: Data & Customers — validate and save
				if (!customerType || !geoReach || !productType) {
					errorMsg = m.onboarding_error_profile_required();
					loading = false;
					return;
				}
				await fetch('/api/onboarding/profile', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ dataTypes, customerType, geoReach, productType })
				});
			} else if (step === 5) {
				// NEW: Security posture — optional, just save
				await fetch('/api/onboarding/posture', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ securityTools })
				});
			} else if (step === 6) {
				// Intent choice (was step 4)
				if (!intent) {
					errorMsg = m.onboarding_error_intent_required();
					loading = false;
					return;
				}
				if (intent === 'questionnaire') {
					// Path A: skip framework, go straight to completion
					step = completionStep;
					loading = false;
					return;
				}
				// Path B: continue to framework step
			} else if (step === 7 && intent === 'compliance') {
				// Framework step (was step 5)
				await fetch('/api/onboarding/framework', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ frameworkSlug: framework })
				});
			} else if (isCompletionStep) {
				// Completion — call complete endpoint and redirect
				const res = await fetch('/api/onboarding/complete', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ intent })
				});
				if (!res.ok) throw new Error('Failed to complete');
				const completionData = await res.json();
				goto(completionData.redirectTo ?? '/dashboard');
				return;
			}

			step++;
		} catch {
			errorMsg = m.onboarding_error_generic();
		} finally {
			loading = false;
		}
	}

	function back() {
		errorMsg = '';
		if (step <= 1) return;

		// If we're on the completion step and chose questionnaire, go back to intent (step 6)
		if (isCompletionStep && intent === 'questionnaire') {
			step = 6;
			return;
		}

		step--;
	}
</script>

<div class="flex min-h-screen flex-col bg-[var(--background)]">
	<!-- Top bar -->
	<header class="flex items-center px-6 py-4">
		<div class="flex items-center gap-2">
			<ShieldCheck size={28} color="var(--brand)" weight="fill" />
			<span class="text-xl font-bold text-[var(--brand)]">{m.onboarding_brand_name()}</span>
		</div>
	</header>

	<!-- Step indicator -->
	<div class="flex items-center justify-center py-6">
		<div class="flex items-center gap-0">
			{#each Array.from({ length: totalSteps }, (_, i) => i + 1) as s}
				{@const displayStep = isCompletionStep ? totalSteps + 1 : step}
				<div
					class="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200
					{s < displayStep
						? 'border-[var(--brand)] bg-[var(--brand)] text-white'
						: s === displayStep
							? 'border-[var(--brand)] bg-[var(--brand)] text-white'
							: 'border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)]'}"
				>
					{#if s < displayStep}
						<Check size={14} weight="bold" />
					{:else}
						{s}
					{/if}
				</div>
				{#if s < totalSteps}
					<div
						class="h-0.5 w-12 transition-all duration-300
						{s < displayStep ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'}"
					></div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Main content -->
	<div class="flex flex-1 items-start justify-center px-4 py-6">
		<div class="w-full max-w-lg">
			{#key step}
				<div in:fly={{ x: 40, duration: 250, delay: 50 }} out:fly={{ x: -40, duration: 200 }}>
					<Card class="p-8">
						<!-- Step 1: Company Setup -->
						{#if step === 1}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<Buildings size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">
									{m.onboarding_step1_title()}
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									{m.onboarding_step1_subtitle()}
								</p>
							</div>

							<div class="space-y-4">
								<Input
									label={m.onboarding_company_name_label()}
									placeholder={m.onboarding_company_name_placeholder()}
									bind:value={companyName}
									required
									error={errorMsg && !companyName.trim() ? errorMsg : ''}
								/>
								<Input
									label={m.onboarding_website_label()}
									placeholder={m.onboarding_website_placeholder()}
									bind:value={website}
									type="url"
								/>
								<div class="flex flex-col gap-1">
									<label for="industry" class="text-sm font-medium text-[var(--foreground)]">
										{m.onboarding_industry_label()}
									</label>
									<select
										id="industry"
										bind:value={industry}
										class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
									>
										<option value="SaaS">SaaS</option>
										<option value="Fintech">Fintech</option>
										<option value="Healthcare">Healthcare</option>
										<option value="Other">Other</option>
									</select>
								</div>
								{#if domainBlocked}
									<div
										class="rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light,#fef2f2)] px-4 py-3 text-sm text-[var(--danger)]"
									>
										{domainBlockMsg}
									</div>
								{/if}
							</div>

							<!-- Step 2: Team Size -->
						{:else if step === 2}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<Users size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">
									{m.onboarding_step2_title()}
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									{m.onboarding_step2_subtitle()}
								</p>
							</div>

							<div class="grid grid-cols-2 gap-3">
								{#each teamOptions as option}
									<button
										type="button"
										onclick={() => (teamSize = option.value)}
										class="flex cursor-pointer flex-col items-start gap-1 rounded-[var(--radius-lg)] border-2 p-4 text-left transition-all duration-150
										{teamSize === option.value
											? 'border-[var(--brand)] bg-[var(--brand-light)]'
											: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
									>
										<div
											class="mb-1 flex h-8 w-8 items-center justify-center rounded-[var(--radius)]
											{teamSize === option.value
												? 'bg-[var(--brand)] text-white'
												: 'bg-[var(--background-alt)] text-[var(--foreground-muted)]'}"
										>
											<option.icon size={16} weight="fill" />
										</div>
										<span
											class="text-sm font-semibold
											{teamSize === option.value ? 'text-[var(--brand)]' : 'text-[var(--foreground)]'}"
										>
											{option.label}
										</span>
										<span class="text-xs text-[var(--foreground-muted)]">{option.sub}</span>
									</button>
								{/each}
							</div>
							{#if errorMsg}
								<p class="mt-3 text-xs text-[var(--danger)]">{errorMsg}</p>
							{/if}

							<!-- Step 3: Tech Stack (shared) -->
						{:else if step === 3}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<Cloud size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">
									{m.onboarding_step3_title()}
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									{m.onboarding_step3_subtitle()}
								</p>
							</div>

							<div class="flex flex-wrap gap-2">
								{#each stackOptions as item}
									<button
										type="button"
										onclick={() => toggleStack(item)}
										class="cursor-pointer rounded-[var(--radius-full)] border-2 px-4 py-2 text-sm font-medium transition-all duration-150
										{stack.includes(item)
											? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]'
											: 'border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]'}"
									>
										{item}
									</button>
								{/each}
							</div>

							<!-- Step 4: Data & Customers (NEW) -->
						{:else if step === 4}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<Database size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">Data & customers</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									This helps us tailor your policies to the right regulations and customer
									expectations.
								</p>
							</div>

							<div class="space-y-5">
								<!-- Data types -->
								<div>
									<p class="mb-2 text-sm font-medium text-[var(--foreground)]">
										What data do you handle?
									</p>
									<div class="grid grid-cols-2 gap-2">
										{#each dataTypeOptions as opt}
											<button
												type="button"
												onclick={() => toggleDataType(opt.value)}
												class="flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150
												{dataTypes.includes(opt.value)
													? 'border-[var(--brand)] bg-[var(--brand-light)]'
													: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
											>
												<span
													class="font-medium {dataTypes.includes(opt.value)
														? 'text-[var(--brand)]'
														: 'text-[var(--foreground)]'}">{opt.label}</span
												>
												<span class="text-xs text-[var(--foreground-muted)]">{opt.sub}</span>
											</button>
										{/each}
									</div>
								</div>

								<!-- Customer type -->
								<div>
									<p class="mb-2 text-sm font-medium text-[var(--foreground)]">
										Who are your customers?
									</p>
									<div class="grid grid-cols-2 gap-2">
										{#each customerTypeOptions as opt}
											<button
												type="button"
												onclick={() => (customerType = opt.value)}
												class="flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150
												{customerType === opt.value
													? 'border-[var(--brand)] bg-[var(--brand-light)]'
													: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
											>
												<span
													class="font-medium {customerType === opt.value
														? 'text-[var(--brand)]'
														: 'text-[var(--foreground)]'}">{opt.label}</span
												>
												<span class="text-xs text-[var(--foreground-muted)]">{opt.sub}</span>
											</button>
										{/each}
									</div>
								</div>

								<!-- Geographic reach -->
								<div>
									<p class="mb-2 text-sm font-medium text-[var(--foreground)]">
										Where do you operate?
									</p>
									<div class="grid grid-cols-3 gap-2">
										{#each geoReachOptions as opt}
											<button
												type="button"
												onclick={() => (geoReach = opt.value)}
												class="flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150
												{geoReach === opt.value
													? 'border-[var(--brand)] bg-[var(--brand-light)]'
													: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
											>
												<span
													class="font-medium {geoReach === opt.value
														? 'text-[var(--brand)]'
														: 'text-[var(--foreground)]'}">{opt.label}</span
												>
												<span class="text-xs text-[var(--foreground-muted)]">{opt.sub}</span>
											</button>
										{/each}
									</div>
								</div>

								<!-- Product type -->
								<div>
									<p class="mb-2 text-sm font-medium text-[var(--foreground)]">What do you ship?</p>
									<div class="grid grid-cols-2 gap-2">
										{#each productTypeOptions as opt}
											<button
												type="button"
												onclick={() => (productType = opt.value)}
												class="flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150
												{productType === opt.value
													? 'border-[var(--brand)] bg-[var(--brand-light)]'
													: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
											>
												<span
													class="font-medium {productType === opt.value
														? 'text-[var(--brand)]'
														: 'text-[var(--foreground)]'}">{opt.label}</span
												>
												<span class="text-xs text-[var(--foreground-muted)]">{opt.sub}</span>
											</button>
										{/each}
									</div>
								</div>

								{#if errorMsg}
									<p class="text-xs text-[var(--danger)]">{errorMsg}</p>
								{/if}
							</div>

							<!-- Step 5: Security Posture (NEW) -->
						{:else if step === 5}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<Shield size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">Security posture</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									What do you already have in place? We'll use this to make your policies reference
									your real tools instead of generic placeholders.
								</p>
							</div>

							<div class="space-y-2">
								{#each securityToolOptions as opt}
									<button
										type="button"
										onclick={() => toggleSecurityTool(opt.value)}
										class="flex w-full cursor-pointer items-center gap-4 rounded-[var(--radius)] border-2 p-4 text-left transition-all duration-150
										{securityTools.includes(opt.value)
											? 'border-[var(--brand)] bg-[var(--brand-light)]'
											: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
									>
										<div
											class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors
											{securityTools.includes(opt.value)
												? 'border-[var(--brand)] bg-[var(--brand)]'
												: 'border-[var(--border)]'}"
										>
											{#if securityTools.includes(opt.value)}
												<Check size={11} weight="bold" color="white" />
											{/if}
										</div>
										<div>
											<p
												class="text-sm font-medium {securityTools.includes(opt.value)
													? 'text-[var(--brand)]'
													: 'text-[var(--foreground)]'}"
											>
												{opt.label}
											</p>
											<p class="text-xs text-[var(--foreground-muted)]">{opt.sub}</p>
										</div>
									</button>
								{/each}
							</div>

							<p class="mt-3 text-xs text-[var(--foreground-muted)]">
								Nothing selected yet? No problem — skip ahead and add this later.
							</p>

							<!-- Step 6: Intent Choice -->
						{:else if step === 6}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<ShieldCheck size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">
									{m.onboarding_step4_title()}
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									{m.onboarding_step4_subtitle()}
								</p>
							</div>

							<div class="flex flex-col gap-4 sm:flex-row">
								<!-- Option A: Questionnaire -->
								<button
									type="button"
									onclick={() => (intent = 'questionnaire')}
									class="relative flex flex-1 cursor-pointer flex-col items-start gap-3 rounded-[var(--radius-lg)] border-2 p-5 text-left transition-all duration-150
									{intent === 'questionnaire'
										? 'border-[var(--brand)] bg-[var(--brand-light)]'
										: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
								>
									<div
										class="flex h-10 w-10 items-center justify-center rounded-[var(--radius)]
										{intent === 'questionnaire'
											? 'bg-[var(--brand)] text-white'
											: 'bg-[var(--background-alt)] text-[var(--foreground-muted)]'}"
									>
										<FileText size={20} weight="fill" />
									</div>
									<div>
										<p
											class="mb-1 text-sm leading-snug font-semibold
											{intent === 'questionnaire' ? 'text-[var(--brand)]' : 'text-[var(--foreground)]'}"
										>
											{m.onboarding_intent_questionnaire_title()}
										</p>
										<p class="text-xs leading-relaxed text-[var(--foreground-muted)]">
											{m.onboarding_intent_questionnaire_description()}
										</p>
									</div>
									{#if intent === 'questionnaire'}
										<div
											class="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)]"
										>
											<Check size={11} weight="bold" color="white" />
										</div>
									{/if}
								</button>

								<!-- Option B: Compliance -->
								<button
									type="button"
									onclick={() => (intent = 'compliance')}
									class="relative flex flex-1 cursor-pointer flex-col items-start gap-3 rounded-[var(--radius-lg)] border-2 p-5 text-left transition-all duration-150
									{intent === 'compliance'
										? 'border-[var(--brand)] bg-[var(--brand-light)]'
										: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
								>
									<div
										class="flex h-10 w-10 items-center justify-center rounded-[var(--radius)]
										{intent === 'compliance'
											? 'bg-[var(--brand)] text-white'
											: 'bg-[var(--background-alt)] text-[var(--foreground-muted)]'}"
									>
										<Shield size={20} weight="fill" />
									</div>
									<div>
										<p
											class="mb-1 text-sm leading-snug font-semibold
											{intent === 'compliance' ? 'text-[var(--brand)]' : 'text-[var(--foreground)]'}"
										>
											{m.onboarding_intent_compliance_title()}
										</p>
										<p class="text-xs leading-relaxed text-[var(--foreground-muted)]">
											{m.onboarding_intent_compliance_description()}
										</p>
									</div>
									{#if intent === 'compliance'}
										<div
											class="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)]"
										>
											<Check size={11} weight="bold" color="white" />
										</div>
									{/if}
								</button>
							</div>

							{#if errorMsg}
								<p class="mt-3 text-xs text-[var(--danger)]">{errorMsg}</p>
							{/if}

							<!-- Step 7: Framework (Path B only) -->
						{:else if step === 7 && intent === 'compliance'}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<ShieldCheck size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">
									{m.onboarding_step5_title()}
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									{m.onboarding_step5_subtitle()}
								</p>
							</div>

							<div class="space-y-3">
								{#each data.frameworks as option}
									<button
										type="button"
										onclick={() => (framework = option.slug)}
										class="flex w-full cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] border-2 p-4 text-left transition-all duration-150
										{framework === option.slug
											? 'border-[var(--brand)] bg-[var(--brand-light)]'
											: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]'}"
									>
										<div
											class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors
											{framework === option.slug ? 'border-[var(--brand)] bg-[var(--brand)]' : 'border-[var(--border)]'}"
										>
											{#if framework === option.slug}
												<div class="h-2 w-2 rounded-full bg-white"></div>
											{/if}
										</div>
										<div class="min-w-0 flex-1">
											<div class="mb-0.5 flex items-center gap-2">
												<span
													class="text-sm font-semibold
													{framework === option.slug ? 'text-[var(--brand)]' : 'text-[var(--foreground)]'}"
												>
													{option.name}
												</span>
												{#if option.recommended}
													<Badge variant="info">{m.onboarding_recommended_badge()}</Badge>
												{/if}
											</div>
											<p class="text-xs text-[var(--foreground-muted)]">{option.description}</p>
										</div>
									</button>
								{/each}
							</div>

							<!-- Completion Step -->
						{:else if isCompletionStep}
							<div class="py-4 text-center">
								<div
									class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success-light)]"
								>
									<Check size={32} color="var(--success)" weight="bold" />
								</div>

								<h1 class="mb-2 text-2xl font-bold text-[var(--foreground)]">
									{m.onboarding_done_title()}
								</h1>
								<p class="mb-6 text-sm text-[var(--foreground-muted)]">
									{intent === 'questionnaire'
										? m.onboarding_done_subtitle_questionnaire()
										: m.onboarding_done_subtitle_compliance()}
								</p>

								<div class="mb-6 flex justify-center">
									<Badge variant="success">{m.onboarding_done_trial_badge()}</Badge>
								</div>

								<!-- Summary card -->
								<div
									class="mb-6 space-y-3 rounded-[var(--radius-lg)] bg-[var(--background-alt)] p-4 text-left"
								>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]"
											>{m.onboarding_done_summary_company()}</span
										>
										<span class="font-medium text-[var(--foreground)]">{companyName}</span>
									</div>
									<div class="h-px bg-[var(--border)]"></div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]"
											>{m.onboarding_done_summary_industry()}</span
										>
										<span class="font-medium text-[var(--foreground)]">{industry}</span>
									</div>
									<div class="h-px bg-[var(--border)]"></div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]"
											>{m.onboarding_done_summary_team_size()}</span
										>
										<span class="font-medium text-[var(--foreground)]">{teamLabel}</span>
									</div>
									{#if intent === 'compliance' && frameworkLabel}
										<div class="h-px bg-[var(--border)]"></div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-[var(--foreground-muted)]"
												>{m.onboarding_done_summary_framework()}</span
											>
											<span class="font-medium text-[var(--foreground)]">{frameworkLabel}</span>
										</div>
									{/if}
									{#if stack.length > 0}
										<div class="h-px bg-[var(--border)]"></div>
										<div class="flex items-start justify-between gap-4 text-sm">
											<span class="flex-shrink-0 text-[var(--foreground-muted)]"
												>{m.onboarding_done_summary_tech_stack()}</span
											>
											<span class="text-right font-medium text-[var(--foreground)]"
												>{stack.join(', ')}</span
											>
										</div>
									{/if}
									<div class="h-px bg-[var(--border)]"></div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]"
											>{m.onboarding_done_summary_path()}</span
										>
										<span class="font-medium text-[var(--foreground)]">{intentLabel}</span>
									</div>
								</div>

								<Button onclick={next} size="lg" class="w-full" disabled={loading}>
									{loading
										? m.onboarding_nav_setting_up()
										: intent === 'questionnaire'
											? m.onboarding_done_cta_questionnaire()
											: m.onboarding_done_cta_compliance()}
									<ArrowRight size={18} />
								</Button>
							</div>
						{/if}

						<!-- Error message (shown above nav for non-step-2/4/6 steps) -->
						{#if errorMsg && step !== 2 && step !== 4 && step !== 6}
							<p class="mt-4 text-xs text-[var(--danger)]">{errorMsg}</p>
						{/if}

						<!-- Navigation buttons (not shown on completion step which has its own CTA) -->
						{#if !isCompletionStep}
							<div
								class="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6"
							>
								{#if step > 1}
									<Button variant="ghost" onclick={back} disabled={loading}>
										<ArrowLeft size={16} />
										{m.onboarding_nav_back()}
									</Button>
								{:else}
									<div></div>
								{/if}

								<Button onclick={next} disabled={loading}>
									{loading ? m.onboarding_nav_saving() : m.onboarding_nav_continue()}
									<ArrowRight size={16} />
								</Button>
							</div>
						{/if}
					</Card>

					<!-- Step counter text -->
					<p class="mt-4 text-center text-xs text-[var(--foreground-subtle)]">
						{#if isCompletionStep}
							Step {totalSteps} of {totalSteps}
						{:else}
							Step {step} of {totalSteps}
						{/if}
					</p>
				</div>
			{/key}
		</div>
	</div>
</div>
