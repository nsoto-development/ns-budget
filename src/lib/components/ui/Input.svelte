<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		label?: string;
		error?: string;
		value?: string | number;
	}

	let {
		label,
		error,
		value = $bindable(''),
		id,
		type = 'text',
		disabled = false,
		...rest
	}: Props = $props();

	const inputId = $derived(id ?? `input-${Math.random().toString(36).slice(2, 9)}`);
</script>

<div class="field">
	{#if label}
		<label for={inputId}>{label}</label>
	{/if}
	<input
		id={inputId}
		{type}
		{disabled}
		bind:value
		aria-invalid={error ? true : undefined}
		class:error
		{...rest}
	/>
	{#if error}
		<span class="error-text">{error}</span>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	label {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--text-tertiary);
	}

	input {
		width: 100%;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--text-primary);
		background: var(--bg-inset);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		padding: 10px 12px;
		outline: none;
		transition: var(--transition-default);
	}

	input:focus {
		border-color: var(--brand);
		box-shadow: var(--glow-brand-sm);
	}

	input:disabled {
		opacity: 0.5;
	}

	input.error {
		border-color: var(--status-danger);
	}

	.error-text {
		font-size: var(--text-xs);
		color: var(--status-danger);
	}

	@media (max-width: 640px) {
		input {
			font-size: 1rem;
			min-height: 44px;
			padding: 12px;
		}
	}
</style>
