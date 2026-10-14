<script lang="ts">
	import Markdown from './Markdown.svelte';

	interface Props {
		optionKey: string;
		text: string;
		explanation?: string;
		/** the user picked this option */
		selected?: boolean;
		/** this option is the correct one — only meaningful when revealed */
		correct?: boolean;
		/** show correct/incorrect styling + explanation */
		revealed?: boolean;
		/** clickable (Examine mode, before results); false everywhere else */
		interactive?: boolean;
		/** at the multi-correct selection cap and not itself selected — blocks further picks */
		disabled?: boolean;
		onSelect?: () => void;
	}

	let {
		optionKey,
		text,
		explanation,
		selected = false,
		correct = false,
		revealed = false,
		interactive = false,
		disabled = false,
		onSelect
	}: Props = $props();

	const wrong = $derived(revealed && selected && !correct);
	const right = $derived(revealed && correct);
</script>

<div class="option-wrap">
	{#if interactive}
		<button
			type="button"
			class="option"
			class:selected
			{disabled}
			onclick={onSelect}
			aria-pressed={selected}
		>
			<span class="option-key">{optionKey}</span>
			<span class="option-text"><Markdown {text} inline /></span>
		</button>
	{:else}
		<div class="option" class:selected class:right class:wrong>
			<span class="option-key">{optionKey}</span>
			<span class="option-text"><Markdown {text} inline /></span>
			{#if revealed}
				<span class="option-mark" aria-hidden="true">{right ? '✓' : wrong ? '✕' : ''}</span>
				<span class="sr-only">
					{right ? 'Correct' : wrong ? 'Your answer, incorrect' : ''}
				</span>
			{/if}
		</div>
	{/if}
	{#if revealed && explanation}
		<div class="explanation"><Markdown text={explanation} /></div>
	{/if}
</div>

<style>
	.option-wrap {
		display: flex;
		flex-direction: column;
	}

	.option {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: var(--color-surface);
		text-align: left;
		width: 100%;
		font-size: var(--prose-size, 1.125rem);
		line-height: var(--prose-lh, 1.65);
		color: var(--color-ink);
		transition: border-color 200ms ease, background-color 200ms ease;
	}

	button.option {
		cursor: pointer;
	}

	button.option:hover {
		border-color: var(--color-accent);
		background: var(--color-surface-alt);
	}

	.option.selected {
		border-color: var(--color-accent);
		background-color: var(--color-surface-alt);
	}

	button.option:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	button.option:disabled:hover {
		border-color: var(--color-border);
		background: var(--color-surface);
	}

	.option.right {
		border-color: var(--color-add);
		background-color: var(--color-add-tint);
	}

	.option.wrong {
		border-color: var(--color-del);
		background-color: var(--color-del-tint);
	}

	.option:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.option-key {
		font-family: var(--font-mono);
		font-weight: 500;
		color: var(--color-ink-muted);
		min-width: 1.25rem;
		flex-shrink: 0;
		padding-top: 0.1rem;
	}

	.option-text {
		flex: 1;
		min-width: 0;
	}

	.option-mark {
		font-size: 0.9375rem;
		flex-shrink: 0;
	}

	.option.right .option-mark {
		color: var(--color-add);
	}

	.option.wrong .option-mark {
		color: var(--color-del);
	}

	.explanation {
		color: var(--color-ink-muted);
		font-size: calc(var(--prose-size, 1.125rem) * 0.83);
		line-height: var(--prose-lh, 1.65);
		margin: 0.5rem 0 0;
		padding: 0.75rem 1rem;
		border-left: 2px solid var(--color-border);
		background-color: var(--color-surface-alt);
	}
</style>
