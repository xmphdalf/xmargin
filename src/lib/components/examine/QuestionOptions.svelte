<script lang="ts">
	import type { AnswerValue, Question } from '$lib/types.js';
	import { displayOptions, isHotspot, requiredSelectionCount } from '$lib/examine.js';
	import { examineState } from '$lib/state/examine.svelte.js';
	import OptionButton from './OptionButton.svelte';
	import HotspotGrid from './HotspotGrid.svelte';

	interface Props {
		question: Question;
		/** current answer: a key, array of keys for multi-correct, or one entry per hotspot row */
		selected?: AnswerValue;
		revealed?: boolean;
		interactive?: boolean;
		/** `rowIndex` is supplied for hotspot questions only */
		onSelect?: (key: string, rowIndex?: number) => void;
	}

	let { question, selected, revealed = false, interactive = false, onSelect }: Props = $props();

	function isSelected(key: string): boolean {
		if (!selected) return false;
		return Array.isArray(selected) ? selected.includes(key) : selected === key;
	}

	/** Once a multi-correct question has its required picks, further unselected options disable. */
	const atMax = $derived(
		question.type === 'multiple-choice-multiple-correct' &&
			Array.isArray(selected) &&
			selected.length >= requiredSelectionCount(question)
	);

	/**
	 * Display order plus the label shown for each position — shuffled per-question
	 * when the session opts in, but always labelled in ascending order so the
	 * shuffle stays invisible. Labels are cosmetic; `option.key` drives everything.
	 */
	const displayed = $derived.by(() => {
		const session = examineState.session;
		return displayOptions(question, session?.shuffleOptions ?? false, session?.shuffleSeed ?? 0);
	});

	/**
	 * Group options by identical explanation text, so repeated explanations show
	 * once. Built from the display list so the letters it names are the ones on
	 * screen, in the order they appear.
	 */
	const explanationGroups = $derived.by(() => {
		const groups: { labels: string[]; text: string }[] = [];
		for (const { option, label } of displayed) {
			if (!option.explanation) continue;
			const existing = groups.find((g) => g.text === option.explanation);
			if (existing) existing.labels.push(label);
			else groups.push({ labels: [label], text: option.explanation });
		}
		return groups;
	});
</script>

<div class="options">
	{#if isHotspot(question)}
		<HotspotGrid
			{question}
			{selected}
			{revealed}
			{interactive}
			onSelect={(category, rowIndex) => onSelect?.(category, rowIndex)}
		/>
	{:else if question.type === 'true-false'}
		<OptionButton
			optionKey="True"
			text="True"
			selected={isSelected('true')}
			correct={question.content.correct === 'true'}
			{revealed}
			{interactive}
			onSelect={() => onSelect?.('true')}
		/>
		<OptionButton
			optionKey="False"
			text="False"
			selected={isSelected('false')}
			correct={question.content.correct === 'false'}
			{revealed}
			{interactive}
			onSelect={() => onSelect?.('false')}
		/>
		{#if revealed && question.content.explanation}
			<p class="shared-explanation">{question.content.explanation}</p>
		{/if}
	{:else}
		{#each displayed as { option, label } (option.key)}
			<OptionButton
				optionKey={label}
				text={option.text}
				explanation={question.type === 'multiple-choice' ? option.explanation : undefined}
				selected={isSelected(option.key)}
				correct={option.isCorrect}
				{revealed}
				{interactive}
				disabled={atMax && !isSelected(option.key)}
				onSelect={() => onSelect?.(option.key)}
			/>
		{/each}
		{#if revealed && question.type === 'multiple-choice-multiple-correct'}
			<div class="shared-explanation">
				{#each explanationGroups as group}
					<p><strong>{group.labels.join(', ')}.</strong> {group.text}</p>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.shared-explanation {
		color: var(--color-ink-muted);
		font-size: calc(var(--prose-size, 1.125rem) * 0.83);
		line-height: var(--prose-lh, 1.65);
		margin: 0.25rem 0 0;
		padding: 0.75rem 1rem;
		border-left: 2px solid var(--color-border);
		background-color: var(--color-surface-alt);
	}

	.shared-explanation p {
		margin: 0;
	}

	.shared-explanation p + p {
		margin-top: 0.5rem;
	}

	.shared-explanation strong {
		color: var(--color-ink);
		font-weight: 500;
	}
</style>
