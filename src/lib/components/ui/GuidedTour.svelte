<script lang="ts">
	import { X, ArrowRight } from 'phosphor-svelte';

	interface TourStep {
		target: string;
		title: string;
		body: string;
	}

	interface Props {
		steps: TourStep[];
		onComplete: () => void;
	}

	let { steps, onComplete }: Props = $props();

	let currentStep = $state(0);
	let targetRect = $state<DOMRect | null>(null);

	const tooltipStyle = $derived(
		targetRect
			? `position:fixed; top:${targetRect.bottom + 12}px; left:${Math.max(12, targetRect.left)}px;`
			: 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);'
	);

	$effect(() => {
		// Remove highlight from all previously highlighted elements
		document.querySelectorAll('.tour-highlight').forEach((el) => {
			el.classList.remove('tour-highlight');
		});

		const el = document.querySelector(steps[currentStep].target);
		if (!el) return;

		el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		targetRect = el.getBoundingClientRect();

		el.classList.add('tour-highlight');

		return () => {
			el.classList.remove('tour-highlight');
		};
	});

	function next() {
		if (currentStep < steps.length - 1) {
			currentStep += 1;
		} else {
			onComplete();
		}
	}

	const isLastStep = $derived(currentStep === steps.length - 1);
</script>

<!-- Backdrop -->
<div
	style="position:fixed; inset:0; background:rgba(0,0,0,0.3); z-index:40;"
	aria-hidden="true"
></div>

<!-- Tooltip card -->
<div
	style={tooltipStyle}
	style:z-index="50"
	class="w-72 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background-elevated)] p-5 shadow-[var(--shadow-lg)]"
	role="dialog"
	aria-modal="true"
	aria-label={steps[currentStep].title}
>
	<!-- Step counter -->
	<p class="mb-2 text-[11px] font-medium tracking-wide text-[var(--foreground-subtle)] uppercase">
		Step {currentStep + 1} of {steps.length}
	</p>

	<!-- Title -->
	<h3 class="mb-1.5 text-[14px] font-semibold text-[var(--foreground)]">
		{steps[currentStep].title}
	</h3>

	<!-- Body -->
	<p class="mb-4 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
		{steps[currentStep].body}
	</p>

	<!-- Actions -->
	<div class="flex items-center justify-between gap-2">
		<button
			onclick={onComplete}
			class="flex cursor-pointer items-center gap-1.5 rounded-[var(--radius)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]"
		>
			<X size={13} />
			Skip tour
		</button>

		<button
			onclick={next}
			class="flex cursor-pointer items-center gap-1.5 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
		>
			{isLastStep ? 'Done' : 'Next'}
			<ArrowRight size={13} />
		</button>
	</div>
</div>

<style>
	:global(.tour-highlight) {
		outline: 2px solid var(--brand);
		outline-offset: 3px;
		border-radius: 6px;
		position: relative;
		z-index: 41;
	}
</style>
