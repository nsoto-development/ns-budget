import { assertIsoDate, compareDates } from "./dates.js";
import { endDateForHorizon, generateOccurrences } from "./recurrence.js";
import type {
  CashFlowEvent,
  CashFlowItem,
  IsoDate,
  ScheduleInput,
} from "./types.js";

function signedAmount(item: CashFlowItem): number {
  if (item.amount < 0) {
    throw new Error(`amount must be >= 0, got ${item.amount} for ${item.id}`);
  }
  return item.kind === "income" ? item.amount : -item.amount;
}

/**
 * Expand all items into dated events in the projection window.
 * Same-day order is applied later in the balance step (incomes then bills).
 */
export function generateEvents(input: ScheduleInput): CashFlowEvent[] {
  assertIsoDate(input.startDate);
  if (input.horizonDays < 1) {
    throw new Error(`horizonDays must be >= 1, got ${input.horizonDays}`);
  }

  const rangeEnd = endDateForHorizon(input.startDate, input.horizonDays);
  const events: CashFlowEvent[] = [];

  for (const item of input.items) {
    const dates = generateOccurrences(
      item.recurrence,
      input.startDate,
      rangeEnd,
    );
    const amount = signedAmount(item);
    for (const date of dates) {
      events.push({
        date,
        itemId: item.id,
        name: item.name,
        amount,
        kind: item.kind,
      });
    }
  }

  events.sort((a, b) => {
    const byDate = compareDates(a.date, b.date);
    if (byDate !== 0) return byDate;
    // Stable secondary: incomes before bills, then id.
    if (a.kind !== b.kind) {
      return a.kind === "income" ? -1 : 1;
    }
    return a.itemId < b.itemId ? -1 : a.itemId > b.itemId ? 1 : 0;
  });

  return events;
}

export function groupEventsByDate(
  events: CashFlowEvent[],
): Map<IsoDate, CashFlowEvent[]> {
  const map = new Map<IsoDate, CashFlowEvent[]>();
  for (const event of events) {
    const list = map.get(event.date);
    if (list) {
      list.push(event);
    } else {
      map.set(event.date, [event]);
    }
  }
  return map;
}
