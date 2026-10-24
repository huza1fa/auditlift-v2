<script lang="ts">
	import { BookOpenText, ShieldCheck } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import AnswerReview from './AnswerReview.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let filter = $state<'all' | 'review' | 'approved' | 'retired'>('all');
	const needsReview = $derived(
		data.entries.filter((entry) => entry.status !== 'retired' && entry.issues.length > 0)
	);
	const approved = $derived(data.entries.filter((entry) => entry.issues.length === 0));
	const retired = $derived(data.entries.filter((entry) => entry.status === 'retired'));
	const visibleEntries = $derived(
		filter === 'review'
			? needsReview
			: filter === 'approved'
				? approved
				: filter === 'retired'
					? retired
					: data.entries
	);
	const tabs = $derived([
		{ id: 'all' as const, label: m.freshness_all(), count: data.entries.length },
		{ id: 'review' as const, label: m.freshness_needs_review(), count: needsReview.length },
		{ id: 'approved' as const, label: m.freshness_approved(), count: approved.length },
		{ id: 'retired' as const, label: m.freshness_retired(), count: retired.length }
	]);
	function issueLabel(reason: string) {
		switch (reason) {
			case 'changed':
				return m.freshness_changed();
			case 'unavailable':
				return m.freshness_missing();
			case 'unversioned':
				return m.freshness_unversioned();
			case 'expired':
				return m.freshness_expired();
			case 'cycle':
				return m.freshness_cycle();
			case 'scope':
				return m.freshness_scope_help();
			case 'retired':
				return m.freshness_retired();
			default:
				return m.freshness_stale();
		}
	}
	function dateLabel(value: Date | string) {
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head><title>{m.freshness_library_title()} | AuditLift</title></svelte:head>
<div class="mx-auto max-w-5xl space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-[var(--foreground)]">{m.freshness_library_title()}</h1>
		<p class="mt-1 max-w-2xl text-sm text-[var(--foreground-muted)]">
			{m.freshness_library_description()}
		</p>
	</div>
	<div class="flex flex-wrap gap-2" aria-label={m.freshness_library_title()}>
		{#each tabs as tab (tab.id)}<button
				type="button"
				aria-pressed={filter === tab.id}
				onclick={() => (filter = tab.id)}
				class={`rounded-[var(--radius)] border px-3 py-2 text-sm ${filter === tab.id ? 'border-[var(--brand)] bg-[var(--background-alt)] text-[var(--brand)]' : 'border-[var(--border)] text-[var(--foreground-muted)]'}`}
				>{tab.label} ({tab.count})</button
			>{/each}
	</div>
	{#each visibleEntries as entry (entry.id)}
		<Card class="p-5">
			<div class="flex items-start justify-between gap-3">
				<p class="text-sm font-semibold text-[var(--foreground)]">{entry.questionText}</p>
				<Badge
					variant={entry.status === 'retired'
						? 'default'
						: entry.issues.length
							? 'warning'
							: 'success'}
					>{entry.status === 'retired'
						? m.freshness_retired()
						: entry.issues.length
							? m.freshness_needs_review()
							: m.freshness_approved()}</Badge
				>
			</div>
			<p
				class="mt-3 rounded-[var(--radius)] bg-[var(--background-alt)] p-3 text-sm leading-relaxed whitespace-pre-wrap"
			>
				{entry.answer}
			</p>
			<div class="mt-3 flex flex-wrap gap-4 text-xs text-[var(--foreground-muted)]">
				<span class="flex items-center gap-1"><ShieldCheck size={13} />{entry.scope}</span><span
					>{m.freshness_reviewed_date({ date: dateLabel(entry.reviewedAt) })}</span
				>{#if entry.expiresAt}<span
						>{m.freshness_review_due({ date: dateLabel(entry.expiresAt) })}</span
					>{/if}
			</div>
			{#if entry.issues.length > 0 && entry.status !== 'retired'}<ul
					class="mt-3 space-y-1 rounded-[var(--radius)] bg-[var(--background-alt)] p-3 text-xs text-[var(--warning)]"
				>
					{#each entry.issues as issue, index (index)}<li>
							{issue.sourceTitle}: {issueLabel(issue.reason)}
						</li>{/each}
				</ul>{/if}
			{#if data.canApprove}<AnswerReview {entry} sourceRevision={data.sourceRevision} />{/if}
		</Card>
	{:else}
		<Card class="p-12 text-center"
			><BookOpenText size={42} class="mx-auto mb-3 text-[var(--foreground-subtle)]" />
			<p>{m.freshness_empty()}</p>
			{#if data.entries.length === 0}<p class="mt-2 text-sm text-[var(--foreground-muted)]">
					{m.freshness_start()}
				</p>
				<a
					href="/questionnaires"
					class="mt-4 inline-block text-sm text-[var(--brand)] hover:underline"
					>{m.freshness_questionnaires()} →</a
				>{/if}</Card
		>
	{/each}
</div>
