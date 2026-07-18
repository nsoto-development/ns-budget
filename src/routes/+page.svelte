<script lang="ts">
	import BalanceChart from '$lib/components/BalanceChart.svelte';
	import CashFlowItemEditor from '$lib/components/CashFlowItemEditor.svelte';
	import SummaryStats from '$lib/components/SummaryStats.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { createDemoPlan } from '$lib/demoPlan';
	import { blankItem } from '$lib/recurrenceUi';
	import { projectSchedule, type CashFlowItem } from '$lib/scheduling';

	const demo = createDemoPlan();

	let startDate = $state(demo.startDate);
	let items = $state<CashFlowItem[]>(demo.items);
	let balanceStr = $state(String(demo.startingBalance));
	let horizonStr = $state(String(demo.horizonDays));

	const result = $derived.by(() => {
		const balance = Number(balanceStr);
		const horizon = Number(horizonStr);
		return projectSchedule({
			startingBalance: Number.isFinite(balance) ? balance : 0,
			startDate,
			horizonDays: Number.isFinite(horizon) && horizon >= 1 ? Math.floor(horizon) : 1,
			items
		});
	});

	function replaceItem(id: string, next: CashFlowItem) {
		items = items.map((it) => (it.id === id ? next : it));
	}

	function removeItem(id: string) {
		items = items.filter((it) => it.id !== id);
	}

	function addItem(kind: CashFlowItem['kind']) {
		items = [...items, blankItem(kind, startDate)];
	}

	function resetDemo() {
		const next = createDemoPlan();
		startDate = next.startDate;
		items = next.items;
		balanceStr = String(next.startingBalance);
		horizonStr = String(next.horizonDays);
	}

	const incomes = $derived(items.filter((i) => i.kind === 'income'));
	const bills = $derived(items.filter((i) => i.kind === 'bill'));
</script>

<main class="page">
	<header class="intro">
		<h2>Cash flow scheduler</h2>
		<p class="lede">
			Configure recurring income and bills, then project a running balance. Demo data is synthetic —
			enter your own figures; nothing is saved yet.
		</p>
	</header>

	<section class="grid">
		<Card class="panel">
			<div class="panel-head">
				<h2>Projection inputs</h2>
				<Button variant="ghost" size="sm" onclick={resetDemo}>Reset demo</Button>
			</div>
			<div class="inputs">
				<Input label="Starting balance" type="number" bind:value={balanceStr} />
				<Input label="Start date" type="date" bind:value={startDate} />
				<Input label="Horizon (days)" type="number" min="1" bind:value={horizonStr} />
			</div>
		</Card>

		<Card class="panel">
			<h2>Summary</h2>
			<SummaryStats summary={result.summary} />
		</Card>
	</section>

	<section class="chart-section">
		<Card>
			<div class="panel-head">
				<h2>Running balance</h2>
				<p class="hint">Red bands mark days below zero.</p>
			</div>
			<BalanceChart series={result.series} />
		</Card>
	</section>

	<section class="lists">
		<Card>
			<div class="panel-head">
				<h2>Income</h2>
				<Button variant="secondary" size="sm" onclick={() => addItem('income')}>Add income</Button>
			</div>
			{#if incomes.length === 0}
				<p class="empty">No income sources yet.</p>
			{:else}
				<ul class="item-list">
					{#each incomes as item (item.id)}
						<li>
							<CashFlowItemEditor
								{item}
								{startDate}
								onchange={(next) => replaceItem(item.id, next)}
								onremove={() => removeItem(item.id)}
							/>
						</li>
					{/each}
				</ul>
			{/if}
		</Card>

		<Card>
			<div class="panel-head">
				<h2>Bills</h2>
				<Button variant="secondary" size="sm" onclick={() => addItem('bill')}>Add bill</Button>
			</div>
			{#if bills.length === 0}
				<p class="empty">No bills yet.</p>
			{:else}
				<ul class="item-list">
					{#each bills as item (item.id)}
						<li>
							<CashFlowItemEditor
								{item}
								{startDate}
								onchange={(next) => replaceItem(item.id, next)}
								onremove={() => removeItem(item.id)}
							/>
						</li>
					{/each}
				</ul>
			{/if}
		</Card>
	</section>
</main>

<style>
	.page {
		max-width: 1080px;
		margin: 0 auto;
		padding: var(--space-6) var(--space-5) var(--space-10);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.intro h2 {
		margin: 0 0 var(--space-3);
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3vw, 2rem);
		letter-spacing: var(--tracking-tight);
	}

	.lede {
		margin: 0;
		max-width: 40rem;
		color: var(--text-secondary);
		font-size: var(--text-md);
		line-height: 1.55;
	}

	.grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: var(--space-4);
	}

	.panel-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: var(--weight-medium);
	}

	.inputs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
	}

	.hint,
	.empty {
		margin: 0;
		color: var(--text-tertiary);
		font-size: var(--text-sm);
	}

	.lists {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.item-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.item-list li {
		padding-bottom: var(--space-5);
		border-bottom: 1px solid var(--border-subtle);
	}

	.item-list li:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	@media (max-width: 800px) {
		.grid,
		.inputs {
			grid-template-columns: 1fr;
		}
	}
</style>
