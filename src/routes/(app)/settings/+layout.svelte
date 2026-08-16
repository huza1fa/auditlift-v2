<script lang="ts">
	import { Buildings, CreditCard, Users, Notebook, Info } from 'phosphor-svelte';
	import { page } from '$app/state';

	let { children } = $props();

	const currentPath = $derived(page.url.pathname);
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-[var(--foreground)]">Settings</h1>

	<div class="flex gap-1 overflow-x-auto border-b border-[var(--border)]">
		<a
			href="/settings"
			class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath ===
			'/settings'
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<Buildings size={16} />
			Organization
		</a>
		<a
			href="/settings/facts"
			class="flex shrink-0 items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath.includes(
				'/settings/facts'
			)
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<Info size={16} />
			Company Facts
		</a>
		<a
			href="/settings/team"
			class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath.includes(
				'/settings/team'
			)
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<Users size={16} />
			Team
		</a>
		<a
			href="/settings/system"
			class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath.includes(
				'/settings/system'
			)
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<Notebook size={16} />
			System Description
		</a>
		<a
			href="/settings/billing"
			class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath.includes(
				'/settings/billing'
			)
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<CreditCard size={16} />
			Billing
		</a>
	</div>

	{@render children()}
</div>
