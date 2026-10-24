<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import SourceReview from '$lib/components/answers/SourceReview.svelte';
	import { toastError, toastSuccess } from '$lib/stores/toasts.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { PageData } from './$types';

	let { entry, sourceRevision }: { entry: PageData['entries'][number]; sourceRevision: string } =
		$props();
	let open = $state(false);
	let answer = $state('');
	let scope = $state('');
	let expires = $state('');
	let selectedSources = $state<number[]>([]);
	let excerpts = $state<Record<string, string>>({});
	let confirmed = $state(false);
	let saving = $state(false);
	let reviewRevision = $state('');
	let reviewSourceRevision = $state('');

	function startReview() {
		reviewRevision = entry.revision;
		reviewSourceRevision = sourceRevision;
		answer = entry.answer;
		scope = entry.scope;
		expires = entry.expiresAt ? new Date(entry.expiresAt).toISOString().slice(0, 10) : '';
		selectedSources = (entry.citations ?? []).map((_, index) => index);
		excerpts = Object.fromEntries(
			(entry.citations ?? []).map((citation, index) => [index, citation.excerpt])
		);
		confirmed = false;
		open = true;
	}

	async function save(action: 'approve' | 'retire') {
		if (action === 'retire' && !window.confirm(m.freshness_retire_confirm())) return;
		saving = true;
		try {
			const response = await fetch(`/api/answer-library/${entry.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action,
					revision: action === 'retire' ? entry.revision : reviewRevision,
					sourceRevision: reviewSourceRevision,
					answer,
					scope,
					expiresAt: expires ? new Date(`${expires}T23:59:59.999Z`).toISOString() : null,
					sourceIndexes: selectedSources,
					sourceExcerpts: Object.fromEntries(
						selectedSources.map((index) => [index, excerpts[index]])
					),
					confirmed
				})
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.message ?? m.freshness_error());
			open = false;
			await invalidateAll();
			toastSuccess(action === 'approve' ? m.freshness_saved() : m.freshness_retired_success());
		} catch (error) {
			toastError(error instanceof Error ? error.message : m.freshness_error());
		} finally {
			saving = false;
		}
	}
</script>

{#if !open}
	<div class="mt-4 flex flex-wrap gap-2">
		<Button variant="secondary" size="sm" onclick={startReview}>{m.freshness_review()}</Button>
		{#if entry.status !== 'retired'}<Button
				variant="ghost"
				size="sm"
				onclick={() => save('retire')}
				disabled={saving}>{m.freshness_retire()}</Button
			>{/if}
	</div>
{:else}
	<form
		class="mt-4 space-y-4 border-t border-[var(--border)] pt-4"
		onsubmit={(event) => {
			event.preventDefault();
			save('approve');
		}}
	>
		<label class="block text-sm font-medium"
			>{m.freshness_answer()}
			<textarea
				class="mt-1 block min-h-36 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
				bind:value={answer}
				maxlength={10000}
				required
			></textarea>
		</label>
		<div class="grid gap-4 sm:grid-cols-2">
			<label class="block text-sm"
				>{m.freshness_scope()}<input
					class="mt-1 block w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-2"
					bind:value={scope}
					maxlength={120}
					required
				/></label
			>
			<label class="block text-sm"
				>{m.freshness_expiry()}<input
					type="date"
					class="mt-1 block w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-2"
					bind:value={expires}
				/></label
			>
		</div>
		<p class="text-xs text-[var(--foreground-muted)]">{m.freshness_scope_help()}</p>
		<SourceReview
			citations={entry.citations ?? []}
			sources={entry.sources}
			bind:selected={selectedSources}
			bind:excerpts
			bind:confirmed
		/>
		<div class="flex flex-wrap gap-2">
			<Button type="submit" size="sm" disabled={!confirmed || saving}>{m.freshness_save()}</Button
			><Button variant="ghost" size="sm" onclick={() => (open = false)} disabled={saving}
				>{m.freshness_cancel()}</Button
			>
		</div>
	</form>
{/if}
