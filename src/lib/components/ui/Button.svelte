<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		children,
		...rest
	}: Props = $props();

	const sizeStyle: Record<Size, string> = {
		sm: 'padding: 6px 12px; font-size: var(--text-xs); gap: 6px;',
		md: 'padding: 10px 18px; font-size: var(--text-sm); gap: 8px;',
		lg: 'padding: 13px 24px; font-size: var(--text-md); gap: 10px;'
	};
</script>

<button
	class="btn btn-{variant}"
	class:disabled
	style={sizeStyle[size]}
	{type}
	{disabled}
	{...rest}
>
	{@render children?.()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-weight: var(--weight-medium);
		letter-spacing: var(--tracking-normal);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: var(--transition-default);
		line-height: 1.2;
	}

	.btn:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}

	.btn-primary {
		background: var(--brand);
		color: var(--text-on-brand);
		border: 1px solid var(--brand);
		box-shadow: var(--glow-brand-button);
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--brand-strong);
		border-color: var(--brand-strong);
	}

	.btn-secondary {
		background: var(--bg-surface-raised);
		color: var(--text-primary);
		border: 1px solid var(--border-default);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--bg-surface-hover);
		border-color: var(--border-strong);
	}

	.btn-ghost {
		background: transparent;
		color: var(--text-secondary);
		border: 1px solid transparent;
	}

	.btn-ghost:hover:not(:disabled) {
		background: var(--bg-surface-hover);
		color: var(--text-primary);
	}

	.btn-danger {
		background: rgba(239, 68, 68, 0.12);
		color: var(--status-danger);
		border: 1px solid rgba(239, 68, 68, 0.35);
	}

	.btn-danger:hover:not(:disabled) {
		background: rgba(239, 68, 68, 0.2);
	}

	.btn:disabled,
	.btn.disabled {
		background: var(--gray-850);
		color: var(--text-disabled);
		border: 1px solid var(--border-subtle);
		box-shadow: none;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		.btn {
			min-height: 44px;
			padding-left: 14px;
			padding-right: 14px;
		}
	}
</style>
