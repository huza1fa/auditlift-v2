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

	const hasInviteRole = $derived(
		data.currentUser.role === 'owner' || data.currentUser.role === 'admin'
	);
	const canManageRoles = $derived(
		data.currentUser.role === 'owner' || data.currentUser.role === 'admin'
	);
	let canInviteMore = $state(false);
	const isTrialLimited = $derived(data.memberLimit !== null);

	$effect(() => {
		canInviteMore = data.canInviteMore;
	});

	let showInviteModal = $state(false);
	let inviteEmail = $state('');
	let inviteRole = $state('member');
	let inviteLink = $state('');
	let copied = $state(false);
	let inviting = $state(false);
	let inviteError = $state('');
	let memberError = $state('');
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
			// Re-check if trial limit is now reached
			if (data.memberLimit !== null) {
				canInviteMore = data.members.length + data.pendingInvites.length < data.memberLimit;
			}
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
		memberError = '';
		removingId = userId;
		try {
			await fetch(`/api/settings/team/${userId}`, { method: 'DELETE' });
			data.members = data.members.filter((m) => m.userId !== userId);
		} catch {
			memberError = 'Failed to remove member. Please try again.';
		} finally {
			removingId = null;
		}
	}

	async function updateRole(userId: string, newRole: string) {
		memberError = '';
		updatingRoleId = userId;
		try {
			await fetch(`/api/settings/team/${userId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role: newRole })
			});
			data.members = data.members.map((m) => (m.userId === userId ? { ...m, role: newRole } : m));
		} catch {
			memberError = 'Failed to update role. Please try again.';
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
		{#if hasInviteRole}
			{#if canInviteMore}
				<Button onclick={() => (showInviteModal = true)}>
					<Plus size={16} />
					Invite Member
				</Button>
			{:else}
				<a href="/settings/billing">
					<Button variant="secondary">Upgrade to invite more</Button>
				</a>
			{/if}
		{/if}
	</div>

	<Card class="p-6">
		<div class="mb-4 flex items-center gap-3">
			<Users size={20} color="var(--brand)" />
			<h2 class="font-semibold text-[var(--foreground)]">
				Members ({data.members.length}{#if isTrialLimited}/{data.memberLimit}{/if})
			</h2>
		</div>

		{#if isTrialLimited && !canInviteMore}
			<div
				class="mb-4 flex items-start gap-2.5 rounded-[var(--radius)] bg-[var(--warning-light)] px-3 py-3"
			>
				<Warning size={16} color="var(--warning)" class="mt-0.5 shrink-0" />
				<p class="text-xs leading-snug text-[var(--warning)]">
					Trial plans are limited to {data.memberLimit} team members.
					<a href="/settings/billing" class="font-medium underline">Upgrade</a> for unlimited invites.
				</p>
			</div>
		{/if}

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

	{#if memberError}
		<div
			class="rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-sm text-[var(--danger)]"
		>
			{memberError}
		</div>
	{/if}

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
				tabindex="-1"
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
							<label
								for="invite-email"
								class="mb-1 block text-sm font-medium text-[var(--foreground)]"
							>
								Email address
							</label>
							<input
								id="invite-email"
								type="email"
								bind:value={inviteEmail}
								placeholder="colleague@company.com"
								class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none"
							/>
						</div>

						<div>
							<label
								for="invite-role"
								class="mb-1 block text-sm font-medium text-[var(--foreground)]">Role</label
							>
							<select
								id="invite-role"
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
						<div
							class="flex items-start gap-3 rounded-[var(--radius)] bg-[var(--success-light,#f0fdf4)] p-3"
						>
							<Check size={18} class="mt-0.5 shrink-0 text-[var(--success,#16a34a)]" />
							<div>
								<p class="text-sm font-medium text-[var(--foreground)]">Invitation sent</p>
								<p class="text-sm text-[var(--foreground-muted)]">
									An email has been sent to <strong>{inviteEmail}</strong> with a link to join your organization.
								</p>
							</div>
						</div>

						<div>
							<p
								class="mb-2 text-xs font-medium tracking-wide text-[var(--foreground-muted)] uppercase"
							>
								Backup invite link
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
							<p class="mt-1 text-xs text-[var(--foreground-muted)]">
								Share this if the email doesn't arrive. Expires in 7 days.
							</p>
						</div>

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
