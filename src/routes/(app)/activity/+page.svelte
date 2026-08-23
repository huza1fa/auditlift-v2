<script lang="ts">
	import {
		ArrowLeft,
		ClockCounterClockwise,
		FileText,
		FolderOpen,
		ChatDots,
		DownloadSimple,
		Gear,
		ShieldCheck,
		Users,
		PencilSimple
	} from 'phosphor-svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface ActivityEntry {
		id: string;
		action: string;
		entityType: string;
		entityName: string | null;
		controlCode: string | null;
		details: string | null;
		userName: string | null;
		createdAt: string;
	}

	let { data } = $props();

	function actionMeta(action: string): {
		label: string;
		icon: typeof FileText;
		color: string;
		bg: string;
	} {
		if (action.startsWith('evidence.upload'))
			return {
				label: 'Uploaded evidence',
				icon: FolderOpen,
				color: 'var(--success)',
				bg: 'var(--success-light)'
			};
		if (action.startsWith('evidence.delete'))
			return {
				label: 'Deleted evidence',
				icon: FolderOpen,
				color: 'var(--danger)',
				bg: 'var(--danger-light)'
			};
		if (action.startsWith('evidence.download'))
			return {
				label: 'Downloaded evidence',
				icon: FolderOpen,
				color: 'var(--info)',
				bg: 'var(--info-light)'
			};
		if (action.startsWith('policy.generate'))
			return {
				label: 'Generated policy',
				icon: FileText,
				color: 'var(--brand)',
				bg: 'var(--brand-light)'
			};
		if (action.startsWith('policy.edit'))
			return {
				label: 'Edited policy',
				icon: PencilSimple,
				color: 'var(--info)',
				bg: 'var(--info-light)'
			};
		if (action.startsWith('policy.archive'))
			return {
				label: 'Archived policy',
				icon: FileText,
				color: 'var(--warning)',
				bg: 'var(--warning-light)'
			};
		if (action.startsWith('policy.restore'))
			return {
				label: 'Restored policy',
				icon: FileText,
				color: 'var(--success)',
				bg: 'var(--success-light)'
			};
		if (action.startsWith('policy.download'))
			return {
				label: 'Downloaded policy PDF',
				icon: DownloadSimple,
				color: 'var(--info)',
				bg: 'var(--info-light)'
			};
		if (action.startsWith('questionnaire.share'))
			return {
				label: 'Enabled share link',
				icon: ChatDots,
				color: 'var(--info)',
				bg: 'var(--info-light)'
			};
		if (action.startsWith('questionnaire.unshare'))
			return {
				label: 'Disabled share link',
				icon: ChatDots,
				color: 'var(--warning)',
				bg: 'var(--warning-light)'
			};
		if (action === 'questionnaire.export')
			return {
				label: 'Exported questionnaire answers',
				icon: DownloadSimple,
				color: 'var(--info)',
				bg: 'var(--info-light)'
			};
		if (action === 'export.created')
			return {
				label: 'Created auditor export',
				icon: DownloadSimple,
				color: 'var(--info)',
				bg: 'var(--info-light)'
			};
		if (action === 'team.invited')
			return {
				label: 'Invited a teammate',
				icon: Users,
				color: 'var(--brand)',
				bg: 'var(--brand-light)'
			};
		if (action === 'team.role_changed')
			return {
				label: 'Changed a team role',
				icon: Users,
				color: 'var(--warning)',
				bg: 'var(--warning-light)'
			};
		if (action === 'team.removed')
			return {
				label: 'Removed a teammate',
				icon: Users,
				color: 'var(--danger)',
				bg: 'var(--danger-light)'
			};
		if (action === 'team.joined')
			return {
				label: 'Joined the organization',
				icon: Users,
				color: 'var(--success)',
				bg: 'var(--success-light)'
			};
		if (action === 'framework.activated')
			return {
				label: 'Activated framework',
				icon: ShieldCheck,
				color: 'var(--success)',
				bg: 'var(--success-light)'
			};
		if (action === 'framework.deactivated')
			return {
				label: 'Deactivated framework',
				icon: ShieldCheck,
				color: 'var(--warning)',
				bg: 'var(--warning-light)'
			};
		return {
			label: action,
			icon: Gear,
			color: 'var(--foreground-muted)',
			bg: 'var(--background-alt)'
		};
	}

	function relativeTime(dateStr: string): string {
		const diffMs = Date.now() - new Date(dateStr).getTime();
		const minutes = Math.floor(diffMs / 60000);
		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		return new Date(dateStr).toLocaleDateString();
	}

	function fullDate(dateStr: string): string {
		return new Date(dateStr).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-[var(--foreground)]">Activity</h1>
		<a
			href="/dashboard"
			class="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
		>
			<ArrowLeft size={16} /> Dashboard
		</a>
	</div>

	<p class="-mt-3 text-sm text-[var(--foreground-muted)]">
		A complete history of everything happening in your organization — useful for audits and security
		reviews.
	</p>

	{#if data.activities.length === 0}
		<Card class="p-12 text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-alt)]"
			>
				<ClockCounterClockwise size={32} color="var(--foreground-subtle)" />
			</div>
			<p class="text-base font-semibold text-[var(--foreground)]">No activity yet</p>
			<p class="mt-1.5 text-sm text-[var(--foreground-muted)]">
				Actions like generating policies, uploading evidence, and sharing questionnaires will appear
				here.
			</p>
		</Card>
	{:else}
		<Card class="divide-y divide-[var(--border)] p-0">
			{#each data.activities as entry (entry.id)}
				{@const meta = actionMeta(entry.action)}
				<div class="flex items-start gap-3 px-4 py-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] {meta.bg}"
					>
						<meta.icon size={15} color={meta.color} />
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-sm text-[var(--foreground)]">
							<span class="font-medium">{meta.label}</span>
							{#if entry.entityName}
								<span class="text-[var(--foreground-muted)]">— {entry.entityName}</span>
							{/if}
							{#if entry.controlCode}
								<span
									class="ml-1 rounded bg-[var(--background-alt)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--foreground-muted)]"
									>{entry.controlCode}</span
								>
							{/if}
						</p>
						{#if entry.details}
							<p class="truncate text-xs text-[var(--foreground-subtle)]" title={entry.details}>
								{entry.details}
							</p>
						{/if}
						<p class="mt-0.5 text-xs text-[var(--foreground-subtle)]">
							{entry.userName ?? 'Unknown user'} ·
							<span title={fullDate(entry.createdAt)}>{relativeTime(entry.createdAt)}</span>
						</p>
					</div>
				</div>
			{/each}
		</Card>
	{/if}
</div>
