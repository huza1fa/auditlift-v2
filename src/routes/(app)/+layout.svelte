<script lang="ts">
	import { page } from '$app/state';
	import {
		House,
		CheckSquare,
		FileText,
		FolderOpen,
		DownloadSimple,
		Gear,
		SignOut,
		List,
		ChatDots,
		ClockCounterClockwise
	} from 'phosphor-svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import GuidedTour from '$lib/components/ui/GuidedTour.svelte';
	import { createAuthClient } from 'better-auth/svelte';
	import { identifyUser, resetPostHog } from '$lib/posthog';

	const authClient = createAuthClient();

	async function signOut() {
		await authClient.signOut();
		resetPostHog();
		window.location.href = '/login';
	}

	let { data, children } = $props();

	$effect(() => {
		if (data.user?.id) {
			identifyUser(
				data.user.id,
				data.user.email ?? '',
				data.user.name,
				data.organization ? { id: data.organization.id, name: data.organization.name } : undefined,
				{
					plan: data.subscription?.status ?? 'trial',
					trial_days_remaining: data.organization?.trialEndsAt
						? Math.ceil((new Date(data.organization.trialEndsAt).getTime() - Date.now()) / 86400000)
						: null
				}
			);
		}
	});

	let sidebarOpen = $state(false);
	let showTour = $state(false);

	const tourSteps = [
		{
			target: '[data-tour="nav-questionnaires"]',
			title: 'Upload questionnaires',
			body: 'Start here — upload a security questionnaire and get AI-generated answers in minutes.'
		},
		{
			target: '[data-tour="nav-policies"]',
			title: 'Generate policies',
			body: 'Create compliance policies tailored to your company. Each one satisfies real framework controls.'
		},
		{
			target: '[data-tour="nav-evidence"]',
			title: 'Store evidence',
			body: 'Upload screenshots, configs, and documents as evidence for your controls.'
		}
	];

	$effect(() => {
		if (typeof localStorage === 'undefined') return;
		const tourDone = localStorage.getItem('auditlift-tour-done');
		if (tourDone) return;
		const url = new URL(window.location.href);
		if (url.searchParams.get('tour') === '1') {
			showTour = true;
		}
	});

	const navLinks = [
		{ href: '/dashboard', icon: House, label: 'Dashboard' },
		{ href: '/controls', icon: CheckSquare, label: 'Controls' },
		{ href: '/policies', icon: FileText, label: 'Policies' },
		{ href: '/questionnaires', icon: ChatDots, label: 'Questionnaires' },
		{ href: '/evidence', icon: FolderOpen, label: 'Evidence' },
		{ href: '/activity', icon: ClockCounterClockwise, label: 'Activity' },
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
	<!-- Mobile top bar -->
	<header
		class="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--background-elevated)] px-4 md:hidden"
	>
		<div class="flex items-center gap-2.5">
			<div
				class="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-[var(--brand)]"
			>
				<LogoMark size={14} />
			</div>
			<span class="text-[14px] font-bold tracking-tight text-[var(--foreground)]">AuditLift</span>
		</div>
		<button
			onclick={() => (sidebarOpen = !sidebarOpen)}
			class="cursor-pointer rounded-[var(--radius)] p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]"
			aria-label="Toggle navigation"
		>
			<List size={20} />
		</button>
	</header>

	<!-- Backdrop overlay (mobile only) -->
	{#if sidebarOpen}
		<div
			class="fixed inset-0 z-30 bg-black/50 md:hidden"
			onclick={() => (sidebarOpen = false)}
			aria-hidden="true"
		></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-[var(--border)] bg-[var(--background-elevated)] transition-transform duration-200
			{sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0"
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
						onclick={() => (sidebarOpen = false)}
						data-tour={link.href === '/questionnaires'
							? 'nav-questionnaires'
							: link.href === '/policies'
								? 'nav-policies'
								: link.href === '/evidence'
									? 'nav-evidence'
									: undefined}
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
					onclick={() => (sidebarOpen = false)}
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
				<button
					onclick={signOut}
					title="Sign out"
					class="cursor-pointer rounded p-1 text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]"
				>
					<SignOut size={14} />
				</button>
			</div>
		</div>
	</aside>

	<!-- Main -->
	<main class="ml-0 min-h-screen flex-1 bg-[var(--background)] pt-14 md:ml-56 md:pt-0">
		{#if data.isReadOnly}
			<div
				class="border-b border-[var(--warning)] bg-[var(--warning-light)] px-6 py-2.5 text-center"
			>
				<p class="text-sm text-[var(--warning)]">
					Your trial has ended. You're in read-only mode —
					<a href="/settings/billing" class="font-semibold underline"
						>upgrade to unlock uploads, policy generation, and export</a
					>.
				</p>
			</div>
		{/if}
		<div class="p-6">
			{@render children()}
		</div>
	</main>

	<!-- Toast notifications -->
	<Toast />

	<!-- Guided tour -->
	{#if showTour}
		<GuidedTour
			steps={tourSteps}
			onComplete={() => {
				localStorage.setItem('auditlift-tour-done', '1');
				showTour = false;
			}}
		/>
	{/if}
</div>
