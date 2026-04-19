<script lang="ts">
	let {
		label,
		id,
		error,
		value = $bindable(''),
		placeholder = '',
		type = 'text',
		required = false,
		disabled = false,
		class: className = '',
		...rest
	}: {
		label?: string;
		id?: string;
		error?: string;
		value?: string;
		placeholder?: string;
		type?: string;
		required?: boolean;
		disabled?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const inputId = $derived(id ?? `input-${Math.random().toString(36).slice(2, 9)}`);
</script>

<div class="flex flex-col gap-1 {className}">
	{#if label}
		<label for={inputId} class="text-sm font-medium text-[var(--foreground)]">
			{label}{#if required}<span class="ml-0.5 text-[var(--danger)]">*</span>{/if}
		</label>
	{/if}
	<input
		{...rest}
		id={inputId}
		{type}
		bind:value
		{placeholder}
		{required}
		{disabled}
		class="w-full rounded-[var(--radius)] border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none disabled:opacity-50
		{error ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : 'border-[var(--border)]'}"
	/>
	{#if error}
		<p class="text-xs text-[var(--danger)]">{error}</p>
	{/if}
</div>
