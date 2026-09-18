<script lang="ts">
	import type { Question } from '$lib/types.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import { answerBucket } from '$lib/examine.js';
	import QuestionCard from './QuestionCard.svelte';
	import QuestionOptions from './QuestionOptions.svelte';

	interface Props {
		questions: Question[];
		onRetake: () => void;
		onLoadNewSet: () => void;
	}

	let { questions, onRetake, onLoadNewSet }: Props = $props();

	const session = $derived(examineState.session!);

	type Filter = 'all' | 'correct' | 'incorrect' | 'unanswered' | 'flagged';

	/** Transient view state — which slice of the results is on screen. Never persisted. */
	let filter = $state<Filter>('all');

	const bucketOf = (q: Question) => answerBucket(session.answers[q.id]);
	/** Flagged is orthogonal to the buckets, so it gets its own predicate. */
	const isFlagged = (q: Question) => session.flagged.includes(q.id);

	const counts = $derived.by(() => ({
		all: questions.length,
		correct: questions.filter((q) => bucketOf(q) === 'correct').length,
		incorrect: questions.filter((q) => bucketOf(q) === 'incorrect').length,
		unanswered: questions.filter((q) => bucketOf(q) === 'unanswered').length,
		// session.flagged can hold ids outside the selected range — count only what's shown.
		flagged: questions.filter(isFlagged).length
	}));

	const correctCount = $derived(counts.correct);

	/** Zero-count buckets are omitted rather than shown empty — the row stays short. */
	const chips = $derived.by(() => {
		const all: { id: Filter; label: string }[] = [
			{ id: 'all', label: 'All' },
			{ id: 'correct', label: 'Correct' },
			{ id: 'incorrect', label: 'Incorrect' },
			{ id: 'unanswered', label: 'Unanswered' },
			{ id: 'flagged', label: 'Flagged' }
		];
		return all.filter(
			(c) => c.id === 'all' || c.id === 'correct' || c.id === 'incorrect' || counts[c.id] > 0
		);
	});

	const shown = $derived.by(() => {
		if (filter === 'all') return questions;
		if (filter === 'flagged') return questions.filter(isFlagged);
		return questions.filter((q) => bucketOf(q) === filter);
	});

	const filterAnnouncement = $derived(
		filter === 'all'
			? `Showing all ${shown.length} question${shown.length === 1 ? '' : 's'}`
			: `Showing ${shown.length} ${filter} question${shown.length === 1 ? '' : 's'}`
	);

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

	<div class="chip-row" role="group" aria-label="Filter results">
		{#each chips as chip (chip.id)}
			<button
				class="chip"
				class:active={filter === chip.id}
				class:correct={chip.id === 'correct'}
				class:incorrect={chip.id === 'incorrect'}
				aria-pressed={filter === chip.id}
				disabled={counts[chip.id] === 0}
				onclick={() => (filter = chip.id)}
			>
				{chip.label} {counts[chip.id]}
			</button>
		{/each}
	</div>

	<p class="sr-only" aria-live="polite">{filterAnnouncement}</p>

	{#key filter}
		<div class="question-list">
			{#each shown as question, i (question.id)}
				{#if i > 0}<div class="rule"></div>{/if}
				<div class="question-block">
					<QuestionCard {question} status={bucketOf(question)} />
					<QuestionOptions {question} selected={session.answers[question.id]?.selected} revealed />
				</div>
			{/each}
		</div>
	{/key}

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

	/* Same chip idiom as the setup screen: neutral at rest, colour only when active. */
	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		padding: 0.5rem 0.875rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		color: var(--color-ink-muted);
		cursor: pointer;
		transition: border-color 200ms ease, color 200ms ease, background-color 200ms ease;
	}

	.chip:hover:not(:disabled) {
		color: var(--color-ink);
		border-color: var(--color-accent);
	}

	/* An empty bucket stays visible — the count is the point — but leads nowhere. */
	.chip:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.chip.active {
		color: var(--color-accent);
		border-color: var(--color-accent);
		background-color: var(--color-surface-alt);
	}

	/* The active chip echoes the ✓/✕ colours already used on the options below. */
	.chip.active.correct {
		color: var(--color-add);
		border-color: var(--color-add);
		background-color: var(--color-add-tint);
	}

	.chip.active.incorrect {
		color: var(--color-del);
		border-color: var(--color-del);
		background-color: var(--color-del-tint);
	}

	.chip:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.question-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		animation: list-in 300ms ease;
	}

	@keyframes list-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
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
