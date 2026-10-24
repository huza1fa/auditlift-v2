<script lang="ts">
	import SourceReview from './SourceReview.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import * as m from '$lib/paraglide/messages';
	import { toastError, toastSuccess } from '$lib/stores/toasts.svelte';
	import type { ReviewableCitation, CurrentAnswerSource } from '$lib/answer-sources';
	let {
		questionnaireId,
		questionId,
		revision,
		sourceRevision,
		citations,
		sources,
		onreviewed
	}: {
		questionnaireId: string;
		questionId: string;
		revision: string;
		sourceRevision: string;
		citations: ReviewableCitation[];
		sources: CurrentAnswerSource[];
		onreviewed: () => Promise<void>;
	} = $props();
	let open = $state(false);
	let selected = $state<number[]>([]);
	let excerpts = $state<Record<string, string>>({});
	let confirmed = $state(false);
	let saving = $state(false);
	let reviewRevision = $state('');
	let reviewSourceRevision = $state('');
	function start() {
		reviewRevision = revision;
		reviewSourceRevision = sourceRevision;
		selected = citations.map((_, index) => index);
		excerpts = Object.fromEntries(citations.map((citation, index) => [index, citation.excerpt]));
		confirmed = false;
		open = true;
	}
	async function save() {
		saving = true;
		try {
			const response = await fetch(
				`/api/questionnaires/${questionnaireId}/questions/${questionId}/review`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						revision: reviewRevision,
						sourceRevision: reviewSourceRevision,
						sourceIndexes: selected,
						sourceExcerpts: Object.fromEntries(selected.map((index) => [index, excerpts[index]])),
						confirmed
					})
				}
			);
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.message ?? m.freshness_error());
			await onreviewed();
			open = false;
			toastSuccess(m.freshness_question_saved());
		} catch (error) {
			toastError(error instanceof Error ? error.message : m.freshness_error());
		} finally {
			saving = false;
		}
	}
</script>

{#if !open}<Button variant="secondary" size="sm" onclick={start}
		>{m.freshness_review_question()}</Button
	>
{:else}
	<form
		class="space-y-3"
		onsubmit={(event) => {
			event.preventDefault();
			save();
		}}
	>
		<SourceReview {citations} {sources} bind:selected bind:excerpts bind:confirmed />
		<div class="flex flex-wrap gap-2">
			<Button type="submit" size="sm" disabled={!confirmed || saving}
				>{m.freshness_question_confirm()}</Button
			><Button size="sm" variant="ghost" onclick={() => (open = false)} disabled={saving}
				>{m.freshness_cancel()}</Button
			>
		</div>
	</form>
{/if}
