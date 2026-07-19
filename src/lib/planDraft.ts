import { parsePlan, serializePlan, type PlanDocument } from '$lib/planDocument';

export const PLAN_DRAFT_STORAGE_KEY = 'ns-budget:plan-draft:v1';

function storage(): Storage | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		return localStorage;
	} catch {
		return null;
	}
}

export function loadDraft(): PlanDocument | null {
	const store = storage();
	if (!store) return null;

	const raw = store.getItem(PLAN_DRAFT_STORAGE_KEY);
	if (raw == null || raw === '') return null;

	try {
		return parsePlan(raw);
	} catch {
		return null;
	}
}

export function saveDraft(plan: PlanDocument): void {
	const store = storage();
	if (!store) return;
	store.setItem(PLAN_DRAFT_STORAGE_KEY, serializePlan(plan));
}

export function clearDraft(): void {
	const store = storage();
	if (!store) return;
	store.removeItem(PLAN_DRAFT_STORAGE_KEY);
}
