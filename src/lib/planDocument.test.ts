import { describe, expect, it } from 'vitest';
import {
	PLAN_DOCUMENT_VERSION,
	parsePlan,
	PlanDocumentError,
	planFromEditor,
	serializePlan,
	type PlanDocument
} from './planDocument';

const sample: PlanDocument = {
	version: PLAN_DOCUMENT_VERSION,
	name: 'Demo',
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
			id: 'rent',
			name: 'Rent',
			amount: 1450,
			kind: 'bill',
			recurrence: {
				kind: 'monthly',
				dayOfMonth: 1
			}
		}
	]
};

describe('planDocument', () => {
	it('round-trips serialize → parse', () => {
		const parsed = parsePlan(serializePlan(sample));
		expect(parsed).toEqual(sample);
	});

	it('parses object input without double-encoding', () => {
		expect(parsePlan(sample)).toEqual(sample);
	});

	it('planFromEditor defaults blank name to Untitled', () => {
		const plan = planFromEditor({
			name: '   ',
			startingBalance: 0,
			startDate: '2026-01-01',
			horizonDays: 30,
			items: []
		});
		expect(plan.name).toBe('Untitled');
		expect(plan.version).toBe(1);
	});

	it('rejects invalid JSON', () => {
		expect(() => parsePlan('{')).toThrow(PlanDocumentError);
	});

	it('rejects unsupported version', () => {
		expect(() => parsePlan({ ...sample, version: 99 })).toThrow(/Unsupported plan version/);
	});

	it('rejects non-object root', () => {
		expect(() => parsePlan([])).toThrow(/JSON object/);
	});

	it('rejects bad startDate', () => {
		expect(() => parsePlan({ ...sample, startDate: '2026-02-30' })).toThrow(/startDate/);
		expect(() => parsePlan({ ...sample, startDate: 'not-a-date' })).toThrow(/startDate/);
	});

	it('rejects horizonDays < 1', () => {
		expect(() => parsePlan({ ...sample, horizonDays: 0 })).toThrow(/horizonDays/);
	});

	it('rejects weekly anchor on wrong weekday', () => {
		expect(() =>
			parsePlan({
				...sample,
				items: [
					{
						id: 'x',
						name: 'X',
						amount: 10,
						kind: 'bill',
						recurrence: {
							kind: 'weekly',
							weekday: 0,
							intervalWeeks: 1,
							anchor: '2026-07-03'
						}
					}
				]
			})
		).toThrow(/anchor must fall on weekday/);
	});

	it('rejects unknown recurrence kind', () => {
		expect(() =>
			parsePlan({
				...sample,
				items: [
					{
						id: 'x',
						name: 'X',
						amount: 10,
						kind: 'income',
						recurrence: { kind: 'daily' }
					}
				]
			})
		).toThrow(/unsupported/);
	});
});
