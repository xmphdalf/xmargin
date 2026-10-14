<script lang="ts">
	import { renderCaseStudyMarkdown } from '$lib/caseStudyMarkdown.js';

	interface Props {
		text: string;
		/** Single-paragraph content (option text) drops the wrapping <p> so it sits inline with its key. */
		inline?: boolean;
	}

	let { text, inline = false }: Props = $props();

	const html = $derived.by(() => {
		const out = renderCaseStudyMarkdown(text);
		return inline ? out.replace(/^<p>((?:(?!<\/?p>)[\s\S])*)<\/p>$/, '$1') : out;
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div class="md">{@html html}</div>

<style>
	.md {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.md :global(p) {
		margin: 0 0 0.875em;
	}

	.md :global(h1),
	.md :global(h2),
	.md :global(h3),
	.md :global(h4) {
		font-size: 1em;
		font-weight: 600;
		margin: 1.25em 0 0.5em;
	}

	.md :global(ul),
	.md :global(ol) {
		margin: 0 0 0.875em;
		padding-left: 1.25em;
	}

	.md :global(a) {
		color: var(--color-accent);
	}

	.md :global(img) {
		display: block;
		max-width: 100%;
		height: auto;
		margin: 0.5rem 0;
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	.md :global(code) {
		font-family: var(--font-mono);
		font-size: 0.875em;
		background: var(--color-code-bg);
		padding: 0.1em 0.3em;
		border-radius: 3px;
	}

	.md :global(pre) {
		overflow-x: auto;
		margin: 0 0 0.875em;
		padding: 0.75rem 1rem;
		background: var(--color-code-bg);
		border-radius: 4px;
	}

	.md :global(pre code) {
		padding: 0;
		background: none;
		overflow-wrap: normal;
	}

	.md :global(table) {
		display: block;
		overflow-x: auto;
		border-collapse: collapse;
		margin: 0 0 0.875em;
		font-size: 0.9em;
	}

	.md :global(th),
	.md :global(td) {
		border: 1px solid var(--color-border);
		padding: 0.35rem 0.6rem;
		text-align: left;
	}

	.md :global(:first-child) {
		margin-top: 0;
	}

	.md :global(:last-child) {
		margin-bottom: 0;
	}
</style>
