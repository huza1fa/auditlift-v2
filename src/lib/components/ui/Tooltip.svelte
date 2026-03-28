<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		content,
		side = 'top',
		children
	}: {
		content: string;
		side?: 'top' | 'bottom' | 'left' | 'right';
		children: Snippet;
	} = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Content
			{side}
			sideOffset={6}
			class="z-50 max-w-xs rounded-[var(--radius)] bg-[var(--foreground)] px-2.5 py-1.5 text-xs text-white shadow-[var(--shadow-md)]"
		>
			{content}
			<Tooltip.Arrow class="fill-[var(--foreground)]" />
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
