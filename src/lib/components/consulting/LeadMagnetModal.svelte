<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Check, Download } from 'phosphor-svelte';
	import { captureEvent } from '$lib/posthog';

	let {
		open = $bindable(false),
		resource = $bindable<'soc2-checklist' | 'security-review-template' | null>(null)
	}: {
		open?: boolean;
		resource?: 'soc2-checklist' | 'security-review-template' | null;
	} = $props();

	let name = $state('');
	let email = $state('');
	let company = $state('');

	let submitting = $state(false);
	let submitted = $state(false);
	let errorMessage = $state('');

	const resourceMeta: Record<
		'soc2-checklist' | 'security-review-template',
		{ title: string; description: string; filename: string }
	> = {
		'soc2-checklist': {
			title: 'Free SOC 2 Checklist for SaaS Startups',
			description:
				'A practical 47-point checklist covering the policies, evidence, and controls you need before your first SOC 2 audit.',
			filename: 'Auditlift-SOC2-Checklist-SaaS-Startups.md'
		},
		'security-review-template': {
			title: '10-Question Enterprise Security Review Template',
			description:
				'The exact 10 questions every enterprise buyer asks first. Use this template to pre-answer them before the questionnaire lands.',
			filename: 'Auditlift-10-Question-Enterprise-Security-Review.md'
		}
	};

	function resetForm() {
		name = '';
		email = '';
		company = '';
		submitting = false;
		submitted = false;
		errorMessage = '';
	}

	function currentMeta() {
		return resource ? resourceMeta[resource] : null;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!resource) return;
		submitting = true;
		errorMessage = '';
		captureEvent('lead_magnet_submitted', { resource });

		try {
			const res = await fetch('/api/lead-magnet', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim().toLowerCase(),
					company: company.trim() || null,
					resource
				})
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				errorMessage = data?.message ?? 'Something went wrong. Please try again.';
				return;
			}

			const data = await res.json();
			submitted = true;

			// Trigger download
			if (data.downloadUrl) {
				const a = document.createElement('a');
				a.href = data.downloadUrl;
				a.download = currentMeta()?.filename ?? 'download.md';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
		} catch {
			errorMessage = 'Network error. Please check your connection and try again.';
		} finally {
			submitting = false;
		}
	}

	$effect(() => {
		if (!open) {
			const timeout = setTimeout(resetForm, 300);
			return () => clearTimeout(timeout);
		}
	});
</script>

<Dialog
	bind:open
	title={currentMeta()?.title ?? 'Download'}
	description={currentMeta()?.description ?? ''}
>
	{#if submitted}
		<div class="flex flex-col items-center gap-3 py-6 text-center">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-light)]"
			>
				<Check size={24} weight="bold" class="text-[var(--success)]" />
			</div>
			<h3 class="text-lg font-semibold text-[var(--foreground)]">Check your downloads</h3>
			<p class="text-sm text-[var(--foreground-muted)]">
				Your document is downloading. We have also sent a copy to <strong>{email}</strong>.
			</p>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<Input label="Full name" bind:value={name} required />
			<Input label="Work email" type="email" bind:value={email} required />
			<Input label="Company (optional)" bind:value={company} />

			<button
				type="submit"
				disabled={submitting}
				class="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if submitting}
					Sending...
				{:else}
					<Download size={16} />
					Download free
				{/if}
			</button>

			{#if errorMessage}
				<p class="text-center text-sm text-[var(--danger)]">{errorMessage}</p>
			{/if}

			<p class="text-center text-xs text-[var(--foreground-subtle)]">
				No spam. Unsubscribe anytime. We use your email to send the document and occasional product
				updates.
			</p>
		</form>
	{/if}
</Dialog>
