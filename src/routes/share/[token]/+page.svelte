<script lang="ts">
	import { ShieldCheck, CheckCircle, XCircle, Warning } from 'phosphor-svelte';

	let { data } = $props();

	const score = $derived(data.questionnaire.dealReadinessScore ?? 0);
	const ringSize = 80;
	const ringStroke = 7;
	const ringRadius = (ringSize - ringStroke) / 2;
	const ringCircumference = 2 * Math.PI * ringRadius;
	const ringOffset = $derived(ringCircumference - (score / 100) * ringCircumference);

	function scoreColor(s: number): string {
		if (s >= 70) return 'var(--success)';
		if (s >= 40) return 'var(--warning)';
		return 'var(--danger)';
	}

	function confidenceBadge(c: string | null): { label: string; cls: string } {
		switch (c) {
			case 'high':
				return { label: 'High', cls: 'bg-[var(--success-light)] text-[var(--success)]' };
			case 'medium':
				return { label: 'Medium', cls: 'bg-[var(--info-light)] text-[var(--info)]' };
			case 'low':
				return { label: 'Low', cls: 'bg-[var(--warning-light)] text-[var(--warning)]' };
			case 'gap':
				return { label: 'Gap', cls: 'bg-[var(--danger-light)] text-[var(--danger)]' };
			default:
				return {
					label: 'Unprocessed',
					cls: 'bg-[var(--background-alt)] text-[var(--foreground-muted)]'
				};
		}
	}

	// Group questions by section
	type Q = (typeof data.questions)[0];
	const grouped = $derived.by(() => {
		const groups: Array<{ section: string | null; questions: Q[] }> = [];
		let current: (typeof groups)[0] | null = null;
		for (const q of data.questions) {
			if (!current || current.section !== q.sectionName) {
				current = { section: q.sectionName, questions: [] };
				groups.push(current);
			}
			current.questions.push(q);
		}
		return groups;
	});

	const sharedDate = $derived(
		new Date(data.questionnaire.sharedAt!).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>Security Questionnaire — {data.organizationName} | AuditLift</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8 border-b border-[var(--border)] pb-8">
		<div class="mb-4 flex items-center gap-2 text-[var(--brand)]">
			<ShieldCheck size={24} weight="fill" />
			<span class="text-lg font-semibold tracking-tight">AuditLift</span>
		</div>

		<h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">Security Questionnaire</h1>
		<p class="mb-4 text-sm text-[var(--foreground-muted)]">
			Prepared by <strong>{data.organizationName}</strong> · {data.questionnaire.filename} · Shared {sharedDate}
		</p>

		<!-- Score + Stats -->
		<div class="flex flex-wrap items-center gap-6">
			<div class="flex items-center gap-3">
				<svg width={ringSize} height={ringSize} class="shrink-0 -rotate-90">
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
						stroke-dasharray={ringCircumference}
						stroke-dashoffset={ringOffset}
						stroke-linecap="round"
					/>
				</svg>
				<div>
					<p class="text-3xl font-bold" style="color: {scoreColor(score)}">{score}%</p>
					<p class="text-xs text-[var(--foreground-muted)]">Deal Readiness</p>
				</div>
			</div>

			<div class="flex gap-4 text-sm text-[var(--foreground-muted)]">
				<div>
					<p class="text-lg font-semibold text-[var(--foreground)]">
						{data.questionnaire.answeredCount}
					</p>
					<p class="text-xs">Answered</p>
				</div>
				<div>
					<p class="text-lg font-semibold text-[var(--danger)]">{data.questionnaire.gapCount}</p>
					<p class="text-xs">Gaps</p>
				</div>
				<div>
					<p class="text-lg font-semibold text-[var(--foreground)]">
						{data.questionnaire.totalQuestions}
					</p>
					<p class="text-xs">Total</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Questions -->
	{#each grouped as group}
		{#if group.section}
			<h2
				class="mt-8 mb-4 border-b border-[var(--border)] pb-2 text-sm font-semibold tracking-wider text-[var(--foreground-muted)] uppercase"
			>
				{group.section}
			</h2>
		{/if}

		{#each group.questions as q (q.id)}
			<div
				class="mb-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-elevated)] p-5"
			>
				<div class="mb-2 flex items-start justify-between gap-3">
					<p class="text-sm font-medium text-[var(--foreground)]">
						{#if q.questionNumber}<span class="text-[var(--foreground-subtle)]"
								>#{q.questionNumber}</span
							>{/if}
						{q.questionText}
					</p>
					<span
						class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold {confidenceBadge(
							q.confidence
						).cls}"
					>
						{confidenceBadge(q.confidence).label}
					</span>
				</div>

				{#if q.confidence === 'gap'}
					<div
						class="flex items-start gap-2 rounded-[var(--radius)] bg-[var(--danger-light)] px-3 py-2"
					>
						<XCircle size={14} color="var(--danger)" class="mt-0.5 shrink-0" />
						<p class="text-xs text-[var(--danger)]">
							{q.gapReason ?? 'This question requires additional documentation.'}
						</p>
					</div>
				{:else if q.answer}
					<div class="rounded-[var(--radius)] bg-[var(--background-alt)] px-3 py-2.5">
						<p class="text-sm leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">
							{q.answer}
						</p>
					</div>
				{:else}
					<p class="text-xs text-[var(--foreground-subtle)] italic">No answer available.</p>
				{/if}
			</div>
		{/each}
	{/each}

	<!-- Footer -->
	<div class="mt-12 border-t border-[var(--border)] pt-6 text-center">
		<div class="flex items-center justify-center gap-1.5 text-[var(--foreground-subtle)]">
			<ShieldCheck size={14} />
			<span class="text-xs"
				>Powered by <a
					href="https://auditlift.app"
					class="font-medium text-[var(--brand)] hover:underline">AuditLift</a
				></span
			>
		</div>
	</div>
</div>
