<script lang="ts">
	import { FolderOpen, File, ArrowRight } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let { data } = $props();

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes}B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">Evidence</h1>
		<Badge variant="default">{data.evidenceList.length} files</Badge>
	</div>

	{#if data.evidenceList.length === 0}
		<Card class="p-12 text-center">
			<div class="mx-auto mb-4 flex justify-center">
				<FolderOpen size={48} color="var(--foreground-subtle)" />
			</div>
			<h2 class="mb-2 text-base font-semibold text-[var(--foreground)]">No evidence yet</h2>
			<p class="mb-4 text-sm text-[var(--foreground-muted)]">
				Upload evidence files from a control's detail page.
			</p>
			<a
				href="/controls"
				class="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)] hover:underline"
			>
				Browse controls <ArrowRight size={14} />
			</a>
		</Card>
	{:else}
		<Card class="overflow-hidden p-0">
			<div class="divide-y divide-[var(--border)]">
				{#each data.evidenceList as ev (ev.id)}
					<div class="flex items-center justify-between px-6 py-4 hover:bg-[var(--background-alt)]">
						<div class="flex items-center gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--background-alt)]"
							>
								<File size={20} color="var(--foreground-muted)" />
							</div>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-[var(--foreground)]">{ev.filename}</p>
								<p class="text-xs text-[var(--foreground-muted)]">
									{formatSize(ev.sizeBytes)} &middot;
									{new Date(ev.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							{#if ev.controlCode}
								<a
									href="/controls/{ev.controlId}"
									class="flex items-center gap-1 text-xs text-[var(--brand)] hover:underline"
								>
									<span class="font-mono">{ev.controlCode}</span>
									<ArrowRight size={12} />
								</a>
							{:else}
								<span class="text-xs text-[var(--foreground-subtle)]">No control linked</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</Card>
	{/if}
</div>
