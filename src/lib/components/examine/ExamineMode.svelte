<script lang="ts">
	import type { Question } from '$lib/types.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import { isAnswerCorrect, toggleSelection } from '$lib/examine.js';
	import QuestionCard from './QuestionCard.svelte';
	import QuestionOptions from './QuestionOptions.svelte';
	import QuestionFrame from './QuestionFrame.svelte';
	import ProgressIndicator from './ProgressIndicator.svelte';
	import TimerDisplay from './TimerDisplay.svelte';

	interface Props {
		questions: Question[];
		onReview: () => void;
	}

	let { questions, onReview }: Props = $props();

	const session = $derived(examineState.session!);
	const index = $derived(session.currentIndex);
	const question = $derived(questions[index]);
	const isLast = $derived(index === questions.length - 1);

	const answeredIndices = $derived.by(() => {
		const set = new Set<number>();
		questions.forEach((q, i) => {
			if (session.answers[q.id]) set.add(i);
		});
		return set;
	});

	function goTo(i: number) {
		if (i < 0 || i >= questions.length) return;
		examineState.goTo(i);
	}

	function handleSelect(key: string, rowIndex?: number) {
		if (!question) return;
		const existing = session.answers[question.id]?.selected;
		const next = toggleSelection(question, existing, key, rowIndex);
		examineState.selectAnswer({
			questionId: question.id,
			selected: next,
			isCorrect: isAnswerCorrect(question, next),
			timestamp: Date.now()
		});
	}
</script>

{#if question}
	<div class="examine-mode">
		<div class="top-row">
			<ProgressIndicator count={questions.length} currentIndex={index} {answeredIndices} />
			{#if session.timerEnabled && session.startedAt}
				<TimerDisplay startedAt={session.startedAt} />
			{/if}
		</div>

		{#key index}
			<QuestionFrame>
				<QuestionCard
					{question}
					flagged={session.flagged.includes(question.id)}
					onToggleFlag={() => examineState.toggleFlag(question.id)}
				/>
				<QuestionOptions
					{question}
					selected={session.answers[question.id]?.selected}
					interactive
					onSelect={handleSelect}
				/>
			</QuestionFrame>
		{/key}

		<div class="nav-row">
			<button class="nav-button" disabled={index === 0} onclick={() => goTo(index - 1)}>
				← Previous
			</button>
			<button class="nav-button" onclick={onReview}>Review &amp; submit</button>
			<button class="nav-button" disabled={isLast} onclick={() => goTo(index + 1)}>
				Next →
			</button>
		</div>
	</div>
{/if}

<style>
	.examine-mode {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.nav-row {
		display: flex;
		justify-content: space-between;
		margin-top: 0.5rem;
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

	.nav-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.nav-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
