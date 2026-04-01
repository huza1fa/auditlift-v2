<script lang="ts">
	import { UploadSimple, Trash, FileText, PencilSimple, ChartLine } from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let { data } = $props();

	type Log = (typeof data.logs)[0];

	function actionLabel(action: string): string {
		switch (action) {
			case 'evidence.upload':
				return 'Uploaded evidence';
			case 'evidence.delete':
				return 'Deleted evidence';
			case 'policy.generate':
				return 'Generated policy';
			case 'policy.edit':
				return 'Edited policy';
			default:
				return action;
		}
	}

	function actionIcon(action: string) {
		switch (action) {
			case 'evidence.upload':
				return UploadSimple;
			case 'evidence.delete':
				return Trash;
			case 'policy.generate':
				return FileText;
			case 'policy.edit':
				return PencilSimple;
			default:
				return ChartLine;
		}
	}

	function actionVariant(action: string): 'success' | 'danger' | 'info' | 'default' {
		switch (action) {
			case 'evidence.upload':
				return 'success';
			case 'evidence.delete':
				return 'danger';
			case 'policy.generate':
				return 'info';
			case 'policy.edit':
				return 'default';
			default:
				return 'default';
		}
	}

	function formatTime(date: Date | string): string {
		const d = new Date(date);
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="space-y-4">
	<h2 class="text-base font-semibold text-[var(--foreground)]">ChartLine Log</h2>

	{#if data.logs.length === 0}
		<Card class="p-8 text-center">
			<ChartLine size={40} color="var(--foreground-subtle)" class="mx-auto mb-3" />
			<p class="font-medium text-[var(--foreground)]">No activity yet</p>
			<p class="mt-1 text-sm text-[var(--foreground-muted)]">
				ChartLine will appear here as your team uploads evidence and generates policies.
			</p>
		</Card>
	{:else}
		<Card class="overflow-hidden p-0">
			<div class="divide-y divide-[var(--border)]">
				{#each data.logs as log (log.id)}
					{@const Icon = actionIcon(log.action)}
					<div class="flex items-start gap-4 px-6 py-4">
						<div
							class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--background-alt)]"
						>
							<Icon size={16} color="var(--foreground-muted)" />
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<span class="text-sm font-medium text-[var(--foreground)]">
									{log.userName ?? 'A team member'}
								</span>
								<Badge variant={actionVariant(log.action)}>{actionLabel(log.action)}</Badge>
								{#if log.controlCode}
									<span class="font-mono text-xs text-[var(--foreground-muted)]"
										>{log.controlCode}</span
									>
								{/if}
							</div>
							{#if log.entityName}
								<p class="mt-0.5 truncate text-sm text-[var(--foreground-muted)]">
									{log.entityName}
								</p>
							{/if}
						</div>
						<span class="flex-shrink-0 text-xs text-[var(--foreground-subtle)]"
							>{formatTime(log.createdAt)}</span
						>
					</div>
				{/each}
			</div>
		</Card>
	{/if}
</div>
