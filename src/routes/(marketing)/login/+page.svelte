<script lang="ts">
	import { createAuthClient } from 'better-auth/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { GithubLogo, Spinner, Envelope } from 'phosphor-svelte';

	const authClient = createAuthClient();

	let mode = $state<'signin' | 'signup'>('signin');
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let loading = $state(false);
	let errorMsg = $state('');
	let infoMsg = $state('');

	// Read redirectTo from query params (set by invite page, etc.)
	const redirectTo = $derived($page.url.searchParams.get('redirectTo') ?? '');
	const isInviteFlow = $derived(redirectTo.includes('/invite/'));
	const postLoginUrl = $derived(redirectTo || '/dashboard');

	async function loginWithGithub() {
		loading = true;
		errorMsg = '';
		try {
			await authClient.signIn.social({ provider: 'github', callbackURL: postLoginUrl });
		} catch {
			errorMsg = 'GitHub sign in failed. Please try again.';
			loading = false;
		}
	}

	async function loginWithGoogle() {
		loading = true;
		errorMsg = '';
		try {
			await authClient.signIn.social({ provider: 'google', callbackURL: postLoginUrl });
		} catch {
			errorMsg = 'Google sign in failed. Please try again.';
			loading = false;
		}
	}

	async function handleEmailAuth() {
		if (!email.trim() || !password.trim()) return;
		loading = true;
		errorMsg = '';
		infoMsg = '';
		try {
			if (mode === 'signin') {
				const res = await authClient.signIn.email({
					email: email.trim(),
					password,
					callbackURL: postLoginUrl
				});
				if (res.error) {
					errorMsg = res.error.message ?? 'Sign in failed';
				} else {
					goto(postLoginUrl);
				}
			} else {
				if (!name.trim()) {
					errorMsg = 'Name is required';
					loading = false;
					return;
				}
				const res = await authClient.signUp.email({
					email: email.trim(),
					password,
					name: name.trim(),
					callbackURL: isInviteFlow ? postLoginUrl : '/onboarding'
				});
				if (res.error) {
					const msg = res.error.message ?? '';
					// User already has an account — switch to sign-in mode with a helpful message
					if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
						mode = 'signin';
						infoMsg = isInviteFlow
							? 'You already have an account. Sign in below to accept your invitation.'
							: 'You already have an account. Sign in below.';
					} else {
						errorMsg = msg || 'Sign up failed';
					}
				} else {
					goto(isInviteFlow ? postLoginUrl : '/onboarding');
				}
			}
		} catch {
			errorMsg = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In — AuditLift</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6"
>
	<div class="absolute top-4 right-4"><ThemeToggle /></div>

	<div class="mb-2 flex items-center gap-2">
		<LogoMark size={28} />
		<span class="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">AuditLift</span>
	</div>
	<p class="mb-8 text-[13px] text-[var(--foreground-muted)]">Get audit-ready in 30 days</p>

	<div
		class="relative w-full max-w-[340px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-8 shadow-[var(--shadow-md)]"
	>
		<!-- Invitation banner -->
		{#if isInviteFlow}
			<div
				class="mb-5 flex items-start gap-2.5 rounded-[var(--radius)] bg-[var(--brand-light)] px-3 py-3"
			>
				<Envelope size={16} color="var(--brand)" class="mt-0.5 shrink-0" />
				<p class="text-[12px] leading-snug text-[var(--brand)]">
					You have a pending team invitation. Sign in or create an account to accept it.
				</p>
			</div>
		{/if}

		<!-- Mode tabs -->
		<div
			class="mb-6 flex gap-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] p-1"
		>
			<button
				onclick={() => {
					mode = 'signin';
					errorMsg = '';
					infoMsg = '';
				}}
				disabled={loading}
				class="flex-1 rounded-[var(--radius)] px-3 py-1.5 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 {mode ===
				'signin'
					? 'bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}">Sign in</button
			>
			<button
				onclick={() => {
					mode = 'signup';
					errorMsg = '';
					infoMsg = '';
				}}
				disabled={loading}
				class="flex-1 rounded-[var(--radius)] px-3 py-1.5 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 {mode ===
				'signup'
					? 'bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}">Sign up</button
			>
		</div>

		<!-- Google -->
		<button
			onclick={loginWithGoogle}
			disabled={loading}
			class="mb-2 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] disabled:pointer-events-none disabled:opacity-60"
		>
			<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					fill="#4285F4"
				/>
				<path
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					fill="#34A853"
				/>
				<path
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
					fill="#FBBC05"
				/>
				<path
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					fill="#EA4335"
				/>
			</svg>
			Continue with Google
		</button>

		<!-- GitHub -->
		<button
			onclick={loginWithGithub}
			disabled={loading}
			class="mb-4 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[var(--radius)] bg-[#24292f] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1a1f24] disabled:pointer-events-none disabled:opacity-60"
		>
			<GithubLogo size={16} weight="fill" />
			Continue with GitHub
		</button>

		<div class="mb-4 flex items-center gap-3">
			<div class="h-px flex-1 bg-[var(--border)]"></div>
			<span class="text-[11px] text-[var(--foreground-subtle)]">or</span>
			<div class="h-px flex-1 bg-[var(--border)]"></div>
		</div>

		<!-- Email/password form -->
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleEmailAuth();
			}}
			class="space-y-3"
		>
			{#if mode === 'signup'}
				<input
					type="text"
					bind:value={name}
					placeholder="Full name"
					disabled={loading}
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					required
				/>
			{/if}
			<input
				type="email"
				bind:value={email}
				placeholder="Email address"
				disabled={loading}
				class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				required
			/>
			<input
				type="password"
				bind:value={password}
				placeholder="Password"
				disabled={loading}
				class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				required
				minlength={8}
			/>

			{#if mode === 'signin'}
				<div class="text-right">
					<a
						href="/forgot-password"
						class="text-[12px] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
						>Forgot password?</a
					>
				</div>
			{/if}

			{#if infoMsg}
				<p class="text-[12px] text-[var(--brand)]">{infoMsg}</p>
			{/if}
			{#if errorMsg}
				<p class="text-[12px] text-[var(--danger)]">{errorMsg}</p>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
			>
				{#if loading}<Spinner size={14} class="animate-spin" />{/if}
				{mode === 'signin' ? 'Sign in' : 'Create account'}
			</button>
		</form>

		<!-- Loading overlay -->
		{#if loading}
			<div
				class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[var(--radius-xl)] bg-[var(--background-elevated)]/80 backdrop-blur-sm"
			>
				<Spinner size={32} class="animate-spin" color="var(--brand)" />
				<p class="mt-3 text-[13px] font-medium text-[var(--foreground)]">
					{mode === 'signin' ? 'Signing in…' : 'Creating account…'}
				</p>
			</div>
		{/if}
	</div>

	<p class="mt-6 text-[12px] text-[var(--foreground-subtle)]">
		10-day free trial · No credit card required
	</p>
</div>
