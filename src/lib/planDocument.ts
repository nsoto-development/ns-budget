import {
	assertIsoDate,
	daysInMonth,
	parseParts,
	weekdayOf,
	type CashFlowItem,
	type IsoDate,
	type RecurrenceRule
} from '$lib/scheduling';

export const PLAN_DOCUMENT_VERSION = 1 as const;

export interface PlanDocument {
	version: typeof PLAN_DOCUMENT_VERSION;
	name: string;
	startingBalance: number;
	startDate: IsoDate;
	horizonDays: number;
	items: CashFlowItem[];
}

export class PlanDocumentError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PlanDocumentError';
	}
}

export function serializePlan(plan: PlanDocument): string {
	return JSON.stringify(plan, null, 2);
}

export function parsePlan(raw: unknown): PlanDocument {
	const data = typeof raw === 'string' ? parseJson(raw) : raw;
	if (!isRecord(data)) {
		throw new PlanDocumentError('Plan must be a JSON object');
	}

	if (data.version !== PLAN_DOCUMENT_VERSION) {
		throw new PlanDocumentError(
			`Unsupported plan version: ${String(data.version)} (expected ${PLAN_DOCUMENT_VERSION})`
		);
	}

	if (typeof data.name !== 'string') {
		throw new PlanDocumentError('Plan name must be a string');
	}

	if (typeof data.startingBalance !== 'number' || !Number.isFinite(data.startingBalance)) {
		throw new PlanDocumentError('startingBalance must be a finite number');
	}

	if (typeof data.startDate !== 'string') {
		throw new PlanDocumentError('startDate must be a YYYY-MM-DD string');
	}
	assertCivilDate(data.startDate, 'startDate');

	if (
		typeof data.horizonDays !== 'number' ||
		!Number.isFinite(data.horizonDays) ||
		!Number.isInteger(data.horizonDays) ||
		data.horizonDays < 1
	) {
		throw new PlanDocumentError('horizonDays must be an integer >= 1');
	}

	if (!Array.isArray(data.items)) {
		throw new PlanDocumentError('items must be an array');
	}

	const items = data.items.map((item, index) => parseItem(item, index));

	return {
		version: PLAN_DOCUMENT_VERSION,
		name: data.name,
		startingBalance: data.startingBalance,
		startDate: data.startDate,
		horizonDays: data.horizonDays,
		items
	};
}

export function planFromEditor(input: {
	name: string;
	startingBalance: number;
	startDate: IsoDate;
	horizonDays: number;
	items: CashFlowItem[];
}): PlanDocument {
	return {
		version: PLAN_DOCUMENT_VERSION,
		name: input.name.trim() || 'Untitled',
		startingBalance: input.startingBalance,
		startDate: input.startDate,
		horizonDays: input.horizonDays,
		items: input.items
	};
}

