<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		padding?: string;
		children?: import('svelte').Snippet;
	}

	let { padding = 'var(--space-6)', children, ...rest }: Props = $props();
</script>

<div class="card" style:padding {...rest}>
	{@render children?.()}
</div>

<style>
	.card {
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
	}
</style>
