<script lang="ts">
	import { createAuthClient } from 'better-auth/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import LogoMark from '$lib/components/ui/LogoMark.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { Spinner } from 'phosphor-svelte';
	import * as m from '$lib/paraglide/messages';

	const authClient = createAuthClient();

	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let errorMsg = $state('');
	let success = $state(false);

	const token = $derived(page.url.searchParams.get('token'));

	async function handleSubmit() {
		if (!password.trim() || !confirmPassword.trim()) return;
		if (password !== confirmPassword) {
			errorMsg = m.reset_password_mismatch();
			return;
		}
		if (!token) return;
		loading = true;
		errorMsg = '';
		try {
			const res = await authClient.resetPassword({
				newPassword: password,
				token
			});
			if (res.error) {
				errorMsg = res.error.message ?? m.reset_password_error_generic();
			} else {
				success = true;
				setTimeout(() => goto('/login'), 1500);
			}
		} catch {
			errorMsg = m.reset_password_error_generic();
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Set New Password — Auditlift</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6"
>
	<div class="absolute top-4 right-4"><ThemeToggle /></div>

	<div class="mb-2 flex items-center gap-2">
		<LogoMark size={28} />
		<span class="text-[18px] font-semibold tracking-tight text-[var(--foreground)]">Auditlift</span>
	</div>
	<p class="mb-8 text-[13px] text-[var(--foreground-muted)]">{m.tagline()}</p>

	<div
		class="w-full max-w-[340px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-8 shadow-[var(--shadow-md)]"
	>
		{#if !token}
			<div class="space-y-3 text-center">
				<p class="text-[15px] font-semibold text-[var(--foreground)]">
					{m.reset_password_invalid_title()}
				</p>
				<p class="text-[13px] text-[var(--foreground-muted)]">
					{m.reset_password_invalid_body()}
				</p>
				<a href="/forgot-password" class="block text-[13px] text-[var(--brand)] hover:underline">
					{m.reset_password_request_new()}
				</a>
			</div>
		{:else if success}
			<div class="space-y-3 text-center">
				<p class="text-[15px] font-semibold text-[var(--foreground)]">
					{m.reset_password_success()}
				</p>
			</div>
		{:else}
			<h1 class="mb-1 text-[15px] font-semibold text-[var(--foreground)]">
				{m.reset_password_title()}
			</h1>
			<p class="mb-5 text-[13px] text-[var(--foreground-muted)]">
				{m.reset_password_subtitle()}
			</p>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-3"
			>
				<input
					type="password"
					bind:value={password}
					placeholder={m.reset_password_new_placeholder()}
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[13px] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
					required
					minlength={8}
				/>
				<input
					type="password"
					bind:value={confirmPassword}
					placeholder={m.reset_password_confirm_placeholder()}
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
					{m.reset_password_submit()}
				</button>
			</form>
		{/if}
	</div>

	<p class="mt-6 text-[12px] text-[var(--foreground-subtle)]">
		<a href="/login" class="hover:text-[var(--foreground)] hover:underline">
			{m.forgot_password_back_to_signin()}
		</a>
	</p>
</div>
