import { parsePlan, serializePlan, type PlanDocument } from '$lib/planDocument';

export function downloadPlanFile(plan: PlanDocument, filename = 'ns-budget-plan.json'): void {
	const blob = new Blob([serializePlan(plan)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

export async function readPlanFile(file: File): Promise<PlanDocument> {
	const text = await file.text();
	return parsePlan(text);
}
