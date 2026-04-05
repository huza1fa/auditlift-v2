<script lang="ts">
	import {
		ArrowLeft,
		Spinner,
		Lock,
		DownloadSimple,
		ArrowRight,
		Warning,
		CheckCircle,
		XCircle,
		FileText,
		FolderOpen
	} from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { toastSuccess, toastError } from '$lib/stores/toasts.svelte';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';

	// ── Types ─────────────────────────────────────────────────────────────────
	type Confidence = 'high' | 'medium' | 'low' | 'gap' | null;
	type QuestionnaireStatus = 'processing' | 'ready' | 'error';

	interface QuestionnaireData {
		id: string;
		filename: string;
		status: QuestionnaireStatus;
		totalQuestions: number;
		answeredCount: number;
		gapCount: number;
		dealReadinessScore: number | null;
	}

	interface Question {
		id: string;
		sectionName: string;
		questionNumber: number;
		questionText: string;
		domain: string;
		generatedAnswer: string | null;
		confidence: Confidence;
		gapReason: string | null;
		gapRemediation: string | null;
		userEditedAnswer: string | null;
		order: number;
	}

	interface ApiResponse {
		questionnaire: QuestionnaireData;
		questions: Question[];
	}

	// ── Props ─────────────────────────────────────────────────────────────────
	let { data } = $props();

	// ── Local state ───────────────────────────────────────────────────────────
	const id = $derived(page.params.id);

	let questionnaire = $state<QuestionnaireData | null>(null);
	let questions = $state<Question[]>([]);
	let loading = $state(true);
	let fetchError = $state('');
	let selectedQuestionId = $state<string | null>(null);
	let filterTab = $state<'all' | 'answered' | 'gaps'>('all');
	let answerDraft = $state('');
	let savingAnswer = $state(false);
	let savedIndicator = $state(false);
	let savedTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let pollTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let exporting = $state(false);

	// ── Derived ───────────────────────────────────────────────────────────────
	const selectedQuestion = $derived(questions.find((q) => q.id === selectedQuestionId) ?? null);

	const filteredQuestions = $derived.by(() => {
		if (filterTab === 'answered') {
			return questions.filter(
				(q) => q.confidence === 'high' || q.confidence === 'medium' || q.confidence === 'low'
			);
		}
		if (filterTab === 'gaps') {
			return questions.filter((q) => q.confidence === 'gap');
		}
		return questions;
	});

	const lockedCount = $derived(questions.filter((q) => q.confidence === null).length);
	const answeredCount = $derived(
		questions.filter(
			(q) => q.confidence === 'high' || q.confidence === 'medium' || q.confidence === 'low'
		).length
	);
	const gapCount = $derived(questions.filter((q) => q.confidence === 'gap').length);

	const isProcessing = $derived(questionnaire?.status === 'processing');
	const isError = $derived(questionnaire?.status === 'error');

	// Score ring math
	const ringSize = 80;
	const ringStroke = 7;
	const ringRadius = $derived((ringSize - ringStroke) / 2);
	const ringCircumference = $derived(2 * Math.PI * ringRadius);
	const score = $derived(questionnaire?.dealReadinessScore ?? 0);
	const ringOffset = $derived(ringCircumference - (score / 100) * ringCircumference);

	function scoreColor(s: number): string {
		if (s >= 70) return 'var(--success)';
		if (s >= 40) return 'var(--warning)';
		return 'var(--danger)';
	}

	function scoreTextColor(s: number): string {
		if (s >= 70) return 'text-[var(--success)]';
		if (s >= 40) return 'text-[var(--warning)]';
		return 'text-[var(--danger)]';
	}

	// ── Confidence helpers ────────────────────────────────────────────────────
	function confidenceLabel(c: Confidence): string {
		if (c === 'high') return m.questionnaires_confidence_high();
		if (c === 'medium') return m.questionnaires_confidence_medium();
		if (c === 'low') return m.questionnaires_confidence_low();
		if (c === 'gap') return m.questionnaires_confidence_gap();
		return m.questionnaires_confidence_locked();
	}

	function confidenceVariant(c: Confidence): 'success' | 'info' | 'warning' | 'danger' | 'default' {
		if (c === 'high') return 'success';
		if (c === 'medium') return 'info';
		if (c === 'low') return 'warning';
		if (c === 'gap') return 'danger';
		return 'default';
	}

	function confidenceExplanation(c: Confidence): string {
		if (c === 'high') return m.questionnaires_confidence_explanation_high();
		if (c === 'medium') return m.questionnaires_confidence_explanation_medium();
		if (c === 'low') return m.questionnaires_confidence_explanation_low();
		return '';
	}

	function remediationLink(remediation: string | null): string | null {
		if (!remediation) return null;
		const lower = remediation.toLowerCase();
		if (lower.includes('policy') || lower.includes('policies')) return '/policies';
		if (lower.includes('evidence')) return '/evidence';
		return null;
	}

	function remediationLinkLabel(link: string): string {
		if (link === '/policies') return m.questionnaires_gap_go_policies();
		return m.questionnaires_gap_go_evidence();
	}

	function remediationLinkIcon(link: string) {
		if (link === '/policies') return FileText;
		return FolderOpen;
	}

	// ── Data fetching ─────────────────────────────────────────────────────────
	async function fetchData() {
		try {
			const res = await fetch(`/api/questionnaires/${id}`);
			if (!res.ok) {
				fetchError = 'Failed to load questionnaire.';
				return;
			}
			const json: ApiResponse = await res.json();
			questionnaire = json.questionnaire;
			questions = json.questions ?? [];

			// Auto-select first question
			if (!selectedQuestionId && questions.length > 0) {
				selectedQuestionId = questions[0].id;
				answerDraft = questions[0].userEditedAnswer ?? questions[0].generatedAnswer ?? '';
			}
		} catch {
			fetchError = 'Failed to load questionnaire.';
		}
	}

	function startPolling() {
		stopPolling();
		pollTimer = setTimeout(async () => {
			await fetchData();
			if (isProcessing) startPolling();
		}, 3000);
	}

	function stopPolling() {
		if (pollTimer !== null) {
			clearTimeout(pollTimer);
			pollTimer = null;
		}
	}

	// ── Answer save ───────────────────────────────────────────────────────────
	async function saveAnswer() {
		if (!selectedQuestion) return;
		savingAnswer = true;
		try {
			const res = await fetch(`/api/questionnaires/${id}/questions/${selectedQuestion.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answer: answerDraft })
			});
			if (!res.ok) throw new Error('Save failed');
			questions = questions.map((q) =>
				q.id === selectedQuestion.id ? { ...q, userEditedAnswer: answerDraft } : q
			);
			showSaved();
		} catch {
			toastError('Failed to save answer');
		} finally {
			savingAnswer = false;
		}
	}

	function showSaved() {
		savedIndicator = true;
		if (savedTimer !== null) clearTimeout(savedTimer);
		savedTimer = setTimeout(() => {
			savedIndicator = false;
		}, 2000);
	}

	// ── Export ────────────────────────────────────────────────────────────────
	async function handleExport() {
		if (!data.hasActivePaidAccess) return;
		exporting = true;
		try {
			window.open(`/api/questionnaires/${id}/export`, '_blank');
		} finally {
			exporting = false;
		}
	}

	// ── Effects ───────────────────────────────────────────────────────────────
	$effect(() => {
		fetchData().then(() => {
			loading = false;
			if (isProcessing) startPolling();
		});
		return () => {
			stopPolling();
			if (savedTimer !== null) clearTimeout(savedTimer);
		};
	});

	$effect(() => {
		if (isProcessing) {
			startPolling();
		} else {
			stopPolling();
		}
	});

	// Sync answer draft when selected question changes
	$effect(() => {
		if (selectedQuestion) {
			answerDraft = selectedQuestion.userEditedAnswer ?? selectedQuestion.generatedAnswer ?? '';
		}
	});
</script>

<div class="space-y-5">
	<!-- Back link -->
	<a
		href="/questionnaires"
		class="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
	>
		<ArrowLeft size={14} />
		{m.questionnaires_back_link()}
	</a>

	{#if loading}
		<div class="flex justify-center py-24">
			<Spinner size={32} class="animate-spin" color="var(--foreground-muted)" />
		</div>
	{:else if fetchError}
		<Card class="p-8 text-center">
			<XCircle size={40} color="var(--danger)" class="mx-auto mb-3" />
			<p class="font-medium text-[var(--foreground)]">{fetchError}</p>
		</Card>
	{:else if questionnaire}
		<!-- Page header -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div class="flex items-center gap-4">
				<!-- Score ring -->
				{#if questionnaire.status === 'ready' && questionnaire.dealReadinessScore !== null}
					<div class="relative shrink-0">
						<svg
							width={ringSize}
							height={ringSize}
							class="-rotate-90"
							aria-label="Deal readiness score"
						>
							<circle
								cx={ringSize / 2}
								cy={ringSize / 2}
								r={ringRadius}
								fill="none"
								stroke="var(--border)"
								stroke-width={ringStroke}
							/>
							<circle
								cx={ringSize / 2}
								cy={ringSize / 2}
								r={ringRadius}
								fill="none"
								stroke={scoreColor(score)}
								stroke-width={ringStroke}
								stroke-linecap="round"
								stroke-dasharray={ringCircumference}
								stroke-dashoffset={ringOffset}
								class="transition-all duration-700"
							/>
						</svg>
						<div class="absolute inset-0 flex flex-col items-center justify-center">
							<span class="text-sm font-bold {scoreTextColor(score)}">{score}%</span>
							<span class="text-[9px] leading-tight text-[var(--foreground-muted)]">ready</span>
						</div>
					</div>
				{/if}

				<div class="min-w-0">
					<h1
						class="truncate text-xl leading-tight font-bold text-[var(--foreground)]"
						title={questionnaire.filename}
					>
						{questionnaire.filename}
					</h1>
					<!-- Stats row -->
					{#if questionnaire.status === 'ready'}
						<div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
							<span class="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
								<CheckCircle size={12} color="var(--success)" weight="fill" />
								{m.questionnaires_stat_answered({ count: answeredCount })}
							</span>
							<span class="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
								<Warning size={12} color="var(--warning)" weight="fill" />
								{m.questionnaires_stat_gaps({ count: gapCount })}
							</span>
							{#if lockedCount > 0}
								<span class="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
									<Lock size={12} color="var(--foreground-subtle)" />
									{m.questionnaires_stat_locked({ count: lockedCount })}
								</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<!-- Export button -->
			<div class="shrink-0">
				{#if data.hasActivePaidAccess}
					<Button
						variant="secondary"
						onclick={handleExport}
						disabled={exporting || questionnaire.status !== 'ready'}
					>
						{#if exporting}
							<Spinner size={14} class="animate-spin" />
						{:else}
							<DownloadSimple size={14} />
						{/if}
						{m.questionnaires_export_button()}
					</Button>
				{:else}
					<div class="group relative">
						<Button variant="secondary" disabled>
							<DownloadSimple size={14} />
							{m.questionnaires_export_button()}
						</Button>
						<div
							class="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-max max-w-[200px] -translate-x-1/2 rounded-[var(--radius)] bg-[var(--foreground)] px-2.5 py-1.5 text-center text-xs text-[var(--background)] group-hover:block"
						>
							{m.questionnaires_export_trial_tooltip()}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Processing state -->
		{#if isProcessing}
			<Card class="p-16 text-center">
				<Spinner size={36} class="mx-auto mb-4 animate-spin" color="var(--brand)" />
				<p class="font-medium text-[var(--foreground)]">{m.questionnaires_processing_message()}</p>
				<p class="mt-1 text-sm text-[var(--foreground-muted)]">This usually takes 30–60 seconds.</p>
			</Card>
		{:else if isError}
			<Card class="p-12 text-center">
				<XCircle size={36} color="var(--danger)" class="mx-auto mb-3" weight="fill" />
				<p class="font-medium text-[var(--foreground)]">{m.questionnaires_error_message()}</p>
			</Card>
		{:else}
			<!-- Two-column review layout -->
			<div class="flex flex-col gap-5 lg:flex-row lg:items-start">
				<!-- Left panel: question list -->
				<div class="w-full lg:sticky lg:top-6 lg:w-[40%]">
					<Card class="overflow-hidden">
						<!-- Filter tabs -->
						<div
							class="flex gap-1 border-b border-[var(--border)] bg-[var(--background-alt)] p-1.5"
						>
							{#each [{ key: 'all', label: m.questionnaires_filter_all() }, { key: 'answered', label: m.questionnaires_filter_answered() }, { key: 'gaps', label: m.questionnaires_filter_gaps() }] as tab (tab.key)}
								<button
									onclick={() => (filterTab = tab.key as typeof filterTab)}
									class="flex-1 rounded-[var(--radius)] px-2.5 py-1.5 text-xs font-medium transition-colors
										{filterTab === tab.key
										? 'bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]'
										: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
								>
									{tab.label}
								</button>
							{/each}
						</div>

						<!-- Question rows -->
						<div class="max-h-[calc(100vh-260px)] divide-y divide-[var(--border)] overflow-y-auto">
							{#each filteredQuestions as q (q.id)}
								<button
									onclick={() => (selectedQuestionId = q.id)}
									class="w-full px-3.5 py-3 text-left transition-colors
										{selectedQuestionId === q.id ? 'bg-[var(--brand-light)]' : 'hover:bg-[var(--background-alt)]'}"
								>
									<div class="flex items-start gap-2.5">
										<!-- Badge column -->
										<div class="mt-0.5 shrink-0">
											{#if q.confidence === null}
												<span
													title="Upgrade to process"
													class="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--background-alt)]"
												>
													<Lock size={10} color="var(--foreground-subtle)" />
												</span>
											{:else}
												<Badge variant={confidenceVariant(q.confidence)}>
													{confidenceLabel(q.confidence)}
												</Badge>
											{/if}
										</div>
										<div class="min-w-0 flex-1">
											<p class="text-xs font-medium text-[var(--foreground-muted)]">
												#{q.questionNumber}
												{#if q.sectionName}
													· {q.sectionName}
												{/if}
											</p>
											<p class="mt-0.5 line-clamp-2 text-sm text-[var(--foreground)]">
												{q.questionText}
											</p>
										</div>
									</div>
								</button>
							{/each}

							{#if filteredQuestions.length === 0}
								<div class="py-8 text-center text-sm text-[var(--foreground-muted)]">
									No questions in this filter.
								</div>
							{/if}
						</div>
					</Card>
				</div>

				<!-- Right panel: question detail -->
				<div class="flex-1">
					{#if selectedQuestion}
						<Card class="p-6">
							<!-- Question text + domain -->
							<div class="mb-5">
								<div class="mb-3 flex flex-wrap items-center gap-2">
									<Badge variant="default">{selectedQuestion.domain}</Badge>
									{#if selectedQuestion.confidence !== null}
										<Badge variant={confidenceVariant(selectedQuestion.confidence)}>
											{confidenceLabel(selectedQuestion.confidence)}
										</Badge>
									{/if}
								</div>
								<h2 class="text-base leading-snug font-semibold text-[var(--foreground)]">
									{selectedQuestion.questionText}
								</h2>
							</div>

							<!-- Confidence explanation (answered) -->
							{#if selectedQuestion.confidence === 'high' || selectedQuestion.confidence === 'medium' || selectedQuestion.confidence === 'low'}
								<div
									class="mb-4 flex items-start gap-2 rounded-[var(--radius)] bg-[var(--background-alt)] px-3.5 py-2.5"
								>
									<CheckCircle
										size={15}
										color="var(--success)"
										weight="fill"
										class="mt-0.5 shrink-0"
									/>
									<p class="text-xs text-[var(--foreground-muted)]">
										{confidenceExplanation(selectedQuestion.confidence)}
									</p>
								</div>

								<!-- Answer textarea -->
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<label
											class="text-sm font-medium text-[var(--foreground)]"
											for="answer-textarea"
										>
											Answer
										</label>
										{#if savedIndicator}
											<span class="flex items-center gap-1 text-xs text-[var(--success)]">
												<CheckCircle size={12} weight="fill" />
												{m.questionnaires_answer_saved()}
											</span>
										{/if}
									</div>
									<textarea
										id="answer-textarea"
										bind:value={answerDraft}
										onblur={saveAnswer}
										rows={8}
										class="w-full resize-none rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm leading-relaxed text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
										placeholder="Edit the generated answer..."
									></textarea>
									<div class="flex justify-end">
										<Button size="sm" onclick={saveAnswer} disabled={savingAnswer}>
											{#if savingAnswer}
												<Spinner size={13} class="animate-spin" />
											{/if}
											Save
										</Button>
									</div>
								</div>

								<!-- Gap state -->
							{:else if selectedQuestion.confidence === 'gap'}
								<div
									class="mb-4 flex items-start gap-2.5 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light)] px-4 py-3"
								>
									<Warning size={16} color="var(--danger)" weight="fill" class="mt-0.5 shrink-0" />
									<p class="text-sm text-[var(--danger)]">{m.questionnaires_gap_title()}</p>
								</div>

								{#if selectedQuestion.gapRemediation}
									{@const link = remediationLink(selectedQuestion.gapRemediation)}
									<div class="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
										<p class="mb-2 text-xs font-semibold text-[var(--foreground-muted)] uppercase">
											{m.questionnaires_gap_remediation_label()}
										</p>
										<p class="mb-4 text-sm leading-relaxed text-[var(--foreground)]">
											{selectedQuestion.gapRemediation}
										</p>
										{#if link}
											{@const LinkIcon = remediationLinkIcon(link)}
											<a href={link}>
												<Button size="sm" variant="secondary">
													<LinkIcon size={14} />
													{remediationLinkLabel(link)}
													<ArrowRight size={12} />
												</Button>
											</a>
										{/if}
									</div>
								{/if}

								<!-- Locked state -->
							{:else}
								<div
									class="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] py-12 text-center"
								>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-alt)]"
									>
										<Lock size={22} color="var(--foreground-subtle)" />
									</div>
									<div>
										<p class="font-medium text-[var(--foreground)]">
											{m.questionnaires_locked_title()}
										</p>
										<p class="mt-1 text-sm text-[var(--foreground-muted)]">
											Upgrade your plan to unlock all questions.
										</p>
									</div>
									<a href="/settings/billing">
										<Button>{m.questionnaires_locked_upgrade()}</Button>
									</a>
								</div>
							{/if}
						</Card>
					{:else}
						<Card class="flex items-center justify-center p-16 text-center">
							<div>
								<p class="text-sm text-[var(--foreground-muted)]">
									Select a question from the left to review and edit the answer.
								</p>
							</div>
						</Card>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>
