<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { addDays, weekdayOf, type CashFlowItem, type Weekday } from '$lib/scheduling';
	import {
		defaultRecurrence,
		recurrenceOptions,
		weekdayOptions,
		type RecurrenceKind
	} from '$lib/recurrenceUi';

	interface Props {
		item: CashFlowItem;
		startDate: string;
		onchange: (item: CashFlowItem) => void;
		onremove: () => void;
	}

	let { item, startDate, onchange, onremove }: Props = $props();

	const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

	/** Weekly/biweekly require anchor's weekday to equal the rule weekday. */
	function alignAnchor(anchor: string, weekday: Weekday): string {
		if (!ISO_DATE.test(anchor)) return anchor;
		try {
			const diff = (weekday - weekdayOf(anchor) + 7) % 7;
			return diff === 0 ? anchor : addDays(anchor, diff);
		} catch {
			return anchor;
		}
	}

	function weekdayForAnchor(anchor: string, fallback: Weekday): Weekday {
		if (!ISO_DATE.test(anchor)) return fallback;
		try {
			return weekdayOf(anchor);
		} catch {
			return fallback;
		}
	}

	function patch(partial: Partial<CashFlowItem>) {
		onchange({ ...item, ...partial });
	}

	function setKind(kind: RecurrenceKind) {
		if (
			(kind === 'weekly' || kind === 'biweekly') &&
			(item.recurrence.kind === 'weekly' || item.recurrence.kind === 'biweekly')
		) {
			if (kind === 'weekly') {
				patch({
					recurrence: {
						kind: 'weekly',
						weekday: item.recurrence.weekday,
						intervalWeeks: item.recurrence.kind === 'weekly' ? item.recurrence.intervalWeeks : 1,
						anchor: item.recurrence.anchor
					}
				});
				return;
			}
			patch({
				recurrence: {
					kind: 'biweekly',
					weekday: item.recurrence.weekday,
					anchor: item.recurrence.anchor
				}
			});
			return;
		}
		patch({ recurrence: defaultRecurrence(kind, startDate) });
	}

	const amountStr = $derived(String(item.amount));
</script>

<div class="row">
	<div class="grow">
		<Input label="Name" value={item.name} oninput={(e) => patch({ name: e.currentTarget.value })} />
	</div>
	<div class="amount">
		<Input
			label="Amount"
			type="number"
			min="0"
			step="1"
			value={amountStr}
			oninput={(e) => {
				const n = Number(e.currentTarget.value);
				if (Number.isFinite(n) && n >= 0) patch({ amount: n });
			}}
		/>
	</div>
	<div class="freq">
		<Select
			label="Frequency"
			options={recurrenceOptions}
			value={item.recurrence.kind}
			onchange={(e) => setKind(e.currentTarget.value as RecurrenceKind)}
		/>
	</div>
	<div class="actions">
		<Button variant="danger" size="sm" onclick={onremove}>Remove</Button>
	</div>
</div>

<div class="details">
	{#if item.recurrence.kind === 'weekly'}
		{@const r = item.recurrence}
		<Select
			label="Weekday"
			options={weekdayOptions}
			value={String(r.weekday)}
			onchange={(e) => {
				const weekday = Number(e.currentTarget.value) as Weekday;
				patch({
					recurrence: {
						kind: 'weekly',
						weekday,
						intervalWeeks: r.intervalWeeks,
						anchor: alignAnchor(r.anchor, weekday)
					}
				});
			}}
		/>
		<Input
			label="Every N weeks"
			type="number"
			min="1"
			value={String(r.intervalWeeks)}
			oninput={(e) => {
				const n = Number(e.currentTarget.value);
				if (Number.isFinite(n) && n >= 1) {
					patch({
						recurrence: {
							kind: 'weekly',
							weekday: r.weekday,
							intervalWeeks: n,
							anchor: r.anchor
						}
					});
				}
			}}
		/>
		<Input
			label="Anchor"
			type="date"
			value={r.anchor}
			oninput={(e) => {
				const anchor = e.currentTarget.value;
				patch({
					recurrence: {
						kind: 'weekly',
						weekday: weekdayForAnchor(anchor, r.weekday),
						intervalWeeks: r.intervalWeeks,
						anchor
					}
				});
			}}
		/>
	{:else if item.recurrence.kind === 'biweekly'}
		{@const r = item.recurrence}
		<Select
			label="Weekday"
			options={weekdayOptions}
			value={String(r.weekday)}
			onchange={(e) => {
				const weekday = Number(e.currentTarget.value) as Weekday;
				patch({
					recurrence: {
						kind: 'biweekly',
						weekday,
						anchor: alignAnchor(r.anchor, weekday)
					}
				});
			}}
		/>
		<Input
			label="Anchor"
			type="date"
			value={r.anchor}
			oninput={(e) => {
				const anchor = e.currentTarget.value;
				patch({
					recurrence: {
						kind: 'biweekly',
						weekday: weekdayForAnchor(anchor, r.weekday),
						anchor
					}
				});
			}}
		/>
	{:else if item.recurrence.kind === 'monthly'}
		{@const r = item.recurrence}
		<Input
			label="Day of month"
			type="number"
			min="1"
			max="31"
			value={String(r.dayOfMonth)}
			oninput={(e) => {
				const n = Number(e.currentTarget.value);
				if (Number.isFinite(n) && n >= 1 && n <= 31) {
					patch({ recurrence: { kind: 'monthly', dayOfMonth: n } });
				}
			}}
		/>
	{:else if item.recurrence.kind === 'semiMonthly'}
		{@const r = item.recurrence}
		<Input
			label="First day"
			type="number"
			min="1"
			max="31"
			value={String(r.days[0])}
			oninput={(e) => {
				const n = Number(e.currentTarget.value);
				if (Number.isFinite(n) && n >= 1 && n <= 31) {
					patch({ recurrence: { kind: 'semiMonthly', days: [n, r.days[1]] } });
				}
			}}
		/>
		<Input
			label="Second day"
			type="number"
			min="1"
			max="31"
			value={String(r.days[1])}
			oninput={(e) => {
				const n = Number(e.currentTarget.value);
				if (Number.isFinite(n) && n >= 1 && n <= 31) {
					patch({ recurrence: { kind: 'semiMonthly', days: [r.days[0], n] } });
				}
			}}
		/>
	{:else if item.recurrence.kind === 'yearly'}
		{@const r = item.recurrence}
		<Input
			label="Month"
			type="number"
			min="1"
			max="12"
			value={String(r.month)}
			oninput={(e) => {
				const n = Number(e.currentTarget.value);
				if (Number.isFinite(n) && n >= 1 && n <= 12) {
					patch({ recurrence: { kind: 'yearly', month: n, day: r.day } });
				}
			}}
		/>
		<Input
			label="Day"
			type="number"
			min="1"
			max="31"
			value={String(r.day)}
			oninput={(e) => {
				const n = Number(e.currentTarget.value);
				if (Number.isFinite(n) && n >= 1 && n <= 31) {
					patch({ recurrence: { kind: 'yearly', month: r.month, day: n } });
				}
			}}
		/>
	{/if}
</div>

<style>
	.row {
		display: grid;
		grid-template-columns: 1.4fr 0.7fr 0.9fr auto;
		gap: var(--space-3);
		align-items: end;
	}

	.details {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: var(--space-3);
		margin-top: var(--space-3);
	}

	.actions {
		padding-bottom: 2px;
	}

	@media (max-width: 720px) {
		.row {
			grid-template-columns: 1fr 1fr;
		}

		.actions {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 480px) {
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
