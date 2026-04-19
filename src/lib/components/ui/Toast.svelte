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

<div class="fixed top-14 right-4 z-50 flex w-80 max-w-sm flex-col gap-2">
	{#each $toasts as toast (toast.id)}
		{@const Icon = icons[toast.type]}
		<div
			class="flex items-start gap-3 rounded-[var(--radius-lg)] border p-4 shadow-lg transition-all"
			class:typeClasses[toast.type]
		>
			<Icon size={18} color={iconColors[toast.type]} weight="fill" class="mt-0.5 flex-shrink-0" />
			<p class="flex-1 text-sm text-[var(--foreground)]">{toast.message}</p>
			<button
				onclick={() => dismissToast(toast.id)}
				class="flex-shrink-0 cursor-pointer text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
			>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>
