<script lang="ts">
	import type { ScheduleSummary } from '$lib/scheduling';

	interface Props {
		summary: ScheduleSummary;
	}

	let { summary }: Props = $props();

	function money(n: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(n);
	}
</script>

<ul class="stats">
	<li>
		<span class="label">Ending balance</span>
		<span class="value" class:neg={summary.endingBalance < 0}>{money(summary.endingBalance)}</span>
	</li>
	<li>
		<span class="label">Minimum balance</span>
		<span class="value" class:neg={summary.minBalance < 0}
			>{money(summary.minBalance)}
			{#if summary.minBalanceDate}
				<span class="meta">on {summary.minBalanceDate}</span>
			{/if}
		</span>
	</li>
	<li>
		<span class="label">First deficit</span>
		<span class="value" class:neg={summary.firstDeficitDate !== null}>
			{summary.firstDeficitDate ?? 'None'}
		</span>
	</li>
	<li>
		<span class="label">Deficit days</span>
		<span class="value" class:neg={summary.deficitDayCount > 0}>{summary.deficitDayCount}</span>
	</li>
</ul>

<style>
	.stats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: var(--space-4);
	}

	li {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.label {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--text-tertiary);
	}

	.value {
		font-size: var(--text-lg);
		font-weight: var(--weight-medium);
		color: var(--text-primary);
	}

	.value.neg {
		color: var(--status-danger);
	}

	.meta {
		display: block;
		font-size: var(--text-xs);
		font-weight: var(--weight-regular);
		color: var(--text-tertiary);
		margin-top: 2px;
	}
</style>
