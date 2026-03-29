<script lang="ts">
	import { Users, Plus, Copy, Check, X, Trash, CaretDown, Warning } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	type Member = {
		id: string;
		userId: string;
		role: string;
		createdAt: Date;
		isCurrentUser: boolean;
	};

	type PendingInvite = {
		id: string;
		email: string;
		role: string;
		expiresAt: Date;
		createdAt: Date;
	};

	let { data } = $props();

	const canInvite = data.currentUser.role === 'owner' || data.currentUser.role === 'admin';
	const canManageRoles = data.currentUser.role === 'owner' || data.currentUser.role === 'admin';

	let showInviteModal = $state(false);
	let inviteEmail = $state('');
	let inviteRole = $state('member');
	let inviteLink = $state('');
	let copied = $state(false);
	let inviting = $state(false);
	let inviteError = $state('');
	let removingId = $state<string | null>(null);
	let updatingRoleId = $state<string | null>(null);

	const roleOptions = [
		{ value: 'admin', label: 'Admin' },
		{ value: 'member', label: 'Member' },
		{ value: 'viewer', label: 'Viewer' }
	];

	async function sendInvite() {
		inviting = true;
		inviteError = '';
		inviteLink = '';

		try {
			const res = await fetch('/api/settings/team', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: inviteEmail, role: inviteRole })
			});

			const json = await res.json();

			if (!res.ok) {
				inviteError = json.message || 'Failed to send invitation';
				return;
			}

			inviteLink = json.inviteLink;
			// Add to local list
			data.pendingInvites = [
				...data.pendingInvites,
				{
					id: json.invitation.id,
					email: json.invitation.email,
					role: json.invitation.role,
					expiresAt: json.invitation.expiresAt,
					createdAt: new Date()
				}
			];
		} catch {
			inviteError = 'An error occurred. Please try again.';
		} finally {
			inviting = false;
		}
	}

	async function copyInviteLink() {
		await navigator.clipboard.writeText(inviteLink);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function removeMember(userId: string) {
		removingId = userId;
		try {
			await fetch(`/api/settings/team/${userId}`, { method: 'DELETE' });
			data.members = data.members.filter((m) => m.userId !== userId);
		} catch {
			alert('Failed to remove member');
		} finally {
			removingId = null;
		}
	}

	async function updateRole(userId: string, newRole: string) {
		updatingRoleId = userId;
		try {
			await fetch(`/api/settings/team/${userId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role: newRole })
			});
			data.members = data.members.map((m) => (m.userId === userId ? { ...m, role: newRole } : m));
		} catch {
			alert('Failed to update role');
		} finally {
			updatingRoleId = null;
		}
	}

	function formatRole(role: string): string {
		return role.charAt(0).toUpperCase() + role.slice(1);
	}

	function getRoleBadgeVariant(role: string): 'success' | 'warning' | 'default' | 'info' {
		switch (role) {
			case 'owner':
				return 'success';
			case 'admin':
				return 'warning';
			case 'member':
				return 'default';
			case 'viewer':
				return 'info';
			default:
				return 'default';
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-[var(--foreground)]">Team</h1>
			<p class="text-sm text-[var(--foreground-muted)]">
				Manage your organization team members and invitations
			</p>
		</div>
		{#if canInvite}
			<Button onclick={() => (showInviteModal = true)}>
				<Plus size={16} />
				Invite Member
			</Button>
		{/if}
	</div>

	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<Users size={20} color="var(--brand)" />
			<h2 class="font-semibold text-[var(--foreground)]">
				Members ({data.members.length})
			</h2>
		</div>

		{#if data.members.length === 0}
			<p class="text-sm text-[var(--foreground-muted)]">No team members yet.</p>
		{:else}
			<div class="space-y-3">
				{#each data.members as member (member.id)}
					<div
						class="flex items-center justify-between rounded-[var(--radius)] bg-[var(--background-alt)] p-4"
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-light)] text-[var(--brand)]"
							>
								{member.isCurrentUser
									? data.currentUser.name?.[0] || '?'
									: member.userId[0].toUpperCase()}
							</div>
							<div>
								<p class="font-medium text-[var(--foreground)]">
									{member.isCurrentUser ? data.currentUser.name : 'Team Member'}
									{#if member.isCurrentUser}
										<span class="text-xs text-[var(--foreground-muted)]">(you)</span>
									{/if}
								</p>
								<p class="text-xs text-[var(--foreground-muted)]">
									{member.isCurrentUser ? data.currentUser.email : 'Email on file'}
								</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							{#if canManageRoles && member.role !== 'owner' && !member.isCurrentUser}
								<select
									class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm text-[var(--foreground)]"
									value={member.role}
									onchange={(e) => updateRole(member.userId, (e.target as HTMLSelectElement).value)}
									disabled={updatingRoleId === member.userId}
								>
									{#each roleOptions as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							{:else}
								<Badge variant={getRoleBadgeVariant(member.role)}>
									{formatRole(member.role)}
								</Badge>
							{/if}

							{#if canManageRoles && member.role !== 'owner' && !member.isCurrentUser}
								<button
									onclick={() => removeMember(member.userId)}
									disabled={removingId === member.userId}
									class="text-[var(--danger)] hover:opacity-70"
									title="Remove member"
								>
									<Trash size={16} />
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Card>

	{#if data.pendingInvites.length > 0}
		<Card class="p-6">
			<h2 class="mb-4 font-semibold text-[var(--foreground)]">
				Pending Invitations ({data.pendingInvites.length})
			</h2>
			<div class="space-y-3">
				{#each data.pendingInvites as invite (invite.id)}
					<div
						class="flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] p-4"
					>
						<div>
							<p class="font-medium text-[var(--foreground)]">{invite.email}</p>
							<p class="text-xs text-[var(--foreground-muted)]">
								Invited as {formatRole(invite.role)} · Expires{' '}
								{new Date(invite.expiresAt).toLocaleDateString()}
							</p>
						</div>
						<Badge variant="warning">Pending</Badge>
					</div>
				{/each}
			</div>
		</Card>
	{/if}

	{#if showInviteModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			onclick={() => (showInviteModal = false)}
			onkeydown={(e) => e.key === 'Escape' && (showInviteModal = false)}
			role="dialog"
			tabindex="-1"
		>
			<div
				class="w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--background)] p-6 shadow-xl"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="dialog"
			>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-semibold text-[var(--foreground)]">Invite Team Member</h2>
					<button
						onclick={() => (showInviteModal = false)}
						class="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
					>
						<X size={20} />
					</button>
				</div>

				{#if !inviteLink}
					<div class="space-y-4">
						<div>
							<label class="mb-1 block text-sm font-medium text-[var(--foreground)]">
								Email address
							</label>
							<input
								type="email"
								bind:value={inviteEmail}
								placeholder="colleague@company.com"
								class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
							/>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-[var(--foreground)]">Role</label>
							<select
								bind:value={inviteRole}
								class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
							>
								{#each roleOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						{#if inviteError}
							<p class="text-sm text-[var(--danger)]">{inviteError}</p>
						{/if}

						<Button onclick={sendInvite} disabled={inviting || !inviteEmail} class="w-full">
							{#if inviting}
								Sending...
							{:else}
								<Plus size={16} />
								Send Invitation
							{/if}
						</Button>
					</div>
				{:else}
					<div class="space-y-4">
						<p class="text-sm text-[var(--foreground-muted)]">
							Share this link with your team member. They can click it to join your organization.
						</p>

						<div class="flex items-center gap-2">
							<input
								type="text"
								readonly
								value={inviteLink}
								class="flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] px-3 py-2 text-sm text-[var(--foreground)]"
							/>
							<Button variant="secondary" onclick={copyInviteLink}>
								{#if copied}
									<Check size={16} />
								{:else}
									<Copy size={16} />
								{/if}
							</Button>
						</div>

						<p class="text-xs text-[var(--foreground-muted)]">Invitation expires in 7 days</p>

						<Button
							variant="secondary"
							onclick={() => {
								showInviteModal = false;
								inviteLink = '';
								inviteEmail = '';
							}}
							class="w-full"
						>
							Done
						</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
