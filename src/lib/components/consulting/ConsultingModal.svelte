<script lang="ts">
	import type { Snippet } from 'svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Check } from 'phosphor-svelte';
	import * as m from '$lib/paraglide/messages';
	import { captureEvent } from '$lib/posthog';

	let {
		open = $bindable(false),
		trigger
	}: {
		open?: boolean;
		trigger?: Snippet;
	} = $props();

	let name = $state('');
	let email = $state('');
	let company = $state('');
	let topic = $state('');
	let message = $state('');

	let submitting = $state(false);
	let submitted = $state(false);
	let errorMessage = $state('');

	const topics: { value: string; label: () => string }[] = [
		{ value: 'questionnaire-help', label: m.consulting_topic_questionnaire },
		{ value: 'soc2-readiness', label: m.consulting_topic_soc2 },
		{ value: 'iso27001-readiness', label: m.consulting_topic_iso27001 },
		{ value: 'vciso-advisory', label: m.consulting_topic_vciso },
		{ value: 'general-compliance', label: m.consulting_topic_general },
		{ value: 'other', label: m.consulting_topic_other }
	];

	function resetForm() {
		name = '';
		email = '';
		company = '';
		topic = '';
		message = '';
		submitting = false;
		submitted = false;
		errorMessage = '';
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		errorMessage = '';
		captureEvent('consulting_form_submitted', { topic, has_company: !!company.trim() });

		try {
			const res = await fetch('/api/consulting/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, company, topic, message })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				errorMessage = data?.message ?? 'Something went wrong. Please try again.';
				return;
			}

			submitted = true;
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
	title={m.consulting_modal_title()}
	description={m.consulting_modal_description()}
	{trigger}
>
	{#if submitted}
		<div class="flex flex-col items-center gap-3 py-6 text-center">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-light)]"
			>
				<Check size={24} weight="bold" class="text-[var(--success)]" />
			</div>
			<h3 class="text-lg font-semibold text-[var(--foreground)]">
				{m.consulting_success_title()}
			</h3>
			<p class="text-sm text-[var(--foreground-muted)]">
				{m.consulting_success_body()}
			</p>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<Input label={m.consulting_field_name()} bind:value={name} required />

			<Input label={m.consulting_field_email()} type="email" bind:value={email} required />

			<Input label={m.consulting_field_company()} bind:value={company} />

			<div class="flex flex-col gap-1">
				<label for="consulting-topic" class="text-sm font-medium text-[var(--foreground)]">
					{m.consulting_field_topic()}<span class="ml-0.5 text-[var(--danger)]">*</span>
				</label>
				<select
					id="consulting-topic"
					bind:value={topic}
					required
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
				>
					<option value="" disabled>{m.consulting_field_topic()}</option>
					{#each topics as t (t.value)}
						<option value={t.value}>{t.label()}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-col gap-1">
				<label for="consulting-message" class="text-sm font-medium text-[var(--foreground)]">
					{m.consulting_field_message()}
				</label>
				<textarea
					id="consulting-message"
					bind:value={message}
					rows={3}
					placeholder={m.consulting_field_message_placeholder()}
					class="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none"
				></textarea>
			</div>

			<Button variant="primary" type="submit" class="w-full" disabled={submitting}>
				{#if submitting}
					{m.consulting_submitting()}
				{:else}
					{m.consulting_submit()}
				{/if}
			</Button>

			{#if errorMessage}
				<p class="text-center text-sm text-[var(--danger)]">{errorMessage}</p>
			{/if}
		</form>
	{/if}
</Dialog>
