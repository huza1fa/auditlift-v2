<script lang="ts">
	import { ArrowRight, Upload, FileText, DownloadSimple, Check, X, Warning } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();

	let showBanner = $state(data.justSubscribed);
	const isTrialUrgent = $derived(data.trialDaysRemaining !== null && data.trialDaysRemaining <= 3);

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});

	// SVG ring math
	const size = 160;
	const strokeWidth = 12;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = $derived(circumference - (data.readiness.score / 100) * circumference);

	// Sparkline math
	const sparkW = 200;
	const sparkH = 40;
	const sparkPoints = $derived.by(() => {
		const history = data.scoreHistory ?? [];
		if (history.length < 2) return '';
		const scores = history.map((s: { score: number }) => s.score);
		const min = Math.min(...scores);
		const max = Math.max(...scores);
		const range = max - min || 1;
		return scores
			.map(
				(s: number, i: number) =>
					`${(i / (scores.length - 1)) * sparkW},${sparkH - ((s - min) / range) * (sparkH - 4) - 2}`
			)
			.join(' ');
	});
	const sparkScores = $derived((data.scoreHistory ?? []).map((s: { score: number }) => s.score));
	const sparkMin = $derived(sparkScores.length ? Math.min(...sparkScores) : 0);
	const sparkRange = $derived(Math.max(...sparkScores) - sparkMin || 1);

	// Start Here guide visibility
	const showStartHere = $derived(
		data.readiness.completedControls === 0 &&
			data.readiness.blockers.length > 0 &&
			!data.isReadOnly
	);
</script>

