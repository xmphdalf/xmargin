<script lang="ts">
	import type { Question } from '$lib/types.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import QuestionCard from './QuestionCard.svelte';
	import QuestionOptions from './QuestionOptions.svelte';

	interface Props {
		questions: Question[];
		onRetake: () => void;
		onLoadNewSet: () => void;
	}

	let { questions, onRetake, onLoadNewSet }: Props = $props();

	const session = $derived(examineState.session!);

	const correctCount = $derived(questions.filter((q) => session.answers[q.id]?.isCorrect).length);

	/**
	 * Stated separately so an unanswered question never reads as a wrong one —
	 * both Reflect and Examine can be finished before every question is attempted.
	 */
	const unansweredCount = $derived(questions.filter((q) => !session.answers[q.id]).length);

	const revisitNumbers = $derived.by(() => {
		const nums = new Set<number>();
		for (const q of questions) {
			const answer = session.answers[q.id];
			if ((answer && !answer.isCorrect) || session.flagged.includes(q.id)) nums.add(q.number);
		}
		return [...nums].sort((a, b) => a - b);
	});

	const elapsedLabel = $derived.by(() => {
		if (!session.startedAt || !session.finishedAt) return '';
		const totalSeconds = Math.floor((session.finishedAt - session.startedAt) / 1000);
		const m = Math.floor(totalSeconds / 60);
		const s = totalSeconds % 60;
		return `${m}:${String(s).padStart(2, '0')}`;
	});
</script>

<div class="results">
	<p class="results-meta">
		{session.setTitle} ({questions.length} question{questions.length === 1 ? '' : 's'})
		{#if elapsedLabel}
			· Completed in {elapsedLabel}
		{/if}
	</p>

	<p class="results-summary">You answered {correctCount} of {questions.length} correctly.</p>

	{#if unansweredCount > 0}
		<p class="results-note">
			{unansweredCount} question{unansweredCount === 1 ? '' : 's'} left unanswered.
		</p>
	{/if}

	{#each questions as question, i}
		{#if i > 0}<div class="rule"></div>{/if}
		<div class="question-block">
			<QuestionCard {question} />
			<QuestionOptions {question} selected={session.answers[question.id]?.selected} revealed />
		</div>
	{/each}

	{#if revisitNumbers.length > 0}
		<div class="rule"></div>
		<p class="revisit">
			Questions to revisit: {revisitNumbers.map((n) => `Q${String(n).padStart(2, '0')}`).join(', ')}
		</p>
	{/if}

	<div class="actions">
		<button class="nav-button" onclick={onRetake}>Retake</button>
		<button class="nav-button" onclick={() => examineState.backToSetup()}>Change range or mode</button>
		<button class="nav-button primary" onclick={onLoadNewSet}>Load new set</button>
	</div>
</div>

<style>
	.results {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		animation: results-in 400ms ease;
	}

	@keyframes results-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.results-meta {
		font-size: 0.8125rem;
		color: var(--color-ink-muted);
		margin: 0;
	}

	.results-summary {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		color: var(--color-ink);
		margin: 0;
	}

	.results-note {
		font-size: 0.9375rem;
		color: var(--color-ink-muted);
		margin: -1rem 0 0;
	}

	.question-block {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.rule {
		height: 1px;
		background-color: var(--color-border);
	}

	.revisit {
		font-size: 0.9375rem;
		color: var(--color-ink);
		margin: 0;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
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

	.nav-button:hover {
		border-color: var(--color-ink);
		background: var(--color-surface-alt);
	}

	.nav-button.primary {
		background: var(--color-ink);
		color: var(--color-surface);
		border-color: var(--color-ink);
	}

	.nav-button.primary:hover {
		opacity: 0.85;
	}

	.nav-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
