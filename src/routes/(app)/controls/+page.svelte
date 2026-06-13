<script lang="ts">
	import { CheckCircle, Circle, ArrowRight, CheckSquare, MagnifyingGlass } from 'phosphor-svelte';
	import * as m from '$lib/paraglide/messages';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data } = $props();

	type ControlItem = (typeof data.controls)[number];

	let searchQuery = $state('');

	function getStatus(c: ControlItem): 'not-started' | 'in-progress' | 'complete' {
		if (c.evidenceCount === 0 && c.policyCount === 0) return 'not-started';
		if (c.evidenceCount > 0 && c.policyCount > 0) return 'complete';
		return 'in-progress';
	}

	const filtered = $derived.by(() => {
		const q = searchQuery.toLowerCase().trim();
		if (!q) return data.controls;
		return data.controls.filter(
			(c) =>
				c.code.toLowerCase().includes(q) ||
				c.title.toLowerCase().includes(q) ||
				c.category.toLowerCase().includes(q)
		);
	});

	const grouped = $derived.by(() => {
		const map = new Map<string, ControlItem[]>();
		for (const c of filtered) {
			if (!map.has(c.category)) map.set(c.category, []);
			map.get(c.category)!.push(c);
		}
		return map;
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">Controls</h1>
		{#if data.frameworks && data.frameworks.length > 1}
			<select
				onchange={(e) => {
					const url = new URL(window.location.href);
					url.searchParams.set('framework', (e.target as HTMLSelectElement).value);
					window.location.href = url.toString();
				}}
				class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)]"
			>
				{#each data.frameworks as fw (fw.id)}
					<option value={fw.slug} selected={fw.id === data.framework?.id}>
						{fw.name}
					</option>
				{/each}
			</select>
		{:else if data.framework}
			<Badge variant="info">{data.framework.name}</Badge>
		{/if}
	</div>

	{#if data.controls.length > 0}
		<div class="relative">
			<MagnifyingGlass
				size={16}
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-subtle)]"
			/>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder={m.controls_search_placeholder()}
				class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] py-2 pr-3 pl-9 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
			/>
		</div>
	{/if}

	{#if data.frameworks.length === 0}
		<Card class="p-10">
			<div class="flex flex-col items-center justify-center gap-3 text-center">
				<CheckSquare size={48} color="var(--foreground-subtle)" />
				<p class="text-[15px] font-semibold text-[var(--foreground)]">
					{m.controls_empty_no_frameworks_title()}
				</p>
				<p class="text-[13px] text-[var(--foreground-muted)]">
					{m.controls_empty_no_frameworks_body()}
				</p>
				<a href="/frameworks" class="text-[13px] text-[var(--brand)] hover:underline">
					{m.controls_empty_no_frameworks_link()}
				</a>
			</div>
		</Card>
	{:else if data.controls.length === 0}
		<Card class="p-10">
			<div class="flex flex-col items-center justify-center gap-3 text-center">
				<Circle size={48} color="var(--foreground-subtle)" />
				<p class="text-[15px] font-semibold text-[var(--foreground)]">
					{m.controls_empty_no_controls_title()}
				</p>
				<p class="text-[13px] text-[var(--foreground-muted)]">
					{m.controls_empty_no_controls_body()}
				</p>
			</div>
		</Card>
	{/if}

	{#each grouped as [category, categoryControls] (category)}
		{@const completed = categoryControls.filter((c) => c.complete).length}
		{@const total = categoryControls.length}
		<Card class="p-6">
			<div class="mb-3 flex items-center justify-between">
				<h2 class="font-semibold text-[var(--foreground)]">{category}</h2>
				<span class="text-sm text-[var(--foreground-muted)]">{completed}/{total}</span>
			</div>
			<div class="mb-4 h-1.5 w-full rounded-full bg-[var(--border)]">
				<div
					class="h-1.5 rounded-full bg-[var(--brand)] transition-all"
					style="width: {total > 0 ? (completed / total) * 100 : 0}%"
				></div>
			</div>
			<div class="space-y-2">
				{#each categoryControls as control (control.id)}
					<a
						href="/controls/{control.id}"
						class="group flex items-center justify-between rounded-[var(--radius)] px-3 py-2 transition-colors hover:bg-[var(--background-alt)]"
					>
						<div class="flex items-center gap-3">
							{#if control.complete}
								<CheckCircle size={18} color="var(--success)" weight="fill" />
							{:else}
								<Circle size={18} color="var(--foreground-subtle)" />
							{/if}
							<span class="w-12 font-mono text-xs text-[var(--foreground-muted)]"
								>{control.code}</span
							>
							<span class="text-sm text-[var(--foreground)]">{control.title}</span>
						</div>
						<div class="flex items-center gap-2">
							{#if getStatus(control) === 'complete'}
								<Badge variant="success">Complete</Badge>
							{:else if getStatus(control) === 'in-progress'}
								<Badge variant="info">In Progress</Badge>
							{:else}
								<Badge variant="warning">Not Started</Badge>
							{/if}
							<ArrowRight
								size={14}
								color="var(--foreground-muted)"
								class="opacity-0 transition-opacity group-hover:opacity-100"
							/>
						</div>
					</a>
				{/each}
			</div>
		</Card>
	{/each}

	{#if searchQuery && filtered.length === 0}
		<Card class="p-8 text-center">
			<MagnifyingGlass size={32} color="var(--foreground-subtle)" class="mx-auto mb-2" />
			<p class="text-sm text-[var(--foreground-muted)]">
				No controls matching "<span class="font-medium text-[var(--foreground)]">{searchQuery}</span
				>"
			</p>
		</Card>
	{/if}
</div>
