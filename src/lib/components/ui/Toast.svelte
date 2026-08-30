<script lang="ts">
	import { X, CheckCircle, WarningCircle, Info, Warning } from 'phosphor-svelte';
	import { toasts, dismissToast } from '$lib/stores/toasts.svelte';

	const icons = {
		success: CheckCircle,
		error: WarningCircle,
		info: Info,
		warning: Warning
	};

	const typeClasses = {
		success: 'border-[var(--success)] bg-[var(--success-light)]',
		error: 'border-[var(--danger)] bg-[var(--danger-light)]',
		info: 'border-[var(--info)] bg-[var(--info-light)]',
		warning: 'border-[var(--warning)] bg-[var(--warning-light)]'
	};

	const iconColors = {
		success: 'var(--success)',
		error: 'var(--danger)',
		info: 'var(--info)',
		warning: 'var(--warning)'
	};
</script>

<div
	class="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[calc(100vw-2rem)] max-w-md flex-col gap-2 sm:right-6 sm:bottom-6"
	aria-live="polite"
	aria-atomic="true"
>
	{#each $toasts as toast (toast.id)}
		{@const Icon = icons[toast.type]}
		<div
			class="pointer-events-auto flex items-start gap-3 rounded-[var(--radius-lg)] border bg-[var(--background-elevated)] p-4 shadow-xl ring-1 ring-black/5 transition-all"
			class:typeClasses[toast.type]
			role={toast.type === 'error' ? 'alert' : 'status'}
		>
			<Icon size={18} color={iconColors[toast.type]} weight="fill" class="mt-0.5 flex-shrink-0" />
			<p class="flex-1 text-sm leading-5 font-medium text-[var(--foreground)]">{toast.message}</p>
			<button
				onclick={() => dismissToast(toast.id)}
				class="flex-shrink-0 cursor-pointer rounded p-0.5 text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]"
				aria-label="Dismiss notification"
			>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>
