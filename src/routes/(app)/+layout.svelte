<script lang="ts">
	import { page } from '$app/state';
	import { House, CheckSquare, FileText, FolderOpen, DownloadSimple, Gear } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';

	let { data, children } = $props();

	const navLinks = [
		{ href: '/dashboard', icon: House, label: 'Dashboard' },
		{ href: '/controls', icon: CheckSquare, label: 'Controls' },
		{ href: '/policies', icon: FileText, label: 'Policies' },
		{ href: '/evidence', icon: FolderOpen, label: 'Evidence' },
		{ href: '/export', icon: DownloadSimple, label: 'Export' },
		{ href: '/settings', icon: Gear, label: 'Settings' }
	];

	const trialDays = $derived.by(() => {
		const org = data.organization;
		if (!org?.trialEndsAt) return null;
		const days = Math.ceil((new Date(org.trialEndsAt).getTime() - Date.now()) / 86400000);
		return days > 0 ? days : 0;
	});

	const initials = $derived(
		data.user.name
			?.split(' ')
			.map((n: string) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) ?? '?'
	);
</script>

<div class="flex min-h-screen">
	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 flex w-52 flex-col border-r border-[var(--border)] bg-[var(--background-elevated)]"
	>
		<!-- Logo -->
		<div class="flex items-center gap-2 border-b border-[var(--border)] px-3 py-3">
			<LogoMark size={18} />
			<span class="text-[13px] font-semibold tracking-tight text-[var(--foreground)]">
				AuditLift
			</span>
		</div>

		<!-- Nav -->
		<nav class="flex-1 overflow-y-auto px-1.5 py-2">
			<div class="space-y-0.5">
				{#each navLinks as link (link.href)}
					{@const isActive =
						link.href === '/dashboard'
							? page.url.pathname === '/dashboard'
							: page.url.pathname.startsWith(link.href)}
					<a
						href={link.href}
						class="flex items-center gap-2.5 rounded-[var(--radius)] px-2 py-1.5 text-[13px] transition-colors
							{isActive
							? 'bg-[var(--brand-light)] font-medium text-[var(--brand)]'
							: 'text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]'}"
					>
						<link.icon size={14} weight={isActive ? 'fill' : 'regular'} />
						{link.label}
					</a>
				{/each}
			</div>
		</nav>

		<!-- Bottom -->
		<div class="space-y-1 border-t border-[var(--border)] px-1.5 py-2">
			<!-- Trial progress -->
			{#if trialDays !== null}
				<div class="px-2 py-1">
					<div class="mb-1 flex items-center justify-between">
						<span class="text-[11px] text-[var(--foreground-subtle)]">Free trial</span>
						<span
							class="text-[11px] font-medium {trialDays <= 3
								? 'text-[var(--warning)]'
								: 'text-[var(--foreground-muted)]'}">{trialDays}d left</span
						>
					</div>
					<div class="h-0.5 w-full rounded-full bg-[var(--background-subtle)]">
						<div
							class="h-0.5 rounded-full transition-all {trialDays <= 3
								? 'bg-[var(--warning)]'
								: 'bg-[var(--brand)]'}"
							style="width: {Math.min(100, (trialDays / 10) * 100)}%"
						></div>
					</div>
				</div>
			{/if}

			<!-- User + theme toggle -->
			<div class="flex items-center gap-2 rounded-[var(--radius)] px-2 py-1.5">
				<div
					class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-light)] text-[10px] font-semibold text-[var(--brand)]"
				>
					{initials}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-[12px] leading-tight font-medium text-[var(--foreground)]">
						{data.organization.name}
					</p>
					<p class="truncate text-[11px] leading-tight text-[var(--foreground-subtle)]">
						{data.user.email}
					</p>
				</div>
				<ThemeToggle />
			</div>
		</div>
	</aside>

	<!-- Main -->
	<main class="ml-52 min-h-screen flex-1 bg-[var(--background)]">
		<div class="p-6">
			{@render children()}
		</div>
	</main>
</div>
