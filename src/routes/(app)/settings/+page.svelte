<script lang="ts">
	import { Buildings, CreditCard, Warning, Trash } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();

	let showDeleteConfirm = $state(false);
	let deleting = $state(false);
	let deleteError = $state('');
	let confirmError = $state('');
	let confirmInput = $state('');

	const org = data.organization!;

	function openDeleteConfirm() {
		showDeleteConfirm = true;
		deleteError = '';
		confirmError = '';
		confirmInput = '';
	}

	function closeDeleteConfirm() {
		showDeleteConfirm = false;
		deleteError = '';
		confirmError = '';
		confirmInput = '';
	}

	async function deleteOrganization() {
		deleteError = '';
		confirmError = '';

		if (confirmInput.trim() !== org.name) {
			confirmError = 'Organization name does not match.';
			return;
		}

		deleting = true;
		try {
			const res = await fetch('/api/settings/organization', { method: 'DELETE' });
			if (res.ok) {
				window.location.href = '/login';
				return;
			}
			const json = await res.json().catch(() => ({}));
			deleteError = json.message || `Failed to delete organization (${res.status})`;
		} catch {
			deleteError = 'An unexpected error occurred. Please try again.';
		} finally {
			deleting = false;
		}
	}
</script>

<div class="space-y-4">
	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<Buildings size={20} color="var(--brand)" />
			<h2 class="font-semibold text-[var(--foreground)]">Organization</h2>
		</div>
		<div class="grid grid-cols-2 gap-4 text-sm">
			<div>
				<p class="text-[var(--foreground-muted)]">Name</p>
				<p class="font-medium text-[var(--foreground)]">{org.name}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Slug</p>
				<p class="font-medium text-[var(--foreground)]">{org.slug}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Industry</p>
				<p class="font-medium text-[var(--foreground)]">{org.industry ?? '—'}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Team size</p>
				<p class="font-medium text-[var(--foreground)]">{org.teamSize ?? '—'}</p>
			</div>
		</div>
	</Card>

	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<CreditCard size={20} color="var(--brand)" />
			<h2 class="font-semibold text-[var(--foreground)]">Billing</h2>
		</div>
		<div class="flex items-center gap-3">
			<Badge variant={data.subscription?.status === 'active' ? 'success' : 'warning'}>
				{data.subscription?.status ?? 'No subscription'}
			</Badge>
			{#if org.trialEndsAt}
				<span class="text-sm text-[var(--foreground-muted)]">
					Trial ends {new Date(org.trialEndsAt).toLocaleDateString()}
				</span>
			{/if}
		</div>
		<div class="mt-4">
			<a href="/settings/billing">
				<Button variant="secondary" size="sm">Manage billing</Button>
			</a>
		</div>
	</Card>

	<Card class="border-[var(--danger)] p-6">
		<div class="mb-4 flex items-center gap-3">
			<Warning size={20} color="var(--danger)" />
			<h2 class="font-semibold text-[var(--danger)]">Danger Zone</h2>
		</div>
		<p class="mb-4 text-sm text-[var(--foreground-muted)]">
			Once you delete your organization, there is no going back. All data including evidence,
			policies, and settings will be permanently deleted.
		</p>

		{#if data.userRole !== 'owner'}
			<p class="text-sm text-[var(--foreground-muted)]">
				Only the organization owner can delete the organization. Contact your owner if you believe
				this organization should be removed.
			</p>
		{:else if !showDeleteConfirm}
			<Button variant="danger" onclick={openDeleteConfirm}>
				<Trash size={16} />
				Delete Organization
			</Button>
		{:else}
			<div class="rounded-[var(--radius)] bg-[var(--danger-light)] p-4">
				<div
					class="mb-3 flex items-start gap-2 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light)] p-3"
				>
					<Warning size={16} class="mt-0.5 shrink-0 text-[var(--danger)]" />
					<p class="text-sm text-[var(--danger)]">
						<strong>Your account will also be deleted.</strong> As the organization owner, removing
						this organization permanently deletes your AuditLift account. You will be signed out.
					</p>
				</div>
				<p class="mb-3 text-sm font-medium text-[var(--danger)]">
					Are you sure? This action cannot be undone.
				</p>
				<p class="mb-4 text-sm text-[var(--foreground-muted)]">
					Type <strong>{org.name}</strong> to confirm deletion.
				</p>
				<input
					type="text"
					placeholder="Type organization name"
					bind:value={confirmInput}
					class="mb-3 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
				/>
				{#if confirmError}
					<p class="mb-2 text-sm text-[var(--danger)]">{confirmError}</p>
				{/if}
				{#if deleteError}
					<p class="mb-2 text-sm text-[var(--danger)]">{deleteError}</p>
				{/if}
				<div class="flex gap-2">
					<Button variant="secondary" onclick={closeDeleteConfirm}>Cancel</Button>
					<Button variant="danger" onclick={deleteOrganization} disabled={deleting}>
						{deleting ? 'Deleting...' : 'Yes, Delete'}
					</Button>
				</div>
			</div>
		{/if}
	</Card>
</div>
