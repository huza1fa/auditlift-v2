<script lang="ts">
	import { onMount } from 'svelte';
	import { CheckCircle, Info, PencilSimple, Plus, Spinner, Trash, Warning } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { toastError, toastSuccess } from '$lib/stores/toasts.svelte';

	type FactStatus = 'pending' | 'verified';

	type OrganizationFact = {
		id: string;
		category: string;
		label: string;
		value: string;
		status: FactStatus;
		source?: string | null;
		sourceDetail?: string | null;
		createdAt: string;
		updatedAt?: string;
		reviewedAt?: string | null;
	};

	type FactsResponse = {
		facts?: OrganizationFact[];
		message?: string;
	};

	let { data } = $props();

	let facts = $state<OrganizationFact[]>([]);
	let loading = $state(true);
	let formOpen = $state(false);
	let editingFact = $state<OrganizationFact | null>(null);
	let factCategory = $state('general');
	let factLabel = $state('');
	let factValue = $state('');
	let saving = $state(false);
	let verifyingId = $state<string | null>(null);
	let deletingId = $state<string | null>(null);

	const isAdmin = $derived(data.userRole === 'owner' || data.userRole === 'admin');
	const verifiedFacts = $derived(facts.filter((fact) => fact.status === 'verified'));
	const pendingFacts = $derived(facts.filter((fact) => fact.status === 'pending'));

	onMount(() => {
		void loadFacts();
	});

	async function loadFacts() {
		loading = true;
		try {
			const res = await fetch('/api/settings/facts');
			const json: FactsResponse = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.message ?? 'Failed to load company facts.');
			facts = json.facts ?? [];
		} catch (error) {
			toastError(error instanceof Error ? error.message : 'Failed to load company facts.');
		} finally {
			loading = false;
		}
	}

	function openCreateForm() {
		editingFact = null;
		factCategory = 'general';
		factLabel = '';
		factValue = '';
		formOpen = true;
	}

	function openEditForm(fact: OrganizationFact) {
		editingFact = fact;
		factCategory = fact.category;
		factLabel = fact.label;
		factValue = fact.value;
		formOpen = true;
	}

	async function saveFact() {
		if (!factCategory || !factLabel.trim() || !factValue.trim()) return;
		saving = true;
		try {
			const res = await fetch(
				editingFact ? `/api/settings/facts/${editingFact.id}` : '/api/settings/facts',
				{
					method: editingFact ? 'PATCH' : 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(
						editingFact
							? {
									category: factCategory,
									label: factLabel.trim(),
									value: factValue.trim()
								}
							: { category: factCategory, label: factLabel.trim(), value: factValue.trim() }
					)
				}
			);
			const json: FactsResponse & { fact?: OrganizationFact } = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.message ?? 'Failed to save company fact.');

			if (json.fact) {
				facts = editingFact
					? facts.map((fact) => (fact.id === json.fact?.id ? json.fact : fact))
					: [json.fact, ...facts];
			} else {
				await loadFacts();
			}
			formOpen = false;
			toastSuccess(editingFact ? 'Company fact updated' : 'Company fact added as pending');
		} catch (error) {
			toastError(error instanceof Error ? error.message : 'Failed to save company fact.');
		} finally {
			saving = false;
		}
	}

	async function verifyFact(fact: OrganizationFact) {
		verifyingId = fact.id;
		try {
			const res = await fetch(`/api/settings/facts/${fact.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'verified' })
			});
			const json: FactsResponse & { fact?: OrganizationFact } = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.message ?? 'Failed to verify company fact.');
			if (json.fact) {
				facts = facts.map((item) => (item.id === fact.id ? json.fact! : item));
			} else {
				await loadFacts();
			}
			toastSuccess('Company fact verified');
		} catch (error) {
			toastError(error instanceof Error ? error.message : 'Failed to verify company fact.');
		} finally {
			verifyingId = null;
		}
	}

	async function deleteFact(fact: OrganizationFact) {
		if (!confirm(`Delete the fact “${fact.label}”?`)) return;
		deletingId = fact.id;
		try {
			const res = await fetch(`/api/settings/facts/${fact.id}`, { method: 'DELETE' });
			const json: FactsResponse = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json.message ?? 'Failed to delete company fact.');
			facts = facts.filter((item) => item.id !== fact.id);
			toastSuccess('Company fact deleted');
		} catch (error) {
			toastError(error instanceof Error ? error.message : 'Failed to delete company fact.');
		} finally {
			deletingId = null;
		}
	}

	function sourceLabel(source: string | null | undefined) {
		if (source === 'system') return 'System generated';
		return 'Added by a team member';
	}

	function formatDate(value: string | null | undefined) {
		return value ? new Date(value).toLocaleDateString() : null;
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<h2 class="text-lg font-semibold text-[var(--foreground)]">Company Facts</h2>
			<p class="mt-1 max-w-2xl text-sm text-[var(--foreground-muted)]">
				Facts give Auditlift approved context for AI-generated answers. New or edited facts stay
				pending until an admin verifies them.
			</p>
		</div>
		<Button onclick={openCreateForm} class="w-full sm:w-auto">
			<Plus size={16} />
			Add fact
		</Button>
	</div>

	<div class="flex items-start gap-2.5 rounded-[var(--radius)] bg-[var(--info-light)] px-4 py-3">
		<Info size={16} color="var(--info)" class="mt-0.5 shrink-0" />
		<p class="text-xs leading-relaxed text-[var(--info)]">
			Verified facts can be used as trusted company context. Pending facts are visible here for
			review but are not confirmed company information.
		</p>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<Spinner size={24} class="animate-spin" color="var(--foreground-muted)" />
		</div>
	{:else}
		<div class="grid gap-5 xl:grid-cols-2">
			<Card class="p-5 sm:p-6">
				<div class="mb-4 flex items-center justify-between gap-3">
					<div class="flex items-center gap-2">
						<CheckCircle size={18} color="var(--success)" weight="fill" />
						<h3 class="font-semibold text-[var(--foreground)]">Verified facts</h3>
					</div>
					<Badge variant="success">{verifiedFacts.length}</Badge>
				</div>
				{#if verifiedFacts.length === 0}
					<p class="py-5 text-sm text-[var(--foreground-muted)]">No verified facts yet.</p>
				{:else}
					<div class="space-y-3">
						{#each verifiedFacts as fact (fact.id)}
							{@render FactRow(fact, isAdmin, openEditForm, deleteFact, deletingId)}
						{/each}
					</div>
				{/if}
			</Card>

			<Card class="p-5 sm:p-6">
				<div class="mb-4 flex items-center justify-between gap-3">
					<div class="flex items-center gap-2">
						<Warning size={18} color="var(--warning)" weight="fill" />
						<h3 class="font-semibold text-[var(--foreground)]">Pending review</h3>
					</div>
					<Badge variant="warning">{pendingFacts.length}</Badge>
				</div>
				{#if pendingFacts.length === 0}
					<p class="py-5 text-sm text-[var(--foreground-muted)]">No facts waiting for review.</p>
				{:else}
					<div class="space-y-3">
						{#each pendingFacts as fact (fact.id)}
							<div
								class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] p-4"
							>
								<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div class="min-w-0">
										<p class="text-sm font-semibold text-[var(--foreground)]">{fact.label}</p>
										<p class="mt-1 text-sm whitespace-pre-wrap text-[var(--foreground-muted)]">
											{fact.value}
										</p>
										<p class="mt-3 text-xs text-[var(--foreground-subtle)]">
											Source: {sourceLabel(fact.source)}
											{#if fact.sourceDetail}
												· {fact.sourceDetail}{/if}
											{#if formatDate(fact.createdAt)}
												· {formatDate(fact.createdAt)}{/if}
										</p>
									</div>
									<div class="flex shrink-0 flex-wrap gap-1">
										<button
											onclick={() => openEditForm(fact)}
											class="rounded-[var(--radius)] p-2 text-[var(--foreground-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
											aria-label={`Edit ${fact.label}`}
										>
											<PencilSimple size={16} />
										</button>
										{#if isAdmin}
											<Button
												size="sm"
												onclick={() => verifyFact(fact)}
												disabled={verifyingId === fact.id}
											>
												{#if verifyingId === fact.id}<Spinner
														size={13}
														class="animate-spin"
													/>{:else}<CheckCircle size={13} />{/if}
												Verify
											</Button>
										{/if}
										{#if isAdmin}
											<button
												onclick={() => deleteFact(fact)}
												disabled={deletingId === fact.id}
												class="rounded-[var(--radius)] p-2 text-[var(--danger)] hover:bg-[var(--danger-light)] disabled:opacity-50"
												aria-label={`Delete ${fact.label}`}
											>
												{#if deletingId === fact.id}<Spinner
														size={16}
														class="animate-spin"
													/>{:else}<Trash size={16} />{/if}
											</button>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</Card>
		</div>
	{/if}
</div>

<Dialog bind:open={formOpen} title={editingFact ? 'Edit company fact' : 'Add company fact'}>
	<form
		class="space-y-4"
		onsubmit={(event) => {
			event.preventDefault();
			void saveFact();
		}}
	>
		<div>
			<label for="fact-category" class="mb-1 block text-sm font-medium text-[var(--foreground)]"
				>Category</label
			>
			<select
				id="fact-category"
				bind:value={factCategory}
				class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
			>
				<option value="general">General</option>
				<option value="access_control">Access control</option>
				<option value="data_security">Data security</option>
				<option value="incident_response">Incident response</option>
				<option value="vendor_management">Vendor management</option>
				<option value="business_continuity">Business continuity</option>
				<option value="cryptography">Cryptography</option>
				<option value="physical_security">Physical security</option>
				<option value="vulnerability_management">Vulnerability management</option>
				<option value="change_management">Change management</option>
				<option value="privacy">Privacy</option>
				<option value="remote_work">Remote work</option>
				<option value="ai_usage">AI usage</option>
				<option value="data_retention">Data retention</option>
				<option value="other">Other</option>
			</select>
		</div>
		<div>
			<label for="fact-label" class="mb-1 block text-sm font-medium text-[var(--foreground)]"
				>Fact</label
			>
			<input
				id="fact-label"
				bind:value={factLabel}
				placeholder="e.g., Data hosting provider"
				maxlength="160"
				required
				class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
			/>
		</div>
		<div>
			<label for="fact-value" class="mb-1 block text-sm font-medium text-[var(--foreground)]"
				>Details</label
			>
			<textarea
				id="fact-value"
				bind:value={factValue}
				rows={4}
				placeholder="Describe the company fact accurately."
				maxlength="2000"
				required
				class="w-full resize-y rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
			></textarea>
		</div>
		<p class="text-xs text-[var(--foreground-muted)]">
			{editingFact
				? 'Editing a fact sends it back for verification.'
				: 'This fact will be marked pending until an admin verifies it.'}
		</p>
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button type="button" variant="ghost" onclick={() => (formOpen = false)}>Cancel</Button>
			<Button
				type="submit"
				disabled={saving || !factCategory || !factLabel.trim() || !factValue.trim()}
			>
				{#if saving}<Spinner size={14} class="animate-spin" />{/if}
				{editingFact ? 'Save changes' : 'Add pending fact'}
			</Button>
		</div>
	</form>
</Dialog>

{#snippet FactRow(
	fact: OrganizationFact,
	isAdmin: boolean,
	onEdit: (fact: OrganizationFact) => void,
	onDelete: (fact: OrganizationFact) => void,
	deletingId: string | null
)}
	<div class="rounded-[var(--radius)] border border-[var(--border)] p-4">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
			<div class="min-w-0">
				<p class="text-sm font-semibold text-[var(--foreground)]">{fact.label}</p>
				<p class="mt-1 text-sm whitespace-pre-wrap text-[var(--foreground-muted)]">{fact.value}</p>
				<p class="mt-3 text-xs text-[var(--foreground-subtle)]">
					Source: {sourceLabel(fact.source)}
					{#if formatDate(fact.reviewedAt)}
						· Reviewed {formatDate(fact.reviewedAt)}{/if}
				</p>
			</div>
			<div class="flex shrink-0 gap-1">
				<button
					onclick={() => onEdit(fact)}
					class="rounded-[var(--radius)] p-2 text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]"
					aria-label={`Edit ${fact.label}`}
				>
					<PencilSimple size={16} />
				</button>
				{#if isAdmin}
					<button
						onclick={() => onDelete(fact)}
						disabled={deletingId === fact.id}
						class="rounded-[var(--radius)] p-2 text-[var(--danger)] hover:bg-[var(--danger-light)] disabled:opacity-50"
						aria-label={`Delete ${fact.label}`}
					>
						{#if deletingId === fact.id}<Spinner size={16} class="animate-spin" />{:else}<Trash
								size={16}
							/>{/if}
					</button>
				{/if}
			</div>
		</div>
	</div>
{/snippet}