function parseJson(raw: string): unknown {
	try {
		return JSON.parse(raw) as unknown;
	} catch {
		throw new PlanDocumentError('Invalid JSON');
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseItem(raw: unknown, index: number): CashFlowItem {
	if (!isRecord(raw)) {
		throw new PlanDocumentError(`items[${index}] must be an object`);
	}

	if (typeof raw.id !== 'string' || raw.id.length === 0) {
		throw new PlanDocumentError(`items[${index}].id must be a non-empty string`);
	}
	if (typeof raw.name !== 'string') {
		throw new PlanDocumentError(`items[${index}].name must be a string`);
	}
	if (typeof raw.amount !== 'number' || !Number.isFinite(raw.amount) || raw.amount < 0) {
		throw new PlanDocumentError(`items[${index}].amount must be a finite number >= 0`);
	}
	if (raw.kind !== 'income' && raw.kind !== 'bill') {
		throw new PlanDocumentError(`items[${index}].kind must be "income" or "bill"`);
	}

	return {
		id: raw.id,
		name: raw.name,
		amount: raw.amount,
		kind: raw.kind,
		recurrence: parseRecurrence(raw.recurrence, index)
	};
}

function parseRecurrence(raw: unknown, index: number): RecurrenceRule {
	if (!isRecord(raw) || typeof raw.kind !== 'string') {
		throw new PlanDocumentError(`items[${index}].recurrence must be an object with kind`);
	}

	switch (raw.kind) {
		case 'weekly': {
			const weekday = parseWeekday(raw.weekday, index);
			const intervalWeeks = raw.intervalWeeks;
			if (
				typeof intervalWeeks !== 'number' ||
				!Number.isInteger(intervalWeeks) ||
				intervalWeeks < 1
			) {
				throw new PlanDocumentError(
					`items[${index}].recurrence.intervalWeeks must be an integer >= 1`
				);
			}
			const anchor = parseAnchor(raw.anchor, index);
			if (weekdayOf(anchor) !== weekday) {
				throw new PlanDocumentError(
					`items[${index}].recurrence.anchor must fall on weekday ${weekday}`
				);
			}
			return { kind: 'weekly', weekday, intervalWeeks, anchor };
		}
		case 'biweekly': {
			const weekday = parseWeekday(raw.weekday, index);
			const anchor = parseAnchor(raw.anchor, index);
			if (weekdayOf(anchor) !== weekday) {
				throw new PlanDocumentError(
					`items[${index}].recurrence.anchor must fall on weekday ${weekday}`
				);
			}
			return { kind: 'biweekly', weekday, anchor };
		}
		case 'monthly': {
			const dayOfMonth = raw.dayOfMonth;
			if (
				typeof dayOfMonth !== 'number' ||
				!Number.isInteger(dayOfMonth) ||
				dayOfMonth < 1 ||
				dayOfMonth > 31
			) {
				throw new PlanDocumentError(`items[${index}].recurrence.dayOfMonth must be 1–31`);
			}
			return { kind: 'monthly', dayOfMonth };
		}
		case 'semiMonthly': {
			if (!Array.isArray(raw.days) || raw.days.length !== 2) {
				throw new PlanDocumentError(`items[${index}].recurrence.days must be [a, b]`);
			}
			const a = raw.days[0];
			const b = raw.days[1];
			if (
				typeof a !== 'number' ||
				typeof b !== 'number' ||
				!Number.isInteger(a) ||
				!Number.isInteger(b) ||
				a < 1 ||
				a > 31 ||
				b < 1 ||
				b > 31
			) {
				throw new PlanDocumentError(`items[${index}].recurrence.days must be integers 1–31`);
			}
			return { kind: 'semiMonthly', days: [a, b] };
		}
		case 'yearly': {
			const month = raw.month;
			const day = raw.day;
			if (typeof month !== 'number' || !Number.isInteger(month) || month < 1 || month > 12) {
				throw new PlanDocumentError(`items[${index}].recurrence.month must be 1–12`);
			}
			if (typeof day !== 'number' || !Number.isInteger(day) || day < 1 || day > 31) {
				throw new PlanDocumentError(`items[${index}].recurrence.day must be 1–31`);
			}
			return { kind: 'yearly', month, day };
		}
		default:
			throw new PlanDocumentError(`items[${index}].recurrence.kind is unsupported: ${raw.kind}`);
	}
}

function parseWeekday(value: unknown, index: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
	if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 6) {
		throw new PlanDocumentError(`items[${index}].recurrence.weekday must be 0–6`);
	}
	return value as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

function parseAnchor(value: unknown, index: number): IsoDate {
	if (typeof value !== 'string') {
		throw new PlanDocumentError(`items[${index}].recurrence.anchor must be a YYYY-MM-DD string`);
	}
	assertCivilDate(value, `items[${index}].recurrence.anchor`);
	return value;
}

/** Format check plus real calendar day (rejects e.g. 2026-02-30). */
function assertCivilDate(value: string, label: string): asserts value is IsoDate {
	try {
		assertIsoDate(value);
	} catch {
		throw new PlanDocumentError(`Invalid ${label}: ${value}`);
	}
	const { y, m, d } = parseParts(value);
	if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) {
		throw new PlanDocumentError(`Invalid ${label}: ${value}`);
	}
}
