<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		description,
		trigger,
		children
	}: {
		open?: boolean;
		title?: string;
		description?: string;
		trigger?: Snippet;
		children: Snippet;
	} = $props();
</script>

<Dialog.Root bind:open>
	{#if trigger}
		<Dialog.Trigger>
			{@render trigger()}
		</Dialog.Trigger>
	{/if}

	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
		/>
		<Dialog.Content
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background)] p-6 shadow-[var(--shadow-lg)] focus:outline-none"
		>
			{#if title}
				<Dialog.Title class="mb-1 text-lg font-semibold text-[var(--foreground)]">
					{title}
				</Dialog.Title>
			{/if}
			{#if description}
				<Dialog.Description class="mb-4 text-sm text-[var(--foreground-muted)]">
					{description}
				</Dialog.Description>
			{/if}
			{@render children()}
			<Dialog.Close
				class="absolute top-4 right-4 rounded-[var(--radius-sm)] p-1 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 6 6 18" /><path d="m6 6 12 12" />
				</svg>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
