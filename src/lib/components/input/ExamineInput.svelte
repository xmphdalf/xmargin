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
		<div class="sample-body">
			<button type="button" class="copy-sample-btn" onclick={copySample}>
				{sampleCopied ? 'Copied' : 'Copy'}
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

	.sample-body {
		position: relative;
	}

	.copy-sample-btn {
		position: absolute;
		top: 1.5rem;
		right: 0.75rem;
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		color: var(--color-ink-muted);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		cursor: pointer;
		transition: color 200ms ease, border-color 200ms ease;
	}

	.copy-sample-btn:hover {
		color: var(--color-ink);
		border-color: var(--color-ink-muted);
	}

	.copy-sample-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.sample-code {
		margin: 0.75rem 0 0;
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
