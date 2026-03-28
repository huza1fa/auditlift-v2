<script lang="ts">
	import { DownloadSimple, FileZip, FileCsv, FileText, Lock } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data } = $props();
	let downloading = $state(false);

	async function download() {
		downloading = true;
		window.location.href = '/api/export';
		setTimeout(() => {
			downloading = false;
		}, 2000);
	}
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-[var(--foreground)]">Auditor Export</h1>

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
						Policies/ ({data.policyCount} docs)
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
						Evidence/ ({data.evidenceCount} files)
					</p>
					<p class="text-xs text-[var(--foreground-muted)]">
						Uploaded evidence organized by control
					</p>
				</div>
			</div>
		</div>

		{#if data.canExport}
			<Button onclick={download} disabled={downloading}>
				<DownloadSimple size={16} />
				{downloading ? 'Preparing download...' : 'Download Audit Package'}
			</Button>
		{:else}
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
</div>
