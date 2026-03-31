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
		DeviceMobile
	} from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let step = $state(1);
	const totalSteps = 5;

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

	// Step 3 state — slug of selected framework, default to first recommended or first available
	let framework = $state(
		data.frameworks.find((f) => f.recommended)?.slug ?? data.frameworks[0]?.slug ?? ''
	);

	// Step 4 state
	let stack = $state<string[]>([]);
	const stackOptions = ['AWS', 'GCP', 'Azure', 'GitHub', 'GitLab', 'Vercel', 'Cloudflare', 'Other'];

	let loading = $state(false);
	let errorMsg = $state('');
	// Domain block: set when check-domain returns hasExistingOrg && !isMember
	let domainBlocked = $state(false);
	let domainBlockMsg = $state('');

	function toggleStack(item: string) {
		if (stack.includes(item)) {
			stack = stack.filter((s) => s !== item);
		} else {
			stack = [...stack, item];
		}
	}

	const frameworkLabel = $derived(
		data.frameworks.find((f) => f.slug === framework)?.name ?? framework
	);
	const teamLabel = $derived(teamOptions.find((t) => t.value === teamSize)?.label ?? teamSize);

	async function next() {
		errorMsg = '';
		domainBlocked = false;
		domainBlockMsg = '';
		loading = true;
		try {
			if (step === 1) {
				if (!companyName.trim()) {
					errorMsg = 'Company name is required';
					loading = false;
					return;
				}

				// Check domain BEFORE creating the org — catches cases where another
				// company on the same domain already exists and this user isn't a member.
				const domainRes = await fetch('/api/onboarding/check-domain');
				if (domainRes.ok) {
					const domainData = await domainRes.json();
					if (domainData.hasExistingOrg && !domainData.isMember) {
						// A different org owns this domain — block with invite prompt
						domainBlocked = true;
						domainBlockMsg = `An organization for ${domainData.domain} already exists on AuditLift. Ask your team admin to send you an invite.`;
						loading = false;
						return;
					}
					// isMember: true means they already have an org (e.g. refreshed mid-onboarding).
					// Just fall through and update the org name — the server handles this safely.
				}

				// Create or update the organization
				const res = await fetch('/api/onboarding/organization', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: companyName, website, industry })
				});
				if (!res.ok) throw new Error('Failed to save');
			} else if (step === 2) {
				if (!teamSize) {
					errorMsg = 'Please select a team size';
					loading = false;
					return;
				}
				await fetch('/api/onboarding/team', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ teamSize })
				});
			} else if (step === 3) {
				await fetch('/api/onboarding/framework', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ frameworkSlug: framework })
				});
			} else if (step === 4) {
				await fetch('/api/onboarding/stack', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ stack })
				});
			} else if (step === 5) {
				await fetch('/api/onboarding/complete', { method: 'POST' });
				goto('/dashboard');
				return;
			}
			step++;
		} catch {
			errorMsg = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}

	function back() {
		if (step > 1) step--;
	}
</script>

