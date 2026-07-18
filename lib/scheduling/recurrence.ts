import {
  addDays,
  assertIsoDate,
  clampDayOfMonth,
  compareDates,
  diffDays,
  fromParts,
  parseParts,
  toJulianDay,
  weekdayOf,
} from "./dates.js";
import type { IsoDate, RecurrenceRule } from "./types.js";

/**
 * Generate occurrence dates in `[rangeStart, rangeEnd]` (inclusive).
 */
export function generateOccurrences(
  rule: RecurrenceRule,
  rangeStart: IsoDate,
  rangeEnd: IsoDate,
): IsoDate[] {
  assertIsoDate(rangeStart);
  assertIsoDate(rangeEnd);
  if (compareDates(rangeStart, rangeEnd) > 0) {
    return [];
  }

  switch (rule.kind) {
    case "weekly":
      return weeklyOccurrences(rule, rangeStart, rangeEnd);
    case "biweekly":
      return biweeklyOccurrences(rule, rangeStart, rangeEnd);
    case "monthly":
      return monthlyOccurrences(rule.dayOfMonth, rangeStart, rangeEnd);
    case "semiMonthly":
      return semiMonthlyOccurrences(rule.days, rangeStart, rangeEnd);
    case "yearly":
      return yearlyOccurrences(rule.month, rule.day, rangeStart, rangeEnd);
  }
}

function weeklyOccurrences(
  rule: Extract<RecurrenceRule, { kind: "weekly" }>,
  rangeStart: IsoDate,
  rangeEnd: IsoDate,
): IsoDate[] {
  if (rule.intervalWeeks < 1) {
    throw new Error(`intervalWeeks must be >= 1, got ${rule.intervalWeeks}`);
  }
  assertIsoDate(rule.anchor);
  if (weekdayOf(rule.anchor) !== rule.weekday) {
    throw new Error(
      `weekly anchor ${rule.anchor} must fall on weekday ${rule.weekday}`,
    );
  }

  const intervalDays = rule.intervalWeeks * 7;
  const anchorJd = toJulianDay(rule.anchor);
  const startJd = toJulianDay(rangeStart);
  const endJd = toJulianDay(rangeEnd);

  // First candidate on-or-after rangeStart that is on the cycle and weekday.
  let k = Math.ceil((startJd - anchorJd) / intervalDays);
  if (k < 0) k = 0;

  const out: IsoDate[] = [];
  for (;;) {
    const jd = anchorJd + k * intervalDays;
    if (jd > endJd) break;
    if (jd >= startJd) {
      const date = addDays(rule.anchor, k * intervalDays);
      if (weekdayOf(date) !== rule.weekday) {
        throw new Error(`internal: weekly date ${date} off weekday`);
      }
      out.push(date);
    }
    k += 1;
  }
  return out;
}

function biweeklyOccurrences(
  rule: Extract<RecurrenceRule, { kind: "biweekly" }>,
  rangeStart: IsoDate,
  rangeEnd: IsoDate,
): IsoDate[] {
  return weeklyOccurrences(
    {
      kind: "weekly",
      weekday: rule.weekday,
      intervalWeeks: 2,
      anchor: rule.anchor,
    },
    rangeStart,
    rangeEnd,
  );
}

function monthlyOccurrences(
  dayOfMonth: number,
  rangeStart: IsoDate,
  rangeEnd: IsoDate,
): IsoDate[] {
  if (dayOfMonth < 1 || dayOfMonth > 31) {
    throw new Error(`dayOfMonth must be 1–31, got ${dayOfMonth}`);
  }

  const start = parseParts(rangeStart);
  const end = parseParts(rangeEnd);
  const out: IsoDate[] = [];

  let y = start.y;
  let m = start.m;
  while (y < end.y || (y === end.y && m <= end.m)) {
    const d = clampDayOfMonth(y, m, dayOfMonth);
    const date = fromParts(y, m, d);
    if (compareDates(date, rangeStart) >= 0 && compareDates(date, rangeEnd) <= 0) {
      out.push(date);
    }
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

function semiMonthlyOccurrences(
  days: [number, number],
  rangeStart: IsoDate,
  rangeEnd: IsoDate,
): IsoDate[] {
  const [a, b] = days;
  const set = new Set<IsoDate>();
  for (const day of [a, b]) {
    for (const d of monthlyOccurrences(day, rangeStart, rangeEnd)) {
      set.add(d);
    }
  }
  return [...set].sort(compareDates);
}

function yearlyOccurrences(
  month: number,
  day: number,
  rangeStart: IsoDate,
  rangeEnd: IsoDate,
): IsoDate[] {
  if (month < 1 || month > 12) {
    throw new Error(`month must be 1–12, got ${month}`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`day must be 1–31, got ${day}`);
  }

  const startY = parseParts(rangeStart).y;
  const endY = parseParts(rangeEnd).y;
  const out: IsoDate[] = [];

  for (let y = startY; y <= endY; y += 1) {
    const d = clampDayOfMonth(y, month, day);
    const date = fromParts(y, month, d);
    if (compareDates(date, rangeStart) >= 0 && compareDates(date, rangeEnd) <= 0) {
      out.push(date);
    }
  }
  return out;
}

/** Inclusive end date for a horizon starting at `startDate`. */
export function endDateForHorizon(startDate: IsoDate, horizonDays: number): IsoDate {
  if (horizonDays < 1) {
    throw new Error(`horizonDays must be >= 1, got ${horizonDays}`);
  }
  return addDays(startDate, horizonDays - 1);
}

export function daysBetweenInclusive(start: IsoDate, end: IsoDate): number {
  return diffDays(end, start) + 1;
}
