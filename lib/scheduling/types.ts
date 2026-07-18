/**
 * Calendar dates as `YYYY-MM-DD` strings. No timezones / DST —
 * all arithmetic is civil-calendar only.
 */
export type IsoDate = string;

/** Sunday = 0 … Saturday = 6 (matches `Date.getUTCDay()`). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Recurrence vocabulary (M1).
 * Amounts live on the cash-flow item; rules only describe when.
 */
export type RecurrenceRule =
  | {
      kind: "weekly";
      /** Day of week for each occurrence. */
      weekday: Weekday;
      /** Repeat every N weeks (1 = every week). */
      intervalWeeks: number;
      /** Alignment epoch — first week of the cycle. */
      anchor: IsoDate;
    }
  | {
      kind: "biweekly";
      weekday: Weekday;
      /** Occurrences every 14 days from this date (must fall on `weekday`). */
      anchor: IsoDate;
    }
  | {
      kind: "monthly";
      /** 1–31; clamped to last day of each month. */
      dayOfMonth: number;
    }
  | {
      kind: "semiMonthly";
      /** Two days per month (1–31 each); each clamped independently. */
      days: [number, number];
    }
  | {
      kind: "yearly";
      /** 1–12 */
      month: number;
      /** 1–31; Feb 29 clamps to Feb 28 in non-leap years. */
      day: number;
    };

export type CashFlowKind = "income" | "bill";

export interface CashFlowItem {
  id: string;
  name: string;
  /** Always positive; sign comes from `kind`. */
  amount: number;
  kind: CashFlowKind;
  recurrence: RecurrenceRule;
}

export interface ScheduleInput {
  startingBalance: number;
  /** Inclusive projection start. */
  startDate: IsoDate;
  /** Number of calendar days in the window (inclusive of start). */
  horizonDays: number;
  items: CashFlowItem[];
}

export interface CashFlowEvent {
  date: IsoDate;
  itemId: string;
  name: string;
  /** Signed: income +, bill −. */
  amount: number;
  kind: CashFlowKind;
}

export interface BalancePoint {
  date: IsoDate;
  balance: number;
  events: CashFlowEvent[];
}

export interface ScheduleSummary {
  endingBalance: number;
  minBalance: number;
  minBalanceDate: IsoDate;
  firstDeficitDate: IsoDate | null;
  deficitDayCount: number;
}

/**
 * Net cash movement for a calendar day (incomes − bills).
 * P1 investing strategies compound a surplus stream derived from this.
 */
export interface DailyDelta {
  date: IsoDate;
  delta: number;
}

export interface ScheduleResult {
  events: CashFlowEvent[];
  series: BalancePoint[];
  summary: ScheduleSummary;
  dailyDeltas: DailyDelta[];
}
