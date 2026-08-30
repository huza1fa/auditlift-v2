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
		FolderOpen,
		Info,
		ShieldCheck,
		ListChecks,
		Sparkle,
		Copy,
		ArrowClockwise,
		ShareNetwork,
		Link as LinkIcon,
		ChatCenteredDots,
		PaperPlaneTilt,
		BookOpenText
	} from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { toastSuccess, toastError, toastWarning } from '$lib/stores/toasts.svelte';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { getSuggestedPolicyType, getPolicyTitle } from '$lib/domain-policy-map';
	import { captureEvent } from '$lib/posthog';

	// ── Types ─────────────────────────────────────────────────────────────────
	type Confidence = 'high' | 'medium' | 'low' | 'gap' | null;
	type QuestionnaireStatus = 'processing' | 'ready' | 'error';

	interface QuestionnaireData {
		id: string;
		filename: string;
		sourceFormat: 'xlsx' | 'csv' | 'docx' | 'pdf' | 'text';
		status: QuestionnaireStatus;
		totalQuestions: number;
		answeredCount: number;
		gapCount: number;
		dealReadinessScore: number | null;
		shareToken?: string | null;
		shareExpiresAt?: string | Date | null;
		dealId?: string | null;
	}

	interface AnswerCitation {
		sourceType: string;
		sourceId: string;
		sourceTitle: string;
		excerpt: string;
	}

	interface Question {
		id: string;
		sectionName: string | null;
		questionNumber: string | null;
		questionText: string;
		domain: string;
		generatedAnswer: string | null;
		confidence: Confidence;
		gapReason: string | null;
		gapRemediation: string | null;
		userEditedAnswer: string | null;
		mappedPolicyIds: string[] | null;
		mappedControlIds: string[] | null;
		citations?: AnswerCitation[] | null;
		order: number;
	}

	interface ApiResponse {
		questionnaire: QuestionnaireData;
		questions: Question[];
		policyMap: Record<string, string>;
		controlMap: Record<string, { code: string; title: string }>;
		existingPolicyTypes?: string[];
	}

	interface FrameworkCoverage {
		frameworkId: string;
		frameworkName: string;
		frameworkSlug: string;
		controlsCovered: number;
		totalControls: number;
		coveragePct: number;
		coveredControls: { id: string; code: string; title: string; category: string }[];
		orgHasFramework: boolean;
	}

	interface RemediationAction {
		id: string;
		title: string;
		reason: string;
		priority: number;
		questionIds: string[];
	}

	interface DealRemediationPlan {
		actions: RemediationAction[];
	}

	interface FounderInterviewPrompt {
		category: string;
		question: string;
		whyItMatters: string;
		affectedQuestionIds: string[];
		proposedFact: { label: string; category: string };
	}

	interface GapInterviewResponse {
		prompts: FounderInterviewPrompt[];
	}

	// ── Props ─────────────────────────────────────────────────────────────────
	let { data } = $props();

	// ── Local state ───────────────────────────────────────────────────────────
	const id = $derived(page.params.id ?? '');

	let questionnaire = $state<QuestionnaireData | null>(null);
	let questions = $state<Question[]>([]);
	let policyMap = $state<Record<string, string>>({});
	let controlMap = $state<Record<string, { code: string; title: string }>>({});
	let coverage = $state<FrameworkCoverage[]>([]);
	let loading = $state(true);
	let fetchError = $state('');
	let selectedQuestionId = $state<string | null>(null);
	let filterTab = $state<'all' | 'answered' | 'gaps'>('all');
	let answerDraft = $state('');
	let savingAnswer = $state(false);
	let savedIndicator = $state(false);
	let savedTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let sse: EventSource | null = null;
	let sseTimeout = $state<ReturnType<typeof setTimeout> | null>(null);
	let sseReconnectTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let sseReconnectAttempts = $state(0);
	let exporting = $state(false);
	let showScoreTooltip = $state(false);
	let showImproveInput = $state(false);
	let refinementPrompt = $state('');
	let improving = $state(false);
	let improveError = $state('');
	let reprocessing = $state(false);
	let shareToken = $state<string | null>(null);
	let shareExpiresAt = $state<string | Date | null>(null);
	let sharing = $state(false);
	let shareCopied = $state(false);
	let existingPolicyTypes = $state<string[]>([]);
	let remediationPlan = $state<DealRemediationPlan | null>(null);
	let planLoading = $state(false);
	let interviewPrompts = $state<FounderInterviewPrompt[]>([]);
	let interviewAnswers = $state<Record<string, string>>({});
	let interviewLoading = $state(false);
	let interviewError = $state('');
	let savingPromptId = $state<string | null>(null);
	let approvingAnswerId = $state<string | null>(null);
	let selectedDealId = $state<string>('');
	let savingDeal = $state(false);

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
	const highCount = $derived(questions.filter((q) => q.confidence === 'high').length);
	const mediumCount = $derived(questions.filter((q) => q.confidence === 'medium').length);
	const lowCount = $derived(questions.filter((q) => q.confidence === 'low').length);
	const answeredCount = $derived(highCount + mediumCount + lowCount);
	const gapCount = $derived(questions.filter((q) => q.confidence === 'gap').length);
	const totalProcessed = $derived(questions.filter((q) => q.confidence !== null).length);

	const isProcessing = $derived(questionnaire?.status === 'processing');
	const isError = $derived(questionnaire?.status === 'error');
	const shareLinkExpired = $derived(
		shareToken !== null && (!shareExpiresAt || new Date(shareExpiresAt).getTime() <= Date.now())
	);
	const shareLinkExpiryLabel = $derived.by(() => {
		if (!shareExpiresAt) return '';
		return new Date(shareExpiresAt).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	});
	const planActions = $derived(remediationPlan?.actions ?? []);
	const selectedInterviewPrompts = $derived(
		selectedQuestion
			? interviewPrompts.filter((prompt) =>
					prompt.affectedQuestionIds.includes(selectedQuestion.id)
				)
			: []
	);

	$effect(() => {
		filterTab = page.url.searchParams.get('filter') === 'gaps' ? 'gaps' : 'all';
	});

	// Score ring math
	const ringSize = 80;
	const ringStroke = 7;
	const ringRadius = (ringSize - ringStroke) / 2;
	const ringCircumference = 2 * Math.PI * ringRadius;
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

	// Breakdown bar segment widths (% of total processed)
	const breakdownTotal = $derived(Math.max(totalProcessed, 1));
	const highPct = $derived(Math.round((highCount / breakdownTotal) * 100));
	const mediumPct = $derived(Math.round((mediumCount / breakdownTotal) * 100));
	const lowPct = $derived(Math.round((lowCount / breakdownTotal) * 100));
	const gapPct = $derived(Math.round((gapCount / breakdownTotal) * 100));

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

	function confidenceExplanation(c: Confidence, userEditedAnswer: string | null = null): string {
		if (c === 'high' && userEditedAnswer) {
			return 'This answer was confirmed by a member of your organization.';
		}
		if (c === 'high') return m.questionnaires_confidence_explanation_high();
		if (c === 'medium') return m.questionnaires_confidence_explanation_medium();
		if (c === 'low') return m.questionnaires_confidence_explanation_low();
		return '';
	}

	function isProcessingFailureGap(question: Question): boolean {
		return question.gapReason?.toLowerCase().includes('processing failed') ?? false;
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

	// ── Question label helpers ─────────────────────────────────────────────────
	function questionLabel(q: Question): string {
		if (q.questionNumber) return `#${q.questionNumber}`;
		return `#${q.order + 1}`;
	}

	// Build an ordered list of [sectionName | null, questions[]] groups for the list
	const groupedQuestions = $derived.by(() => {
		const groups: Array<{ section: string | null; questions: Question[] }> = [];
		let current: { section: string | null; questions: Question[] } | null = null;
		for (const q of filteredQuestions) {
			if (!current || current.section !== q.sectionName) {
				current = { section: q.sectionName, questions: [] };
				groups.push(current);
			}
			current.questions.push(q);
		}
		return groups;
	});

	// Source policies for selected question
	const sourcePolicies = $derived.by(() => {
		if (!selectedQuestion?.mappedPolicyIds?.length) return [];
		return selectedQuestion.mappedPolicyIds
			.map((policyId) => ({ id: policyId, title: policyMap[policyId] ?? null }))
			.filter((p) => p.title !== null) as { id: string; title: string }[];
	});

	// Mapped controls for selected gap question
	const gapControls = $derived.by(() => {
		if (!selectedQuestion?.mappedControlIds?.length) return [];
		return selectedQuestion.mappedControlIds
			.map((controlId) => {
				const c = controlMap[controlId];
				return c ? { id: controlId, code: c.code, title: c.title } : null;
			})
			.filter((c): c is { id: string; code: string; title: string } => c !== null);
	});

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
			policyMap = json.policyMap ?? {};
			controlMap = json.controlMap ?? {};
			existingPolicyTypes = json.existingPolicyTypes ?? [];
			shareToken = json.questionnaire.shareToken ?? null;
			shareExpiresAt = json.questionnaire.shareExpiresAt ?? null;
			selectedDealId = json.questionnaire.dealId ?? '';

			// Auto-select first question
			if (!selectedQuestionId && questions.length > 0) {
				selectedQuestionId = questions[0].id;
				answerDraft = questions[0].userEditedAnswer ?? questions[0].generatedAnswer ?? '';
			}

			// Fetch coverage data when questionnaire is ready
			if (json.questionnaire.status === 'ready') {
				fetchCoverage();
				fetchRemediationPlan();
			}
		} catch {
			fetchError = 'Failed to load questionnaire.';
		}
	}

	async function saveDealAssignment() {
		savingDeal = true;
		try {
			const res = await fetch(`/api/questionnaires/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dealId: selectedDealId || null })
			});
			const body: { message?: string } = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body.message ?? 'Could not update deal assignment.');
			toastSuccess(
				selectedDealId ? 'Questionnaire attached to deal.' : 'Questionnaire removed from deal.'
			);
		} catch (err) {
			toastError(err instanceof Error ? err.message : 'Could not update deal assignment.');
		} finally {
			savingDeal = false;
		}
	}

	async function fetchCoverage() {
		try {
			const res = await fetch(`/api/questionnaires/${id}/coverage`);
			if (res.ok) {
				const json = await res.json();
				coverage = json.coverageByFramework ?? [];
			}
		} catch {
			// Coverage is optional — silently ignore errors
		}
	}

	async function fetchRemediationPlan() {
		planLoading = true;
		try {
			const res = await fetch(`/api/questionnaires/${id}/plan`);
			if (!res.ok) return;
			const json: DealRemediationPlan = await res.json();
			remediationPlan = json;
		} catch {
			// The plan is supplementary and should not block questionnaire review.
		} finally {
			planLoading = false;
		}
	}

	function priorityVariant(priority: number): 'danger' | 'warning' | 'info' {
		if (priority === 1) return 'danger';
		if (priority <= 3) return 'warning';
		return 'info';
	}

	async function startGapInterview() {
		if (!selectedQuestion) return;
		interviewLoading = true;
		interviewError = '';
		try {
			const res = await fetch(`/api/questionnaires/${id}/gap-interview`, {
				method: 'POST'
			});
			const json: GapInterviewResponse & { message?: string } = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.message ?? 'Unable to start the founder interview.');
			interviewPrompts = json.prompts ?? [];
			interviewAnswers = {};
		} catch (error) {
			interviewError =
				error instanceof Error ? error.message : 'Unable to start the founder interview.';
		} finally {
			interviewLoading = false;
		}
	}

	async function saveInterviewFact(prompt: FounderInterviewPrompt) {
		const answer = interviewAnswers[prompt.question]?.trim();
		if (!answer) return;
		savingPromptId = prompt.question;
		try {
			const res = await fetch('/api/settings/facts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category: prompt.proposedFact.category,
					label: prompt.proposedFact.label,
					value: answer,
					sourceDetail: `Founder interview for questionnaire ${id}: ${prompt.question}`
				})
			});
			const json: { message?: string } = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.message ?? 'Unable to save the suggested fact.');
			interviewPrompts = interviewPrompts.filter((item) => item.question !== prompt.question);
			toastSuccess('Saved as a pending company fact');
		} catch (error) {
			toastError(error instanceof Error ? error.message : 'Unable to save the suggested fact.');
		} finally {
			savingPromptId = null;
		}
	}

	// ── SSE ───────────────────────────────────────────────────────────────────
	function openSSE(questionnaireId: string) {
		closeSSE();
		sse = new EventSource(`/api/questionnaires/${questionnaireId}/stream`);
		sseTimeout = setTimeout(async () => {
			closeSSE();
			await fetchData();
			if (questionnaire?.status === 'processing') {
				toastWarning('Processing is taking longer than expected. Refresh to check again.');
			}
		}, 120_000);

		sse.onmessage = async (event) => {
			let payload: { status: string };
			try {
				payload = JSON.parse(event.data);
			} catch {
				return;
			}

			if (payload.status === 'ready' || payload.status === 'error') {
				closeSSE();
				sseReconnectAttempts = 0;
				// Reload full data — questions + coverage are now available
				await fetchData();
			}
		};

		sse.onerror = () => {
			closeSSE();
			if (sseReconnectAttempts >= 3) {
				toastWarning('Live updates were interrupted. Refresh the page to check processing status.');
				return;
			}
			const delay = 2000 * (sseReconnectAttempts + 1);
			sseReconnectAttempts += 1;
			sseReconnectTimer = setTimeout(async () => {
				sseReconnectTimer = null;
				await fetchData();
				if (questionnaire?.status === 'processing') openSSE(questionnaireId);
			}, delay);
		};
	}

	function closeSSE() {
		if (sse !== null) {
			sse.close();
			sse = null;
		}
		if (sseTimeout !== null) {
			clearTimeout(sseTimeout);
			sseTimeout = null;
		}
		if (sseReconnectTimer !== null) {
			clearTimeout(sseReconnectTimer);
			sseReconnectTimer = null;
		}
	}

	// ── Answer save ───────────────────────────────────────────────────────────
	async function saveAnswer() {
		if (!selectedQuestion) return;
		const answer = answerDraft.trim();
		if (!answer) {
			toastError('Enter an answer before saving.');
			return;
		}
		savingAnswer = true;
		try {
			const res = await fetch(`/api/questionnaires/${id}/questions/${selectedQuestion.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answer })
			});
			if (!res.ok) throw new Error('Save failed');
			const { resolvedGap }: { resolvedGap?: boolean } = await res.json();
			await fetchData();
			showSaved();
			if (resolvedGap)
				toastSuccess('Answer saved and gap resolved. Deal Readiness has been updated.');
			captureEvent('questionnaire_answer_edited', {
				questionnaire_id: id,
				question_id: selectedQuestion.id
			});
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

	async function approveForReuse() {
		if (!selectedQuestion) return;
		approvingAnswerId = selectedQuestion.id;
		try {
			const res = await fetch(
				`/api/questionnaires/${id}/questions/${selectedQuestion.id}/library`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ scope: 'Company-wide' })
				}
			);
			const body: { message?: string } = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body.message ?? 'Could not approve this answer for reuse.');
			toastSuccess('Approved for reuse in the Answer Library.');
			captureEvent('answer_library_entry_approved', {
				questionnaire_id: id,
				question_id: selectedQuestion.id
			});
		} catch (err) {
			toastError(err instanceof Error ? err.message : 'Could not approve this answer for reuse.');
		} finally {
			approvingAnswerId = null;
		}
	}

	// ── Improve answer ────────────────────────────────────────────────────────
	async function improveAnswer() {
		if (!selectedQuestion || !refinementPrompt.trim()) return;
		improving = true;
		improveError = '';
		captureEvent('questionnaire_answer_improved', {
			questionnaire_id: id,
			question_id: selectedQuestion.id
		});
		try {
			const res = await fetch(
				`/api/questionnaires/${id}/questions/${selectedQuestion.id}/improve`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ refinementPrompt: refinementPrompt.trim() })
				}
			);
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				improveError = (body as { message?: string }).message ?? 'Failed to improve answer';
				return;
			}
			const result: { answer: string } = await res.json();
			answerDraft = result.answer;
			questions = questions.map((q) =>
				q.id === selectedQuestion.id ? { ...q, userEditedAnswer: result.answer } : q
			);
			refinementPrompt = '';
			showImproveInput = false;
			toastSuccess('Answer improved');
		} catch {
			improveError = 'Something went wrong. Please try again.';
		} finally {
			improving = false;
		}
	}

	// ── Export ────────────────────────────────────────────────────────────────
	async function handleExport() {
		if (!data.hasActivePaidAccess) return;
		exporting = true;
		captureEvent('questionnaire_export_clicked', { questionnaire_id: id });
		try {
			const response = await fetch(`/api/questionnaires/${id}/export`);
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				throw new Error((body as { message?: string }).message ?? 'Could not export answers.');
			}
			const filename = response.headers
				.get('Content-Disposition')
				?.match(/filename="?([^";]+)"?/)?.[1];
			const url = URL.createObjectURL(await response.blob());
			const link = document.createElement('a');
			link.href = url;
			link.download = filename ?? 'questionnaire-answers.csv';
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
			toastSuccess(
				response.headers.get('X-AuditLift-Export-Mode') === 'native'
					? 'Completed response template downloaded'
					: 'Answer review CSV downloaded'
			);
		} catch (err) {
			toastError(err instanceof Error ? err.message : 'Could not export answers.');
		} finally {
			exporting = false;
		}
	}

	// ── Reprocess ─────────────────────────────────────────────────────────────
	async function handleReprocess() {
		reprocessing = true;
		captureEvent('questionnaire_reprocess_clicked', { questionnaire_id: id });
		try {
			const res = await fetch(`/api/questionnaires/${id}/reprocess`, { method: 'POST' });
			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				toastError((json as { message?: string }).message ?? 'Failed to update answers.');
				return;
			}
			if (questionnaire) questionnaire.status = 'processing';
			openSSE(id);
			toastSuccess('Updating answers with latest policies...');
		} catch {
			toastError('Failed to start reprocessing.');
		} finally {
			reprocessing = false;
		}
	}

	// ── Share ─────────────────────────────────────────────────────────────────
	async function toggleShare() {
		sharing = true;
		try {
			const res = await fetch(`/api/questionnaires/${id}/share`, { method: 'POST' });
			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				toastError((json as { message?: string }).message ?? 'Failed to toggle sharing.');
				return;
			}
			const result = await res.json();
			shareToken = result.shareToken;
			shareExpiresAt = result.shareExpiresAt ?? null;
			toastSuccess(shareToken ? 'Share link is ready' : 'Sharing disabled');
		} catch {
			toastError('Failed to toggle sharing.');
		} finally {
			sharing = false;
		}
	}

	async function copyShareLink() {
		if (!shareToken || shareLinkExpired) return;
		const url = `${window.location.origin}/share/${shareToken}`;
		try {
			await navigator.clipboard.writeText(url);
			shareCopied = true;
			captureEvent('questionnaire_share_link_copied', { questionnaire_id: id });
			setTimeout(() => (shareCopied = false), 2000);
		} catch {
			toastError('Could not copy the share link. Please try again.');
		}
	}

	// ── Effects ───────────────────────────────────────────────────────────────
	$effect(() => {
		fetchData().then(() => {
			loading = false;
			if (isProcessing) openSSE(id);
		});
		return () => {
			closeSSE();
			if (sseReconnectTimer !== null) clearTimeout(sseReconnectTimer);
			if (savedTimer !== null) clearTimeout(savedTimer);
		};
	});

	// Sync answer draft when selected question changes
	$effect(() => {
		if (selectedQuestion) {
			answerDraft = selectedQuestion.userEditedAnswer ?? selectedQuestion.generatedAnswer ?? '';
			showImproveInput = false;
			refinementPrompt = '';
			improveError = '';
			interviewError = '';
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
			<div class="flex items-start gap-4">
				<!-- Score ring with tooltip -->
				{#if questionnaire.status === 'ready' && questionnaire.dealReadinessScore !== null}
					<div class="relative shrink-0">
						<button
							onclick={() => (showScoreTooltip = !showScoreTooltip)}
							class="relative focus:outline-none"
							aria-label="Deal readiness score breakdown"
						>
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
						</button>

						<!-- Permanent breakdown row (always visible) -->
						{#if totalProcessed > 0}
							<div class="mt-1.5 flex flex-wrap justify-center gap-x-2 gap-y-0.5">
								<span class="flex items-center gap-1 text-[10px]">
									<span class="h-1.5 w-1.5 rounded-full bg-[var(--success)]"></span>
									<span class="font-medium text-[var(--success)]">{highCount}</span>
									<span class="text-[var(--foreground-subtle)]">high</span>
								</span>
								<span class="flex items-center gap-1 text-[10px]">
									<span class="h-1.5 w-1.5 rounded-full bg-[var(--info)]"></span>
									<span class="font-medium text-[var(--info)]">{mediumCount}</span>
									<span class="text-[var(--foreground-subtle)]">med</span>
								</span>
								<span class="flex items-center gap-1 text-[10px]">
									<span class="h-1.5 w-1.5 rounded-full bg-[var(--warning)]"></span>
									<span class="font-medium text-[var(--warning)]">{lowCount}</span>
									<span class="text-[var(--foreground-subtle)]">low</span>
								</span>
								<span class="flex items-center gap-1 text-[10px]">
									<span class="h-1.5 w-1.5 rounded-full bg-[var(--danger)]"></span>
									<span class="font-medium text-[var(--danger)]">{gapCount}</span>
									<span class="text-[var(--foreground-subtle)]">gaps</span>
								</span>
							</div>
						{/if}

						<!-- Score tooltip -->
						{#if showScoreTooltip}
							<div
								class="absolute top-full left-0 z-20 mt-2 w-64 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] p-3 shadow-[var(--shadow-md)]"
							>
								<p class="mb-2 text-xs font-semibold text-[var(--foreground)]">
									Deal Readiness Score
								</p>
								<p class="mb-3 text-xs leading-relaxed text-[var(--foreground-muted)]">
									Weighted score across all processed questions: High = 100%, Medium = 70%, Low =
									40%, Gap = 0%.
								</p>
								<div class="space-y-1.5">
									<div class="flex items-center justify-between text-xs">
										<span class="flex items-center gap-1.5">
											<span class="h-2 w-2 rounded-full bg-[var(--success)]"></span>
											High confidence
										</span>
										<span class="font-medium text-[var(--foreground)]">{highCount}</span>
									</div>
									<div class="flex items-center justify-between text-xs">
										<span class="flex items-center gap-1.5">
											<span class="h-2 w-2 rounded-full bg-[var(--info)]"></span>
											Medium confidence
										</span>
										<span class="font-medium text-[var(--foreground)]">{mediumCount}</span>
									</div>
									<div class="flex items-center justify-between text-xs">
										<span class="flex items-center gap-1.5">
											<span class="h-2 w-2 rounded-full bg-[var(--warning)]"></span>
											Low confidence
										</span>
										<span class="font-medium text-[var(--foreground)]">{lowCount}</span>
									</div>
									<div class="flex items-center justify-between text-xs">
										<span class="flex items-center gap-1.5">
											<span class="h-2 w-2 rounded-full bg-[var(--danger)]"></span>
											Gaps (unanswered)
										</span>
										<span class="font-medium text-[var(--foreground)]">{gapCount}</span>
									</div>
									{#if lockedCount > 0}
										<div class="flex items-center justify-between text-xs">
											<span class="flex items-center gap-1.5">
												<span class="h-2 w-2 rounded-full bg-[var(--border)]"></span>
												Locked (upgrade)
											</span>
											<span class="font-medium text-[var(--foreground)]">{lockedCount}</span>
										</div>
									{/if}
								</div>

								<!-- Breakdown bar -->
								{#if totalProcessed > 0}
									<div class="mt-3 flex h-1.5 w-full overflow-hidden rounded-full">
										{#if highPct > 0}
											<div class="bg-[var(--success)]" style="width:{highPct}%"></div>
										{/if}
										{#if mediumPct > 0}
											<div class="bg-[var(--info)]" style="width:{mediumPct}%"></div>
										{/if}
										{#if lowPct > 0}
											<div class="bg-[var(--warning)]" style="width:{lowPct}%"></div>
										{/if}
										{#if gapPct > 0}
											<div class="bg-[var(--danger)]" style="width:{gapPct}%"></div>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
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
								{m.questionnaires_stat_answered({ count: answeredCount })} of {questionnaire.totalQuestions}
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

						<!-- Confidence breakdown bar -->
						{#if totalProcessed > 0}
							<div class="mt-2.5 flex items-center gap-2">
								<div class="flex h-1.5 w-32 overflow-hidden rounded-full bg-[var(--border)]">
									{#if highPct > 0}
										<div
											class="bg-[var(--success)] transition-all duration-500"
											style="width:{highPct}%"
										></div>
									{/if}
									{#if mediumPct > 0}
										<div
											class="bg-[var(--info)] transition-all duration-500"
											style="width:{mediumPct}%"
										></div>
									{/if}
									{#if lowPct > 0}
										<div
											class="bg-[var(--warning)] transition-all duration-500"
											style="width:{lowPct}%"
										></div>
									{/if}
									{#if gapPct > 0}
										<div
											class="bg-[var(--danger)] transition-all duration-500"
											style="width:{gapPct}%"
										></div>
									{/if}
								</div>
								<button
									onclick={() => (showScoreTooltip = !showScoreTooltip)}
									class="flex items-center gap-1 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
								>
									<Info size={11} />
									How this is calculated
								</button>
							</div>
						{/if}
					{/if}
					{#if data.dealOptions.length > 0}
						<div class="mt-3 flex flex-wrap items-center gap-2">
							<label
								for="deal-assignment"
								class="text-xs font-medium text-[var(--foreground-muted)]">Deal</label
							>
							<select
								id="deal-assignment"
								bind:value={selectedDealId}
								onchange={saveDealAssignment}
								disabled={savingDeal}
								class="max-w-xs rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)]"
							>
								<option value="">Not attached to a deal</option>
								{#each data.dealOptions as deal (deal.id)}
									<option value={deal.id}>{deal.customerName} — {deal.name}</option>
								{/each}
							</select>
							{#if savingDeal}<Spinner size={13} class="animate-spin text-[var(--brand)]" />{/if}
						</div>
					{/if}
				</div>
			</div>

			<!-- Action buttons -->
			<div class="flex shrink-0 flex-wrap items-center gap-2">
				<!-- Update answers button -->
				{#if questionnaire.status === 'ready' && (gapCount > 0 || lowCount > 0 || mediumCount > 0)}
					<Button variant="secondary" onclick={handleReprocess} disabled={reprocessing}>
						{#if reprocessing}
							<Spinner size={14} class="animate-spin" />
						{:else}
							<ArrowClockwise size={14} />
						{/if}
						Update answers
					</Button>
				{/if}

				<!-- Share button -->
				{#if data.hasActivePaidAccess && questionnaire.status === 'ready'}
					{#if shareToken}
						<div class="flex items-center gap-1">
							{#if shareLinkExpired}
								<Button variant="secondary" onclick={toggleShare} disabled={sharing}>
									{#if sharing}
										<Spinner size={14} class="animate-spin" />
									{:else}
										<ArrowClockwise size={14} />
									{/if}
									Renew link
								</Button>
							{:else}
								<Button variant="secondary" onclick={copyShareLink}>
									{#if shareCopied}
										<CheckCircle size={14} color="var(--success)" />
										Copied
									{:else}
										<LinkIcon size={14} />
										Copy link
									{/if}
								</Button>
							{/if}
							{#if !shareLinkExpired}
								<Button
									variant="ghost"
									onclick={toggleShare}
									disabled={sharing}
									ariaLabel="Disable sharing"
								>
									<XCircle size={14} />
								</Button>
							{/if}
						</div>
						<p class="basis-full text-right text-[11px] text-[var(--foreground-subtle)]">
							{shareLinkExpired ? 'Link expired' : `Expires ${shareLinkExpiryLabel}`}
						</p>
					{:else}
						<Button variant="secondary" onclick={toggleShare} disabled={sharing}>
							{#if sharing}
								<Spinner size={14} class="animate-spin" />
							{:else}
								<ShareNetwork size={14} />
							{/if}
							Share
						</Button>
					{/if}
				{/if}

				<!-- Export button -->
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
						{questionnaire.sourceFormat === 'xlsx' || questionnaire.sourceFormat === 'csv'
							? 'Download completed file'
							: m.questionnaires_export_button()}
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

		<!-- Click-outside to close tooltip -->
		{#if showScoreTooltip}
			<button
				class="fixed inset-0 z-10"
				onclick={() => (showScoreTooltip = false)}
				aria-label="Close tooltip"
			></button>
		{/if}

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
			<!-- Framework Coverage section (only when coverage data is available) -->
			{#if coverage.length > 0}
				<Card class="p-5">
					<div class="mb-4 flex items-center gap-2">
						<ShieldCheck size={18} color="var(--brand)" weight="fill" />
						<h2 class="text-sm font-semibold text-[var(--foreground)]">
							{m.questionnaires_coverage_title()}
						</h2>
					</div>

					<div class="space-y-3">
						{#each coverage as fw (fw.frameworkId)}
							<div class="flex flex-col gap-1.5">
								<div class="flex items-center justify-between gap-3">
									<div class="flex min-w-0 items-center gap-2">
										<Badge variant="default">{fw.frameworkName}</Badge>
										<span class="truncate text-xs text-[var(--foreground-muted)]">
											{m.questionnaires_coverage_row_label({
												count: fw.controlsCovered,
												total: fw.totalControls
											})}
										</span>
									</div>
									{#if !fw.orgHasFramework}
										<a
											href="/frameworks"
											class="shrink-0 text-xs text-[var(--brand)] hover:underline"
										>
											{m.questionnaires_coverage_cta_add({ frameworkName: fw.frameworkName })}
										</a>
									{/if}
								</div>
								<!-- Progress bar -->
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
									<div
										class="h-full rounded-full bg-[var(--brand)] transition-all duration-700"
										style="width:{fw.coveragePct}%"
									></div>
								</div>
							</div>
						{/each}
					</div>

					<p class="mt-4 text-xs leading-relaxed text-[var(--foreground-muted)]">
						{m.questionnaires_coverage_footer()}
					</p>
				</Card>
			{/if}

			<!-- Deal remediation plan -->
			{#if planLoading || remediationPlan}
				<Card class="p-5 sm:p-6">
					<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div class="flex items-start gap-2.5">
							<Sparkle size={19} color="var(--brand)" weight="fill" class="mt-0.5 shrink-0" />
							<div>
								<h2 class="text-sm font-semibold text-[var(--foreground)]">
									Deal remediation plan
								</h2>
								<p class="mt-1 text-xs leading-relaxed text-[var(--foreground-muted)]">
									Prioritized next steps to improve this deal's readiness. Review each action before
									representing it to your prospect.
								</p>
							</div>
						</div>
						{#if planLoading}
							<Spinner size={18} class="animate-spin" color="var(--foreground-muted)" />
						{/if}
					</div>

					{#if planActions.length > 0}
						<div class="mt-4 grid gap-3 lg:grid-cols-3">
							{#each planActions as action (action.id)}
								<button
									onclick={() => (selectedQuestionId = action.questionIds[0] ?? selectedQuestionId)}
									disabled={action.questionIds.length === 0}
									class="rounded-[var(--radius)] border border-[var(--border)] p-3 text-left transition-colors enabled:hover:border-[var(--brand)] enabled:hover:bg-[var(--brand-light)] disabled:cursor-default"
								>
									<div class="mb-2 flex items-center justify-between gap-2">
										<Badge variant={priorityVariant(action.priority)}
											>Priority {action.priority}</Badge
										>
										{#if action.questionIds.length > 0}<ArrowRight
												size={14}
												color="var(--foreground-muted)"
											/>{/if}
									</div>
									<p class="text-sm font-medium text-[var(--foreground)]">{action.title}</p>
									<p class="mt-1 text-xs leading-relaxed text-[var(--foreground-muted)]">
										{action.reason}
									</p>
								</button>
							{/each}
						</div>
					{/if}
				</Card>
			{/if}

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

						<!-- Question rows grouped by section -->
						<div class="max-h-[calc(100vh-260px)] divide-y divide-[var(--border)] overflow-y-auto">
							{#each groupedQuestions as group (group.section ?? '__none__')}
								<!-- Section divider -->
								{#if group.section}
									<div
										class="sticky top-0 z-[1] border-b border-[var(--border)] bg-[var(--background-elevated)] px-3.5 py-2"
									>
										<p
											class="truncate text-[10px] font-semibold tracking-wider text-[var(--foreground-subtle)] uppercase"
											title={group.section}
										>
											{group.section}
										</p>
									</div>
								{/if}

								{#each group.questions as q (q.id)}
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
													{questionLabel(q)}
												</p>
												<p class="mt-0.5 line-clamp-2 text-sm text-[var(--foreground)]">
													{q.questionText}
												</p>
											</div>
										</div>
									</button>
								{/each}
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
							<!-- Question number + section breadcrumb -->
							<div class="mb-1 flex items-center gap-1.5 text-xs text-[var(--foreground-subtle)]">
								<span>{questionLabel(selectedQuestion)}</span>
								{#if selectedQuestion.sectionName}
									<span>·</span>
									<span class="truncate">{selectedQuestion.sectionName}</span>
								{/if}
							</div>

							<!-- Question text + domain badges -->
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
										{confidenceExplanation(
											selectedQuestion.confidence,
											selectedQuestion.userEditedAnswer
										)}
									</p>
								</div>

								<!-- Confidence upgrade hint -->
								{#if (selectedQuestion.confidence === 'medium' || selectedQuestion.confidence === 'low') && getSuggestedPolicyType(selectedQuestion.domain)}
									{@const upgradeType = getSuggestedPolicyType(selectedQuestion.domain)!}
									{#if !existingPolicyTypes.includes(upgradeType)}
										<div
											class="mb-3 flex items-start gap-2 rounded-[var(--radius)] border border-[var(--brand)] bg-[var(--brand-light)] px-3 py-2.5"
										>
											<Sparkle size={14} color="var(--brand)" class="mt-0.5 shrink-0" />
											<p class="text-xs leading-snug text-[var(--foreground-muted)]">
												Generate a <a
													href="/policies?generate={upgradeType}"
													class="font-medium text-[var(--brand)] hover:underline"
													>{getPolicyTitle(upgradeType)}</a
												> to potentially upgrade this answer to High confidence.
											</p>
										</div>
									{/if}
								{/if}

								<!-- Source policies -->
								{#if sourcePolicies.length > 0}
									<div class="mb-4">
										<p
											class="mb-1.5 text-xs font-semibold tracking-wide text-[var(--foreground-subtle)] uppercase"
										>
											Sources
										</p>
										<div class="flex flex-wrap gap-1.5">
											{#each sourcePolicies as policy (policy.id)}
												<a
													href="/policies"
													class="inline-flex items-center gap-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] px-2 py-1 text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
												>
													<FileText size={11} />
													{policy.title}
												</a>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Answer citations with supporting excerpts -->
								{#if selectedQuestion.citations && selectedQuestion.citations.length > 0}
									<div class="mb-4 space-y-2">
										<p
											class="text-xs font-semibold tracking-wide text-[var(--foreground-subtle)] uppercase"
										>
											Supporting evidence
										</p>
										{#each selectedQuestion.citations as citation, i (i)}
											<details
												class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] px-3 py-2"
											>
												<summary
													class="cursor-pointer list-none text-xs font-medium text-[var(--foreground-muted)]"
												>
													<span
														class="mr-1.5 inline-block rounded bg-[var(--brand-light)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand)] uppercase"
													>
														{citation.sourceType.replace('_', ' ')}
													</span>
													{citation.sourceTitle}
												</summary>
												<p
													class="mt-1.5 text-xs leading-relaxed text-[var(--foreground-muted)] italic"
												>
													“{citation.excerpt}”
												</p>
											</details>
										{/each}
									</div>
								{/if}

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
									<div class="flex flex-wrap items-center justify-between gap-2">
										<div class="flex items-center gap-2">
											{#if questionnaire?.status === 'ready' && selectedQuestion.generatedAnswer && data.hasActivePaidAccess}
												<button
													onclick={() => {
														showImproveInput = !showImproveInput;
														if (!showImproveInput) {
															refinementPrompt = '';
															improveError = '';
														}
													}}
													class="inline-flex items-center gap-1.5 rounded-[var(--radius)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]"
												>
													<Sparkle size={13} weight="fill" />
													Improve with AI
												</button>
											{/if}
										</div>
										<div class="flex items-center gap-2">
											{#if data.canApproveAnswers && answerDraft.trim()}
												<Button
													size="sm"
													variant="secondary"
													onclick={approveForReuse}
													disabled={approvingAnswerId === selectedQuestion.id}
												>
													{#if approvingAnswerId === selectedQuestion.id}<Spinner
															size={13}
															class="animate-spin"
														/>{:else}<BookOpenText size={13} />{/if}
													Approve for reuse
												</Button>
											{/if}
											<Button
												size="sm"
												variant="ghost"
												onclick={async () => {
													await navigator.clipboard.writeText(answerDraft);
													toastSuccess(m.questionnaires_copied());
												}}
												disabled={!answerDraft}
											>
												<Copy size={13} />
												{m.questionnaires_copy_answer()}
											</Button>
											<Button size="sm" onclick={saveAnswer} disabled={savingAnswer}>
												{#if savingAnswer}
													<Spinner size={13} class="animate-spin" />
												{/if}
												Save
											</Button>
										</div>
									</div>

									{#if showImproveInput}
										<div
											class="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-alt)] p-3.5"
										>
											<p
												class="mb-2 text-xs font-semibold tracking-wide text-[var(--foreground-subtle)] uppercase"
											>
												Refine this answer
											</p>
											<input
												type="text"
												bind:value={refinementPrompt}
												onkeydown={(e) => {
													if (e.key === 'Enter' && !improving) improveAnswer();
												}}
												placeholder="e.g. make this more formal, add more detail..."
												class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
											/>
											{#if improveError}
												<p class="mt-1.5 text-xs text-[var(--danger)]">{improveError}</p>
											{/if}
											<div class="mt-2.5 flex items-center justify-between gap-2">
												<button
													onclick={() => {
														showImproveInput = false;
														refinementPrompt = '';
														improveError = '';
													}}
													class="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
												>
													Cancel
												</button>
												<Button
													size="sm"
													onclick={improveAnswer}
													disabled={improving || !refinementPrompt.trim()}
												>
													{#if improving}
														<Spinner size={13} class="animate-spin" />
													{:else}
														<Sparkle size={13} weight="fill" />
													{/if}
													Apply
												</Button>
											</div>
										</div>
									{/if}
								</div>

								<!-- Gap state -->
							{:else if selectedQuestion.confidence === 'gap'}
								{@const processingFailure = isProcessingFailureGap(selectedQuestion)}
								<div
									class="mb-4 flex items-start gap-2.5 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light)] px-4 py-3"
								>
									<Warning size={16} color="var(--danger)" weight="fill" class="mt-0.5 shrink-0" />
									<div>
										<p class="text-sm font-medium text-[var(--danger)]">
											{processingFailure
												? 'Analysis needs to be retried'
												: m.questionnaires_gap_title()}
										</p>
										{#if processingFailure}
											<p class="mt-0.5 text-xs text-[var(--danger)] opacity-80">
												We could not finish analyzing this question. This is not a missing company
												fact.
											</p>
										{/if}
										{#if selectedQuestion.gapReason}
											<p class="mt-0.5 text-xs text-[var(--danger)] opacity-80">
												{selectedQuestion.gapReason}
											</p>
										{/if}
									</div>
								</div>

								<div
									class="mb-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-alt)] p-4"
								>
									<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div>
											<p class="text-sm font-semibold text-[var(--foreground)]">
												Answer this question
											</p>
											<p class="mt-0.5 text-xs leading-relaxed text-[var(--foreground-muted)]">
												Confirm an answer on behalf of your company to resolve this questionnaire
												gap now.
											</p>
										</div>
										{#if processingFailure}
											<Button
												size="sm"
												variant="secondary"
												onclick={handleReprocess}
												disabled={reprocessing}
											>
												{#if reprocessing}<Spinner
														size={13}
														class="animate-spin"
													/>{:else}<ArrowClockwise size={13} />{/if}
												Retry analysis
											</Button>
										{/if}
									</div>
									<textarea
										id="answer-textarea"
										bind:value={answerDraft}
										rows={6}
										placeholder="Enter the answer you can confirm..."
										class="mt-3 w-full resize-y rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm leading-relaxed text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
									></textarea>
									<div class="mt-2.5 flex flex-wrap items-center justify-between gap-2">
										<p class="text-xs text-[var(--foreground-subtle)]">
											This is saved as an owner-confirmed answer and updates Deal Readiness
											immediately.
										</p>
										<Button
											size="sm"
											onclick={saveAnswer}
											disabled={savingAnswer || !answerDraft.trim()}
										>
											{#if savingAnswer}<Spinner size={13} class="animate-spin" />{/if}
											Mark as answered
										</Button>
									</div>
								</div>

								<!-- Founder interview -->
								{#if data.hasActivePaidAccess && !processingFailure}
									<div
										class="mb-4 rounded-[var(--radius-lg)] border border-[var(--brand)] bg-[var(--brand-light)] p-4"
									>
										<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
											<div class="flex items-start gap-2.5">
												<ChatCenteredDots size={18} color="var(--brand)" class="mt-0.5 shrink-0" />
												<div>
													<p class="text-sm font-semibold text-[var(--foreground)]">
														Founder interview
													</p>
													<p class="mt-0.5 text-xs leading-relaxed text-[var(--foreground-muted)]">
														Answer a short AI follow-up to capture missing company context.
													</p>
												</div>
											</div>
											<Button
												size="sm"
												variant="secondary"
												onclick={startGapInterview}
												disabled={interviewLoading}
											>
												{#if interviewLoading}<Spinner
														size={13}
														class="animate-spin"
													/>{:else}<Sparkle size={13} />{/if}
												{interviewPrompts.length > 0 ? 'Refresh' : 'Start'}
											</Button>
										</div>

										{#each selectedInterviewPrompts as prompt (prompt.question)}
											<div class="mt-4 rounded-[var(--radius)] bg-[var(--background)] p-3">
												<p
													class="text-xs font-semibold tracking-wide text-[var(--foreground-subtle)] uppercase"
												>
													AI question
												</p>
												<p class="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
													{prompt.question}
												</p>
												<p class="mt-1 text-xs leading-relaxed text-[var(--foreground-muted)]">
													{prompt.whyItMatters}
												</p>
												<textarea
													value={interviewAnswers[prompt.question] ?? ''}
													oninput={(event) => {
														interviewAnswers = {
															...interviewAnswers,
															[prompt.question]: (event.target as HTMLTextAreaElement).value
														};
													}}
													rows={3}
													placeholder="Share only details you can confirm."
													class="mt-3 w-full resize-y rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
												></textarea>
												<div class="mt-2 flex justify-end">
													<Button
														size="sm"
														variant="secondary"
														onclick={() => saveInterviewFact(prompt)}
														disabled={savingPromptId === prompt.question ||
															!(interviewAnswers[prompt.question] ?? '').trim()}
													>
														{#if savingPromptId === prompt.question}<Spinner
																size={13}
																class="animate-spin"
															/>{:else}<PaperPlaneTilt size={13} />{/if}
														Save as pending fact
													</Button>
												</div>
												<p class="mt-2 text-xs text-[var(--foreground-subtle)]">
													After verification, choose Update answers to apply this reusable fact to
													unresolved questions.
												</p>
											</div>
										{/each}

										{#if interviewError}
											<p class="mt-3 text-xs text-[var(--danger)]">{interviewError}</p>
										{/if}
									</div>
								{/if}

								{#if selectedQuestion.gapRemediation}
									{@const suggestedType = getSuggestedPolicyType(selectedQuestion.domain)}
									<div class="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
										<p class="mb-2 text-xs font-semibold text-[var(--foreground-muted)] uppercase">
											{m.questionnaires_gap_remediation_label()}
										</p>
										<p class="mb-4 text-sm leading-relaxed text-[var(--foreground)]">
											{selectedQuestion.gapRemediation}
										</p>
										<div class="flex flex-wrap gap-2">
											{#if suggestedType}
												<a
													href="/policies?generate={suggestedType}&controlIds={gapControls
														.map((control) => control.id)
														.join(',')}&questionnaireId={id}"
												>
													<Button size="sm" variant="secondary">
														<FileText size={14} />
														Generate {getPolicyTitle(suggestedType)}
														<ArrowRight size={12} />
													</Button>
												</a>
											{/if}
											{#if gapControls.length > 0}
												<a href="/controls/{gapControls[0].id}">
													<Button size="sm" variant="secondary">
														<FolderOpen size={14} />
														Upload evidence for {gapControls[0].code}
														<ArrowRight size={12} />
													</Button>
												</a>
											{/if}
										</div>
									</div>
								{/if}

								<!-- Controls satisfied by fixing this gap -->
								{#if gapControls.length > 0}
									<div
										class="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-alt)] p-4"
									>
										<p
											class="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)]"
										>
											<ListChecks size={13} />
											{m.questionnaires_gap_controls_title()}
										</p>
										<ul class="space-y-1">
											{#each gapControls as ctrl (ctrl.id)}
												<li class="flex items-start gap-1.5 text-xs text-[var(--foreground-muted)]">
													<span class="mt-px shrink-0 text-[var(--foreground-subtle)]">·</span>
													<span>
														<span class="font-medium text-[var(--foreground)]">{ctrl.code}</span>
														{' — '}{ctrl.title}
													</span>
												</li>
											{/each}
										</ul>
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
