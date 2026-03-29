<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Check, X, Warning, Buildings } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data } = $props();

	let loading = $state(true);
	let error = $state('');
	let invitation: {
		email: string;
		role: string;
		expiresAt: string;
	} | null = $state(null);
	let organization: { id: string; name: string } | null = $state(null);
	let isLoggedIn = $state(false);
	let matchingEmail = $state(false);
	let processing = $state(false);

	onMount(async () => {
		try {
			const res = await fetch(`/api/invites/${data.token}`);
			const json = await res.json();

			if (!res.ok) {
				error = json.message || 'Invalid invitation';
				return;
			}

			invitation = json.invitation;
			organization = json.organization;
			isLoggedIn = json.isLoggedIn;
			matchingEmail = json.matchingEmail;
		} catch {
			error = 'Failed to load invitation';
		} finally {
			loading = false;
		}
	});

	async function respond(action: 'accept' | 'decline') {
		processing = true;
		error = '';

		try {
			const res = await fetch(`/api/invites/${data.token}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action })
			});

			const json = await res.json();

			if (!res.ok) {
				error = json.message || `Failed to ${action} invitation`;
				return;
			}

			if (action === 'accept') {
				// Redirect to dashboard
				goto('/dashboard');
			} else {
				// Show confirmation
				goto('/login');
			}
		} catch {
			error = 'An error occurred. Please try again.';
		} finally {
			processing = false;
		}
	}

	function formatRole(role: string): string {
		return role.charAt(0).toUpperCase() + role.slice(1);
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
	<Card class="w-full max-w-md p-8">
		{#if loading}
			<div class="text-center">
				<div
					class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent"
				></div>
				<p class="text-[var(--foreground-muted)]">Loading invitation...</p>
			</div>
		{:else if error}
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--danger-light)]"
				>
					<Warning size={24} color="var(--danger)" />
				</div>
				<h2 class="mb-2 text-lg font-semibold text-[var(--foreground)]">Invalid Invitation</h2>
				<p class="mb-6 text-sm text-[var(--foreground-muted)]">{error}</p>
				<a href="/login">
					<Button>Go to Login</Button>
				</a>
			</div>
		{:else if invitation && organization}
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-light)]"
				>
					<Buildings size={24} color="var(--brand)" />
				</div>

				<h2 class="mb-2 text-lg font-semibold text-[var(--foreground)]">
					Join {organization.name}
				</h2>

				<p class="mb-6 text-sm text-[var(--foreground-muted)]">
					You've been invited to join <strong>{organization.name}</strong> as a{' '}
					<strong>{formatRole(invitation.role)}</strong>
				</p>

				{#if !isLoggedIn}
					<div class="mb-6 rounded-[var(--radius)] bg-[var(--warning-light)] p-4">
						<p class="text-sm text-[var(--warning)]">
							Please sign in with GitHub to accept this invitation.
						</p>
						<p class="mt-1 text-xs text-[var(--foreground-muted)]">
							Invitation sent to: {invitation.email}
						</p>
					</div>
					<a href="/login" class="block">
						<Button class="w-full">Sign in with GitHub</Button>
					</a>
				{:else if !matchingEmail}
					<div class="mb-6 rounded-[var(--radius)] bg-[var(--danger-light)] p-4">
						<p class="text-sm text-[var(--danger)]">
							This invitation was sent to a different email address.
						</p>
						<p class="mt-1 text-xs text-[var(--foreground-muted)]">
							Invitation sent to: {invitation.email}
						</p>
					</div>
				{:else}
					<div class="flex gap-3">
						<Button
							variant="secondary"
							onclick={() => respond('decline')}
							disabled={processing}
							class="flex-1"
						>
							<X size={16} />
							Decline
						</Button>
						<Button onclick={() => respond('accept')} disabled={processing} class="flex-1">
							<Check size={16} />
							{processing ? 'Joining...' : 'Join Organization'}
						</Button>
					</div>
				{/if}

				{#if error}
					<p class="mt-4 text-sm text-[var(--danger)]">{error}</p>
				{/if}
			</div>
		{/if}
	</Card>
</div>
