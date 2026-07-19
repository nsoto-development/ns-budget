<script lang="ts">
	import type { BalancePoint } from '$lib/scheduling';

	interface Props {
		series: BalancePoint[];
	}

	let { series }: Props = $props();

	const width = 720;
	const height = 280;
	const pad = { top: 16, right: 16, bottom: 36, left: 64 };

	const plot = $derived.by(() => {
		if (series.length === 0) {
			return null;
		}

		const balances = series.map((p) => p.balance);
		const minB = Math.min(...balances, 0);
		const maxB = Math.max(...balances, 0);
		const span = maxB - minB || 1;
		const innerW = width - pad.left - pad.right;
		const innerH = height - pad.top - pad.bottom;

		const xAt = (i: number) =>
			pad.left + (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
		const yAt = (b: number) => pad.top + ((maxB - b) / span) * innerH;

		const zeroY = yAt(0);

		let path = '';
		for (let i = 0; i < series.length; i++) {
			const point = series[i]!;
			const cmd = i === 0 ? 'M' : 'L';
			path += `${cmd}${xAt(i).toFixed(1)},${yAt(point.balance).toFixed(1)} `;
		}

		const deficitSpans: { x1: number; x2: number }[] = [];
		let runStart: number | null = null;
		for (let i = 0; i < series.length; i++) {
			const neg = series[i]!.balance < 0;
			if (neg && runStart === null) runStart = i;
			if ((!neg || i === series.length - 1) && runStart !== null) {
				const end = neg && i === series.length - 1 ? i : i - 1;
				deficitSpans.push({ x1: xAt(runStart), x2: xAt(end) });
				runStart = null;
			}
		}

		const mid = series[Math.floor(series.length / 2)]!;
		const last = series[series.length - 1]!;

		const dots = series
			.map((point, i) => ({
				date: point.date,
				x: xAt(i),
				y: yAt(point.balance),
				neg: point.balance < 0
			}))
			.filter((d) => d.neg);

		return {
			path: path.trim(),
			zeroY,
			deficitSpans,
			minB,
			maxB,
			dots,
			labels: {
				start: series[0]!.date,
				mid: mid.date,
				end: last.date
			}
		};
	});

	function fmt(n: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(n);
	}
</script>

{#if plot}
	<svg
		class="chart"
		viewBox="0 0 {width} {height}"
		role="img"
		aria-label="Running balance over the projection horizon"
	>
		{#each plot.deficitSpans as span (span.x1)}
			<rect
				x={span.x1}
				y={pad.top}
				width={Math.max(span.x2 - span.x1, 2)}
				height={height - pad.top - pad.bottom}
				class="deficit-band"
			/>
		{/each}

		<line x1={pad.left} y1={plot.zeroY} x2={width - pad.right} y2={plot.zeroY} class="zero" />

		<path d={plot.path} class="line" fill="none" />

		{#each plot.dots as dot (dot.date)}
			<circle cx={dot.x} cy={dot.y} r="2.2" class="deficit-dot" />
		{/each}

		<text x={pad.left} y={height - 10} class="axis">{plot.labels.start}</text>
		<text x={width / 2} y={height - 10} text-anchor="middle" class="axis axis-mid"
			>{plot.labels.mid}</text
		>
		<text x={width - pad.right} y={height - 10} text-anchor="end" class="axis"
			>{plot.labels.end}</text
		>

		<text x={6} y={pad.top + 4} class="axis">{fmt(plot.maxB)}</text>
		<text x={6} y={height - pad.bottom} class="axis">{fmt(plot.minB)}</text>
	</svg>
{:else}
	<p class="empty">Add a horizon with at least one day to see the chart.</p>
{/if}

<style>
	.chart {
		width: 100%;
		height: auto;
		display: block;
	}

	.deficit-band {
		fill: rgba(239, 68, 68, 0.12);
	}

	.zero {
		stroke: var(--border-strong);
		stroke-dasharray: 4 4;
		stroke-width: 1;
	}

	.line {
		stroke: var(--brand);
		stroke-width: 2.25;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.deficit-dot {
		fill: var(--status-danger);
	}

	.axis {
		fill: var(--text-tertiary);
		font-family: var(--font-mono);
		font-size: 10px;
	}

	@media (max-width: 640px) {
		.axis {
			font-size: 9px;
		}

		.axis-mid {
			display: none;
		}
	}

	.empty {
		color: var(--text-secondary);
		font-size: var(--text-sm);
		margin: 0;
	}
</style>
