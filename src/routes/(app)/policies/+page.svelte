<script lang="ts">
	import { FileText, Download, Plus } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data } = $props();
	let generating = $state(false);
	let selectedType = $state('security-policy');

	const policyTypes = [
		{ value: 'security-policy', label: 'Security Policy' },
		{ value: 'access-control-policy', label: 'Access Control Policy' },
		{ value: 'incident-response-policy', label: 'Incident Response Policy' }
	];

	async function generatePolicy() {
		generating = true;
		await fetch('/api/policies/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ policyType: selectedType })
		});
		window.location.reload();
		generating = false;
	}

	function downloadPolicy(policy: (typeof data.policies)[0]) {
		const blob = new Blob([policy.content], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${policy.type}.md`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">Policies</h1>
	</div>

	<!-- Generator -->
	<Card class="p-6">
		<h2 class="mb-4 font-semibold text-[var(--foreground)]">Generate a Policy</h2>
		<div class="flex gap-3">
			<select
				bind:value={selectedType}
				class="flex-1 rounded-[var(--radius)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
			>
				{#each policyTypes as pt (pt.value)}
					<option value={pt.value}>{pt.label}</option>
				{/each}
			</select>
			<Button onclick={generatePolicy} disabled={generating}>
				<Plus size={16} />
				{generating ? 'Generating...' : 'Generate'}
			</Button>
		</div>
		<p class="mt-2 text-xs text-[var(--foreground-muted)]">
			Policies are generated from templates using your company info. You can edit them after
			generation.
		</p>
	</Card>

	<!-- Policy list -->
	{#if data.policies.length === 0}
		<Card class="p-8 text-center">
			<div class="mx-auto mb-3 flex justify-center">
				<FileText size={40} color="var(--foreground-subtle)" />
			</div>
			<p class="text-[var(--foreground-muted)]">
				No policies generated yet. Use the generator above.
			</p>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each data.policies as policy (policy.id)}
				<Card class="p-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<FileText size={20} color="var(--brand)" />
							<div>
								<p class="font-medium text-[var(--foreground)]">{policy.title}</p>
								<p class="text-xs text-[var(--foreground-muted)]">
									Generated {policy.generatedAt
										? new Date(policy.generatedAt).toLocaleDateString()
										: 'recently'}
								</p>
							</div>
						</div>
						<div class="flex gap-2">
							<Button variant="secondary" size="sm" onclick={() => downloadPolicy(policy)}>
								<Download size={14} /> Download
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
