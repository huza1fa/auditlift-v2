<script lang="ts">
	import { Upload, Spinner } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		controlId: string;
		onUploadSuccess: (evidence: { id: string; filename: string; sizeBytes: number }) => void;
		accept?: string;
		maxSize?: number;
	}

	let {
		controlId,
		onUploadSuccess,
		accept = '.pdf,.png,.jpg,.jpeg,.csv,.docx',
		maxSize = 10 * 1024 * 1024
	}: Props = $props();

	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let error = $state('');
	let progress = $state(0);

	async function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		error = '';

		if (file.size > maxSize) {
			error = `File too large. Maximum size is ${maxSize / 1024 / 1024}MB`;
			return;
		}

		uploading = true;
		progress = 10;

		try {
			const presignRes = await fetch('/api/evidence/presign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					controlId,
					filename: file.name,
					mimeType: file.type,
					sizeBytes: file.size
				})
			});

			if (!presignRes.ok) {
				const err = await presignRes.json().catch(() => ({}));
				throw new Error(err.message || 'Failed to get upload URL');
			}

			const { evidenceId, uploadUrl } = await presignRes.json();
			progress = 30;

			const uploadRes = await fetch(uploadUrl, {
				method: 'PUT',
				body: file,
				headers: {
					'Content-Type': file.type
				}
			});

			if (!uploadRes.ok) {
				throw new Error('Failed to upload file to storage');
			}

			progress = 70;

			const confirmRes = await fetch(`/api/evidence/${evidenceId}/confirm`, {
				method: 'POST'
			});

			if (!confirmRes.ok) {
				const err = await confirmRes.json().catch(() => ({}));
				throw new Error(err.message || 'Failed to confirm upload');
			}

			progress = 100;

			onUploadSuccess({
				id: evidenceId,
				filename: file.name,
				sizeBytes: file.size
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload failed. Please try again.';
		} finally {
			uploading = false;
			progress = 0;
			if (fileInput) fileInput.value = '';
		}
	}

	function triggerUpload() {
		fileInput?.click();
	}
</script>

<div class="space-y-3">
	<input
		bind:this={fileInput}
		type="file"
		class="hidden"
		{accept}
		onchange={handleFileChange}
		disabled={uploading}
	/>

	<div
		class="cursor-pointer rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] p-6 text-center transition-colors hover:border-[var(--brand)]"
		onclick={triggerUpload}
		onkeydown={(e) => e.key === 'Enter' && triggerUpload()}
		role="button"
		tabindex="0"
	>
		<div class="mx-auto mb-2 flex justify-center">
			{#if uploading}
				<Spinner size={32} class="animate-spin text-[var(--brand)]" />
			{:else}
				<Upload size={32} color="var(--foreground-subtle)" />
			{/if}
		</div>
		<p class="text-sm font-medium text-[var(--foreground)]">
			{#if uploading}
				Uploading... {progress}%
			{:else}
				Click to upload
			{/if}
		</p>
		<p class="text-xs text-[var(--foreground-muted)]">
			{#if uploading}
				Please wait while your file is uploaded
			{:else}
				PDF, PNG, JPG, CSV, DOCX up to {maxSize / 1024 / 1024}MB
			{/if}
		</p>
	</div>

	{#if error}
		<p class="text-sm text-[var(--danger)]">{error}</p>
	{/if}
</div>
