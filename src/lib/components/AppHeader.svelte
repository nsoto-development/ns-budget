<script lang="ts">
	import BrandLink from '$lib/components/BrandLink.svelte';

	const REPO_URL = 'https://github.com/nsoto-development/ns-budget';
</script>

<header class="chrome">
	<BrandLink />

	<span class="divider" aria-hidden="true"></span>

	<div class="product">
		<span class="eyebrow">&lt;/ product &gt;</span>
		<h1 class="title">
			<a href={REPO_URL} target="_blank" rel="noopener noreferrer">ns-budget</a>
		</h1>
	</div>
</header>

<style>
	.chrome {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		background: var(--bg-surface);
		box-shadow: var(--shadow-card);
	}

	.divider {
		width: 1px;
		height: 1.25rem;
		flex-shrink: 0;
		background: var(--border-default);
	}

	.product {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		font-weight: var(--weight-medium);
		line-height: 1;
		letter-spacing: var(--tracking-widest);
		text-transform: uppercase;
		color: var(--text-tertiary);
	}

	.title {
		margin: 0;
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: var(--weight-semibold);
		line-height: 1;
		letter-spacing: var(--tracking-tight);
	}

	.title a {
		color: var(--link);
		text-decoration: none;
		transition:
			color 200ms ease,
			opacity 200ms ease;
	}

	.title a:hover {
		color: var(--link-hover);
		opacity: 0.9;
	}

	.title a:focus-visible {
		border-radius: var(--radius-sm);
		box-shadow: var(--glow-brand-sm);
		outline: none;
	}

	@media (min-width: 1024px) {
		.chrome {
			gap: var(--space-5);
			padding: var(--space-4) var(--space-6);
		}

		.divider {
			height: 1.75rem;
		}

		.product {
			gap: var(--space-2);
		}

		.eyebrow {
			font-size: var(--text-xs);
		}

		.title {
			font-size: var(--text-2xl);
		}
	}
</style>
