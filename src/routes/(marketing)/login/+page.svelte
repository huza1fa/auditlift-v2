<script lang="ts">
	import { createAuthClient } from 'better-auth/svelte';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { GithubLogo, Spinner } from 'phosphor-svelte';

	const authClient = createAuthClient();

	let mode = $state<'signin' | 'signup'>('signin');
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let loading = $state(false);
	let errorMsg = $state('');

	async function loginWithGithub() {
		await authClient.signIn.social({ provider: 'github', callbackURL: '/dashboard' });
	}

	async function handleEmailAuth() {
		if (!email.trim() || !password.trim()) return;
		loading = true;
		errorMsg = '';
		try {
			if (mode === 'signin') {
				const res = await authClient.signIn.email({
					email: email.trim(),
					password,
					callbackURL: '/dashboard'
				});
				if (res.error) errorMsg = res.error.message ?? 'Sign in failed';
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
					callbackURL: '/dashboard'
				});
				if (res.error) errorMsg = res.error.message ?? 'Sign up failed';
			}
		} catch {
			errorMsg = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

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
		class="w-full max-w-[340px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-8 shadow-[var(--shadow-md)]"
	>
		<!-- Mode tabs -->
		<div
			class="mb-6 flex gap-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] p-1"
		>
			<button
				onclick={() => {
					mode = 'signin';
					errorMsg = '';
				}}
				class="flex-1 rounded-[var(--radius)] px-3 py-1.5 text-[13px] font-medium transition-colors {mode ===
				'signin'
					? 'bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}">Sign in</button
			>
			<button
				onclick={() => {
					mode = 'signup';
					errorMsg = '';
				}}
				class="flex-1 rounded-[var(--radius)] px-3 py-1.5 text-[13px] font-medium transition-colors {mode ===
				'signup'
					? 'bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}">Sign up</button
			>
		</div>

		<!-- GitHub -->
		<button
			onclick={loginWithGithub}
			class="mb-4 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[var(--radius)] bg-[#24292f] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1a1f24]"
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
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
					required
				/>
			{/if}
			<input
				type="email"
				bind:value={email}
				placeholder="Email address"
				class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
				required
			/>
			<input
				type="password"
				bind:value={password}
				placeholder="Password"
				class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
				required
				minlength={8}
			/>

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
	</div>

	<p class="mt-6 text-[12px] text-[var(--foreground-subtle)]">
		10-day free trial · No credit card required
	</p>
</div>
