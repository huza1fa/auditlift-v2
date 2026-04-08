<script lang="ts">
	import { Buildings, CreditCard, Warning, Trash } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();

	let showDeleteConfirm = $state(false);
	let deleting = $state(false);
	let deleteError = $state('');

	async function deleteOrganization() {
		deleteError = '';
		deleting = true;
		try {
			const res = await fetch('/api/settings/organization', { method: 'DELETE' });
			if (res.ok) {
				window.location.href = '/login';
			} else {
				const json = await res.json();
				deleteError = json.message || 'Failed to delete organization';
			}
		} catch {
			deleteError = 'An unexpected error occurred. Please try again.';
		} finally {
			deleting = false;
			showDeleteConfirm = false;
		}
	}

	const org = data.organization as { domain?: string | null } | undefined;
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
				<p class="font-medium text-[var(--foreground)]">{data.organization.name}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Slug</p>
				<p class="font-medium text-[var(--foreground)]">{data.organization.slug}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Industry</p>
				<p class="font-medium text-[var(--foreground)]">{data.organization.industry ?? '—'}</p>
			</div>
			<div>
				<p class="text-[var(--foreground-muted)]">Team size</p>
				<p class="font-medium text-[var(--foreground)]">{data.organization.teamSize ?? '—'}</p>
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
			{#if data.organization.trialEndsAt}
				<span class="text-sm text-[var(--foreground-muted)]">
					Trial ends {new Date(data.organization.trialEndsAt).toLocaleDateString()}
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

		{#if !showDeleteConfirm}
			<Button variant="danger" onclick={() => (showDeleteConfirm = true)}>
				<Trash size={16} />
				Delete Organization
			</Button>
		{:else}
			<div class="rounded-[var(--radius)] bg-[var(--danger-light)] p-4">
				{#if data.userRole === 'owner'}
					<div
						class="mb-3 flex items-start gap-2 rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light)] p-3"
					>
						<Warning size={16} class="mt-0.5 shrink-0 text-[var(--danger)]" />
						<p class="text-sm text-[var(--danger)]">
							<strong>Your account will also be deleted.</strong> As the organization owner, removing
							this organization permanently deletes your AuditLift account. You will be signed out.
						</p>
					</div>
				{/if}
				<p class="mb-3 text-sm font-medium text-[var(--danger)]">
					Are you sure? This action cannot be undone.
				</p>
				<p class="mb-4 text-sm text-[var(--foreground-muted)]">
					Type <strong>{data.organization.name}</strong> to confirm deletion.
				</p>
				<input
					type="text"
					placeholder="Type organization name"
					class="mb-3 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
					id="confirmDelete"
				/>
				{#if deleteError}
					<p class="text-sm text-[var(--danger)]">{deleteError}</p>
				{/if}
				<div class="flex gap-2">
					<Button variant="secondary" onclick={() => (showDeleteConfirm = false)}>Cancel</Button>
					<Button
						variant="danger"
						onclick={() => {
							const input = document.getElementById('confirmDelete') as HTMLInputElement;
							if (input.value === data.organization.name) {
								deleteOrganization();
							}
						}}
						disabled={deleting}
					>
						{deleting ? 'Deleting...' : 'Yes, Delete'}
					</Button>
				</div>
			</div>
		{/if}
	</Card>
</div>
