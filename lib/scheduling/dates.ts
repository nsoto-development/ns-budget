import type { IsoDate, Weekday } from "./types.js";

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function assertIsoDate(value: string): asserts value is IsoDate {
  if (!ISO_RE.test(value)) {
    throw new Error(`Invalid IsoDate: ${value}`);
  }
  const parts = parseParts(value);
  const clamped = fromParts(parts.y, parts.m, parts.d);
  if (clamped !== value) {
    throw new Error(`Invalid calendar date: ${value}`);
  }
}

export function parseParts(iso: IsoDate): { y: number; m: number; d: number } {
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7));
  const d = Number(iso.slice(8, 10));
  return { y, m, d };
}

export function fromParts(y: number, m: number, d: number): IsoDate {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  switch (m) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return isLeapYear(y) ? 29 : 28;
    default:
      throw new Error(`Invalid month: ${m}`);
  }
}

/** Clamp day-of-month into a valid day for `(y, m)`. */
export function clampDayOfMonth(y: number, m: number, day: number): number {
  if (day < 1) {
    throw new Error(`dayOfMonth must be >= 1, got ${day}`);
  }
  const dim = daysInMonth(y, m);
  return Math.min(day, dim);
}

/** Julian day number (Gregorian) for civil-date arithmetic. */
export function toJulianDay(iso: IsoDate): number {
  const { y, m, d } = parseParts(iso);
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

export function fromJulianDay(jd: number): IsoDate {
  let a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return fromParts(year, month, day);
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  return fromJulianDay(toJulianDay(iso) + days);
}

export function diffDays(a: IsoDate, b: IsoDate): number {
  return toJulianDay(a) - toJulianDay(b);
}

export function compareDates(a: IsoDate, b: IsoDate): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Weekday for an ISO date (UTC civil calendar). */
export function weekdayOf(iso: IsoDate): Weekday {
  // 0 = Monday in some JD formulas; convert via known epoch.
  // Julian day 0 is Monday historically for this algorithm;
  // we use Date UTC for weekday to match JS convention (Sun=0).
  const { y, m, d } = parseParts(iso);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return wd as Weekday;
}

export function eachDayInclusive(start: IsoDate, end: IsoDate): IsoDate[] {
  if (compareDates(start, end) > 0) {
    return [];
  }
  const out: IsoDate[] = [];
  let cur = start;
  while (compareDates(cur, end) <= 0) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}
