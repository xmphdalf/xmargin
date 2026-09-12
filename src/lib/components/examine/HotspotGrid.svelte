<script lang="ts">
	import type { AnswerValue, Question } from '$lib/types.js';
	import { hotspotAnswer, hotspotRowTally, selectionCount } from '$lib/examine.js';

	interface Props {
		question: Question;
		/** one entry per row, parallel to content.items; null = that row is unanswered */
		selected?: AnswerValue;
		revealed?: boolean;
		interactive?: boolean;
		onSelect?: (category: string, rowIndex: number) => void;
	}

	let { question, selected, revealed = false, interactive = false, onSelect }: Props = $props();

	/** Source order, always — row and category order are part of the question. */
	const items = $derived(question.content.items ?? []);
	const categories = $derived(question.content.categories ?? []);

	const answer = $derived(hotspotAnswer(question, selected));
	/** Read mode reveals answers with nothing selected — no tally, no "not answered" noise. */
	const attempted = $derived(selectionCount(question, selected) > 0);
	const tally = $derived(hotspotRowTally(question, selected));

	/** Four or more categories won't sit inline comfortably — fall back to a dropdown. */
	const useDropdown = $derived(categories.length > 3);

	const instruction = $derived(
		question.type === 'hotspot-yesno' ? 'Select Yes or No:' : 'Select the correct category:'
	);
</script>

<div class="hotspot">
	<div class="hotspot-head">
		<span class="head-label">{question.content.itemLabel ?? 'Statement:'}</span>
		<span class="head-instruction">{instruction}</span>
	</div>

	<ul class="rows">
		{#each items as item, i (i)}
			{@const chosen = answer[i]}
			{@const right = chosen === item.correct}
			<li
				class="row"
				class:row-right={revealed && attempted && right}
				class:row-wrong={revealed && attempted && !right}
			>
				<p class="statement" id="{question.id}-row-{i}">{item.statement}</p>

				<div class="selector">
					{#if interactive && useDropdown}
						<select
							class="dropdown"
							aria-labelledby="{question.id}-row-{i}"
							value={chosen ?? ''}
							onchange={(e) => onSelect?.(e.currentTarget.value, i)}
						>
							<option value="" disabled>Select…</option>
							{#each categories as category (category)}
								<option value={category}>{category}</option>
							{/each}
						</select>
					{:else if interactive}
						<div class="segmented" role="radiogroup" aria-labelledby="{question.id}-row-{i}">
							{#each categories as category (category)}
								<label class="segment" class:picked={chosen === category}>
									<input
										type="radio"
										name="{question.id}-row-{i}"
										value={category}
										checked={chosen === category}
										onchange={() => onSelect?.(category, i)}
									/>
									<span class="segment-label">{category}</span>
								</label>
							{/each}
						</div>
					{:else}
						<div class="segmented static">
							{#each categories as category (category)}
								{@const isCorrect = category === item.correct}
								{@const isChosen = attempted && chosen === category}
								<span
									class="segment"
									class:picked={isChosen}
									class:right={revealed && isCorrect}
									class:wrong={revealed && isChosen && !isCorrect}
								>
									<span class="segment-label">{category}</span>
									{#if revealed && (isCorrect || (isChosen && !isCorrect))}
										<span class="mark" aria-hidden="true">{isCorrect ? '✓' : '✕'}</span>
										<span class="sr-only">
											{isCorrect ? 'Correct answer' : 'Your answer, incorrect'}
										</span>
									{/if}
								</span>
							{/each}
						</div>
					{/if}
				</div>

				{#if revealed && attempted && chosen === null}
					<p class="row-note">Not answered — the correct category is “{item.correct}”.</p>
				{:else if revealed && attempted}
					<p class="row-note">{right ? 'Correct' : `Incorrect — the correct category is “${item.correct}”.`}</p>
				{/if}

				{#if revealed && item.explanation}
					<p class="row-explanation">{item.explanation}</p>
				{/if}
			</li>
		{/each}
	</ul>

	{#if revealed && attempted}
		<p class="tally">{tally.correct} of {tally.total} rows correct.</p>
	{/if}
</div>

<style>
	.hotspot {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.hotspot-head {
		display: none;
		gap: 1.5rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
		padding: 0 1rem;
	}

	.head-label {
		flex: 1;
		min-width: 0;
	}

	.head-instruction {
		flex-shrink: 0;
		width: 40%;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Narrow: each row is a stacked card — statement above its selector, never a wide table. */
	.row {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface);
		transition: border-color 300ms ease, background-color 300ms ease;
	}

	.row-right {
		border-color: var(--color-add);
	}

	.row-wrong {
		border-color: var(--color-del);
	}

	.statement {
		margin: 0;
		font-size: var(--prose-size, 1.125rem);
		line-height: var(--prose-lh, 1.65);
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}

	.selector {
		min-width: 0;
	}

	.segmented {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.segment {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.5rem 0.875rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		line-height: 1.45;
		color: var(--color-ink);
		overflow-wrap: anywhere;
		transition: border-color 200ms ease, background-color 200ms ease;
	}

	label.segment {
		cursor: pointer;
	}

	label.segment:hover {
		border-color: var(--color-accent);
		background: var(--color-surface-alt);
	}

	.segment input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.segment.picked {
		border-color: var(--color-accent);
		background-color: var(--color-surface-alt);
	}

	.segment:has(input:focus-visible) {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.segment.right {
		border-color: var(--color-add);
		background-color: var(--color-add-tint);
	}

	.segment.wrong {
		border-color: var(--color-del);
		background-color: var(--color-del-tint);
	}

	.segment.right .mark {
		color: var(--color-add);
	}

	.segment.wrong .mark {
		color: var(--color-del);
	}

	.mark {
		font-size: 0.8125rem;
		flex-shrink: 0;
	}

	.dropdown {
		width: 100%;
		max-width: 22rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface);
		color: var(--color-ink);
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		cursor: pointer;
		transition: border-color 200ms ease;
	}

	.dropdown:hover {
		border-color: var(--color-accent);
	}

	.dropdown:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.row-note {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		color: var(--color-ink-muted);
	}

	.row-explanation {
		color: var(--color-ink-muted);
		font-size: calc(var(--prose-size, 1.125rem) * 0.83);
		line-height: var(--prose-lh, 1.65);
		margin: 0;
		padding: 0.75rem 1rem;
		border-left: 2px solid var(--color-border);
		background-color: var(--color-surface-alt);
	}

	.tally {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: var(--color-ink);
	}

	/* Wide: statement and selector sit side by side under a shared header row. */
	@media (min-width: 40rem) {
		.hotspot-head {
			display: flex;
		}

		.row {
			display: grid;
			grid-template-columns: 1fr 40%;
			column-gap: 1.5rem;
			row-gap: 0.75rem;
			align-items: start;
		}

		.row-note,
		.row-explanation {
			grid-column: 1 / -1;
		}
	}
</style>
