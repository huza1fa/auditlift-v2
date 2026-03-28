<script lang="ts">
	import {
		ArrowLeft,
		FileText,
		Upload,
		Trash,
		File,
		Spinner,
		CaretDown,
		CaretUp,
		Download
	} from 'phosphor-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import * as m from '$lib/paraglide/messages';

	// ── Types ────────────────────────────────────────────────────────────────
	type LinkedPolicy = (typeof data.linkedPolicies)[0];

	// ── Props ────────────────────────────────────────────────────────────────
	let { data } = $props();

	// ── Local state ──────────────────────────────────────────────────────────
	let uploading = $state(false);
	let fileInput: HTMLInputElement;
	let evidenceList = $state([...data.evidenceList]);

	// Policy generation state
	let showPolicyPanel = $state(false);
	let selectedPolicyType = $state('security-policy');
	let generatingPolicy = $state(false);
	let policyError = $state('');
	let linkedPolicies = $state<LinkedPolicy[]>([...data.linkedPolicies]);
	let expandedPolicyId = $state<string | null>(null);

	// ── Policy types ─────────────────────────────────────────────────────────
	const allPolicyTypes = [
		{ value: 'security-policy', label: 'Security Policy' },
		{ value: 'access-control-policy', label: 'Access Control Policy' },
		{ value: 'password-policy', label: 'Password Policy' },
		{ value: 'acceptable-use-policy', label: 'Acceptable Use Policy' },
		{ value: 'incident-response-policy', label: 'Incident Response Policy' },
		{ value: 'change-management-policy', label: 'Change Management Policy' },
		{ value: 'vulnerability-management-policy', label: 'Vulnerability Management Policy' },
		{ value: 'physical-security-policy', label: 'Physical Security Policy' },
		{ value: 'data-classification-policy', label: 'Data Classification Policy' },
		{ value: 'data-retention-policy', label: 'Data Retention Policy' },
		{ value: 'privacy-policy', label: 'Privacy Policy' },
		{ value: 'business-continuity-policy', label: 'Business Continuity Policy' },
		{ value: 'vendor-management-policy', label: 'Vendor Management Policy' },
		{ value: 'cryptography-policy', label: 'Cryptography Policy' },
		{ value: 'remote-work-policy', label: 'Remote Work Policy' },
		{ value: 'ai-usage-policy', label: 'AI Usage Policy' }
	];

	// ── Helpers ──────────────────────────────────────────────────────────────
	async function uploadFile(file: globalThis.File) {
		uploading = true;
		const formData = new FormData();
		formData.append('file', file);
		formData.append('controlId', data.control.id);
		const res = await fetch('/api/evidence/upload', { method: 'POST', body: formData });
		if (res.ok) {
			const newEvidence = await res.json();
			evidenceList = [newEvidence, ...evidenceList];
		}
		uploading = false;
	}

	function onFileChange(e: Event) {
		const f = (e.target as HTMLInputElement).files?.[0];
		if (f) uploadFile(f);
	}

	async function deleteEvidence(id: string) {
		await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
		evidenceList = evidenceList.filter((ev) => ev.id !== id);
	}

	function downloadPolicy(policy: LinkedPolicy) {
		const blob = new Blob([policy.content], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${policy.type}.md`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function togglePolicyExpand(id: string) {
		expandedPolicyId = expandedPolicyId === id ? null : id;
	}

	async function generatePolicy() {
		generatingPolicy = true;
		policyError = '';
		try {
			const res = await fetch('/api/policies/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					policyType: selectedPolicyType,
					controlId: data.control.id
				})
			});
			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				policyError = (json as { message?: string }).message ?? 'Failed to generate policy.';
				return;
			}
			const newPolicy: LinkedPolicy = await res.json();
			linkedPolicies = [newPolicy, ...linkedPolicies];
			showPolicyPanel = false;
		} catch {
			policyError = 'Failed to generate policy. Please try again.';
		} finally {
			generatingPolicy = false;
		}
	}
</script>

<div class="space-y-6">
	<a
		href="/controls"
		class="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
	>
		<ArrowLeft size={16} />
		{m.control_back_to_controls()}
	</a>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Left column: Control details + Policy generation -->
		<div class="space-y-4">
			<Card class="p-6">
				<div class="mb-4 flex items-start gap-3">
					<span
						class="rounded bg-[var(--brand-light)] px-2 py-1 font-mono text-sm font-semibold text-[var(--brand)]"
					>
						{data.control.code}
					</span>
					<div>
						<h1 class="text-lg font-semibold text-[var(--foreground)]">{data.control.title}</h1>
						<Badge variant="default">{data.control.category}</Badge>
					</div>
				</div>
				<p class="mb-4 text-sm text-[var(--foreground-muted)]">{data.control.description}</p>

				<div class="space-y-3">
					<div class="rounded-[var(--radius)] bg-[var(--warning-light)] p-3">
						<p class="mb-1 text-xs font-semibold text-[var(--warning)]">
							{m.control_why_it_matters()}
						</p>
						<p class="text-sm text-[var(--foreground-muted)]">{data.control.whyItMatters}</p>
					</div>
					<div class="rounded-[var(--radius)] bg-[var(--info-light)] p-3">
						<p class="mb-1 text-xs font-semibold text-[var(--info)]">
							{m.control_auditor_expects()}
						</p>
						<p class="text-sm text-[var(--foreground-muted)]">{data.control.whatAuditorExpects}</p>
					</div>
				</div>
			</Card>

			<!-- Generate policy panel toggle -->
			<Button variant="secondary" onclick={() => (showPolicyPanel = !showPolicyPanel)}>
				<FileText size={16} />
				{m.control_generate_policy()}
				{#if showPolicyPanel}
					<CaretUp size={14} />
				{:else}
					<CaretDown size={14} />
				{/if}
			</Button>

			{#if showPolicyPanel}
				<Card class="p-4">
					<h3 class="mb-3 text-sm font-semibold text-[var(--foreground)]">
						{m.control_generate_policy_section()}
					</h3>
					<div class="space-y-3">
						<select
							bind:value={selectedPolicyType}
							class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
						>
							{#each allPolicyTypes as pt (pt.value)}
								<option value={pt.value}>{pt.label}</option>
							{/each}
						</select>

						<Button onclick={generatePolicy} disabled={generatingPolicy}>
							{#if generatingPolicy}
								<Spinner size={16} class="animate-spin" />
								{m.control_generating()}
							{:else}
								<FileText size={16} />
								{m.control_generate_button()}
							{/if}
						</Button>

						{#if policyError}
							<p class="text-sm text-[var(--danger)]">{policyError}</p>
						{/if}
					</div>
				</Card>
			{/if}

			<!-- Linked Policies -->
			<Card class="p-6">
				<h2 class="mb-4 font-semibold text-[var(--foreground)]">
					{m.control_linked_policies()} ({linkedPolicies.length})
				</h2>

				{#if linkedPolicies.length === 0}
					<p class="py-4 text-center text-sm text-[var(--foreground-muted)]">
						{m.control_no_linked_policies()}
					</p>
				{:else}
					<div class="space-y-3">
						{#each linkedPolicies as policy (policy.id)}
							<div class="overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">
								<div class="flex items-center justify-between p-3">
									<div class="flex min-w-0 items-center gap-2">
										<FileText size={16} color="var(--brand)" class="shrink-0" />
										<div class="min-w-0">
											<div class="flex items-center gap-2">
												<span class="truncate text-sm font-medium text-[var(--foreground)]">
													{policy.title}
												</span>
												{#if policy.isCustom}
													<Badge variant="info">{m.control_badge_custom()}</Badge>
												{:else}
													<Badge variant="default">{m.control_badge_standard()}</Badge>
												{/if}
											</div>
										</div>
									</div>
									<div class="flex shrink-0 gap-1">
										<Button variant="ghost" size="sm" onclick={() => togglePolicyExpand(policy.id)}>
											{expandedPolicyId === policy.id
												? m.control_policy_hide()
												: m.control_policy_view()}
											{#if expandedPolicyId === policy.id}
												<CaretUp size={12} />
											{:else}
												<CaretDown size={12} />
											{/if}
										</Button>
										<Button variant="ghost" size="sm" onclick={() => downloadPolicy(policy)}>
											<Download size={14} />
											{m.control_policy_download()}
										</Button>
									</div>
								</div>

								{#if expandedPolicyId === policy.id}
									<div class="border-t border-[var(--border)] bg-[var(--background-alt)] p-3">
										<pre
											class="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">{policy.content}</pre>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</Card>
		</div>

		<!-- Right column: Evidence -->
		<div class="space-y-4">
			<Card class="p-6">
				<h2 class="mb-4 font-semibold text-[var(--foreground)]">
					{m.control_evidence_title()} ({evidenceList.length})
				</h2>

				<!-- Upload zone -->
				<div
					class="mb-4 cursor-pointer rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] p-8 text-center transition-colors hover:border-[var(--brand)]"
					onclick={() => fileInput?.click()}
					onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
					role="button"
					tabindex="0"
				>
					<div class="mx-auto mb-2 flex justify-center">
						<Upload size={32} color="var(--foreground-subtle)" />
					</div>
					<p class="text-sm font-medium text-[var(--foreground)]">{m.control_upload_click()}</p>
					<p class="text-xs text-[var(--foreground-muted)]">{m.control_upload_hint()}</p>
					{#if uploading}
						<p class="mt-2 text-xs text-[var(--brand)]">{m.control_uploading()}</p>
					{/if}
				</div>
				<input
					bind:this={fileInput}
					type="file"
					class="hidden"
					onchange={onFileChange}
					accept=".pdf,.png,.jpg,.jpeg,.csv,.docx"
				/>

				<!-- Evidence list -->
				{#if evidenceList.length === 0}
					<p class="py-4 text-center text-sm text-[var(--foreground-muted)]">
						{m.control_no_evidence()}
					</p>
				{:else}
					<div class="space-y-2">
						{#each evidenceList as ev (ev.id)}
							<div
								class="flex items-center justify-between rounded-[var(--radius)] bg-[var(--background-alt)] p-3"
							>
								<div class="flex min-w-0 items-center gap-2">
									<File size={16} color="var(--foreground-muted)" />
									<span class="truncate text-sm text-[var(--foreground)]">{ev.filename}</span>
									<span class="text-xs text-[var(--foreground-subtle)]">
										{(ev.sizeBytes / 1024).toFixed(0)}KB
									</span>
								</div>
								<button
									onclick={() => deleteEvidence(ev.id)}
									class="ml-2 text-[var(--danger)] hover:opacity-70"
									aria-label="Delete evidence"
								>
									<Trash size={14} />
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</Card>
		</div>
	</div>
</div>
