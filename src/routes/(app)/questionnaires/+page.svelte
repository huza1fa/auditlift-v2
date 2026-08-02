<script lang="ts">
	import {
		ChatDots,
		Upload,
		Spinner,
		Warning,
		ArrowRight,
		FileCsv,
		FileDoc,
		FilePdf,
		File as FileGeneric,
		Trash
	} from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { toastError, toastSuccess } from '$lib/stores/toasts.svelte';
	import * as m from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { captureEvent } from '$lib/posthog';

	// ── Types ─────────────────────────────────────────────────────────────────
	type QuestionnaireStatus = 'processing' | 'ready' | 'error';

	interface Questionnaire {
		id: string;
		filename: string;
		status: QuestionnaireStatus;
		totalQuestions: number;
		answeredCount: number;
		gapCount: number;
		highCount: number;
		mediumCount: number;
		lowCount: number;
		dealReadinessScore: number | null;
		createdAt: string;
	}

	interface ApiResponse {
		questionnaires: Questionnaire[];
	}

	// ── Props ─────────────────────────────────────────────────────────────────
	let { data } = $props();

	// ── Local state ───────────────────────────────────────────────────────────
	let questionnaires = $state<Questionnaire[]>([]);
	let loading = $state(true);
	let uploading = $state(false);
	let uploadingFilename = $state('');
	let uploadError = $state('');
	let dragOver = $state(false);
	let fileInput = $state<HTMLInputElement | null>(null);

	// Plain map — not reactive state, just bookkeeping for open SSE connections
	const sseConnections = new Map<string, EventSource>();

	// ── Derived ───────────────────────────────────────────────────────────────
	const hasProcessing = $derived(questionnaires.some((q) => q.status === 'processing'));
	const showTrialBanner = $derived(!data.hasActivePaidAccess && questionnaires.length >= 1);

	// ── Helpers ───────────────────────────────────────────────────────────────
	function formatDate(dateStr: string): string {
		const d = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		if (diffDays === 0) return 'today';
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 30) return `${diffDays} days ago`;
		return d.toLocaleDateString();
	}

	function getFileIcon(filename: string) {
		const ext = filename.split('.').pop()?.toLowerCase();
		if (ext === 'pdf') return FilePdf;
		if (ext === 'csv') return FileCsv;
		if (ext === 'docx' || ext === 'doc') return FileDoc;
		return FileGeneric;
	}

	function scoreColor(score: number): string {
		if (score >= 70) return 'text-[var(--success)]';
		if (score >= 40) return 'text-[var(--warning)]';
		return 'text-[var(--danger)]';
	}

	function scoreBg(score: number): string {
		if (score >= 70) return 'bg-[var(--success-light)]';
		if (score >= 40) return 'bg-[var(--warning-light)]';
		return 'bg-[var(--danger-light)]';
	}

	// ── Data fetching ─────────────────────────────────────────────────────────
	async function fetchQuestionnaires() {
		try {
			const res = await fetch('/api/questionnaires');
			if (!res.ok) return;
			const json: ApiResponse = await res.json();
			questionnaires = json.questionnaires ?? [];
		} catch {
			// silently fail — don't disrupt UI
		}
	}

	// ── SSE ───────────────────────────────────────────────────────────────────
	const sseTimers = new Map<string, ReturnType<typeof setTimeout>>();

	function connectSSE(questionnaireId: string) {
		if (sseConnections.has(questionnaireId)) return;

		const es = new EventSource(`/api/questionnaires/${questionnaireId}/stream`);
		sseConnections.set(questionnaireId, es);

		// Client-side timeout: if no result after 2 minutes, show feedback
		const timer = setTimeout(() => {
			es.close();
			sseConnections.delete(questionnaireId);
			sseTimers.delete(questionnaireId);
			questionnaires = questionnaires.map((q) =>
				q.id === questionnaireId ? { ...q, status: 'error' as QuestionnaireStatus } : q
			);
			toastError('Processing is taking too long. Please try refreshing the page or re-uploading.');
		}, 120_000);
		sseTimers.set(questionnaireId, timer);

		es.onmessage = async (event) => {
			let payload: { status: string };
			try {
				payload = JSON.parse(event.data);
			} catch {
				return;
			}

			if (payload.status === 'ready' || payload.status === 'error') {
				clearTimeout(sseTimers.get(questionnaireId));
				sseTimers.delete(questionnaireId);
				questionnaires = questionnaires.map((q) =>
					q.id === questionnaireId ? { ...q, status: payload.status as QuestionnaireStatus } : q
				);
				es.close();
				sseConnections.delete(questionnaireId);
				await fetchQuestionnaires();

				if (payload.status === 'error') {
					toastError('Questionnaire processing failed. Please try uploading again.');
				}
			}
		};

		es.onerror = () => {
			clearTimeout(sseTimers.get(questionnaireId));
			sseTimers.delete(questionnaireId);
			es.close();
			sseConnections.delete(questionnaireId);
		};
	}

	function closeAllSSE() {
		for (const es of sseConnections.values()) {
			es.close();
		}
		sseConnections.clear();
		for (const timer of sseTimers.values()) {
			clearTimeout(timer);
		}
		sseTimers.clear();
	}

	// ── Delete ───────────────────────────────────────────────────────────────
	async function deleteQuestionnaire(id: string) {
		if (!confirm('Delete this questionnaire? This cannot be undone.')) return;
		captureEvent('questionnaire_deleted', { questionnaire_id: id });
		try {
			const res = await fetch(`/api/questionnaires/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error();
			questionnaires = questionnaires.filter((q) => q.id !== id);
			toastSuccess('Questionnaire deleted');
		} catch {
			toastError('Failed to delete questionnaire');
		}
	}

	// ── Upload ────────────────────────────────────────────────────────────────
	const ALLOWED_TYPES = [
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'text/csv',
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	];
	const MAX_SIZE = 5 * 1024 * 1024; // 5MB

	async function uploadFile(file: globalThis.File) {
		uploadError = '';

		if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(xlsx|csv|pdf|docx)$/i)) {
			uploadError = 'Invalid file type. Please upload XLSX, CSV, PDF, or DOCX.';
			return;
		}
		if (file.size > MAX_SIZE) {
			uploadError = 'File too large. Maximum size is 5MB.';
			return;
		}

		uploading = true;
		uploadingFilename = file.name;
		captureEvent('questionnaire_upload_clicked', { file_size_bytes: file.size });
		try {
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/questionnaires/upload', {
				method: 'POST',
				body: formData
			});

			if (res.status === 402) {
				uploadError = m.questionnaires_trial_limit_error();
				return;
			}
			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				uploadError = (json as { message?: string }).message ?? 'Upload failed. Please try again.';
				return;
			}

			const newQ: Questionnaire = await res.json();
			questionnaires = [newQ, ...questionnaires];
			toastSuccess(
				'Questionnaire uploaded — AI is analyzing your questions now. This may take a minute.'
			);

			if (newQ.status === 'processing') {
				connectSSE(newQ.id);
			}
		} catch {
			uploadError = 'Upload failed. Please try again.';
			toastError('Upload failed');
		} finally {
			uploading = false;
			uploadingFilename = '';
		}
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) uploadFile(file as globalThis.File);
		target.value = '';
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) uploadFile(file as globalThis.File);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	// ── Effects ───────────────────────────────────────────────────────────────
	$effect(() => {
		fetchQuestionnaires().then(() => {
			loading = false;
			// Open SSE for any already-processing questionnaires on page load
			for (const q of questionnaires) {
				if (q.status === 'processing') {
					connectSSE(q.id);
				}
			}
		});

		return () => closeAllSSE();
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">{m.questionnaires_title()}</h1>
		<Button onclick={() => fileInput?.click()} disabled={uploading}>
			{#if uploading}
				<Spinner size={16} class="animate-spin" />
				{m.questionnaires_uploading()}
			{:else}
				<Upload size={16} />
				{m.questionnaires_upload_button()}
			{/if}
		</Button>
	</div>

	<!-- Trial banner -->
	{#if showTrialBanner}
		<div
			class="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] px-4 py-3"
		>
			<div class="flex items-center gap-2.5">
				<Warning size={18} color="var(--warning)" weight="fill" />
				<p class="text-sm text-[var(--warning)]">{m.questionnaires_trial_banner()}</p>
			</div>
			<a href="/settings/billing">
				<Button size="sm" variant="secondary">{m.questionnaires_trial_upgrade()}</Button>
			</a>
		</div>
	{/if}

	<!-- Upload zone -->
	<div
		role="button"
		tabindex="0"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		onclick={() => fileInput?.click()}
		onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
		class="cursor-pointer rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-8 text-center transition-colors
			{dragOver
			? 'border-[var(--brand)] bg-[var(--brand-light)]'
			: 'border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--brand)] hover:bg-[var(--background-alt)]'}"
	>
		{#if uploading}
			<div class="flex flex-col items-center gap-3">
				<Spinner size={28} class="animate-spin text-[var(--brand)]" color="var(--brand)" />
				<p class="text-sm font-medium text-[var(--foreground-muted)]">
					{m.questionnaires_uploading()}
				</p>
			</div>
		{:else}
			<div class="flex flex-col items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-alt)]"
				>
					<Upload size={24} color="var(--foreground-muted)" />
				</div>
				<div>
					<p class="font-medium text-[var(--foreground)]">{m.questionnaires_upload_area_title()}</p>
					<p class="mt-1 text-sm text-[var(--foreground-muted)]">
						{m.questionnaires_upload_area_subtitle()}
					</p>
					<p class="mt-2 text-xs font-medium text-[var(--brand)]">
						{m.questionnaires_upload_area_click()}
					</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Hidden file input -->
	<input
		bind:this={fileInput}
		type="file"
		accept=".xlsx,.csv,.pdf,.docx"
		class="hidden"
		onchange={handleFileChange}
	/>

	<!-- Upload error -->
	{#if uploadError}
		<div class="rounded-[var(--radius)] bg-[var(--danger-light)] px-4 py-3">
			<p class="text-sm text-[var(--danger)]">{uploadError}</p>
		</div>
	{/if}

	<!-- Processing banner -->
	{#if hasProcessing}
		<div
			class="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--info)] bg-[var(--info-light)] px-4 py-3"
		>
			<Spinner size={18} class="animate-spin" color="var(--info)" />
			<p class="text-sm text-[var(--info)]">
				One or more questionnaires are being analyzed by AI. Results will appear automatically — no
				need to refresh.
			</p>
		</div>
	{/if}

	<!-- List -->
	{#if loading}
		<div class="flex justify-center py-16">
			<Spinner size={28} class="animate-spin" color="var(--foreground-muted)" />
		</div>
	{:else if questionnaires.length === 0 && !uploading}
		<!-- Empty state -->
		<Card class="p-12 text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-alt)]"
			>
				<ChatDots size={32} color="var(--foreground-subtle)" />
			</div>
			<p class="text-base font-semibold text-[var(--foreground)]">
				{m.questionnaires_empty_title()}
			</p>
			<p class="mt-1.5 text-sm text-[var(--foreground-muted)]">
				{m.questionnaires_empty_subtitle()}
			</p>
			<div class="mt-5 flex justify-center">
				<Button onclick={() => fileInput?.click()} disabled={uploading}>
					<Upload size={16} />
					{m.questionnaires_upload_button()}
				</Button>
			</div>
		</Card>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Skeleton card shown immediately while uploading -->
			{#if uploading}
				<div class="pointer-events-none">
					<Card class="flex h-full flex-col p-4 opacity-70">
						<div class="mb-3 flex items-start justify-between gap-2">
							<div class="flex min-w-0 items-center gap-2.5">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--background-alt)]"
								>
									<Upload size={18} color="var(--brand)" />
								</div>
								<p class="truncate text-sm font-medium text-[var(--foreground)]">
									{uploadingFilename}
								</p>
							</div>
							<div class="shrink-0">
								<Badge variant="warning">
									<Spinner size={10} class="animate-spin" />
									Uploading…
								</Badge>
							</div>
						</div>
						<div class="mt-auto flex items-center justify-between">
							<div class="h-3 w-32 animate-pulse rounded bg-[var(--background-alt)]"></div>
							<div class="h-3 w-12 animate-pulse rounded bg-[var(--background-alt)]"></div>
						</div>
					</Card>
				</div>
			{/if}
			{#each questionnaires as q (q.id)}
				{@const FileIcon = getFileIcon(q.filename)}
				<div class="group relative">
					<button
						onclick={(e) => {
							e.stopPropagation();
							deleteQuestionnaire(q.id);
						}}
						class="absolute right-2 bottom-2 z-10 flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-[var(--background-elevated)] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-[var(--danger-light)]"
						title="Delete questionnaire"
					>
						<Trash size={14} color="var(--danger)" />
					</button>
					<button
						onclick={() => goto(`/questionnaires/${q.id}`)}
						class="w-full cursor-pointer text-left"
					>
						<Card
							class="flex h-full flex-col p-4 transition-shadow hover:shadow-[var(--shadow-md)]"
						>
							<!-- Top row: icon + filename + status badge -->
							<div class="mb-3 flex items-start justify-between gap-2">
								<div class="flex min-w-0 items-center gap-2.5">
									<div
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--background-alt)]"
									>
										<FileIcon size={18} color="var(--brand)" />
									</div>
									<p class="truncate text-sm font-medium text-[var(--foreground)]">
										{q.filename}
									</p>
								</div>
								<div class="shrink-0">
									{#if q.status === 'processing'}
										<Badge variant="warning">
											<Spinner size={10} class="animate-spin" />
											{m.questionnaires_status_processing()}
										</Badge>
									{:else if q.status === 'ready'}
										<Badge variant="success">{m.questionnaires_status_ready()}</Badge>
									{:else}
										<Badge variant="danger">{m.questionnaires_status_error()}</Badge>
									{/if}
								</div>
							</div>

							<!-- Deal readiness score -->
							{#if q.status === 'ready' && q.dealReadinessScore !== null}
								<div
									class="mb-3 self-start rounded-[var(--radius)] {scoreBg(
										q.dealReadinessScore
									)} px-2.5 py-1.5"
								>
									<div class="flex items-baseline gap-1.5">
										<span class="text-xs font-medium text-[var(--foreground-muted)]">
											{m.questionnaires_deal_readiness()}
										</span>
										<span class="text-lg leading-none font-bold {scoreColor(q.dealReadinessScore)}">
											{q.dealReadinessScore}%
										</span>
									</div>
									<p class="mt-0.5 text-xs text-[var(--foreground-muted)]">
										<span class="font-medium text-[var(--success)]">{q.highCount} high</span>
										·
										<span class="font-medium text-[var(--info)]">{q.mediumCount} medium</span>
										·
										<span class="font-medium text-[var(--danger)]">{q.gapCount} gaps</span>
									</p>
								</div>
							{/if}

							<!-- Stats -->
							<div class="mt-auto flex items-center justify-between">
								<p class="text-xs text-[var(--foreground-muted)]">
									{m.questionnaires_stat_answered({ count: q.answeredCount })} of {q.totalQuestions} ·
									{m.questionnaires_stat_gaps({ count: q.gapCount })}
								</p>
								<div class="flex items-center gap-1 text-xs text-[var(--foreground-subtle)]">
									<span>{formatDate(q.createdAt)}</span>
									<ArrowRight size={12} class="transition-transform group-hover:translate-x-0.5" />
								</div>
							</div>
						</Card>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