<div class="space-y-8">
	<!-- Subscription success banner -->
	{#if showBanner}
		<div
			class="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--success)] bg-[var(--success-light)] p-4"
		>
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)]">
					<Check size={16} color="white" weight="bold" />
				</div>
				<div>
					<p class="font-semibold text-[var(--success)]">Welcome to AuditLift Pro!</p>
					<p class="text-sm text-[var(--foreground-muted)]">
						Your subscription is active. You have full access to all features.
					</p>
				</div>
			</div>
			<button
				onclick={() => (showBanner = false)}
				class="cursor-pointer text-[var(--success)] hover:opacity-70"
			>
				<X size={20} />
			</button>
		</div>
	{/if}
	<!-- Trial urgency banner -->
	{#if isTrialUrgent && !showBanner}
		<div
			class="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] p-4"
		>
			<div class="flex items-center gap-3">
				<Warning size={20} color="var(--warning)" weight="fill" />
				<div>
					<p class="font-semibold text-[var(--warning)]">
						{data.trialDaysRemaining === 0
							? 'Your trial expires today'
							: `${data.trialDaysRemaining} day${data.trialDaysRemaining === 1 ? '' : 's'} left on your trial`}
					</p>
					<p class="text-sm text-[var(--foreground-muted)]">
						Upgrade now to keep uninterrupted access to all features.
					</p>
				</div>
			</div>
			<a href="/settings/billing">
				<Button size="sm">Upgrade now</Button>
			</a>
		</div>
	{/if}

	<!-- Header -->
	<div>
		<p class="text-sm text-[var(--foreground-muted)]">{today}</p>
		<h1 class="text-2xl font-bold text-[var(--foreground)]">
			Welcome back, {data.user?.name?.split(' ')[0] ?? 'there'} 👋
		</h1>
	</div>

	<!-- Score + trial -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<!-- Readiness ring -->
		<div class="md:col-span-2">
			<Card class="p-6">
				<h2 class="mb-4 text-sm font-medium text-[var(--foreground-muted)]">
					Audit Readiness Score
				</h2>
				<div class="flex items-center gap-8">
					<div class="relative flex-shrink-0">
						<svg width={size} height={size} class="-rotate-90">
							<circle
								cx={size / 2}
								cy={size / 2}
								r={radius}
								fill="none"
								stroke="var(--border)"
								stroke-width={strokeWidth}
							/>
							<circle
								cx={size / 2}
								cy={size / 2}
								r={radius}
								fill="none"
								stroke="var(--brand)"
								stroke-width={strokeWidth}
								stroke-linecap="round"
								stroke-dasharray={circumference}
								stroke-dashoffset={dashOffset}
								class="transition-all duration-700"
							/>
						</svg>
						<div class="absolute inset-0 flex flex-col items-center justify-center">
							<span class="text-3xl font-bold text-[var(--foreground)]"
								>{data.readiness.score}%</span
							>
							<span class="text-xs text-[var(--foreground-muted)]">ready</span>
						</div>
					</div>
					<div class="space-y-2">
						<p class="text-sm text-[var(--foreground-muted)]">
							<strong class="text-[var(--foreground)]">{data.readiness.completedControls}</strong>
							of
							<strong class="text-[var(--foreground)]">{data.readiness.totalControls}</strong> controls
							completed
						</p>
						{#if data.framework}
							<Badge variant="info">{data.framework.name}</Badge>
						{/if}
						{#if data.readiness.blockers.length > 0}
							<p class="text-sm text-[var(--warning)]">
								{data.readiness.blockers.length} blockers need attention
							</p>
						{/if}
					</div>
				</div>
				{#if data.scoreHistory && data.scoreHistory.length > 1}
					<div class="mt-4 border-t border-[var(--border)] pt-4">
						<p class="mb-2 text-xs text-[var(--foreground-muted)]">
							Score trend ({data.scoreHistory.length} snapshots)
						</p>
						<svg width={sparkW} height={sparkH} class="overflow-visible">
							<polyline
								points={sparkPoints}
								fill="none"
								stroke="var(--brand)"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							{#each sparkScores as score, i (i)}
								<circle
									cx={(i / (sparkScores.length - 1)) * sparkW}
									cy={sparkH - ((score - sparkMin) / sparkRange) * (sparkH - 4) - 2}
									r="3"
									fill="var(--brand)"
								/>
							{/each}
						</svg>
					</div>
				{/if}
			</Card>
		</div>

		<!-- Trial card -->
		<Card class="flex flex-col justify-between p-6">
			<div>
				<h2 class="mb-1 text-sm font-medium text-[var(--foreground-muted)]">Trial Status</h2>
				{#if data.trialDaysRemaining !== null}
					<p
						class="text-3xl font-bold {isTrialUrgent
							? 'text-[var(--warning)]'
							: 'text-[var(--foreground)]'}"
					>
						{data.trialDaysRemaining}
					</p>
					<p class="text-sm text-[var(--foreground-muted)]">days remaining</p>
				{:else}
					<Badge variant="success">Active subscription</Badge>
				{/if}
			</div>
			<Button variant="secondary" size="sm">
				<a href="/settings/billing">Manage billing</a>
			</Button>
		</Card>
	</div>

	<!-- Blockers -->
	{#if data.readiness.blockers.length > 0}
		<Card class="p-6">
			<h2 class="mb-4 text-base font-semibold text-[var(--foreground)]">Blockers to fix</h2>
			{#if data.isReadOnly}
				<div class="relative">
					<!-- Blurred preview rows -->
					<div class="space-y-2 blur-sm select-none">
						{#each [1, 2, 3] as n (n)}
							<div class="flex items-center justify-between border-b border-[var(--border)] py-2">
								<div class="flex items-center gap-3">
									<span
										class="rounded bg-[var(--background-alt)] px-2 py-1 font-mono text-xs text-[var(--foreground-muted)]"
										>CC0.0</span
									>
									<span class="text-sm text-[var(--foreground)]">Control details hidden</span>
								</div>
							</div>
						{/each}
					</div>
					<!-- Overlay CTA -->
					<div
						class="absolute inset-0 flex flex-col items-center justify-center rounded-[var(--radius)] bg-[var(--background)]/80 backdrop-blur-sm"
					>
						<p class="mb-3 text-sm font-semibold text-[var(--foreground)]">Your trial has ended</p>
						<p class="mb-4 max-w-xs text-center text-xs text-[var(--foreground-muted)]">
							Upgrade to see which {data.readiness.blockers.length} controls are blocking your readiness
							score.
						</p>
						<a
							href="/settings/billing"
							class="rounded-[var(--radius)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white no-underline hover:bg-[var(--brand-hover)]"
						>
							Upgrade now
						</a>
					</div>
				</div>
			{:else}
				<div class="space-y-2">
					{#each data.readiness.blockers.slice(0, 5) as blocker (blocker.id)}
						<div
							class="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0"
						>
							<div class="flex items-center gap-3">
								<span
									class="rounded bg-[var(--background-alt)] px-2 py-1 font-mono text-xs text-[var(--foreground-muted)]"
									>{blocker.code}</span
								>
								<span class="text-sm text-[var(--foreground)]">{blocker.title}</span>
							</div>
							<a
								href="/controls/{blocker.id}"
								class="flex items-center gap-1 text-xs text-[var(--brand)] hover:underline"
							>
								Fix it <ArrowRight size={12} />
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</Card>
	{/if}

	<!-- Start Here guide (shown when 0 controls completed and blockers exist) -->
	{#if showStartHere}
		<Card class="p-6">
			<h2 class="mb-5 text-base font-semibold text-[var(--foreground)]">
				Start here — complete your first control in 3 steps
			</h2>
			<div class="space-y-5">
				<!-- Step 1 -->
				<div class="flex gap-4">
					<div
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white"
					>
						1
					</div>
					<div>
						<p class="mb-1.5 text-sm font-semibold text-[var(--foreground)]">
							Open your first control
						</p>
						<a
							href="/controls/{data.readiness.blockers[0].id}"
							class="inline-flex items-center gap-1.5 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-sm font-medium text-white no-underline hover:bg-[var(--brand-hover)]"
						>
							Go to {data.readiness.blockers[0].code}
							<ArrowRight size={14} />
						</a>
					</div>
				</div>

				<!-- Step 2 -->
				<div class="flex gap-4">
					<div
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white"
					>
						2
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold text-[var(--foreground)]">
							Read what the auditor expects
						</p>
						<p class="text-sm text-[var(--foreground-muted)]">
							Each control shows exactly what evidence or policy an auditor will check.
						</p>
					</div>
				</div>

				<!-- Step 3 -->
				<div class="flex gap-4">
					<div
						class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white"
					>
						3
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold text-[var(--foreground)]">
							Upload evidence or generate a policy
						</p>
						<p class="text-sm text-[var(--foreground-muted)]">
							Either one counts toward your readiness score.
						</p>
					</div>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Quick actions -->
	<div>
		<h2 class="mb-3 text-base font-semibold text-[var(--foreground)]">Quick actions</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<a href="/evidence" class="group">
				<Card class="cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]">
					<div class="flex items-center gap-3">
						<div class="rounded-[var(--radius)] bg-[var(--brand-light)] p-2">
							<Upload size={20} color="var(--brand)" />
						</div>
						<div>
							<p class="text-sm font-medium text-[var(--foreground)]">Upload evidence</p>
							<p class="text-xs text-[var(--foreground-muted)]">Add files to controls</p>
						</div>
					</div>
				</Card>
			</a>
			<a href="/policies" class="group">
				<Card class="cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]">
					<div class="flex items-center gap-3">
						<div class="rounded-[var(--radius)] bg-[var(--success-light)] p-2">
							<FileText size={20} color="var(--success)" />
						</div>
						<div>
							<p class="text-sm font-medium text-[var(--foreground)]">Generate policy</p>
							<p class="text-xs text-[var(--foreground-muted)]">Create compliance docs</p>
						</div>
					</div>
				</Card>
			</a>
			<a href="/export" class="group">
				<Card class="cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]">
					<div class="flex items-center gap-3">
						<div class="rounded-[var(--radius)] bg-[var(--warning-light)] p-2">
							<DownloadSimple size={20} color="var(--warning)" />
						</div>
						<div>
							<p class="text-sm font-medium text-[var(--foreground)]">Export package</p>
							<p class="text-xs text-[var(--foreground-muted)]">Download for your auditor</p>
						</div>
					</div>
				</Card>
			</a>
		</div>
	</div>
</div>
