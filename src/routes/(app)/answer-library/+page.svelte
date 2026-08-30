<script lang="ts">
	import { BookOpenText, CheckCircle, ClockCounterClockwise, ShieldCheck } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data } = $props();

	function dateLabel(value: Date | string | null) {
		if (!value) return 'No review date';
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function isStale(entry: (typeof data.entries)[number]) {
		return (
			entry.status === 'stale' ||
			(entry.expiresAt && new Date(entry.expiresAt).getTime() < Date.now())
		);
	}
</script>

<div class="mx-auto max-w-5xl space-y-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-[var(--foreground)]">Answer Library</h1>
			<p class="mt-1 max-w-2xl text-sm text-[var(--foreground-muted)]">
				Approved company claims that can be reused in the next buyer security review. Drafts never
				appear here—an admin must explicitly approve each answer.
			</p>
		</div>
		<Badge variant="info">{data.entries.length} approved answers</Badge>
	</div>

	{#if data.entries.length === 0}
		<Card class="p-12 text-center"
			><BookOpenText size={46} color="var(--foreground-subtle)" class="mx-auto mb-3" />
			<h2 class="font-semibold text-[var(--foreground)]">
				Your reusable answer base starts with a reviewed questionnaire
			</h2>
			<p class="mx-auto mt-2 max-w-lg text-sm text-[var(--foreground-muted)]">
				Open an answered question, confirm its wording and sources, then select “Approve for reuse.”
				This keeps the library limited to defensible company claims.
			</p>
			<a
				href="/questionnaires"
				class="mt-4 inline-block text-sm font-medium text-[var(--brand)] hover:underline"
				>Review questionnaires →</a
			></Card
		>
	{:else}
		<div class="space-y-4">
			{#each data.entries as entry (entry.id)}
				<Card class="p-5">
					<div class="flex flex-wrap items-start justify-between gap-3">
						<p class="max-w-3xl text-sm font-semibold text-[var(--foreground)]">
							{entry.questionText}
						</p>
						<Badge variant={isStale(entry) ? 'warning' : 'success'}
							>{isStale(entry) ? 'Needs review' : 'Approved'}</Badge
						>
					</div>
					<p
						class="mt-3 rounded-[var(--radius)] bg-[var(--background-alt)] p-3 text-sm leading-relaxed whitespace-pre-wrap text-[var(--foreground)]"
					>
						{entry.answer}
					</p>
					<div
						class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--foreground-muted)]"
					>
						<span class="flex items-center gap-1"
							><ShieldCheck size={13} color="var(--success)" /> {entry.scope}</span
						><span class="flex items-center gap-1"
							><CheckCircle size={13} /> Reviewed {dateLabel(entry.reviewedAt)}</span
						>{#if entry.expiresAt}<span class="flex items-center gap-1"
								><ClockCounterClockwise size={13} /> Re-review {dateLabel(entry.expiresAt)}</span
							>{/if}
					</div>
					{#if entry.citations && entry.citations.length > 0}<details class="mt-3">
							<summary class="cursor-pointer text-xs font-medium text-[var(--brand)]"
								>{entry.citations.length} supporting {entry.citations.length === 1
									? 'source'
									: 'sources'}</summary
							>
							<div class="mt-2 space-y-2">
								{#each entry.citations as citation, i (i)}<div
										class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] px-3 py-2 text-xs text-[var(--foreground-muted)]"
									>
										<span class="font-semibold text-[var(--foreground)]"
											>{citation.sourceTitle}</span
										>
										· “{citation.excerpt}”
									</div>{/each}
							</div>
						</details>{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
