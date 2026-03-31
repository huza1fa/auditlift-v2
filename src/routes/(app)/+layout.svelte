<script lang="ts">
	import { page } from '$app/state';
	import { House, CheckSquare, FileText, FolderOpen, DownloadSimple, Gear } from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

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
		// Hide trial indicator if user has an active subscription
		if (data.subscription?.status === 'active') return null;
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
		class="fixed inset-y-0 left-0 flex w-56 flex-col border-r border-[var(--border)] bg-[var(--background-elevated)]"
	>
		<!-- Logo -->
		<div class="flex items-center gap-2.5 border-b border-[var(--border)] px-4 py-3.5">
			<div
				class="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-[var(--brand)]"
			>
				<LogoMark size={14} />
			</div>
			<div class="flex items-center gap-1.5">
				<span class="text-[14px] font-bold tracking-tight text-[var(--foreground)]">AuditLift</span>
				{#if data.subscription?.status === 'active'}
					<span
						class="rounded-full bg-[var(--success-light)] px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-[var(--success)] uppercase"
						>Pro</span
					>
				{/if}
			</div>
		</div>

		<!-- Nav -->
		<nav class="flex-1 overflow-y-auto px-2 py-3">
			<div class="space-y-0.5">
				{#each navLinks as link (link.href)}
					{@const isActive =
						link.href === '/dashboard'
							? page.url.pathname === '/dashboard'
							: page.url.pathname.startsWith(link.href)}
					<a
						href={link.href}
						class="flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-[13px] font-medium transition-all
							{isActive
							? 'bg-[var(--brand)] text-white shadow-sm'
							: 'text-[var(--foreground-muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]'}"
					>
						<link.icon size={15} weight={isActive ? 'fill' : 'regular'} />
						{link.label}
					</a>
				{/each}
			</div>
		</nav>

		<!-- Bottom -->
		<div class="border-t border-[var(--border)] px-2 py-2">
			<!-- Trial progress -->
			{#if trialDays !== null}
				<a
					href="/settings/billing"
					class="mb-1.5 block rounded-[var(--radius-md)] bg-[var(--warning-light)] px-3 py-2 transition-opacity hover:opacity-80"
				>
					<div class="mb-1.5 flex items-center justify-between">
						<span class="text-[11px] font-medium text-[var(--warning)]">Free trial</span>
						<span class="text-[11px] font-semibold text-[var(--warning)]">{trialDays}d left</span>
					</div>
					<div class="h-1 w-full rounded-full bg-[var(--background-subtle)]">
						<div
							class="h-1 rounded-full bg-[var(--warning)] transition-all"
							style="width: {Math.min(100, (trialDays / 10) * 100)}%"
						></div>
					</div>
					<p class="mt-1.5 text-[10px] text-[var(--warning)]">Upgrade to keep access →</p>
				</a>
			{/if}

			<!-- User + theme toggle -->
			<div
				class="flex items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-2 hover:bg-[var(--background-subtle)]"
			>
				<div
					class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--brand)] text-[10px] font-bold text-white"
				>
					{initials}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-[12px] leading-tight font-semibold text-[var(--foreground)]">
						{data.organization.name}
					</p>
					<p class="truncate text-[10px] leading-tight text-[var(--foreground-subtle)]">
						{data.user.email}
					</p>
				</div>
				<ThemeToggle />
			</div>
		</div>
	</aside>

	<!-- Main -->
	<main class="ml-56 min-h-screen flex-1 bg-[var(--background)]">
		<div class="p-6">
			{@render children()}
		</div>
	</main>

	<!-- Toast notifications -->
	<Toast />
</div>
