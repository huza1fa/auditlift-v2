<script lang="ts">
	import { createAuthClient } from 'better-auth/svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { GithubLogo } from 'phosphor-svelte';

	const authClient = createAuthClient();

	async function loginWithGithub() {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/dashboard'
		});
	}
</script>

<div
	class="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6"
>
	<!-- Top-right theme toggle -->
	<div class="absolute top-4 right-4">
		<ThemeToggle />
	</div>

	<!-- Logo + wordmark -->
	<div class="mb-2 flex items-center gap-2">
		<LogoMark size={28} />
		<span class="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">AuditLift</span>
	</div>

	<!-- Tagline -->
	<p class="mb-8 text-[13px] text-[var(--foreground-muted)]">Get audit-ready in 30 days</p>

	<!-- Card -->
	<div
		class="w-full max-w-[340px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-8 shadow-[var(--shadow-md)]"
	>
		<h1 class="mb-6 text-[15px] font-semibold text-[var(--foreground)]">Sign in to continue</h1>

		<button
			onclick={loginWithGithub}
			class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[var(--radius)] bg-[#24292f] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1a1f24]"
		>
			<GithubLogo size={16} weight="fill" />
			Continue with GitHub
		</button>
	</div>

	<!-- Small print -->
	<p class="mt-6 text-[12px] text-[var(--foreground-subtle)]">
		10-day free trial · No credit card required
	</p>
</div>
