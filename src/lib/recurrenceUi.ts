import type { CashFlowItem, RecurrenceRule } from '$lib/scheduling';

export type RecurrenceKind = RecurrenceRule['kind'];

export const recurrenceOptions: { value: RecurrenceKind; label: string }[] = [
	{ value: 'weekly', label: 'Weekly' },
	{ value: 'biweekly', label: 'Biweekly' },
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'semiMonthly', label: 'Semi-monthly' },
	{ value: 'yearly', label: 'Yearly' }
];

export const weekdayOptions = [
	{ value: '0', label: 'Sunday' },
	{ value: '1', label: 'Monday' },
	{ value: '2', label: 'Tuesday' },
	{ value: '3', label: 'Wednesday' },
	{ value: '4', label: 'Thursday' },
	{ value: '5', label: 'Friday' },
	{ value: '6', label: 'Saturday' }
];

export function defaultRecurrence(kind: RecurrenceKind, anchor: string): RecurrenceRule {
	switch (kind) {
		case 'weekly':
			return { kind: 'weekly', weekday: 5, intervalWeeks: 1, anchor };
		case 'biweekly':
			return { kind: 'biweekly', weekday: 5, anchor };
		case 'monthly':
			return { kind: 'monthly', dayOfMonth: 1 };
		case 'semiMonthly':
			return { kind: 'semiMonthly', days: [1, 15] };
		case 'yearly':
			return { kind: 'yearly', month: 1, day: 1 };
	}
}

export function blankItem(kind: CashFlowItem['kind'], startDate: string): CashFlowItem {
	return {
		id: `item-${crypto.randomUUID().slice(0, 8)}`,
		name: kind === 'income' ? 'New income' : 'New bill',
		amount: kind === 'income' ? 1000 : 100,
		kind,
		recurrence: defaultRecurrence('monthly', startDate)
	};
}
