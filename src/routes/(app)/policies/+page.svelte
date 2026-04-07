<script lang="ts">
	import {
		FileText,
		Download,
		Plus,
		Spinner,
		CaretDown,
		CaretUp,
		PencilSimple,
		FloppyDisk,
		X,
		Trash,
		ClockCounterClockwise,
		ArrowCounterClockwise
	} from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { toastSuccess, toastError } from '$lib/stores/toasts.svelte';
	import * as m from '$lib/paraglide/messages';
	import { POLICY_DESCRIPTIONS } from '$lib/policy-descriptions';

	// ── Types ────────────────────────────────────────────────────────────────
	type Policy = (typeof data.policies)[0];
	type Version = { id: string; content: string; savedAt: string; savedBy: string };

	// ── Props ────────────────────────────────────────────────────────────────
	let { data } = $props();

	// ── Generation steps ─────────────────────────────────────────────────────
	const generationSteps = [
		m.policies_step_analysing(),
		m.policies_step_reviewing(),
		m.policies_step_drafting(),
		m.policies_step_tailoring(),
		m.policies_step_finalising()
	];

	// ── Local state ──────────────────────────────────────────────────────────
	let activeTab = $state<'standard' | 'custom'>('standard');
	let selectedType = $state('security-policy');
	let customTitle = $state('');
	let customPrompt = $state('');
	let generating = $state(false);
	let generationStepIndex = $state(0);
	let progressWidth = $state('0%');
	let errorMessage = $state('');
	let policyList = $state<Policy[]>(data.policies);
	let expandedId = $state<string | null>(null);
	let editingId = $state<string | null>(null);
	let editContent = $state('');
	let saving = $state(false);
	let archivingId = $state<string | null>(null);
	let versionsByPolicy = $state<Record<string, Version[]>>({});
	let versionsOpenId = $state<string | null>(null);
	let restoringVersionId = $state<string | null>(null);

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
		window.open(`/api/policies/${policy.id}/download`, '_blank');
	}

	function toggleExpand(id: string) {
		const closing = expandedId === id;
		expandedId = closing ? null : id;
		if (!closing && !(id in versionsByPolicy)) {
			fetch(`/api/policies/${id}?versions=true`)
				.then((r) => r.json())
				.then((body: { versions: Version[] }) => {
					versionsByPolicy = { ...versionsByPolicy, [id]: body.versions };
				})
				.catch(() => {
					versionsByPolicy = { ...versionsByPolicy, [id]: [] };
				});
		}
	}

	function toggleVersionHistory(id: string) {
		versionsOpenId = versionsOpenId === id ? null : id;
	}

	async function restoreVersion(policy: Policy, versionId: string) {
		restoringVersionId = versionId;
		try {
			const res = await fetch(`/api/policies/${policy.id}/restore`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ versionId })
			});
			if (!res.ok) throw new Error('Failed to restore');
			const body: { content: string } = await res.json();
			policyList = policyList.map((p) =>
				p.id === policy.id ? { ...p, content: body.content, editedAt: new Date() } : p
			);
			// Refresh versions for this policy
			const versionsRes = await fetch(`/api/policies/${policy.id}?versions=true`);
			const versionsBody: { versions: Version[] } = await versionsRes.json();
			versionsByPolicy = { ...versionsByPolicy, [policy.id]: versionsBody.versions };
			versionsOpenId = null;
			toastSuccess('Policy restored');
		} catch {
			toastError('Failed to restore version');
		} finally {
			restoringVersionId = null;
		}
	}

	function formatVersionDate(date: string): string {
		const d = new Date(date);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
		if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
		if (diffDays === 1) return '1 day ago';
		if (diffDays < 30) return `${diffDays} days ago`;
		return d.toLocaleDateString();
	}

	let stepInterval: ReturnType<typeof setInterval> | null = null;

	function startGenerationProgress() {
		generationStepIndex = 0;
		progressWidth = '0%';
		// Defer the transition trigger to the next frame so the DOM renders at 0% first
		requestAnimationFrame(() => {
			progressWidth = '90%';
		});
		stepInterval = setInterval(() => {
			if (generationStepIndex < generationSteps.length - 1) {
				generationStepIndex += 1;
			}
		}, 2200);
	}

	function stopGenerationProgress(success: boolean) {
		if (stepInterval !== null) {
			clearInterval(stepInterval);
			stepInterval = null;
		}
		if (success) {
			progressWidth = '100%';
		}
		generationStepIndex = 0;
	}

	async function callGenerate(body: Record<string, string>) {
		generating = true;
		errorMessage = '';
		startGenerationProgress();
		try {
			const res = await fetch('/api/policies/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				errorMessage = (json as { message?: string }).message ?? m.policies_error_generic();
				stopGenerationProgress(false);
				return;
			}
			const newPolicy: Policy = await res.json();
			policyList = [newPolicy, ...policyList];
			stopGenerationProgress(true);
		} catch {
			errorMessage = m.policies_error_generic();
			stopGenerationProgress(false);
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

	function startEdit(policy: Policy) {
		editingId = policy.id;
		editContent = policy.content;
	}

	function cancelEdit() {
		editingId = null;
		editContent = '';
	}

	async function saveEdit(policy: Policy) {
		saving = true;
		try {
			const res = await fetch(`/api/policies/${policy.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: editContent })
			});
			if (!res.ok) throw new Error('Failed to save');
			toastSuccess('Policy saved');
			policyList = policyList.map((p) =>
				p.id === policy.id ? { ...p, content: editContent, editedAt: new Date() } : p
			);
			editingId = null;
			editContent = '';
		} catch {
			toastError('Failed to save policy');
		} finally {
			saving = false;
		}
	}

	async function archivePolicy(policy: Policy) {
		archivingId = policy.id;
		try {
			const res = await fetch(`/api/policies/${policy.id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to archive');
			policyList = policyList.filter((p) => p.id !== policy.id);
			toastSuccess('Policy archived');
		} catch {
			toastError('Failed to archive');
		} finally {
			archivingId = null;
		}
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
				{#each policyGroups as group (group.label)}
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
									<span class="block font-medium">{item.label}</span>
									{#if POLICY_DESCRIPTIONS[item.value]}
										<span
											class="mt-0.5 block text-xs leading-tight text-[var(--foreground-muted)] {selectedType ===
											item.value
												? 'text-[var(--brand)]'
												: ''}">{POLICY_DESCRIPTIONS[item.value]}</span
										>
									{/if}
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

		<!-- Generating progress state -->
		{#if generating}
			<div class="mt-4 rounded-[var(--radius)] bg-[var(--info-light)] px-4 py-3">
				<div class="flex items-center gap-2">
					<Spinner size={16} class="shrink-0 animate-spin text-[var(--info)]" />
					<p class="text-sm font-medium text-[var(--info)]">
						{generationSteps[generationStepIndex]}
					</p>
				</div>
				<div
					class="mt-3 h-1 w-full overflow-hidden rounded-full"
					style="background-color: color-mix(in srgb, var(--info) 20%, transparent);"
				>
					<div
						class="h-full rounded-full bg-[var(--info)]"
						style="width: {progressWidth}; transition: width 12s ease-out;"
					></div>
				</div>
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
							<Button variant="ghost" size="sm" onclick={() => startEdit(policy)}>
								<PencilSimple size={14} />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => archivePolicy(policy)}
								disabled={archivingId === policy.id}
							>
								<Trash size={14} />
							</Button>
						</div>
					</div>

					{#if expandedId === policy.id}
						<div class="border-t border-[var(--border)] bg-[var(--background-alt)] p-4">
							{#if editingId === policy.id}
								<textarea
									bind:value={editContent}
									class="h-64 w-full resize-none rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--foreground)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
								></textarea>
								<div class="mt-3 flex justify-end gap-2">
									<Button variant="ghost" size="sm" onclick={cancelEdit}>
										<X size={14} /> Cancel
									</Button>
									<Button size="sm" onclick={() => saveEdit(policy)} disabled={saving}>
										<FloppyDisk size={14} />
										{saving ? 'Saving...' : 'Save'}
									</Button>
								</div>
							{:else}
								<pre
									class="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">{policy.content}</pre>
							{/if}

							{#if versionsByPolicy[policy.id]?.length > 0}
								<div class="mt-4 border-t border-[var(--border)] pt-4">
									<button
										onclick={() => toggleVersionHistory(policy.id)}
										class="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
									>
										<ClockCounterClockwise size={14} />
										Version history
										{#if versionsOpenId === policy.id}
											<CaretUp size={11} />
										{:else}
											<CaretDown size={11} />
										{/if}
									</button>

									{#if versionsOpenId === policy.id}
										<div class="mt-3 space-y-2">
											{#each versionsByPolicy[policy.id] as version (version.id)}
												<div
													class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
												>
													<div class="flex items-center justify-between gap-3">
														<p class="text-xs font-medium text-[var(--foreground-muted)]">
															{formatVersionDate(version.savedAt)}
														</p>
														<button
															onclick={() => restoreVersion(policy, version.id)}
															disabled={restoringVersionId === version.id}
															class="flex shrink-0 items-center gap-1 rounded-[var(--radius)] border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50"
														>
															{#if restoringVersionId === version.id}
																<Spinner size={11} class="animate-spin" />
																Restoring...
															{:else}
																<ArrowCounterClockwise size={11} />
																Restore
															{/if}
														</button>
													</div>
													<p
														class="mt-1.5 line-clamp-2 font-mono text-xs leading-relaxed text-[var(--foreground-subtle)]"
													>
														{version.content.slice(0, 120)}{version.content.length > 120
															? '...'
															: ''}
													</p>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
