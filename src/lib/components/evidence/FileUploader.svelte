<script lang="ts">
	import { Upload, Spinner, CheckCircle, X as XIcon } from 'phosphor-svelte';
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

	type FileEntry = { file: File; progress: number; done: boolean; error: string };

	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let queue = $state<FileEntry[]>([]);

	function setEntryProgress(entry: FileEntry, progress: number) {
		entry.progress = progress;
		queue = [...queue];
	}

	function markEntryDone(entry: FileEntry) {
		entry.progress = 100;
		entry.done = true;
		queue = [...queue];
	}

	function markEntryError(entry: FileEntry, message: string) {
		entry.error = message;
		entry.progress = 0;
		queue = [...queue];
	}

	async function calculateSha256(file: File): Promise<string> {
		const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
		const bytes = new Uint8Array(hash);
		let binary = '';
		for (const byte of bytes) binary += String.fromCharCode(byte);
		return btoa(binary);
	}

	async function uploadOne(entry: FileEntry): Promise<void> {
		setEntryProgress(entry, 10);

		try {
			const checksumSha256 = await calculateSha256(entry.file);
			const presignRes = await fetch('/api/evidence/presign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					controlId,
					filename: entry.file.name,
					mimeType: entry.file.type,
					sizeBytes: entry.file.size,
					checksumSha256
				})
			});

			if (!presignRes.ok) {
				const err = await presignRes.json().catch(() => ({}));
				throw new Error((err as { message?: string }).message || 'Failed to get upload URL');
			}

			const { evidenceId, uploadUrl, uploadFields } = await presignRes.json();
			setEntryProgress(entry, 30);

			const formData = new FormData();
			for (const [name, value] of Object.entries(uploadFields as Record<string, string>)) {
				formData.append(name, value);
			}
			formData.append('file', entry.file);
			const uploadRes = await fetch(uploadUrl, {
				method: 'POST',
				body: formData
			});

			if (!uploadRes.ok) throw new Error('Failed to upload file to storage');
			setEntryProgress(entry, 70);

			const confirmRes = await fetch(`/api/evidence/${evidenceId}/confirm`, { method: 'POST' });
			if (!confirmRes.ok) {
				const err = await confirmRes.json().catch(() => ({}));
				throw new Error((err as { message?: string }).message || 'Failed to confirm upload');
			}

			markEntryDone(entry);

			onUploadSuccess({ id: evidenceId, filename: entry.file.name, sizeBytes: entry.file.size });
		} catch (err) {
			markEntryError(
				entry,
				err instanceof Error ? err.message : 'Upload failed. Please try again.'
			);
		}
	}

	async function handleFileChange(e: Event) {
		const files = Array.from((e.target as HTMLInputElement).files ?? []);
		if (!files.length) return;

		const valid = files.filter((f) => {
			if (f.size > maxSize) return false;
			return true;
		});
		const oversized = files.filter((f) => f.size > maxSize);

		const entries: FileEntry[] = [
			...valid.map((f) => ({ file: f, progress: 0, done: false, error: '' })),
			...oversized.map((f) => ({
				file: f,
				progress: 0,
				done: false,
				error: `Too large (max ${maxSize / 1024 / 1024}MB)`
			}))
		];

		queue = [...queue, ...entries];
		uploading = true;

		for (const entry of entries.filter((e) => !e.error)) {
			await uploadOne(entry);
		}

		uploading = false;
		if (fileInput) fileInput.value = '';
	}

	function triggerUpload() {
		fileInput?.click();
	}

	function clearDone() {
		queue = queue.filter((e) => !e.done && !e.error);
	}
</script>

<div class="space-y-3">
	<input
		bind:this={fileInput}
		type="file"
		class="hidden"
		{accept}
		multiple
		onchange={handleFileChange}
		disabled={uploading}
	/>

	<div
		class="cursor-pointer rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] p-6 text-center transition-colors hover:border-[var(--brand)] {uploading
			? 'pointer-events-none opacity-60'
			: ''}"
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
			{uploading ? 'Uploading...' : 'Click to upload'}
		</p>
		<p class="text-xs text-[var(--foreground-muted)]">
			{uploading
				? 'Please wait'
				: `PDF, PNG, JPG, CSV, DOCX up to ${maxSize / 1024 / 1024}MB · multiple files supported`}
		</p>
	</div>

	{#if queue.length > 0}
		<div class="space-y-2">
			{#each queue as entry (entry.file.name + entry.file.size)}
				<div
					class="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] px-3 py-2"
				>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm text-[var(--foreground)]">{entry.file.name}</p>
						{#if entry.error}
							<p class="text-xs text-[var(--danger)]">{entry.error}</p>
						{:else if entry.done}
							<p class="text-xs text-[var(--success)]">Uploaded</p>
						{:else if entry.progress > 0}
							<div class="mt-1 h-1 w-full rounded-full bg-[var(--border)]">
								<div
									class="h-1 rounded-full bg-[var(--brand)] transition-all"
									style="width: {entry.progress}%"
								></div>
							</div>
						{/if}
					</div>
					{#if entry.done}
						<CheckCircle size={16} color="var(--success)" weight="fill" />
					{:else if entry.error}
						<XIcon size={16} color="var(--danger)" />
					{/if}
				</div>
			{/each}
			{#if queue.some((e) => e.done || e.error)}
				<button
					onclick={clearDone}
					class="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
				>
					Clear completed
				</button>
			{/if}
		</div>
	{/if}
</div>
