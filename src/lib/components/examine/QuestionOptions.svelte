<script lang="ts">
	import type { AnswerValue, Question } from '$lib/types.js';
	import { isHotspot, requiredSelectionCount, seededShuffle, questionSeed } from '$lib/examine.js';
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

	/** Display order — shuffled per-question when the session opts in; true-false has nothing to shuffle. */
	const displayOptions = $derived.by(() => {
		const options = question.content.options ?? [];
		const session = examineState.session;
		if (question.type === 'true-false' || !session?.shuffleOptions) return options;
		return seededShuffle(options, questionSeed(session.shuffleSeed, question.id));
	});

	/** Group options by identical explanation text, so repeated explanations show once. */
	const explanationGroups = $derived.by(() => {
		const groups: { keys: string[]; text: string }[] = [];
		for (const option of question.content.options ?? []) {
			if (!option.explanation) continue;
			const existing = groups.find((g) => g.text === option.explanation);
			if (existing) existing.keys.push(option.key);
			else groups.push({ keys: [option.key], text: option.explanation });
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
		{#each displayOptions as option}
			<OptionButton
				optionKey={option.key}
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
					<p><strong>{group.keys.join(', ')}.</strong> {group.text}</p>
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
