<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	export type SelectOption = { value: string; label: string };

	interface Props extends Omit<HTMLSelectAttributes, 'value'> {
		label?: string;
		options?: SelectOption[];
		value?: string;
	}

	let {
		label,
		options = [],
		value = $bindable(''),
		id,
		disabled = false,
		...rest
	}: Props = $props();

	const selectId = $derived(id ?? `select-${Math.random().toString(36).slice(2, 9)}`);
</script>

<div class="field">
	{#if label}
		<label for={selectId}>{label}</label>
	{/if}
	<div class="wrap">
		<select id={selectId} {disabled} bind:value {...rest}>
			{#each options as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
		<span class="chev" aria-hidden="true">▾</span>
	</div>
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

	.wrap {
		position: relative;
	}

	select {
		width: 100%;
		appearance: none;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--text-primary);
		background: var(--bg-inset);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		padding: 10px 36px 10px 12px;
		outline: none;
		transition: var(--transition-default);
		cursor: pointer;
	}

	select:focus {
		border-color: var(--brand);
		box-shadow: var(--glow-brand-sm);
	}

	select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.chev {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: var(--text-tertiary);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	@media (max-width: 640px) {
		select {
			font-size: 1rem;
			min-height: 44px;
			padding: 12px 36px 12px 12px;
		}
	}
</style>
