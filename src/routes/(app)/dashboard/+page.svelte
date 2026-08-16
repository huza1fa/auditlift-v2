<script lang="ts">
	import {
		ArrowRight,
		Upload,
		FileText,
		DownloadSimple,
		Check,
		X,
		Warning,
		ChatText,
		Notebook,
		Handshake
	} from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ConsultingModal from '$lib/components/consulting/ConsultingModal.svelte';
	import * as m from '$lib/paraglide/messages';
	import { captureEvent } from '$lib/posthog';

	// ---------------------------------------------------------------------------
	// Types
	// ---------------------------------------------------------------------------
	type RecentQuestionnaire = {
		id: string;
		filename: string;
		status: 'processing' | 'ready' | 'error';
		dealReadinessScore: number;
		answeredCount: number;
		totalQuestions: number;
		gapCount: number;
	};

	type NextAction =
		| { type: 'fix-gaps'; gapCount: number; questionnaireId: string }
		| { type: 'upload-questionnaire' }
		| { type: 'generate-policy' }
		| { type: 'stale-evidence' };

	type PageData = {
		user?: { name?: string };
		readiness: {
			score: number;
			totalControls: number;
			completedControls: number;
			blockers: Array<{ id: string; code: string; title: string; category: string }>;
		};
		framework: { id: string; name: string } | null;
		trialDaysRemaining: number | null;
		isActiveSubscription: boolean;
		justSubscribed: boolean;
		scoreHistory?: Array<{ score: number; snapshotAt: Date }>;
		isReadOnly?: boolean;
		questionnaireTotal?: number;
		avgDealReadiness?: number | null;
		policiesTotal?: number;
		recentQuestionnaires?: RecentQuestionnaire[];
		staleEvidenceCount?: number;
		nextAction?: NextAction | null;
		hasSystemDescription?: boolean;
		lastActivity?: { action: string; entityName?: string | null; createdAt: Date | string } | null;
	};

	let { data }: { data: PageData } = $props();

	// ---------------------------------------------------------------------------
	// Banner state
	// ---------------------------------------------------------------------------
	let showBanner = $state(false);
	$effect(() => {
		showBanner = data.justSubscribed;
	});
	const isTrialUrgent = $derived(data.trialDaysRemaining !== null && data.trialDaysRemaining <= 3);

	// ---------------------------------------------------------------------------
	// Date
	// ---------------------------------------------------------------------------
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});

	// ---------------------------------------------------------------------------
	// SVG ring math
	// ---------------------------------------------------------------------------
	const size = 160;
	const strokeWidth = 12;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = $derived(circumference - (data.readiness.score / 100) * circumference);

	// ---------------------------------------------------------------------------
	// Sparkline math
	// ---------------------------------------------------------------------------
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

	// ---------------------------------------------------------------------------
	// Derived convenience values
	// ---------------------------------------------------------------------------
	const firstName = $derived(data.user?.name?.split(' ')[0] ?? 'there');
	const recentQuestionnaires = $derived(data.recentQuestionnaires ?? []);
	const hasQuestionnaires = $derived(recentQuestionnaires.length > 0);
	const hasFramework = $derived(data.framework !== null);
	const staleEvidenceCount = $derived(data.staleEvidenceCount ?? 0);

	const showStartHere = $derived(
		data.readiness.completedControls === 0 && data.readiness.blockers.length > 0 && !data.isReadOnly
	);

	let consultingOpen = $state(false);
	$effect(() => {
		if (consultingOpen) {
			captureEvent('consulting_modal_opened', { source: 'dashboard' });
		}
	});
	const showAdvisoryNudge = $derived(
		hasFramework &&
			!data.isReadOnly &&
			(data.readiness.blockers.length >= 5 ||
				(data.readiness.score < 40 && data.readiness.totalControls > 0))
	);

	function formatRelativeTime(date: Date | string): string {
		const d = new Date(date);
		const diffMs = Date.now() - d.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);
		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 30) return `${diffDays} days ago`;
		return d.toLocaleDateString();
	}

	function formatActivityAction(action: string): string {
		const map: Record<string, string> = {
			'evidence.upload': 'uploaded evidence',
			'evidence.delete': 'removed evidence',
			'policy.generate': 'generated a policy',
			'policy.edit': 'edited a policy'
		};
		return map[action] ?? action;
	}

	function dealReadinessColor(score: number | null): string {
		if (score === null) return 'var(--foreground-muted)';
		if (score >= 70) return 'var(--success)';
		if (score >= 40) return 'var(--warning)';
		return 'var(--danger)';
	}
