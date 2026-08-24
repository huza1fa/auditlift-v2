<script lang="ts">
	import { ShieldCheck, Spinner } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { toastError, toastSuccess } from '$lib/stores/toasts.svelte';
	import * as m from '$lib/paraglide/messages';

	interface Framework {
		id: string;
		slug: string;
		name: string;
		description: string;
		active: boolean;
		recommended?: boolean | null;
	}

	let { data } = $props();
	const canManageFrameworks = $derived(data.canManageFrameworks === true);

	// svelte-ignore state_referenced_locally
	let frameworks = $state<Framework[]>(
		data.frameworks.map((f) => ({
			id: f.id,
			slug: f.slug,
			name: f.name,
			description: f.description,
			active: f.active,
			recommended: f.recommended ?? null
		}))
	);
	let busySlug = $state<string | null>(null);

	async function toggle(framework: Framework) {
		if (busySlug) return;
		busySlug = framework.slug;
		const activating = !framework.active;
		try {
			const res = await fetch('/api/onboarding/framework', {
				method: activating ? 'POST' : 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ frameworkSlug: framework.slug })
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error((body as { message?: string }).message ?? 'Request failed');
			}
			frameworks = frameworks.map((f) =>
				f.id === framework.id ? { ...f, active: activating } : f
			);
			toastSuccess(activating ? `${framework.name} activated` : `${framework.name} deactivated`);
		} catch (err) {
			toastError(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			busySlug = null;
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-[var(--foreground)]">Compliance Frameworks</h1>
		<p class="mt-1 text-sm text-[var(--foreground-muted)]">
			Activate as many frameworks as you need. Policies, evidence, and questionnaire answers count
			toward every active framework at once.
		</p>
		{#if !canManageFrameworks}
			<p class="mt-2 text-sm text-[var(--foreground-subtle)]">
				Only organization admins can change active frameworks.
			</p>
		{/if}
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		{#each frameworks as framework (framework.id)}
			<Card class="flex flex-col p-6">
				<div class="mb-3 flex items-start justify-between">
					<ShieldCheck size={24} color="var(--brand)" weight="fill" />
					{#if framework.recommended}
						<Badge variant="info">{m.frameworks_most_popular()}</Badge>
					{/if}
				</div>
				<h2 class="mb-1 font-semibold text-[var(--foreground)]">{framework.name}</h2>
				<p class="mb-4 text-sm text-[var(--foreground-muted)]">{framework.description}</p>
				<div class="mt-auto">
					{#if framework.active}
						<div class="flex items-center gap-2">
							<Badge variant="success">Active</Badge>
							{#if canManageFrameworks}
								<Button
									variant="secondary"
									size="sm"
									disabled={busySlug !== null}
									onclick={() => toggle(framework)}
								>
									{#if busySlug === framework.slug}
										<Spinner size={14} class="animate-spin" />
									{:else}
										Deactivate
									{/if}
								</Button>
							{/if}
						</div>
					{:else if canManageFrameworks}
						<Button
							variant="secondary"
							size="sm"
							disabled={busySlug !== null}
							onclick={() => toggle(framework)}
						>
							{#if busySlug === framework.slug}
								<Spinner size={14} class="animate-spin" />
							{:else}
								Activate
							{/if}
						</Button>
					{/if}
				</div>
			</Card>
		{/each}
	</div>
</div>
