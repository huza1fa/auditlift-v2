<script lang="ts">
	import { DownloadSimple, FileZip, FileCsv, FileText, Lock } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { toastError } from '$lib/stores/toasts.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { data } = $props();

	// Track which IDs are explicitly deselected (empty = all selected by default)
	let deselectedPolicyIds = new SvelteSet<string>();
	let deselectedEvidenceIds = new SvelteSet<string>();

	// Derive the active selection arrays from data and deselected sets
	let selectedPolicyIds = $derived(
		data.policyList
			.map((p: { id: string }) => p.id)
			.filter((id: string) => !deselectedPolicyIds.has(id))
	);
	let selectedEvidenceIds = $derived(
		data.evidenceList
			.map((e: { id: string }) => e.id)
			.filter((id: string) => !deselectedEvidenceIds.has(id))
	);

	let downloading = $state(false);
	let exportError = $state('');

	function togglePolicy(id: string) {
		if (deselectedPolicyIds.has(id)) {
			deselectedPolicyIds.delete(id);
		} else {
			deselectedPolicyIds.add(id);
		}
	}

	function toggleEvidence(id: string) {
		if (deselectedEvidenceIds.has(id)) {
			deselectedEvidenceIds.delete(id);
		} else {
			deselectedEvidenceIds.add(id);
		}
	}

	function selectAllPolicies() {
		deselectedPolicyIds.clear();
	}

	function deselectAllPolicies() {
		data.policyList.forEach((p: { id: string }) => deselectedPolicyIds.add(p.id));
	}

	function selectAllEvidence() {
		deselectedEvidenceIds.clear();
	}

	function deselectAllEvidence() {
		data.evidenceList.forEach((e: { id: string }) => deselectedEvidenceIds.add(e.id));
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes}B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
	}

	async function download() {
		downloading = true;
		exportError = '';
		try {
			const res = await fetch('/api/export', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ policyIds: selectedPolicyIds, evidenceIds: selectedEvidenceIds })
			});
			if (!res.ok) throw new Error('Export failed');
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `Auditlift-Export-${new Date().toISOString().split('T')[0]}.zip`;
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			exportError = 'Export failed. Please try again.';
			toastError('Export failed');
		} finally {
			downloading = false;
		}
	}
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-[var(--foreground)]">Auditor Export</h1>

	<!-- Summary card -->
	<Card class="p-6">
		<h2 class="mb-2 font-semibold text-[var(--foreground)]">What's included</h2>
		<p class="mb-4 text-sm text-[var(--foreground-muted)]">
			Download a complete audit package ready for your auditor.
		</p>
		<div class="mb-6 space-y-3">
			<div class="flex items-center gap-3">
				<FileCsv size={20} color="var(--brand)" />
				<div>
					<p class="text-sm font-medium text-[var(--foreground)]">control-mapping.csv</p>
					<p class="text-xs text-[var(--foreground-muted)]">All controls with status and links</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<FileText size={20} color="var(--brand)" />
				<div>
					<p class="text-sm font-medium text-[var(--foreground)]">
						Policies/ ({data.policyList.length} docs)
					</p>
					<p class="text-xs text-[var(--foreground-muted)]">
						Generated policy documents as Markdown
					</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<FileZip size={20} color="var(--brand)" />
				<div>
					<p class="text-sm font-medium text-[var(--foreground)]">
						Evidence/ ({data.evidenceList.length} files)
					</p>
					<p class="text-xs text-[var(--foreground-muted)]">
						Uploaded evidence organized by control
					</p>
				</div>
			</div>
		</div>

		{#if !data.canExport}
			<div class="flex items-start gap-3 rounded-[var(--radius)] bg-[var(--warning-light)] p-4">
				<Lock size={18} color="var(--warning)" class="mt-0.5 flex-shrink-0" />
				<div>
					<p class="text-sm font-semibold text-[var(--warning)]">Subscription required</p>
					<p class="text-sm text-[var(--foreground-muted)]">
						Export is available on paid plans only.
					</p>
					<a
						href="/settings/billing"
						class="mt-1 inline-block text-sm text-[var(--brand)] hover:underline"
					>
						Upgrade to export →
					</a>
				</div>
			</div>
		{/if}
	</Card>

	{#if data.canExport}
		<!-- Policies selection -->
		<Card class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="font-semibold text-[var(--foreground)]">
					Policies
					<span class="ml-1 text-sm font-normal text-[var(--foreground-muted)]">
						({selectedPolicyIds.length} / {data.policyList.length} selected)
					</span>
				</h2>
				<div class="flex gap-2">
					<button onclick={selectAllPolicies} class="text-xs text-[var(--brand)] hover:underline">
						Select all
					</button>
					<span class="text-xs text-[var(--foreground-subtle)]">/</span>
					<button onclick={deselectAllPolicies} class="text-xs text-[var(--brand)] hover:underline">
						Deselect all
					</button>
				</div>
			</div>

			{#if data.policyList.length === 0}
				<p class="text-sm text-[var(--foreground-muted)]">No policies yet — generate some first.</p>
			{:else}
				<div class="space-y-2">
					{#each data.policyList as policy (policy.id)}
						<label
							class="flex cursor-pointer items-center gap-3 rounded-[var(--radius)] px-3 py-2 hover:bg-[var(--background-alt)]"
						>
							<input
								type="checkbox"
								checked={selectedPolicyIds.includes(policy.id)}
								onchange={() => togglePolicy(policy.id)}
								class="h-4 w-4 accent-[var(--brand)]"
							/>
							<FileText size={16} color="var(--foreground-muted)" class="shrink-0" />
							<span class="flex-1 text-sm text-[var(--foreground)]">{policy.title}</span>
							{#if policy.isCustom}
								<span
									class="rounded-full bg-[var(--info-light)] px-2 py-0.5 text-xs font-medium text-[var(--info)]"
								>
									Custom
								</span>
							{/if}
						</label>
					{/each}
				</div>
			{/if}
		</Card>

		<!-- Evidence selection -->
		<Card class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="font-semibold text-[var(--foreground)]">
					Evidence
					<span class="ml-1 text-sm font-normal text-[var(--foreground-muted)]">
						({selectedEvidenceIds.length} / {data.evidenceList.length} selected)
					</span>
				</h2>
				<div class="flex gap-2">
					<button onclick={selectAllEvidence} class="text-xs text-[var(--brand)] hover:underline">
						Select all
					</button>
					<span class="text-xs text-[var(--foreground-subtle)]">/</span>
					<button onclick={deselectAllEvidence} class="text-xs text-[var(--brand)] hover:underline">
						Deselect all
					</button>
				</div>
			</div>

			{#if data.evidenceList.length === 0}
				<p class="text-sm text-[var(--foreground-muted)]">
					No evidence yet — upload files from a control's detail page.
				</p>
			{:else}
				<div class="space-y-2">
					{#each data.evidenceList as ev (ev.id)}
						<label
							class="flex cursor-pointer items-center gap-3 rounded-[var(--radius)] px-3 py-2 hover:bg-[var(--background-alt)]"
						>
							<input
								type="checkbox"
								checked={selectedEvidenceIds.includes(ev.id)}
								onchange={() => toggleEvidence(ev.id)}
								class="h-4 w-4 accent-[var(--brand)]"
							/>
							<FileZip size={16} color="var(--foreground-muted)" class="shrink-0" />
							<span class="flex-1 truncate text-sm text-[var(--foreground)]">{ev.filename}</span>
							<span class="text-xs text-[var(--foreground-muted)]">{formatSize(ev.sizeBytes)}</span>
							{#if ev.controlCode}
								<span
									class="rounded-full bg-[var(--background-alt)] px-2 py-0.5 font-mono text-xs text-[var(--foreground-muted)]"
								>
									{ev.controlCode}
								</span>
							{/if}
						</label>
					{/each}
				</div>
			{/if}
		</Card>

		<!-- Error -->
		{#if exportError}
			<div class="rounded-[var(--radius)] bg-[var(--danger-light)] px-4 py-3">
				<p class="text-sm text-[var(--danger)]">{exportError}</p>
			</div>
		{/if}

		<!-- Download button -->
		<div class="flex justify-end">
			<Button
				onclick={download}
				disabled={downloading ||
					(selectedPolicyIds.length === 0 && selectedEvidenceIds.length === 0)}
			>
				<DownloadSimple size={16} />
				{#if downloading}
					Preparing download...
				{:else}
					Download ({selectedPolicyIds.length}
					{selectedPolicyIds.length === 1 ? 'policy' : 'policies'}, {selectedEvidenceIds.length}
					{selectedEvidenceIds.length === 1 ? 'file' : 'files'})
				{/if}
			</Button>
		</div>
	{/if}
</div>
