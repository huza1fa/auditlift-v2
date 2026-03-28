<script lang="ts">
	import { FileText, Download, Plus, Spinner, CaretDown, CaretUp } from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import * as m from '$lib/paraglide/messages';

	// ── Types ────────────────────────────────────────────────────────────────
	type Policy = (typeof data.policies)[0];

	// ── Props ────────────────────────────────────────────────────────────────
	let { data } = $props();

	// ── Local state ──────────────────────────────────────────────────────────
	let activeTab = $state<'standard' | 'custom'>('standard');
	let selectedType = $state('security-policy');
	let customTitle = $state('');
	let customPrompt = $state('');
	let generating = $state(false);
	let errorMessage = $state('');
	let policyList = $state<Policy[]>([...data.policies]);
	let expandedId = $state<string | null>(null);

	// ── Policy groups ────────────────────────────────────────────────────────
	const policyGroups = [
		{
			label: m.policies_group_security_fundamentals(),
			items: [
				{ value: 'security-policy', label: 'Security Policy' },
				{ value: 'access-control-policy', label: 'Access Control Policy' },
				{ value: 'password-policy', label: 'Password Policy' },
				{ value: 'acceptable-use-policy', label: 'Acceptable Use Policy' }
			]
		},
		{
			label: m.policies_group_operations(),
			items: [
				{ value: 'incident-response-policy', label: 'Incident Response Policy' },
				{ value: 'change-management-policy', label: 'Change Management Policy' },
				{ value: 'vulnerability-management-policy', label: 'Vulnerability Management Policy' },
				{ value: 'physical-security-policy', label: 'Physical Security Policy' }
			]
		},
		{
			label: m.policies_group_data_privacy(),
			items: [
				{ value: 'data-classification-policy', label: 'Data Classification Policy' },
				{ value: 'data-retention-policy', label: 'Data Retention Policy' },
				{ value: 'privacy-policy', label: 'Privacy Policy' }
			]
		},
		{
			label: m.policies_group_business_continuity(),
			items: [{ value: 'business-continuity-policy', label: 'Business Continuity Policy' }]
		},
		{
			label: m.policies_group_vendor(),
			items: [{ value: 'vendor-management-policy', label: 'Vendor Management Policy' }]
		},
		{
			label: m.policies_group_technology(),
			items: [
				{ value: 'cryptography-policy', label: 'Cryptography Policy' },
				{ value: 'remote-work-policy', label: 'Remote Work Policy' },
				{ value: 'ai-usage-policy', label: 'AI Usage Policy' }
			]
		}
	];

	// ── Helpers ──────────────────────────────────────────────────────────────
	function formatDate(date: Date | string | null): string {
		if (!date) return 'recently';
		const d = new Date(date);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		if (diffDays === 0) return 'today';
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 30) return `${diffDays} days ago`;
		return d.toLocaleDateString();
	}

	function downloadPolicy(policy: Policy) {
		const blob = new Blob([policy.content], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${policy.type}.md`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function toggleExpand(id: string) {
		expandedId = expandedId === id ? null : id;
	}

	async function callGenerate(body: Record<string, string>) {
		generating = true;
		errorMessage = '';
		try {
			const res = await fetch('/api/policies/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				errorMessage = (json as { message?: string }).message ?? m.policies_error_generic();
				return;
			}
			const newPolicy: Policy = await res.json();
			policyList = [newPolicy, ...policyList];
		} catch {
			errorMessage = m.policies_error_generic();
		} finally {
			generating = false;
		}
	}

	async function generateStandard() {
		await callGenerate({ policyType: selectedType });
	}

	async function generateCustom() {
		if (!customTitle.trim() || !customPrompt.trim()) return;
		await callGenerate({
			policyType: 'custom',
			customTitle: customTitle.trim(),
			customPrompt: customPrompt.trim()
		});
		customTitle = '';
		customPrompt = '';
	}

	async function regenerate(policy: Policy) {
		const body: Record<string, string> = { policyType: policy.type };
		if (policy.isCustom && policy.customPrompt) {
			body.policyType = 'custom';
			body.customTitle = policy.title;
			body.customPrompt = policy.customPrompt;
		}
		await callGenerate(body);
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">{m.policies_title()}</h1>
	</div>

	<!-- Generator card -->
	<Card class="p-6">
		<h2 class="mb-4 font-semibold text-[var(--foreground)]">{m.policies_generate_section()}</h2>

		<!-- Tabs -->
		<div
			class="mb-5 flex gap-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] p-1"
		>
			<button
				onclick={() => (activeTab = 'standard')}
				class="flex-1 rounded-[var(--radius)] px-3 py-1.5 text-sm font-medium transition-colors {activeTab ===
				'standard'
					? 'bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				{m.policies_tab_standard()}
			</button>
			<button
				onclick={() => (activeTab = 'custom')}
				class="flex-1 rounded-[var(--radius)] px-3 py-1.5 text-sm font-medium transition-colors {activeTab ===
				'custom'
					? 'bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]'
					: 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}"
			>
				{m.policies_tab_custom()}
			</button>
		</div>

		<!-- Tab: Standard -->
		{#if activeTab === 'standard'}
			<div class="space-y-4">
				{#each policyGroups as group}
					<div>
						<p
							class="mb-2 text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase"
						>
							{group.label}
						</p>
						<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
							{#each group.items as item (item.value)}
								<button
									onclick={() => (selectedType = item.value)}
									class="rounded-[var(--radius)] border px-3 py-2 text-left text-sm transition-colors {selectedType ===
									item.value
										? 'border-[var(--brand)] bg-[var(--brand-light)] font-medium text-[var(--brand)]'
										: 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand)] hover:bg-[var(--background-alt)]'}"
								>
									{item.label}
								</button>
							{/each}
						</div>
					</div>
				{/each}

				<Button onclick={generateStandard} disabled={generating} class="mt-2">
					{#if generating}
						<Spinner size={16} class="animate-spin" />
						{m.policies_generating_short()}
					{:else}
						<Plus size={16} />
						{m.policies_generate_button()}
					{/if}
				</Button>
			</div>
		{/if}

		<!-- Tab: Custom -->
		{#if activeTab === 'custom'}
			<div class="space-y-4">
				<div class="space-y-1">
					<label class="text-sm font-medium text-[var(--foreground)]" for="custom-title">
						{m.policies_custom_title_label()}
					</label>
					<input
						id="custom-title"
						bind:value={customTitle}
						placeholder={m.policies_custom_title_placeholder()}
						class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-sm font-medium text-[var(--foreground)]" for="custom-prompt">
						{m.policies_custom_prompt_label()}
					</label>
					<textarea
						id="custom-prompt"
						bind:value={customPrompt}
						placeholder={m.policies_custom_prompt_placeholder()}
						rows={5}
						class="w-full resize-none rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
					></textarea>
				</div>
				<Button
					onclick={generateCustom}
					disabled={generating || !customTitle.trim() || !customPrompt.trim()}
				>
					{#if generating}
						<Spinner size={16} class="animate-spin" />
						{m.policies_generating_short()}
					{:else}
						<Plus size={16} />
						{m.policies_generate_button()}
					{/if}
				</Button>
			</div>
		{/if}

		<!-- Generating spinner state -->
		{#if generating}
			<div
				class="mt-4 flex items-center gap-2 rounded-[var(--radius)] bg-[var(--info-light)] px-4 py-3"
			>
				<Spinner size={16} class="animate-spin text-[var(--info)]" />
				<p class="text-sm font-medium text-[var(--info)]">{m.policies_generating()}</p>
			</div>
		{/if}

		<!-- Error state -->
		{#if errorMessage}
			<div class="mt-4 rounded-[var(--radius)] bg-[var(--danger-light)] px-4 py-3">
				<p class="text-sm text-[var(--danger)]">{errorMessage}</p>
			</div>
		{/if}
	</Card>

	<!-- Policy list -->
	{#if policyList.length === 0}
		<Card class="p-8 text-center">
			<div class="mx-auto mb-3 flex justify-center">
				<FileText size={40} color="var(--foreground-subtle)" />
			</div>
			<p class="font-medium text-[var(--foreground)]">{m.policies_empty_title()}</p>
			<p class="mt-1 text-sm text-[var(--foreground-muted)]">{m.policies_empty_subtitle()}</p>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each policyList as policy (policy.id)}
				<Card class="overflow-hidden">
					<div class="flex items-center justify-between p-4">
						<div class="flex min-w-0 items-center gap-3">
							<FileText size={20} color="var(--brand)" class="shrink-0" />
							<div class="min-w-0">
								<div class="flex items-center gap-2">
									<p class="truncate font-medium text-[var(--foreground)]">{policy.title}</p>
									{#if policy.isCustom}
										<Badge variant="info">{m.policies_badge_custom()}</Badge>
									{/if}
								</div>
								<p class="text-xs text-[var(--foreground-muted)]">
									{m.policies_generated_on({ date: formatDate(policy.createdAt) })}
								</p>
							</div>
						</div>
						<div class="flex shrink-0 gap-2">
							<Button variant="ghost" size="sm" onclick={() => toggleExpand(policy.id)}>
								{expandedId === policy.id ? m.policies_hide() : m.policies_view()}
								{#if expandedId === policy.id}
									<CaretUp size={12} />
								{:else}
									<CaretDown size={12} />
								{/if}
							</Button>
							<Button variant="secondary" size="sm" onclick={() => downloadPolicy(policy)}>
								<Download size={14} />
								{m.policies_download()}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => regenerate(policy)}
								disabled={generating}
							>
								{m.policies_regenerate()}
							</Button>
						</div>
					</div>

					{#if expandedId === policy.id}
						<div class="border-t border-[var(--border)] bg-[var(--background-alt)] p-4">
							<pre
								class="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">{policy.content}</pre>
						</div>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
