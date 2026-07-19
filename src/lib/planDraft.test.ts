import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { PLAN_DOCUMENT_VERSION, type PlanDocument } from './planDocument';
import { clearDraft, loadDraft, PLAN_DRAFT_STORAGE_KEY, saveDraft } from './planDraft';

beforeAll(() => {
	const map = new Map<string, string>();
	Object.defineProperty(globalThis, 'localStorage', {
		configurable: true,
		value: {
			getItem: (key: string) => map.get(key) ?? null,
			setItem: (key: string, value: string) => {
				map.set(key, value);
			},
			removeItem: (key: string) => {
				map.delete(key);
			},
			clear: () => {
				map.clear();
			}
		}
	});
});

const sample: PlanDocument = {
	version: PLAN_DOCUMENT_VERSION,
	name: 'Draft',
	startingBalance: 100,
	startDate: '2026-07-01',
	horizonDays: 14,
	items: []
};

afterEach(() => {
	clearDraft();
});

describe('planDraft', () => {
	it('round-trips save → load', () => {
		saveDraft(sample);
		expect(loadDraft()).toEqual(sample);
	});

	it('returns null when empty', () => {
		expect(loadDraft()).toBeNull();
	});

	it('returns null for corrupt storage and leaves key', () => {
		localStorage.setItem(PLAN_DRAFT_STORAGE_KEY, '{not-json');
		expect(loadDraft()).toBeNull();
	});

	it('clearDraft removes the key', () => {
		saveDraft(sample);
		clearDraft();
		expect(localStorage.getItem(PLAN_DRAFT_STORAGE_KEY)).toBeNull();
	});
});
