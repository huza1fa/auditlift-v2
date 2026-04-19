<script lang="ts">
	import { onMount } from 'svelte';
	import { FloppyDisk, Spinner, CheckCircle, Info } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { toastSuccess, toastError } from '$lib/stores/toasts.svelte';

	// ── State ────────────────────────────────────────────────────────────────
	let loading = $state(true);
	let saving = $state(false);
	let saved = $state(false);

	let productDescription = $state('');
	let dataFlowType = $state('');
	let dataStorageProviders = $state<string[]>([]);
	let dataStorageRegion = $state('');
	let endpointManagement = $state('');
	let endpointManagementTool = $state('');
	let identityProvider = $state('');
	let keyTools = $state('');
	let additionalContext = $state('');

	// ── Options ───────────────────────────────────────────────────────────────
	const dataFlowOptions = [
		{ value: 'cloud-saas', label: 'Cloud-hosted SaaS', sub: 'Fully hosted in the cloud' },
		{ value: 'on-prem', label: 'On-premises', sub: 'Self-hosted by customers' },
		{ value: 'hybrid', label: 'Hybrid', sub: 'Mix of cloud and on-prem' },
		{ value: 'api-only', label: 'API / Platform', sub: 'Developer-facing service' }
	];

	const storageProviderOptions = ['AWS', 'GCP', 'Azure', 'Cloudflare', 'DigitalOcean', 'Hetzner', 'Other'];

	const endpointOptions = [
		{ value: 'mdm', label: 'MDM', sub: 'Jamf, Kandji, Intune, etc.' },
		{
			value: 'compliance-tool',
			label: 'Compliance tool',
			sub: 'Kolide, Drata Agent, etc.'
		},
		{ value: 'manual', label: 'Manual policies', sub: 'Documented but not enforced by tooling' },
		{ value: 'none', label: 'None yet', sub: 'No endpoint management in place' }
	];

	const idpOptions = [
		'Google Workspace',
		'Okta',
		'Azure AD / Entra',
		'JumpCloud',
		'OneLogin',
		'None'
	];

	// ── Load ──────────────────────────────────────────────────────────────────
	onMount(async () => {
		try {
			const res = await fetch('/api/settings/system-description');
			if (res.ok) {
				const { systemDescription: sd } = await res.json();
				if (sd) {
					productDescription = sd.productDescription ?? '';
					dataFlowType = sd.dataFlowType ?? '';
					dataStorageProviders = sd.dataStorageProviders ?? [];
					dataStorageRegion = sd.dataStorageRegion ?? '';
					endpointManagement = sd.endpointManagement ?? '';
					endpointManagementTool = sd.endpointManagementTool ?? '';
					identityProvider = sd.identityProvider ?? '';
					keyTools = sd.keyTools ?? '';
					additionalContext = sd.additionalContext ?? '';
				}
			}
		} catch {
			// Silently fail on load — form just stays empty
		} finally {
			loading = false;
		}
	});

	// ── Save ──────────────────────────────────────────────────────────────────
	async function save() {
		saving = true;
		try {
			const res = await fetch('/api/settings/system-description', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productDescription,
					dataFlowType,
					dataStorageProviders,
					dataStorageRegion,
					endpointManagement,
					endpointManagementTool,
					identityProvider,
					keyTools,
					additionalContext
				})
			});
			if (!res.ok) throw new Error();
			toastSuccess('System description saved');
			saved = true;
			setTimeout(() => (saved = false), 3000);
		} catch {
			toastError('Failed to save. Please try again.');
		} finally {
			saving = false;
		}
	}

	function toggleStorageProvider(provider: string) {
		if (dataStorageProviders.includes(provider)) {
			dataStorageProviders = dataStorageProviders.filter((p) => p !== provider);
		} else {
			dataStorageProviders = [...dataStorageProviders, provider];
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-lg font-semibold text-[var(--foreground)]">System Description</h2>
		<p class="mt-1 text-sm text-[var(--foreground-muted)]">
			Describe your product, infrastructure, and tools. This information is used to generate
			tailored policies and more accurate questionnaire answers.
		</p>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<Spinner size={24} class="animate-spin" color="var(--foreground-muted)" />
		</div>
	{:else}
		<!-- Product description -->
		<Card class="space-y-5 p-6">
			<div>
				<h3 class="mb-1 text-sm font-semibold text-[var(--foreground)]">What does your product do?</h3>
				<p class="mb-2 text-xs text-[var(--foreground-muted)]">
					A brief description of your product — like the first paragraph of a SOC 2 system description.
				</p>
				<textarea
					bind:value={productDescription}
					placeholder="e.g., Acme provides a cloud-based project management platform for enterprise teams. Customers upload documents, manage workflows, and collaborate in real-time."
					rows={3}
					maxlength={500}
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
				></textarea>
				<p class="mt-1 text-right text-xs text-[var(--foreground-subtle)]">{productDescription.length}/500</p>
			</div>

			<!-- Data flow type -->
			<div>
				<h3 class="mb-2 text-sm font-semibold text-[var(--foreground)]">How does your product operate?</h3>
				<div class="grid grid-cols-2 gap-2">
					{#each dataFlowOptions as opt (opt.value)}
						<button
							onclick={() => (dataFlowType = dataFlowType === opt.value ? '' : opt.value)}
							class="rounded-[var(--radius)] border px-3 py-2.5 text-left text-sm transition-colors {dataFlowType ===
							opt.value
								? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--foreground)]'
								: 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand)]'}"
						>
							<span class="font-medium">{opt.label}</span>
							<span class="mt-0.5 block text-xs text-[var(--foreground-muted)]">{opt.sub}</span>
						</button>
					{/each}
				</div>
			</div>
		</Card>

		<!-- Infrastructure -->
		<Card class="space-y-5 p-6">
			<h3 class="text-sm font-semibold text-[var(--foreground)]">Infrastructure</h3>

			<!-- Cloud providers -->
			<div>
				<p class="mb-2 text-xs font-medium text-[var(--foreground-muted)]">Where is your data stored?</p>
				<div class="flex flex-wrap gap-2">
					{#each storageProviderOptions as provider (provider)}
						<button
							onclick={() => toggleStorageProvider(provider)}
							class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors {dataStorageProviders.includes(
								provider
							)
								? 'border-[var(--brand)] bg-[var(--brand)] text-white'
								: 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand)]'}"
						>
							{provider}
						</button>
					{/each}
				</div>
			</div>

			<!-- Region -->
			<div>
				<p class="mb-2 text-xs font-medium text-[var(--foreground-muted)]">Primary data region</p>
				<input
					type="text"
					bind:value={dataStorageRegion}
					placeholder="e.g., us-east-1, EU (Frankfurt), Australia"
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
				/>
			</div>

			<!-- Identity provider -->
			<div>
				<p class="mb-2 text-xs font-medium text-[var(--foreground-muted)]">Identity provider (SSO)</p>
				<div class="flex flex-wrap gap-2">
					{#each idpOptions as idp (idp)}
						<button
							onclick={() => (identityProvider = identityProvider === idp ? '' : idp)}
							class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors {identityProvider ===
							idp
								? 'border-[var(--brand)] bg-[var(--brand)] text-white'
								: 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand)]'}"
						>
							{idp}
						</button>
					{/each}
				</div>
			</div>
		</Card>

		<!-- Endpoint & tooling -->
		<Card class="space-y-5 p-6">
			<h3 class="text-sm font-semibold text-[var(--foreground)]">Endpoint Management & Tooling</h3>

			<div>
				<p class="mb-2 text-xs font-medium text-[var(--foreground-muted)]">
					How do you manage company devices?
				</p>
				<div class="grid grid-cols-2 gap-2">
					{#each endpointOptions as opt (opt.value)}
						<button
							onclick={() =>
								(endpointManagement = endpointManagement === opt.value ? '' : opt.value)}
							class="rounded-[var(--radius)] border px-3 py-2.5 text-left text-sm transition-colors {endpointManagement ===
							opt.value
								? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--foreground)]'
								: 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand)]'}"
						>
							<span class="font-medium">{opt.label}</span>
							<span class="mt-0.5 block text-xs text-[var(--foreground-muted)]">{opt.sub}</span>
						</button>
					{/each}
				</div>
			</div>

			{#if endpointManagement === 'compliance-tool' || endpointManagement === 'mdm'}
				<div>
					<p class="mb-2 text-xs font-medium text-[var(--foreground-muted)]">
						Which tool do you use?
					</p>
					<input
						type="text"
						bind:value={endpointManagementTool}
						placeholder="e.g., Kolide, Jamf, Kandji, Intune"
						class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
					/>
				</div>
			{/if}

			<!-- Key tools -->
			<div>
				<p class="mb-2 text-xs font-medium text-[var(--foreground-muted)]">
					Key tools your team uses daily
				</p>
				<input
					type="text"
					bind:value={keyTools}
					placeholder="e.g., 1Password, GitHub, Datadog, PagerDuty, Linear, Slack"
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
				/>
			</div>
		</Card>

		<!-- Additional context -->
		<Card class="space-y-4 p-6">
			<div>
				<h3 class="mb-1 text-sm font-semibold text-[var(--foreground)]">Anything else an auditor should know?</h3>
				<p class="mb-2 text-xs text-[var(--foreground-muted)]">
					Compensating controls, upcoming changes, or context that doesn't fit above.
				</p>
				<textarea
					bind:value={additionalContext}
					placeholder="e.g., We don't have an MDM but use Kolide to enforce device compliance checks before granting access. We plan to migrate from Heroku to AWS in Q3."
					rows={3}
					maxlength={1000}
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
				></textarea>
			</div>
		</Card>

		<!-- Info banner -->
		<div class="flex items-start gap-2.5 rounded-[var(--radius)] bg-[var(--info-light)] px-4 py-3">
			<Info size={16} color="var(--info)" class="mt-0.5 shrink-0" />
			<p class="text-xs leading-snug text-[var(--info)]">
				This information is used to tailor policy documents and questionnaire answers to your
				specific environment. The more detail you provide, the more accurate and auditor-ready
				the output will be.
			</p>
		</div>

		<!-- Save button -->
		<div class="flex items-center gap-3">
			<Button onclick={save} disabled={saving}>
				{#if saving}
					<Spinner size={14} class="animate-spin" />
					Saving...
				{:else if saved}
					<CheckCircle size={14} color="var(--success)" />
					Saved
				{:else}
					<FloppyDisk size={14} />
					Save system description
				{/if}
			</Button>
		</div>
	{/if}
</div>
