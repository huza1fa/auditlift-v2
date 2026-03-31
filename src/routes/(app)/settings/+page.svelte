<script lang="ts">
	import { Buildings, CreditCard, Users, Warning, Trash } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { page } from '$app/state';

	let { data } = $props();

	const currentPath = $derived(page.url.pathname);
	let showDeleteConfirm = $state(false);
	let deleting = $state(false);

	async function deleteOrganization() {
		deleting = true;
		try {
			const res = await fetch('/api/settings/organization', { method: 'DELETE' });
			if (res.ok) {
				window.location.href = '/';
			} else {
				alert('Failed to delete organization');
			}
		} catch {
			alert('Failed to delete organization');
		} finally {
			deleting = false;
			showDeleteConfirm = false;
		}
	}

	const org = data.organization as { domain?: string | null } | undefined;
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-[var(--foreground)]">Settings</h1>

	<div class="flex gap-1 border-b border-[var(--border)]">
		<a
			href="/settings"
			class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath ===
			'/settings'
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<Buildings size={16} />
			Organization
		</a>
		<a
			href="/settings/team"
			class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath.includes(
				'/settings/team'
			)
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<Users size={16} />
			Team
		</a>
		<a
			href="/settings/billing"
			class="flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors {currentPath.includes(
				'/settings/billing'
			)
				? 'border-[var(--brand)] text-[var(--brand)]'
				: 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
		>
			<CreditCard size={16} />
			Billing
		</a>
	</div>

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
		<p class="mt-4 text-sm text-[var(--foreground-muted)]">Stripe billing portal coming soon.</p>
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
