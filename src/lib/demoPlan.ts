import type { CashFlowItem, IsoDate } from '$lib/scheduling';

/** Synthetic demo seed — not real personal finances. */
export interface DemoPlanState {
	startingBalance: number;
	startDate: IsoDate;
	horizonDays: number;
	items: CashFlowItem[];
}

export function createDemoPlan(): DemoPlanState {
	return {
		startingBalance: 2400,
		startDate: '2026-07-01',
		horizonDays: 90,
		items: [
			{
				id: 'paycheck',
				name: 'Paycheck',
				amount: 2200,
				kind: 'income',
				recurrence: {
					kind: 'biweekly',
					weekday: 5,
					anchor: '2026-07-03'
				}
			},
			{
				id: 'side-gig',
				name: 'Side gig',
				amount: 400,
				kind: 'income',
				recurrence: {
					kind: 'monthly',
					dayOfMonth: 15
				}
			},
			{
				id: 'rent',
				name: 'Rent',
				amount: 1450,
				kind: 'bill',
				recurrence: {
					kind: 'monthly',
					dayOfMonth: 1
				}
			},
			{
				id: 'utilities',
				name: 'Utilities',
				amount: 180,
				kind: 'bill',
				recurrence: {
					kind: 'monthly',
					dayOfMonth: 12
				}
			},
			{
				id: 'groceries',
				name: 'Groceries',
				amount: 120,
				kind: 'bill',
				recurrence: {
					kind: 'weekly',
					weekday: 0,
					intervalWeeks: 1,
					anchor: '2026-07-05'
				}
			}
		]
	};
}
