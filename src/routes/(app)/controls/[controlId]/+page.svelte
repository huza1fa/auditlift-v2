<script lang="ts">
	import { ArrowLeft, FileText, Upload, Trash, File } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data } = $props();
	let uploading = $state(false);
	let fileInput: HTMLInputElement;

	async function uploadFile(file: globalThis.File) {
		uploading = true;
		const formData = new FormData();
		formData.append('file', file);
		formData.append('controlId', data.control.id);
		await fetch('/api/evidence/upload', { method: 'POST', body: formData });
		window.location.reload();
		uploading = false;
	}

	function onFileChange(e: Event) {
		const f = (e.target as HTMLInputElement).files?.[0];
		if (f) uploadFile(f);
	}

	async function deleteEvidence(id: string) {
		await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<a
		href="/controls"
		class="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
	>
		<ArrowLeft size={16} /> Back to Controls
	</a>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Control details -->
		<div class="space-y-4">
			<Card class="p-6">
				<div class="mb-4 flex items-start gap-3">
					<span
						class="rounded bg-[var(--brand-light)] px-2 py-1 font-mono text-sm font-semibold text-[var(--brand)]"
						>{data.control.code}</span
					>
					<div>
						<h1 class="text-lg font-semibold text-[var(--foreground)]">{data.control.title}</h1>
						<Badge variant="default">{data.control.category}</Badge>
					</div>
				</div>
				<p class="mb-4 text-sm text-[var(--foreground-muted)]">{data.control.description}</p>

				<div class="space-y-3">
					<div class="rounded-[var(--radius)] bg-[var(--warning-light)] p-3">
						<p class="mb-1 text-xs font-semibold text-[var(--warning)]">Why it matters</p>
						<p class="text-sm text-[var(--foreground-muted)]">{data.control.whyItMatters}</p>
					</div>
					<div class="rounded-[var(--radius)] bg-[var(--info-light)] p-3">
						<p class="mb-1 text-xs font-semibold text-[var(--info)]">What your auditor expects</p>
						<p class="text-sm text-[var(--foreground-muted)]">{data.control.whatAuditorExpects}</p>
					</div>
				</div>
			</Card>

			<!-- Generate policy button -->
			<Button variant="secondary">
				<FileText size={16} /> Generate Policy for this Control
			</Button>
		</div>

		<!-- Evidence -->
		<div class="space-y-4">
			<Card class="p-6">
				<h2 class="mb-4 font-semibold text-[var(--foreground)]">
					Evidence ({data.evidenceList.length})
				</h2>

				<!-- Upload zone -->
				<div
					class="mb-4 cursor-pointer rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] p-8 text-center transition-colors hover:border-[var(--brand)]"
					onclick={() => fileInput?.click()}
					onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
					role="button"
					tabindex="0"
				>
					<div class="mx-auto mb-2 flex justify-center">
						<Upload size={32} color="var(--foreground-subtle)" />
					</div>
					<p class="text-sm font-medium text-[var(--foreground)]">Click to upload evidence</p>
					<p class="text-xs text-[var(--foreground-muted)]">PDF, PNG, JPG, CSV, DOCX — max 10MB</p>
					{#if uploading}
						<p class="mt-2 text-xs text-[var(--brand)]">Uploading...</p>
					{/if}
				</div>
				<input
					bind:this={fileInput}
					type="file"
					class="hidden"
					onchange={onFileChange}
					accept=".pdf,.png,.jpg,.jpeg,.csv,.docx"
				/>

				<!-- Evidence list -->
				{#if data.evidenceList.length === 0}
					<p class="py-4 text-center text-sm text-[var(--foreground-muted)]">
						No evidence uploaded yet
					</p>
				{:else}
					<div class="space-y-2">
						{#each data.evidenceList as ev (ev.id)}
							<div
								class="flex items-center justify-between rounded-[var(--radius)] bg-[var(--background-alt)] p-3"
							>
								<div class="flex min-w-0 items-center gap-2">
									<File size={16} color="var(--foreground-muted)" />
									<span class="truncate text-sm text-[var(--foreground)]">{ev.filename}</span>
									<span class="text-xs text-[var(--foreground-subtle)]"
										>{(ev.sizeBytes / 1024).toFixed(0)}KB</span
									>
								</div>
								<button
									onclick={() => deleteEvidence(ev.id)}
									class="ml-2 text-[var(--danger)] hover:opacity-70"
									aria-label="Delete evidence"
								>
									<Trash size={14} />
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</Card>
		</div>
	</div>
</div>
