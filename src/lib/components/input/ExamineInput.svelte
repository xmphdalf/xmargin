<script lang="ts">
	import ExaminePastePanel from './ExaminePastePanel.svelte';
	import ExamineUploadPanel from './ExamineUploadPanel.svelte';
	import { SAMPLE_QUESTION_SET_JSON } from '$lib/examine.js';

	type Tab = 'paste' | 'upload';

	interface Props {
		onSubmit: (raw: string) => Promise<void> | void;
	}

	let { onSubmit }: Props = $props();

	let activeTab = $state<Tab>('paste');
	let loading = $state(false);
	let sampleCopied = $state(false);

	async function copySample() {
		const { copyToClipboard } = await import('$lib/export.js');
		await copyToClipboard(SAMPLE_QUESTION_SET_JSON);
		sampleCopied = true;
		setTimeout(() => (sampleCopied = false), 1500);
	}

	async function handleSubmit(raw: string) {
		loading = true;
		try {
			await onSubmit(raw);
		} finally {
			loading = false;
		}
	}

	const tabs: { id: Tab; label: string }[] = [
		{ id: 'paste', label: 'Paste' },
		{ id: 'upload', label: 'Upload' }
	];
</script>

<div class="input-container">
	<div class="input-tabs" role="tablist" aria-label="Question set input method">
		{#each tabs as tab}
			<button
				role="tab"
				aria-selected={activeTab === tab.id}
				aria-controls="examine-panel-{tab.id}"
				id="examine-tab-{tab.id}"
				onclick={() => (activeTab = tab.id)}
				class="tab-btn"
				class:active={activeTab === tab.id}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="tab-content">
		<div
			id="examine-panel-paste"
			role="tabpanel"
			aria-labelledby="examine-tab-paste"
			hidden={activeTab !== 'paste'}
		>
			{#if activeTab === 'paste'}
				<ExaminePastePanel onSubmit={handleSubmit} {loading} />
			{/if}
		</div>

		<div
			id="examine-panel-upload"
			role="tabpanel"
			aria-labelledby="examine-tab-upload"
			hidden={activeTab !== 'upload'}
		>
			{#if activeTab === 'upload'}
				<ExamineUploadPanel onSubmit={handleSubmit} {loading} />
			{/if}
		</div>
	</div>

	<details class="sample-disclosure">
		<summary>View sample format</summary>
		<div class="sample-code-wrap">
			<button
				type="button"
				class="sample-copy-btn"
				onclick={copySample}
				aria-label="Copy sample JSON"
			>
				{#if sampleCopied}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="20 6 9 17 4 12" />
					</svg>
					Copied
				{:else}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="9" y="9" width="13" height="13" rx="2" />
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
					</svg>
					Copy
				{/if}
			</button>
			<pre class="sample-code"><code>{SAMPLE_QUESTION_SET_JSON}</code></pre>
		</div>
	</details>
</div>

<style>
	.input-container {
		width: 100%;
		max-width: 680px;
		margin: 0 auto;
	}

	.input-tabs {
		display: flex;
		gap: 0;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 1.25rem;
	}

	.tab-btn {
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		color: var(--color-ink-muted);
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		cursor: pointer;
		transition: color 200ms ease, border-color 200ms ease;
	}

	.tab-btn:hover {
		color: var(--color-ink);
	}

	.tab-btn.active {
		color: var(--color-ink);
		border-bottom-color: var(--color-accent);
		font-weight: 500;
	}

	.tab-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	.tab-content {
		width: 100%;
	}

	.sample-disclosure {
		margin-top: 1.5rem;
	}

	.sample-disclosure summary {
		font-size: 0.8125rem;
		color: var(--color-ink-muted);
		cursor: pointer;
		transition: color 200ms ease;
	}

	.sample-disclosure summary:hover {
		color: var(--color-ink);
	}

	.sample-disclosure summary:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.sample-code-wrap {
		position: relative;
		margin-top: 0.75rem;
	}

	.sample-copy-btn {
		position: absolute;
		top: 0.625rem;
		right: 0.625rem;
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		color: var(--color-ink-muted);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		cursor: pointer;
		transition: color 200ms ease, border-color 200ms ease, background-color 200ms ease;
	}

	.sample-copy-btn:hover {
		color: var(--color-ink);
		background-color: var(--color-surface-alt);
	}

	.sample-copy-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.sample-code {
		margin: 0;
		padding: 1rem;
		background-color: var(--color-code-bg);
		border-radius: 8px;
		overflow-x: auto;
	}

	.sample-code code {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-ink);
		white-space: pre;
	}
</style>
