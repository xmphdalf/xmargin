<script lang="ts">
	import type { AnswerValue, Question } from '$lib/types.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import { isHotspot, requiredSelectionCount, selectionCount, toggleSelection } from '$lib/examine.js';
	import QuestionCard from './QuestionCard.svelte';
	import QuestionOptions from './QuestionOptions.svelte';
	import QuestionFrame from './QuestionFrame.svelte';
	import ProgressIndicator from './ProgressIndicator.svelte';

	interface Props {
		questions: Question[];
	}

	let { questions }: Props = $props();

	const index = $derived(examineState.session?.currentIndex ?? 0);
	const question = $derived(questions[index]);

	let selected = $state<AnswerValue | undefined>(undefined);
	let revealed = $state(false);
	let revealedIndices = $state<Set<number>>(new Set());

	const required = $derived(question ? requiredSelectionCount(question) : 1);
	const picked = $derived(question ? selectionCount(question, selected) : 0);
	const canReveal = $derived(picked === required);

	const revealLabel = $derived.by(() => {
		if (canReveal) return 'Reveal answer';
		const remaining = required - picked;
		if (question && isHotspot(question)) {
			return picked === 0
				? `Answer all ${required} rows`
				: `${remaining} row${remaining === 1 ? '' : 's'} left`;
		}
		if (picked === 0) return required === 1 ? 'Select an answer' : `Select ${required}`;
		return `Select ${remaining} more`;
	});

	function handleSelect(key: string, rowIndex?: number) {
		if (!question || revealed) return;
		selected = toggleSelection(question, selected, key, rowIndex);
	}

	function reveal() {
		revealed = true;
		revealedIndices = new Set([...revealedIndices, index]);
	}

	function goTo(i: number) {
		if (i < 0 || i >= questions.length) return;
		selected = undefined;
		revealed = false;
		examineState.goTo(i);
	}
</script>

{#if question}
	<div class="reflect-mode">
		<ProgressIndicator count={questions.length} currentIndex={index} answeredIndices={revealedIndices} />

		{#key index}
			<QuestionFrame>
				<QuestionCard {question} />
				<QuestionOptions {question} {selected} {revealed} interactive={!revealed} onSelect={handleSelect} />
				{#if !revealed}
					<button class="nav-button primary reveal-btn" disabled={!canReveal} onclick={reveal}>
						{revealLabel}
					</button>
				{/if}
			</QuestionFrame>
		{/key}

		<div class="nav-row">
			<button class="nav-button" disabled={index === 0} onclick={() => goTo(index - 1)}>
				← Previous
			</button>
			<button class="nav-button" disabled={index === questions.length - 1} onclick={() => goTo(index + 1)}>
				Next →
			</button>
		</div>
	</div>
{/if}

<style>
	.reflect-mode {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.reveal-btn {
		align-self: flex-start;
	}

	.nav-row {
		display: flex;
		justify-content: space-between;
	}

	.nav-button {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface);
		color: var(--color-ink);
		cursor: pointer;
		transition: border-color 200ms ease, background-color 200ms ease, opacity 200ms ease;
	}

	.nav-button:hover:not(:disabled) {
		border-color: var(--color-ink);
		background: var(--color-surface-alt);
	}

	.nav-button.primary {
		background: var(--color-ink);
		color: var(--color-surface);
		border-color: var(--color-ink);
	}

	.nav-button.primary:hover:not(:disabled) {
		opacity: 0.85;
	}

	.nav-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.nav-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
