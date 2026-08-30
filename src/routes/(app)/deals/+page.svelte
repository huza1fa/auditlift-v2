<script lang="ts">
	import { Briefcase, CalendarBlank, CheckCircle, Plus, Spinner } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { toastError, toastSuccess } from '$lib/stores/toasts.svelte';

	type DealStatus = 'active' | 'submitted' | 'won' | 'lost' | 'archived';
	type Deal = (typeof data.deals)[number] & { status: DealStatus };

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	let deals = $state<Deal[]>(data.deals);
	// svelte-ignore state_referenced_locally
	let showCreate = $state(deals.length === 0);
	let customerName = $state('');
	let name = $state('');
	let deadline = $state('');
	let creating = $state(false);
	let updatingId = $state<string | null>(null);

	function statusVariant(status: DealStatus): 'default' | 'info' | 'success' | 'warning' {
		if (status === 'won') return 'success';
		if (status === 'submitted') return 'info';
		if (status === 'lost' || status === 'archived') return 'default';
		return 'warning';
	}

	function formatDeadline(value: string | Date | null) {
		if (!value) return 'No deadline set';
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	async function createDeal() {
		if (!customerName.trim() || !name.trim()) {
			toastError('Add both the customer and deal name.');
			return;
		}
		creating = true;
		try {
			const res = await fetch('/api/deals', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customerName: customerName.trim(),
					name: name.trim(),
					deadlineAt: deadline ? new Date(`${deadline}T12:00:00`).toISOString() : null
				})
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body.message ?? 'Could not create the deal.');
			deals = [{ ...body.deal, questionnaires: 0, ready: 0 }, ...deals];
			customerName = '';
			name = '';
			deadline = '';
			showCreate = false;
			toastSuccess('Deal workspace created. Attach a questionnaire to start responding.');
		} catch (err) {
			toastError(err instanceof Error ? err.message : 'Could not create the deal.');
		} finally {
			creating = false;
		}
	}

	async function changeStatus(deal: Deal, status: DealStatus) {
		updatingId = deal.id;
		try {
			const res = await fetch(`/api/deals/${deal.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status })
			});
			if (!res.ok) throw new Error('Could not update the deal.');
			deals = deals.map((item) => (item.id === deal.id ? { ...item, status } : item));
			toastSuccess(status === 'submitted' ? 'Marked as submitted.' : `Deal marked ${status}.`);
		} catch (err) {
			toastError(err instanceof Error ? err.message : 'Could not update the deal.');
		} finally {
			updatingId = null;
		}
	}
</script>

<div class="mx-auto max-w-5xl space-y-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-[var(--foreground)]">Deals</h1>
			<p class="mt-1 max-w-2xl text-sm text-[var(--foreground-muted)]">
				Keep each customer security review moving: attach the questionnaire, close only the gaps
				that matter, and mark it ready to submit.
			</p>
		</div>
		{#if data.canEdit && !showCreate}
			<Button onclick={() => (showCreate = true)}><Plus size={15} /> New deal</Button>
		{/if}
	</div>

	{#if showCreate && data.canEdit}
		<Card class="border-[var(--brand)] bg-[var(--brand-light)] p-5">
			<div class="mb-4 flex items-center gap-2">
				<Briefcase size={18} color="var(--brand)" weight="fill" />
				<h2 class="font-semibold text-[var(--foreground)]">Open a security review</h2>
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				<label class="text-sm font-medium text-[var(--foreground)]"
					>Customer<input
						bind:value={customerName}
						placeholder="Acme Inc."
						class="mt-1.5 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-normal"
					/></label
				>
				<label class="text-sm font-medium text-[var(--foreground)]"
					>Deal name<input
						bind:value={name}
						placeholder="Enterprise security review"
						class="mt-1.5 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-normal"
					/></label
				>
				<label class="text-sm font-medium text-[var(--foreground)]"
					>Buyer deadline <span class="font-normal text-[var(--foreground-subtle)]">(optional)</span
					><input
						bind:value={deadline}
						type="date"
						class="mt-1.5 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-normal"
					/></label
				>
			</div>
			<div class="mt-4 flex justify-end gap-2">
				<Button variant="ghost" onclick={() => (showCreate = false)}>Cancel</Button>
				<Button onclick={createDeal} disabled={creating}
					>{#if creating}<Spinner size={14} class="animate-spin" />{/if}Create workspace</Button
				>
			</div>
		</Card>
	{/if}

	{#if deals.length === 0 && !showCreate}
		<Card class="p-12 text-center"
			><Briefcase size={44} color="var(--foreground-subtle)" class="mx-auto mb-3" />
			<h2 class="font-semibold text-[var(--foreground)]">No active security reviews</h2>
			<p class="mx-auto mt-2 max-w-md text-sm text-[var(--foreground-muted)]">
				Create a deal before you receive a questionnaire so there is a clear workspace, owner, and
				deadline.
			</p></Card
		>
	{:else}
		<div class="grid gap-4 md:grid-cols-2">
			{#each deals as deal (deal.id)}
				<Card class="flex flex-col p-5">
					<div class="flex items-start justify-between gap-3">
						<div>
							<p
								class="text-xs font-semibold tracking-wide text-[var(--foreground-subtle)] uppercase"
							>
								{deal.customerName}
							</p>
							<h2 class="mt-1 font-semibold text-[var(--foreground)]">{deal.name}</h2>
						</div>
						<Badge variant={statusVariant(deal.status)}>{deal.status}</Badge>
					</div>
					<div class="mt-4 grid grid-cols-2 gap-3 text-sm">
						<div class="rounded-[var(--radius)] bg-[var(--background-alt)] p-3">
							<p class="text-xs text-[var(--foreground-subtle)]">Questionnaires</p>
							<p class="mt-1 font-semibold text-[var(--foreground)]">{deal.questionnaires}</p>
						</div>
						<div class="rounded-[var(--radius)] bg-[var(--background-alt)] p-3">
							<p class="text-xs text-[var(--foreground-subtle)]">Ready</p>
							<p class="mt-1 font-semibold text-[var(--foreground)]">
								{deal.ready}/{deal.questionnaires}
							</p>
						</div>
					</div>
					<div class="mt-4 flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
						<CalendarBlank size={13} />
						{formatDeadline(deal.deadlineAt)}
					</div>
					{#if data.canEdit && (deal.status === 'active' || deal.status === 'submitted')}
						<div class="mt-5 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
							{#if deal.status === 'active'}<Button
									size="sm"
									variant="secondary"
									onclick={() => changeStatus(deal, 'submitted')}
									disabled={updatingId === deal.id}>Mark submitted</Button
								>{/if}
							<Button
								size="sm"
								variant="ghost"
								onclick={() => changeStatus(deal, 'won')}
								disabled={updatingId === deal.id}><CheckCircle size={13} /> Won</Button
							>
							<Button
								size="sm"
								variant="ghost"
								onclick={() => changeStatus(deal, 'lost')}
								disabled={updatingId === deal.id}>Lost</Button
							>
						</div>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
