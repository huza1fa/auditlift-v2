<script lang="ts">
	import { CheckCircle, Circle, ArrowRight } from 'phosphor-svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data } = $props();

	type ControlItem = (typeof data.controls)[number];
	const grouped = $derived.by(() => {
		const map = new Map<string, ControlItem[]>();
		for (const c of data.controls) {
			if (!map.has(c.category)) map.set(c.category, []);
			map.get(c.category)!.push(c);
		}
		return map;
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">Controls</h1>
		{#if data.framework}
			<Badge variant="info">{data.framework.name}</Badge>
		{/if}
	</div>

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
						<div
							class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
						>
							{#if control.evidenceCount > 0}
								<Badge variant="success">{control.evidenceCount} files</Badge>
							{/if}
							{#if control.policyCount > 0}
								<Badge variant="info">{control.policyCount} policies</Badge>
							{/if}
							<ArrowRight size={14} color="var(--foreground-muted)" />
						</div>
					</a>
				{/each}
			</div>
		</Card>
	{/each}
</div>
