<script lang="ts">
	import {
		ArrowLeft,
		ArrowRight,
		FileText,
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
	import FileUploader from '$lib/components/evidence/FileUploader.svelte';
	import * as m from '$lib/paraglide/messages';

	// ── Types ────────────────────────────────────────────────────────────────
	type LinkedPolicy = (typeof data.linkedPolicies)[0];
	type EvidenceItem = {
		id: string;
		filename: string;
		mimeType: string;
		sizeBytes: number;
		createdAt: Date;
	};

	// ── Props ────────────────────────────────────────────────────────────────
	let { data } = $props();

	// ── Policy label map ──────────────────────────────────────────────────────
	const POLICY_LABELS: Record<string, string> = {
		'security-policy': m.control_policy_label_security(),
		'access-control-policy': m.control_policy_label_access_control(),
		'password-policy': m.control_policy_label_password(),
		'acceptable-use-policy': m.control_policy_label_acceptable_use(),
		'incident-response-policy': m.control_policy_label_incident_response(),
		'change-management-policy': m.control_policy_label_change_management(),
		'vulnerability-management-policy': m.control_policy_label_vulnerability_management(),
		'physical-security-policy': m.control_policy_label_physical_security(),
		'data-classification-policy': m.control_policy_label_data_classification(),
		'data-retention-policy': m.control_policy_label_data_retention(),
		'privacy-policy': m.control_policy_label_privacy(),
		'business-continuity-policy': m.control_policy_label_business_continuity(),
		'vendor-management-policy': m.control_policy_label_vendor_management(),
		'cryptography-policy': m.control_policy_label_cryptography(),
		'remote-work-policy': m.control_policy_label_remote_work(),
		'ai-usage-policy': m.control_policy_label_ai_usage()
	};

	// ── Policy types for the full dropdown fallback ───────────────────────────
	const allPolicyTypes = Object.entries(POLICY_LABELS).map(([value, label]) => ({ value, label }));

	// ── Smart policy suggestions ──────────────────────────────────────────────
	function getSuggestedPolicies(code: string): string[] {
		const prefix = code.split('.')[0].toUpperCase();
		const map: Record<string, string[]> = {
			// SOC2
			CC1: ['security-policy', 'acceptable-use-policy'],
			CC2: ['security-policy'],
			CC3: ['security-policy'],
			CC4: ['vulnerability-management-policy'],
			CC5: ['change-management-policy', 'security-policy'],
			CC6: ['access-control-policy', 'password-policy'],
			CC7: ['incident-response-policy', 'change-management-policy'],
			CC8: ['change-management-policy'],
			CC9: ['vendor-management-policy', 'business-continuity-policy'],
			A1: ['business-continuity-policy'],
			C1: ['data-classification-policy', 'data-retention-policy'],
			// PCI
			REQ1: ['security-policy'],
			REQ3: ['data-classification-policy', 'cryptography-policy'],
			REQ7: ['access-control-policy', 'password-policy'],
			REQ9: ['physical-security-policy'],
			REQ12: ['security-policy'],
			// ISO 27001
			A5: ['security-policy'],
			A6: ['acceptable-use-policy'],
			A8: ['data-classification-policy', 'data-retention-policy'],
			A9: ['access-control-policy', 'password-policy'],
			A10: ['cryptography-policy'],
			A11: ['physical-security-policy'],
			A12: ['change-management-policy', 'vulnerability-management-policy'],
			A15: ['vendor-management-policy'],
			A16: ['incident-response-policy'],
			A17: ['business-continuity-policy']
		};
		return map[prefix] ?? ['security-policy'];
	}

	// ── Upload guidance ───────────────────────────────────────────────────────
	function getUploadGuidance(category: string, code: string): string {
		const cat = category.toLowerCase();
		if (cat.includes('access') || code.startsWith('CC6'))
			return m.control_upload_guidance_access();
		if (cat.includes('incident') || code.startsWith('CC7'))
			return m.control_upload_guidance_incident();
		if (cat.includes('change') || code.startsWith('CC8'))
			return m.control_upload_guidance_change();
		if (cat.includes('vendor') || code.startsWith('CC9'))
			return m.control_upload_guidance_vendor();
		if (cat.includes('data') || cat.includes('privacy'))
			return m.control_upload_guidance_data();
		if (cat.includes('physical'))
			return m.control_upload_guidance_physical();
		if (cat.includes('crypto'))
			return m.control_upload_guidance_crypto();
		return m.control_upload_guidance_default();
	}

	// ── Local state ──────────────────────────────────────────────────────────
	let evidenceList = $state<EvidenceItem[]>([...data.evidenceList]);
	let linkedPolicies = $state<LinkedPolicy[]>([...data.linkedPolicies]);

	// ── Derived: completion status ────────────────────────────────────────────
	const isComplete = $derived(evidenceList.length > 0 || linkedPolicies.length > 0);

	// ── Policy generation state ───────────────────────────────────────────────
	let showPolicyPanel = $state(data.linkedPolicies.length === 0);
	let generatingPolicy = $state(false);
	let policyError = $state('');
	let expandedPolicyId = $state<string | null>(null);
	let showAllPolicies = $state(false);

	// ── Suggested policies ────────────────────────────────────────────────────
	const suggestedTypes = $derived(getSuggestedPolicies(data.control.code));
	let selectedPolicyType = $state(getSuggestedPolicies(data.control.code)[0]);

	// ── Helpers ──────────────────────────────────────────────────────────────
	async function deleteEvidence(id: string) {
		await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
		evidenceList = evidenceList.filter((ev) => ev.id !== id);
	}

	function handleUploadSuccess(newEvidence: { id: string; filename: string; sizeBytes: number }) {
		const evidenceItem: EvidenceItem = {
			id: newEvidence.id,
			filename: newEvidence.filename,
			mimeType: '',
			sizeBytes: newEvidence.sizeBytes,
			createdAt: new Date()
		};
		evidenceList = [evidenceItem, ...evidenceList];
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

	<!-- Completion status banner -->
	{#if isComplete}
		<div
			class="flex items-center gap-2 rounded-[var(--radius)] border border-[var(--success)] bg-[var(--success-light)] px-4 py-3 text-sm font-medium text-[var(--success)]"
		>
			✓ Control complete — this control has evidence or a policy attached
		</div>
	{:else}
		<div
			class="flex items-center gap-2 rounded-[var(--radius)] border border-[var(--warning)] bg-[var(--warning-light)] px-4 py-3 text-sm font-medium text-[var(--warning)]"
		>
			⚠ Incomplete — upload evidence or generate a policy to complete this control
		</div>
	{/if}

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
						<!-- Suggested policy pills -->
						<div>
							<p class="mb-2 text-xs text-[var(--foreground-muted)]">Suggested for this control</p>
							<div class="flex flex-wrap gap-2">
								{#each suggestedTypes as type, i (type)}
									<button
										onclick={() => (selectedPolicyType = type)}
										class="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors {selectedPolicyType === type
											? 'border-[var(--brand)] bg-[var(--brand)] text-white'
											: 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand)] hover:text-[var(--brand)]'}"
									>
										{#if i === 0}
											<span
												class="rounded px-1 py-0.5 text-[10px] font-semibold {selectedPolicyType === type
													? 'bg-white/20 text-white'
													: 'bg-[var(--brand-light)] text-[var(--brand)]'}"
											>
												Suggested
											</span>
										{/if}
										{POLICY_LABELS[type] ?? type}
									</button>
								{/each}
							</div>
						</div>

						<!-- Show all policies toggle -->
						<button
							onclick={() => (showAllPolicies = !showAllPolicies)}
							class="text-xs text-[var(--brand)] hover:underline"
						>
							{showAllPolicies ? 'Hide all policies' : 'Show all policies'}
						</button>

						{#if showAllPolicies}
							<select
								bind:value={selectedPolicyType}
								class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
							>
								{#each allPolicyTypes as pt (pt.value)}
									<option value={pt.value}>{pt.label}</option>
								{/each}
							</select>
						{/if}

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

				<FileUploader controlId={data.control.id} onUploadSuccess={handleUploadSuccess} />

				<!-- Upload guidance hint -->
				<p class="mt-2 text-xs text-[var(--foreground-muted)]">
					{getUploadGuidance(data.control.category, data.control.code)}
				</p>

				<!-- Evidence list -->
				{#if evidenceList.length === 0}
					<p class="py-4 text-center text-sm text-[var(--foreground-muted)]">
						{m.control_no_evidence()}
					</p>
				{:else}
					<div class="mt-4 space-y-2">
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

	<!-- Next incomplete control navigation -->
	{#if data.nextIncompleteControl}
		<div
			class="flex items-center justify-between rounded-[var(--radius)] bg-[var(--background-alt)] px-4 py-3"
		>
			<span class="text-sm text-[var(--foreground-muted)]">Keep going</span>
			<a
				href="/controls/{data.nextIncompleteControl.id}"
				class="flex items-center gap-2 text-sm font-medium text-[var(--brand)] hover:underline"
			>
				Next incomplete: <span class="font-mono">{data.nextIncompleteControl.code}</span> — {data
					.nextIncompleteControl.title}
				<ArrowRight size={14} />
			</a>
		</div>
	{/if}
</div>
