import { eachDayInclusive } from "./dates.js";
import { endDateForHorizon } from "./recurrence.js";
import { generateEvents, groupEventsByDate } from "./events.js";
import type {
  BalancePoint,
  DailyDelta,
  ScheduleInput,
  ScheduleResult,
  ScheduleSummary,
} from "./types.js";

/**
 * Project running balance day-by-day.
 * Same-day: all incomes applied before all bills (via event sort).
 */
export function projectSchedule(input: ScheduleInput): ScheduleResult {
  const events = generateEvents(input);
  const byDate = groupEventsByDate(events);
  const rangeEnd = endDateForHorizon(input.startDate, input.horizonDays);
  const days = eachDayInclusive(input.startDate, rangeEnd);

  const series: BalancePoint[] = [];
  const dailyDeltas: DailyDelta[] = [];
  let balance = input.startingBalance;
  let minBalance = balance;
  let minBalanceDate = input.startDate;
  let firstDeficitDate: string | null = balance < 0 ? input.startDate : null;
  let deficitDayCount = 0;

  // Starting balance is the balance at the start of startDate, before events.
  // We record end-of-day balance after applying that day's events.
  for (const date of days) {
    const dayEvents = byDate.get(date) ?? [];
    let delta = 0;
    for (const event of dayEvents) {
      delta += event.amount;
      balance += event.amount;
    }

    dailyDeltas.push({ date, delta });
    series.push({ date, balance, events: dayEvents });

    if (balance < minBalance) {
      minBalance = balance;
      minBalanceDate = date;
    }
    if (balance < 0) {
      deficitDayCount += 1;
      if (firstDeficitDate === null) {
        firstDeficitDate = date;
      }
    }
  }

  const last = series[series.length - 1];
  const summary: ScheduleSummary = {
    endingBalance: last?.balance ?? input.startingBalance,
    minBalance,
    minBalanceDate,
    firstDeficitDate,
    deficitDayCount,
  };

  return { events, series, summary, dailyDeltas };
}
