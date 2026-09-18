<script lang="ts">
	import type { Question } from '$lib/types.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import { caseStudyFor } from '$lib/examine.js';
	import CaseStudyBlock from './CaseStudyBlock.svelte';

	interface Props {
		question: Question;
		/**
		 * The number is the source set's, so it doubles as the cross-reference on
		 * the results screen. Session views hide it while questions are shuffled —
		 * otherwise "Q 07 → Q 02" advertises the shuffled order.
		 */
		showNumber?: boolean;
		/** Results only — the verdict for this question, stated as text, not colour alone. */
		status?: 'correct' | 'incorrect' | 'unanswered';
		flagged?: boolean;
		onToggleFlag?: () => void;
	}

	let { question, showNumber = true, status, flagged = false, onToggleFlag }: Props = $props();

	const statusLabel = $derived(
		status === 'correct' ? 'Correct' : status === 'incorrect' ? 'Incorrect' : 'Not answered'
	);

	const caseStudy = $derived(
		examineState.questionSet ? caseStudyFor(examineState.questionSet, question) : undefined
	);
</script>

<div class="question-card">
	{#if showNumber || status || onToggleFlag}
		<div class="question-header">
			{#if showNumber}
				<span class="question-number">Q {String(question.number).padStart(2, '0')}</span>
			{/if}
			{#if status}
				<span class="question-status" class:correct={status === 'correct'} class:incorrect={status === 'incorrect'}>
					{statusLabel}
					{#if status !== 'unanswered'}
						<span aria-hidden="true">{status === 'correct' ? '✓' : '✕'}</span>
					{/if}
				</span>
			{/if}
			{#if onToggleFlag}
				<button
					class="flag-btn"
					class:active={flagged}
					aria-pressed={flagged}
					onclick={onToggleFlag}
				>
					{flagged ? 'Flagged for revisit' : 'Flag for revisit'}
				</button>
			{/if}
		</div>
	{/if}
	{#if caseStudy}
		<CaseStudyBlock {caseStudy} />
	{/if}
	<p class="question-stem">{question.content.stem}</p>
</div>

<style>
	.question-card {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.question-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.question-number {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
	}

	.question-status {
		/* Holds right even when the number is hidden. */
		margin-left: auto;
		display: inline-flex;
		align-items: baseline;
		gap: 0.3rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-ink-muted);
	}

	.question-status.correct {
		color: var(--color-add);
	}

	.question-status.incorrect {
		color: var(--color-del);
	}

	.flag-btn {
		/* Holds the button right even when the number is hidden. */
		margin-left: auto;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-ink-muted);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		transition: color 200ms ease, background-color 200ms ease;
	}

	.flag-btn:hover {
		color: var(--color-ink);
		background-color: var(--color-surface-alt);
	}

	.flag-btn.active {
		color: var(--color-accent);
	}

	.flag-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.question-stem {
		font-size: var(--prose-size, 1.125rem);
		line-height: var(--prose-lh, 1.65);
		font-weight: 400;
		color: var(--color-ink);
		margin: 0;
	}
</style>
