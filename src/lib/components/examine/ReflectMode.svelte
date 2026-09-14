<script lang="ts">
	import type { AnswerValue, Question } from '$lib/types.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import {
		isAnswerCorrect,
		isHotspot,
		requiredSelectionCount,
		selectionCount,
		toggleSelection
	} from '$lib/examine.js';
	import QuestionCard from './QuestionCard.svelte';
	import QuestionOptions from './QuestionOptions.svelte';
	import QuestionFrame from './QuestionFrame.svelte';
	import ProgressIndicator from './ProgressIndicator.svelte';

	interface Props {
		questions: Question[];
	}

	let { questions }: Props = $props();

	const session = $derived(examineState.session!);
	const index = $derived(session.currentIndex);
	const question = $derived(questions[index]);

	/**
	 * The in-progress pick, before reveal. Revealing commits it to the session,
	 * which is what lets Reflect resume after a reload and produce results at the
	 * end — so `pending` only ever holds an uncommitted selection.
	 */
	let pending = $state<AnswerValue | undefined>(undefined);

	const committed = $derived(question ? session.answers[question.id] : undefined);
	const revealed = $derived(!!committed);
	const selected = $derived(committed?.selected ?? pending);

	const answeredIndices = $derived.by(() => {
		const set = new Set<number>();
		questions.forEach((q, i) => {
			if (session.answers[q.id]) set.add(i);
		});
		return set;
	});

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
		pending = toggleSelection(question, pending, key, rowIndex);
	}

	/** Revealing is the commit — the answer is graded and recorded, then locked. */
	function reveal() {
		if (!question || !canReveal || pending === undefined) return;
		examineState.selectAnswer({
			questionId: question.id,
			selected: pending,
			isCorrect: isAnswerCorrect(question, pending),
			timestamp: Date.now()
		});
		pending = undefined;
	}

	function goTo(i: number) {
		if (i < 0 || i >= questions.length) return;
		pending = undefined;
		examineState.goTo(i);
	}
</script>

{#if question}
	<div class="reflect-mode">
		<ProgressIndicator count={questions.length} currentIndex={index} {answeredIndices} />

		{#key index}
			<QuestionFrame>
				<QuestionCard {question} showNumber={!session.shuffleQuestions} />
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
			<button
				class="nav-button"
				disabled={answeredIndices.size === 0}
				onclick={() => examineState.finishSession()}
			>
				See results
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
