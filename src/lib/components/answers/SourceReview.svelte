<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { ReviewableCitation, CurrentAnswerSource } from '$lib/answer-sources';
	let {
		citations,
		sources,
		selected = $bindable(),
		excerpts = $bindable(),
		confirmed = $bindable()
	}: {
		citations: ReviewableCitation[];
		sources: CurrentAnswerSource[];
		selected: number[];
		excerpts: Record<string, string>;
		confirmed: boolean;
	} = $props();
</script>

<fieldset class="space-y-3">
	<legend class="text-sm font-semibold">{m.freshness_sources()}</legend>
	<p class="text-xs text-[var(--foreground-muted)]">{m.freshness_source_help()}</p>
	{#each citations as citation, index (index)}
		<div class="rounded-[var(--radius)] border border-[var(--border)] p-3 text-xs">
			<label class="flex items-center gap-2 font-semibold"
				><input type="checkbox" bind:group={selected} value={index} />{citation.sourceTitle}</label
			>
			<p class="mt-2 text-[var(--foreground-muted)]">
				{m.freshness_original()}: {citation.excerpt}
			</p>
			{#if sources[index]?.available}
				<details class="mt-2">
					<summary class="cursor-pointer text-[var(--brand)]">{m.freshness_current()}</summary>
					<pre class="mt-2 max-h-64 overflow-auto font-sans whitespace-pre-wrap">{sources[index]
							.currentText}</pre>
				</details>
				{#if selected.includes(index)}<label class="mt-3 block"
						>{m.freshness_quote()}<textarea
							class="mt-1 block w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-2"
							bind:value={excerpts[index]}
							maxlength={300}
							required
						></textarea></label
					>{/if}
			{:else}<p class="mt-2 text-[var(--warning)]">{m.freshness_unavailable()}</p>{/if}
		</div>
	{:else}<p class="text-xs text-[var(--foreground-muted)]">{m.freshness_manual()}</p>{/each}
</fieldset>
<label class="flex items-start gap-2 text-sm"
	><input
		type="checkbox"
		bind:checked={confirmed}
		class="mt-1"
		required
	/>{m.freshness_confirm()}</label
>