</script>

<div class="space-y-8">
	<!-- =========================================================== -->
	<!-- Subscription success banner -->
	<!-- =========================================================== -->
	{#if showBanner}
		<div
			class="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--success)] bg-[var(--success-light)] p-4"
		>
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)]">
					<Check size={16} color="white" weight="bold" />
				</div>
				<div>
					<p class="font-semibold text-[var(--success)]">{m.dashboard_welcome_pro_title()}</p>
					<p class="text-sm text-[var(--foreground-muted)]">{m.dashboard_welcome_pro_body()}</p>
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
							? m.dashboard_trial_expires_today()
							: m.dashboard_trial_days_left({ days: data.trialDaysRemaining! })}
					</p>
					<p class="text-sm text-[var(--foreground-muted)]">{m.dashboard_trial_upgrade_body()}</p>
				</div>
			</div>
			<a href="/settings/billing">
				<Button size="sm">{m.dashboard_upgrade_now()}</Button>
			</a>
		</div>
	{/if}

	<!-- Stale evidence warning -->
	{#if staleEvidenceCount > 0}
		<div
			class="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] p-4"
		>
			<div class="flex items-center gap-3">
				<Warning size={16} color="var(--warning)" weight="fill" />
				<p class="text-sm text-[var(--warning)]">
					{staleEvidenceCount === 1
						? m.dashboard_stale_evidence_singular({ count: staleEvidenceCount })
						: m.dashboard_stale_evidence_plural({ count: staleEvidenceCount })} uploaded more than 90
					days ago — auditors may question outdated evidence.
				</p>
			</div>
			<a
				href="/evidence"
				class="shrink-0 text-sm font-medium text-[var(--warning)] underline hover:opacity-70"
			>
				Review evidence →
			</a>
		</div>
	{/if}

	<!-- Next action recommendation -->
	{#if data.nextAction}
		<div
			class="flex items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--brand)] bg-[var(--brand-light)] p-4"
		>
			<div class="flex items-start gap-3">
				<div class="mt-0.5 shrink-0 rounded-full bg-[var(--brand)] p-1.5">
					<ArrowRight size={14} color="white" weight="bold" />
				</div>
				<div>
					<p class="mb-0.5 text-xs font-semibold tracking-wide text-[var(--brand)] uppercase">
						Recommended next action
					</p>
					{#if data.nextAction.type === 'fix-gaps'}
						<p class="text-sm text-[var(--foreground)]">
							You have <span class="font-semibold">{data.nextAction.gapCount}</span> unanswered
							{data.nextAction.gapCount === 1 ? 'gap' : 'gaps'} from recent questionnaires — generate
							the missing policies to close them.
						</p>
						<a
							href="/questionnaires/{data.nextAction.questionnaireId}?filter=gaps"
							class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
						>
							Review gaps <ArrowRight size={12} />
						</a>
					{:else if data.nextAction.type === 'upload-questionnaire'}
						<p class="text-sm text-[var(--foreground)]">
							Upload your first security questionnaire to get AI-generated answers in minutes.
						</p>
						<a
							href="/questionnaires"
							class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
						>
							Upload questionnaire <ArrowRight size={12} />
						</a>
					{:else if data.nextAction.type === 'generate-policy'}
						<p class="text-sm text-[var(--foreground)]">
							No policies yet — generate your first to improve your readiness score.
						</p>
						<a
							href="/policies"
							class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
						>
							Generate a policy <ArrowRight size={12} />
						</a>
					{:else if data.nextAction.type === 'stale-evidence'}
						<p class="text-sm text-[var(--foreground)]">
							<span class="font-semibold">{data.staleEvidenceCount}</span>
							{staleEvidenceCount === 1 ? 'evidence file is' : 'evidence files are'} over 90 days old
							— review and refresh them.
						</p>
						<a
							href="/evidence"
							class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
						>
							Review evidence <ArrowRight size={12} />
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- =========================================================== -->
	<!-- 1. Header row -->
	<!-- =========================================================== -->
	<div>
		<p class="text-sm text-[var(--foreground-muted)]">{today}</p>
		<h1 class="text-2xl font-bold text-[var(--foreground)]">
			{m.dashboard_welcome({ name: firstName })}
		</h1>
		{#if data.lastActivity}
			<p class="mt-1 text-xs text-[var(--foreground-subtle)]">
				{m.dashboard_last_activity({
					description:
						formatActivityAction(data.lastActivity.action) +
						(data.lastActivity.entityName ? ` "${data.lastActivity.entityName}"` : ''),
					timeAgo: formatRelativeTime(data.lastActivity.createdAt)
				})}
			</p>
		{:else}
			<p class="mt-1 text-xs text-[var(--foreground-subtle)]">
				{m.dashboard_no_activity_yet()}
			</p>
		{/if}
	</div>

	<!-- =========================================================== -->
	<!-- 2. Stats row — 3 quick-stat cards -->
	<!-- =========================================================== -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<!-- Questionnaires answered -->
		<a href="/questionnaires" class="group">
			<Card class="p-5 transition-shadow hover:shadow-[var(--shadow-md)]">
				<p class="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
					{m.dashboard_stats_questionnaires_title()}
				</p>
				<p class="text-3xl font-bold text-[var(--foreground)]">
					{data.questionnaireTotal ?? 0}
				</p>
				<p class="mt-1 flex items-center gap-1 text-xs text-[var(--brand)]">
					{m.questionnaires_title()}
					<ArrowRight size={12} />
				</p>
			</Card>
		</a>

		<!-- Avg deal readiness -->
		<Card class="p-5">
			<p class="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
				{m.dashboard_stats_avg_deal_readiness_title()}
			</p>
			{#if data.avgDealReadiness != null}
				<p class="text-3xl font-bold" style="color: {dealReadinessColor(data.avgDealReadiness)}">
					{data.avgDealReadiness}%
				</p>
			{:else}
				<p class="text-3xl font-bold text-[var(--foreground-muted)]">—</p>
			{/if}
			<p class="mt-1 text-xs text-[var(--foreground-muted)]">
				{m.dashboard_deal_readiness_label()}
			</p>
		</Card>

		<!-- Policies generated -->
		<a href="/policies" class="group">
			<Card class="p-5 transition-shadow hover:shadow-[var(--shadow-md)]">
				<p class="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
					{m.dashboard_stats_policies_title()}
				</p>
				<p class="text-3xl font-bold text-[var(--foreground)]">
					{data.policiesTotal ?? 0}
				</p>
				<p class="mt-1 flex items-center gap-1 text-xs text-[var(--brand)]">
					{m.policies_title()}
					<ArrowRight size={12} />
				</p>
			</Card>
		</a>
	</div>

	<!-- =========================================================== -->
	<!-- 3. Recent Questionnaires -->
	<!-- =========================================================== -->
	<div>
		<h2 class="mb-3 text-base font-semibold text-[var(--foreground)]">
			{m.dashboard_recent_questionnaires_title()}
		</h2>

		{#if hasQuestionnaires}
			<div class="space-y-3">
				{#each recentQuestionnaires.slice(0, 3) as q (q.id)}
					<a href="/questionnaires/{q.id}" class="block">
						<Card class="cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]">
							<div class="flex items-start justify-between gap-4">
								<!-- Left: filename + meta -->
								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-center gap-2">
										<p class="truncate text-sm font-medium text-[var(--foreground)]">
											{q.filename}
										</p>
										{#if q.status === 'processing'}
											<Badge variant="warning">{m.questionnaires_status_processing()}</Badge>
										{:else if q.status === 'error'}
											<Badge variant="danger">{m.questionnaires_status_error()}</Badge>
										{:else}
											<Badge variant="success">{m.questionnaires_status_ready()}</Badge>
										{/if}
									</div>
									<p class="mt-1 text-xs text-[var(--foreground-muted)]">
										{m.dashboard_answers_gaps_label({
											answered: q.answeredCount,
											gaps: q.gapCount
										})}
									</p>
								</div>

								<!-- Right: deal readiness score -->
								<div class="flex shrink-0 flex-col items-end gap-1">
									<p class="text-xs text-[var(--foreground-muted)]">
										{m.dashboard_deal_readiness_label()}
									</p>
									{#if q.status === 'ready'}
										<p
											class="text-lg font-bold"
											style="color: {dealReadinessColor(q.dealReadinessScore)}"
										>
											{q.dealReadinessScore}%
										</p>
									{:else}
										<p class="text-lg font-bold text-[var(--foreground-muted)]">—</p>
									{/if}
								</div>
							</div>
						</Card>
					</a>
				{/each}
			</div>
		{:else}
			<!-- Empty state -->
			<Card class="p-8 text-center">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-alt)]"
				>
					<ChatText size={24} color="var(--foreground-muted)" />
				</div>
				<p class="mb-1 font-semibold text-[var(--foreground)]">
					{m.dashboard_empty_state_title()}
				</p>
				<p class="mb-6 text-sm text-[var(--foreground-muted)]">
					{m.dashboard_empty_state_subtitle()}
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a href="/questionnaires">
						<Button variant="primary">{m.dashboard_empty_upload_btn()}</Button>
					</a>
					<a href="/policies">
						<Button variant="secondary">{m.dashboard_empty_policies_btn()}</Button>
					</a>
				</div>
			</Card>
		{/if}
	</div>

	<!-- =========================================================== -->
	<!-- 4. Compliance Coverage (only when a framework is selected) -->
	<!-- =========================================================== -->
	{#if hasFramework}
		<Card class="p-6">
			<div class="mb-1 flex items-start justify-between">
				<div>
					<h2 class="text-base font-semibold text-[var(--foreground)]">
						{m.dashboard_compliance_coverage_title()}
					</h2>
					<p class="mt-0.5 text-sm text-[var(--foreground-muted)]">
						{m.dashboard_compliance_coverage_subtitle()}
					</p>
				</div>
				{#if data.framework}
					<Badge variant="info">{data.framework.name}</Badge>
				{/if}
			</div>

			<div class="mt-6 flex flex-col gap-8 sm:flex-row sm:items-center">
				<!-- Readiness ring -->
				<div class="relative shrink-0">
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
						<span class="text-3xl font-bold text-[var(--foreground)]">{data.readiness.score}%</span>
						<span class="text-xs text-[var(--foreground-muted)]">{m.dashboard_score_ready()}</span>
					</div>
				</div>

				<!-- Coverage breakdown -->
				<div class="flex-1 space-y-3">
					<p class="text-sm text-[var(--foreground-muted)]">
						{m.dashboard_controls_completed({
							completed: data.readiness.completedControls,
							total: data.readiness.totalControls
						})}
					</p>
					<div
						class="space-y-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] p-3 text-sm"
					>
						<p class="font-medium text-[var(--foreground)]">
							{m.dashboard_coverage_total({
								covered: data.readiness.completedControls,
								total: data.readiness.totalControls
							})}
						</p>
						<p class="border-t border-[var(--border)] pt-2 text-[var(--foreground-muted)]">
							Includes controls covered through questionnaire answers, policies, and evidence.
						</p>
					</div>

					{#if data.readiness.blockers.length > 0}
						<p class="text-sm text-[var(--warning)]">
							{m.dashboard_blockers_count({ count: data.readiness.blockers.length })}
						</p>
					{/if}
				</div>
			</div>

			<!-- Sparkline (score trend) -->
			{#if data.scoreHistory && data.scoreHistory.length > 1}
				<div class="mt-4 border-t border-[var(--border)] pt-4">
					<p class="mb-2 text-xs text-[var(--foreground-muted)]">
						{m.dashboard_score_trend({ count: data.scoreHistory.length })}
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
	{/if}

	{#if data.isActiveSubscription}
		<!-- Readiness insight card (replaces trial card for subscribed users) -->
		<Card class="flex flex-col justify-between p-6 sm:flex-row sm:items-center">
			<div>
				<h2 class="mb-1 text-sm font-medium text-[var(--foreground-muted)]">
					{m.dashboard_plan_status_title()}
				</h2>
				<div class="flex items-center gap-2">
					<Badge variant="success">{m.dashboard_plan_active()}</Badge>
				</div>
				{#if data.framework}
					<p class="mt-2 text-sm text-[var(--foreground-muted)]">
						{m.dashboard_plan_readiness_insight({
							completed: data.readiness.completedControls,
							total: data.readiness.totalControls,
							remaining: data.readiness.totalControls - data.readiness.completedControls,
							framework: data.framework.name
						})}
					</p>
				{:else}
					<p class="mt-2 text-sm text-[var(--foreground-muted)]">
						{m.dashboard_plan_no_framework_insight()}
					</p>
				{/if}
			</div>
			<div class="mt-4 sm:mt-0">
				<Button variant="secondary" size="sm">
					<a href="/settings/billing">{m.dashboard_manage_billing()}</a>
				</Button>
			</div>
		</Card>
	{:else}
		<!-- Trial card -->
		<Card class="flex flex-col justify-between p-6 sm:flex-row sm:items-center">
			<div>
				<h2 class="mb-1 text-sm font-medium text-[var(--foreground-muted)]">
					{m.dashboard_trial_status_title()}
				</h2>
				{#if data.trialDaysRemaining !== null}
					<p
						class="text-3xl font-bold {isTrialUrgent
							? 'text-[var(--warning)]'
							: 'text-[var(--foreground)]'}"
					>
						{data.trialDaysRemaining}
					</p>
					<p class="text-sm text-[var(--foreground-muted)]">
						{m.dashboard_trial_days_remaining({ days: data.trialDaysRemaining })}
					</p>
				{:else}
					<Badge variant="success">{m.dashboard_trial_active()}</Badge>
				{/if}
			</div>
			<div class="mt-4 sm:mt-0">
				<Button variant="secondary" size="sm">
					<a href="/settings/billing">{m.dashboard_manage_billing()}</a>
				</Button>
			</div>
		</Card>
	{/if}

	<!-- System description nudge -->
	{#if !data.hasSystemDescription && (data.questionnaireTotal ?? 0) > 0}
		<Card class="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
			<div class="flex items-start gap-3">
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--brand-light)]"
				>
					<Notebook size={18} color="var(--brand)" />
				</div>
				<div>
					<p class="text-sm font-medium text-[var(--foreground)]">
						Make your answers more accurate
					</p>
					<p class="mt-0.5 text-xs text-[var(--foreground-muted)]">
						Add your system description so policies and questionnaire answers reference your actual
						tools, infrastructure, and environment.
					</p>
				</div>
			</div>
			<a href="/settings/system" class="shrink-0">
				<Button size="sm" variant="secondary">
					<Notebook size={14} />
					Add system description
				</Button>
			</a>
		</Card>
	{/if}

	<!-- =========================================================== -->
	<!-- 5. Blockers section -->
	<!-- =========================================================== -->
	{#if data.readiness.blockers.length > 0}
		<Card class="p-6">
			<h2 class="mb-4 text-base font-semibold text-[var(--foreground)]">
				{m.dashboard_blockers_title()}
			</h2>
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
							{m.dashboard_upgrade_now()}
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

	<!-- =========================================================== -->
	<!-- Advisory nudge (contextual — only when struggling) -->
	<!-- =========================================================== -->
	{#if showAdvisoryNudge}
		<Card class="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
			<div class="flex items-start gap-3">
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--brand-light)]"
				>
					<Handshake size={18} color="var(--brand)" />
				</div>
				<div>
					<p class="text-sm font-medium text-[var(--foreground)]">
						{m.consulting_cta_dashboard_title()}
					</p>
					<p class="mt-0.5 text-xs text-[var(--foreground-muted)]">
						{m.consulting_cta_dashboard_body()}
					</p>
				</div>
			</div>
			<Button size="sm" variant="secondary" onclick={() => (consultingOpen = true)}>
				<Handshake size={14} />
				{m.consulting_cta_dashboard_button()}
			</Button>
		</Card>
	{/if}

	<ConsultingModal bind:open={consultingOpen} />

	<!-- =========================================================== -->
	<!-- Start Here guide (shown when 0 controls completed + blockers) -->
	<!-- =========================================================== -->
	{#if showStartHere}
		<Card class="p-6">
			<h2 class="mb-5 text-base font-semibold text-[var(--foreground)]">
				{m.dashboard_start_here_title()}
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
							{m.dashboard_start_here_step1()}
						</p>
						<a
							href="/controls/{data.readiness.blockers[0].id}"
							class="inline-flex items-center gap-1.5 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-sm font-medium text-white no-underline hover:bg-[var(--brand-hover)]"
						>
							{m.dashboard_start_here_step1_btn({ code: data.readiness.blockers[0].code })}
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
							{m.dashboard_start_here_step2()}
						</p>
						<p class="text-sm text-[var(--foreground-muted)]">
							{m.dashboard_start_here_step2_body()}
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
							{m.dashboard_start_here_step3()}
						</p>
						<p class="text-sm text-[var(--foreground-muted)]">
							{m.dashboard_start_here_step3_body()}
						</p>
					</div>
				</div>
			</div>
		</Card>
	{/if}

	<!-- =========================================================== -->
	<!-- 6. Quick actions -->
	<!-- =========================================================== -->
	<div>
		<h2 class="mb-3 text-base font-semibold text-[var(--foreground)]">
			{m.dashboard_quick_actions_title()}
		</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<a
				href="/evidence"
				class="group"
				onclick={() => captureEvent('quick_action_clicked', { action: 'upload_evidence' })}
			>
				<Card class="cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]">
					<div class="flex items-center gap-3">
						<div class="rounded-[var(--radius)] bg-[var(--brand-light)] p-2">
							<Upload size={20} color="var(--brand)" />
						</div>
						<div>
							<p class="text-sm font-medium text-[var(--foreground)]">
								{m.dashboard_quick_upload_evidence()}
							</p>
							<p class="text-xs text-[var(--foreground-muted)]">
								{m.dashboard_quick_upload_evidence_sub()}
							</p>
						</div>
					</div>
				</Card>
			</a>
			<a
				href="/policies"
				class="group"
				onclick={() => captureEvent('quick_action_clicked', { action: 'generate_policy' })}
			>
				<Card class="cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]">
					<div class="flex items-center gap-3">
						<div class="rounded-[var(--radius)] bg-[var(--success-light)] p-2">
							<FileText size={20} color="var(--success)" />
						</div>
						<div>
							<p class="text-sm font-medium text-[var(--foreground)]">
								{m.dashboard_quick_generate_policy()}
							</p>
							<p class="text-xs text-[var(--foreground-muted)]">
								{m.dashboard_quick_generate_policy_sub()}
							</p>
						</div>
					</div>
				</Card>
			</a>
			<a
				href="/export"
				class="group"
				onclick={() => captureEvent('quick_action_clicked', { action: 'export' })}
			>
				<Card class="cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]">
					<div class="flex items-center gap-3">
						<div class="rounded-[var(--radius)] bg-[var(--warning-light)] p-2">
							<DownloadSimple size={20} color="var(--warning)" />
						</div>
						<div>
							<p class="text-sm font-medium text-[var(--foreground)]">
								{m.dashboard_quick_export()}
							</p>
							<p class="text-xs text-[var(--foreground-muted)]">
								{m.dashboard_quick_export_sub()}
							</p>
						</div>
					</div>
				</Card>
			</a>
		</div>
	</div>
</div>
