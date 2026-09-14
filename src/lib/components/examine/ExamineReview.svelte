<script lang="ts">
	import type { Question } from '$lib/types.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import TimerDisplay from './TimerDisplay.svelte';

	interface Props {
		questions: Question[];
		onBack: () => void;
	}

	let { questions, onBack }: Props = $props();

	const session = $derived(examineState.session!);
	const attemptedCount = $derived(questions.filter((q) => session.answers[q.id]).length);
	const flaggedQuestions = $derived(questions.filter((q) => session.flagged.includes(q.id)));

	function goToQuestion(id: string) {
		const idx = questions.findIndex((q) => q.id === id);
		if (idx >= 0) examineState.goTo(idx);
		onBack();
	}

	function reviewFlagged() {
		const first = flaggedQuestions[0];
		if (first) goToQuestion(first.id);
	}
</script>

<div class="review">
	<h1 class="review-title">Review before you submit</h1>

	<div class="review-meta">
		<p class="meta-line">You've attempted {attemptedCount} of {questions.length} questions.</p>
		{#if session.timerEnabled && session.startedAt}
			<TimerDisplay startedAt={session.startedAt} />
		{/if}
	</div>

	<fieldset class="control-group">
		<legend class="control-label">Flagged for revisit</legend>
		{#if flaggedQuestions.length === 0}
			<p class="empty-note">No questions flagged.</p>
		{:else}
			<ul class="flagged-list">
				{#each flaggedQuestions as question}
					<li>
						<button class="flagged-item" onclick={() => goToQuestion(question.id)}>
							{#if !session.shuffleQuestions}
								<span class="flagged-number">Q {String(question.number).padStart(2, '0')}</span>
							{/if}
							<span class="flagged-stem">{question.content.stem}</span>
						</button>
					</li>
				{/each}
			</ul>
			<button class="nav-button" onclick={reviewFlagged}>Review flagged questions →</button>
		{/if}
	</fieldset>

	<div class="actions">
		<button class="nav-button" onclick={onBack}>← Back to questions</button>
		<button class="nav-button primary" onclick={() => examineState.finishSession()}>Submit exam</button>
	</div>
</div>

<style>
	.review {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		min-width: 0;
	}

	.review-title {
		font-family: var(--font-serif);
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-ink);
		margin: 0;
	}

	.review-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.meta-line {
		font-size: 0.9375rem;
		color: var(--color-ink-muted);
		margin: 0;
	}

	.control-group {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-width: 0;
	}

	.control-label {
		font-size: 0.875rem;
		color: var(--color-ink);
		font-weight: 500;
		padding: 0;
	}

	.empty-note {
		font-size: 0.875rem;
		color: var(--color-ink-muted);
		margin: 0;
	}

	.flagged-list {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		list-style: none;
		margin: 0;
		padding: 0;
		min-width: 0;
	}

	.flagged-list li {
		min-width: 0;
	}

	.flagged-item {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		width: 100%;
		min-width: 0;
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface);
		text-align: left;
		cursor: pointer;
		transition: border-color 200ms ease, background-color 200ms ease;
	}

	.flagged-item:hover {
		border-color: var(--color-accent);
		background-color: var(--color-surface-alt);
	}

	.flagged-item:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.flagged-number {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: var(--color-ink-muted);
		flex-shrink: 0;
	}

	.flagged-stem {
		flex: 1;
		min-width: 0;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		color: var(--color-ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		justify-content: space-between;
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
