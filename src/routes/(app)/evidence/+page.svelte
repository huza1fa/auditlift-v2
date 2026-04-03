<script lang="ts">
	import {
		FolderOpen,
		File,
		ArrowRight,
		Download,
		PencilSimple,
		FloppyDisk,
		X,
		Note,
		Warning,
		Trash
	} from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { toastSuccess, toastError } from '$lib/stores/toasts.svelte';

	let { data } = $props();

	type Evidence = (typeof data.evidenceList)[0];

	const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
	function isStale(createdAt: Date | string): boolean {
		return Date.now() - new Date(createdAt).getTime() > NINETY_DAYS_MS;
	}

	let editingId = $state<string | null>(null);
	let editNotes = $state('');
	let saving = $state(false);
	let deletingId = $state<string | null>(null);
	let deleteInProgress = $state<string | null>(null);

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes}B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
	}

	async function downloadEvidence(id: string, filename: string) {
		try {
			const res = await fetch(`/api/evidence/${id}`);
			if (!res.ok) {
				console.error('Failed to get download URL');
				return;
			}
			const { downloadUrl } = await res.json();
			const a = document.createElement('a');
			a.href = downloadUrl;
			a.download = filename;
			a.click();
		} catch (err) {
			console.error('Download failed:', err);
		}
	}

	function startEditNotes(ev: Evidence) {
		editingId = ev.id;
		editNotes = ev.notes ?? '';
	}

	function cancelEditNotes() {
		editingId = null;
		editNotes = '';
	}

	async function saveNotes(ev: Evidence) {
		saving = true;
		try {
			const res = await fetch(`/api/evidence/${ev.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notes: editNotes })
			});
			if (!res.ok) throw new Error('Failed to save');
			toastSuccess('Notes saved');
			ev.notes = editNotes;
			editingId = null;
			editNotes = '';
		} catch {
			toastError('Failed to save notes');
		} finally {
			saving = false;
		}
	}

	function confirmDelete(id: string) {
		deletingId = id;
	}

	function cancelDelete() {
		deletingId = null;
	}

	async function deleteEvidence(id: string) {
		deleteInProgress = id;
		// optimistic removal
		data.evidenceList = data.evidenceList.filter((ev: Evidence) => ev.id !== id);
		deletingId = null;
		try {
			const res = await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to delete');
			toastSuccess('Evidence deleted');
		} catch {
			toastError('Failed to delete');
		} finally {
			deleteInProgress = null;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">Evidence</h1>
		<div class="flex items-center gap-2">
			<Badge variant="default">{data.evidenceList.length} files</Badge>
			{#if data.evidenceList.filter((ev: Evidence) => isStale(ev.createdAt)).length > 0}
				<Badge variant="warning"
					>{data.evidenceList.filter((ev: Evidence) => isStale(ev.createdAt)).length} stale</Badge
				>
			{/if}
		</div>
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
								{#if isStale(ev.createdAt)}
									<span class="mt-0.5 flex items-center gap-1 text-xs text-[var(--warning)]">
										<Warning size={10} weight="fill" /> Needs refresh — older than 90 days
									</span>
								{/if}
								{#if editingId === ev.id}
									<div class="mt-2 flex items-center gap-2">
										<input
											bind:value={editNotes}
											placeholder="Add notes..."
											class="flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
										/>
										<button
											onclick={() => saveNotes(ev)}
											class="text-[var(--success)] hover:opacity-70"
										>
											<FloppyDisk size={12} />
										</button>
										<button
											onclick={cancelEditNotes}
											class="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
										>
											<X size={12} />
										</button>
									</div>
								{:else if ev.notes}
									<p class="mt-1 text-xs text-[var(--foreground-muted)] italic">"{ev.notes}"</p>
								{/if}

								{#if deletingId === ev.id}
									<div
										class="mt-2 flex items-center gap-2 rounded-[var(--radius)] bg-[var(--danger-light)] px-3 py-2"
									>
										<span class="text-xs font-medium text-[var(--danger)]">
											This will reduce your readiness score. Delete?
										</span>
										<button
											onclick={() => deleteEvidence(ev.id)}
											class="rounded-[var(--radius)] bg-[var(--danger)] px-2 py-0.5 text-xs font-semibold text-white hover:opacity-80"
										>
											Delete
										</button>
										<button
											onclick={cancelDelete}
											class="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
										>
											Cancel
										</button>
									</div>
								{/if}
							</div>
						</div>
						<div class="flex items-center gap-3">
							<Button variant="ghost" size="sm" onclick={() => startEditNotes(ev)}>
								<PencilSimple size={14} />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => downloadEvidence(ev.id, ev.filename)}
							>
								<Download size={14} />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => confirmDelete(ev.id)}
								disabled={deleteInProgress === ev.id}
							>
								<Trash size={14} />
							</Button>
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