<div class="flex min-h-screen flex-col bg-[var(--background)]">
	<!-- Top bar -->
	<header class="flex items-center px-6 py-4">
		<div class="flex items-center gap-2">
			<ShieldCheck size={28} color="var(--brand)" weight="fill" />
			<span class="text-xl font-bold text-[var(--brand)]">AuditLift</span>
		</div>
	</header>

	<!-- Step indicator -->
	<div class="flex items-center justify-center py-6">
		<div class="flex items-center gap-0">
			{#each Array.from({ length: totalSteps }, (_, i) => i + 1) as s}
				<div
					class="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200
					{s < step
						? 'border-[var(--brand)] bg-[var(--brand)] text-white'
						: s === step
							? 'border-[var(--brand)] bg-[var(--brand)] text-white'
							: 'border-[var(--border)] bg-white text-[var(--foreground-muted)]'}"
				>
					{#if s < step}
						<Check size={14} weight="bold" />
					{:else}
						{s}
					{/if}
				</div>
				{#if s < totalSteps}
					<div
						class="h-0.5 w-12 transition-all duration-300
						{s < step ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'}"
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
									Let's set up your workspace
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									Tell us a bit about your company to get started.
								</p>
							</div>

							<div class="space-y-4">
								<Input
									label="Company name"
									placeholder="Acme Corp"
									bind:value={companyName}
									required
									error={errorMsg && !companyName.trim() ? errorMsg : ''}
								/>
								<Input
									label="Website"
									placeholder="https://acme.com"
									bind:value={website}
									type="url"
								/>
								<div class="flex flex-col gap-1">
									<label for="industry" class="text-sm font-medium text-[var(--foreground)]"
										>Industry</label
									>
									<select
										id="industry"
										bind:value={industry}
										class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
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
									How big is your team?
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									We'll tailor the experience based on your team size.
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
											: 'border-[var(--border)] bg-white hover:border-[var(--foreground-subtle)]'}"
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

							<!-- Step 3: Choose Framework -->
						{:else if step === 3}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<ShieldCheck size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">
									Which compliance framework?
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									You can add more frameworks later.
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
											: 'border-[var(--border)] bg-white hover:border-[var(--foreground-subtle)]'}"
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
													<Badge variant="info">Recommended</Badge>
												{/if}
											</div>
											<p class="text-xs text-[var(--foreground-muted)]">{option.description}</p>
										</div>
									</button>
								{/each}
							</div>

							<!-- Step 4: Tech Stack -->
						{:else if step === 4}
							<div class="mb-6">
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]"
								>
									<Cloud size={24} color="var(--brand)" weight="fill" />
								</div>
								<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">
									What tools do you use?
								</h1>
								<p class="text-sm text-[var(--foreground-muted)]">
									We'll use this to personalize your policies. Select all that apply.
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
											: 'border-[var(--border)] bg-white text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]'}"
									>
										{item}
									</button>
								{/each}
							</div>

							<!-- Step 5: Done -->
						{:else if step === 5}
							<div class="py-4 text-center">
								<div
									class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success-light)]"
								>
									<Check size={32} color="var(--success)" weight="bold" />
								</div>

								<h1 class="mb-2 text-2xl font-bold text-[var(--foreground)]">You're all set! 🎉</h1>
								<p class="mb-6 text-sm text-[var(--foreground-muted)]">
									Your workspace is ready. Here's a summary of your setup.
								</p>

								<div class="mb-6 flex justify-center">
									<Badge variant="success">10 days free trial started</Badge>
								</div>

								<!-- Summary card -->
								<div
									class="mb-6 space-y-3 rounded-[var(--radius-lg)] bg-[var(--background-alt)] p-4 text-left"
								>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]">Company</span>
										<span class="font-medium text-[var(--foreground)]">{companyName}</span>
									</div>
									<div class="h-px bg-[var(--border)]"></div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]">Industry</span>
										<span class="font-medium text-[var(--foreground)]">{industry}</span>
									</div>
									<div class="h-px bg-[var(--border)]"></div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]">Team size</span>
										<span class="font-medium text-[var(--foreground)]">{teamLabel}</span>
									</div>
									<div class="h-px bg-[var(--border)]"></div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-[var(--foreground-muted)]">Framework</span>
										<span class="font-medium text-[var(--foreground)]">{frameworkLabel}</span>
									</div>
									{#if stack.length > 0}
										<div class="h-px bg-[var(--border)]"></div>
										<div class="flex items-start justify-between gap-4 text-sm">
											<span class="flex-shrink-0 text-[var(--foreground-muted)]">Tech stack</span>
											<span class="text-right font-medium text-[var(--foreground)]"
												>{stack.join(', ')}</span
											>
										</div>
									{/if}
								</div>

								<Button onclick={next} size="lg" class="w-full" disabled={loading}>
									{loading ? 'Setting up...' : 'Go to my dashboard'}
									<ArrowRight size={18} />
								</Button>
							</div>
						{/if}

						<!-- Error message -->
						{#if errorMsg && step !== 2}
							<p class="mt-4 text-xs text-[var(--danger)]">{errorMsg}</p>
						{/if}

						<!-- Navigation buttons (not shown on step 5 which has its own CTA) -->
						{#if step < 5}
							<div
								class="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6"
							>
								{#if step > 1}
									<Button variant="ghost" onclick={back} disabled={loading}>
										<ArrowLeft size={16} />
										Back
									</Button>
								{:else}
									<div></div>
								{/if}

								<Button onclick={next} disabled={loading}>
									{loading ? 'Saving...' : 'Continue'}
									<ArrowRight size={16} />
								</Button>
							</div>
						{/if}
					</Card>

					<!-- Step counter text -->
					<p class="mt-4 text-center text-xs text-[var(--foreground-subtle)]">
						Step {step} of {totalSteps}
					</p>
				</div>
			{/key}
		</div>
	</div>
</div>
