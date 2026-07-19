<script lang="ts">
	import { nsotoMarkCyan } from '$lib/components/ui/brandAssets';

	const BRAND_URL = 'https://nsoto.dev/';
</script>

<a
	class="brand"
	href={BRAND_URL}
	target="_blank"
	rel="noopener noreferrer"
	aria-label="nsoto.dev — portfolio home"
>
	<img class="mark" src={nsotoMarkCyan} alt="" aria-hidden="true" />
	<span class="caption">nsoto<span class="dot">.dev</span></span>
</a>

<style>
	.brand {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		border-radius: var(--radius-sm);
		text-decoration: none;
		outline: none;
		transition:
			opacity 200ms ease,
			box-shadow 200ms ease;
	}

	.brand:hover {
		opacity: 0.9;
	}

	.brand:focus-visible {
		box-shadow: var(--glow-brand-sm);
	}

	.mark {
		display: block;
		height: 1.75rem;
		width: auto;
		filter: drop-shadow(0 0 10px color-mix(in srgb, var(--brand) 22%, transparent));
		transition: filter 200ms ease;
	}

	.brand:hover .mark {
		filter: drop-shadow(0 0 12px color-mix(in srgb, var(--brand) 45%, transparent));
	}

	.caption {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		font-weight: var(--weight-semibold);
		line-height: 1;
		letter-spacing: var(--tracking-tight);
		color: var(--text-secondary);
	}

	.dot {
		color: var(--brand);
	}

	@media (min-width: 1024px) {
		.brand {
			gap: var(--space-2);
		}

		.mark {
			height: 2.75rem;
		}

		.caption {
			font-size: var(--text-sm);
		}
	}
</style>
