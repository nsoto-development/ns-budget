import { describe, expect, it } from "vitest";
import { generateEvents } from "./events.js";
import { projectSchedule } from "./schedule.js";
import type { ScheduleInput } from "./types.js";

describe("generateEvents", () => {
  it("returns no events for empty items", () => {
    const events = generateEvents({
      startingBalance: 100,
      startDate: "2024-01-01",
      horizonDays: 30,
      items: [],
    });
    expect(events).toEqual([]);
  });

  it("applies incomes before bills on the same day", () => {
    const events = generateEvents({
      startingBalance: 0,
      startDate: "2024-01-01",
      horizonDays: 1,
      items: [
        {
          id: "rent",
          name: "Rent",
          amount: 1000,
          kind: "bill",
          recurrence: { kind: "monthly", dayOfMonth: 1 },
        },
        {
          id: "pay",
          name: "Paycheck",
          amount: 2000,
          kind: "income",
          recurrence: { kind: "monthly", dayOfMonth: 1 },
        },
      ],
    });
    expect(events.map((e) => e.itemId)).toEqual(["pay", "rent"]);
    expect(events.map((e) => e.amount)).toEqual([2000, -1000]);
  });
});

describe("projectSchedule", () => {
  it("holds starting balance when schedule is empty", () => {
    const result = projectSchedule({
      startingBalance: 500,
      startDate: "2024-01-01",
      horizonDays: 3,
      items: [],
    });
    expect(result.series.map((p) => p.balance)).toEqual([500, 500, 500]);
    expect(result.summary.endingBalance).toBe(500);
    expect(result.summary.minBalance).toBe(500);
    expect(result.summary.firstDeficitDate).toBeNull();
    expect(result.summary.deficitDayCount).toBe(0);
    expect(result.dailyDeltas.every((d) => d.delta === 0)).toBe(true);
  });

  it("projects running balance and flags deficit days", () => {
    const input: ScheduleInput = {
      startingBalance: 100,
      startDate: "2024-01-01",
      horizonDays: 15,
      items: [
        {
          id: "pay",
          name: "Paycheck",
          amount: 200,
          kind: "income",
          recurrence: {
            kind: "biweekly",
            weekday: 5,
            anchor: "2024-01-05",
          },
        },
        {
          id: "rent",
          name: "Rent",
          amount: 250,
          kind: "bill",
          recurrence: { kind: "monthly", dayOfMonth: 1 },
        },
      ],
    };

    const result = projectSchedule(input);
    // Day 1: rent −250 → balance −150 (deficit)
    expect(result.series[0]?.balance).toBe(-150);
    expect(result.summary.firstDeficitDate).toBe("2024-01-01");
    // Day 5 (Fri): +200 → −150 + 200 = 50
    const day5 = result.series.find((p) => p.date === "2024-01-05");
    expect(day5?.balance).toBe(50);
    expect(result.summary.deficitDayCount).toBeGreaterThan(0);
    expect(result.summary.minBalance).toBeLessThan(0);
  });

  it("same-day income then bill avoids false deficit mid-day", () => {
    const result = projectSchedule({
      startingBalance: 0,
      startDate: "2024-03-01",
      horizonDays: 1,
      items: [
        {
          id: "bill",
          name: "Bill",
          amount: 50,
          kind: "bill",
          recurrence: { kind: "monthly", dayOfMonth: 1 },
        },
        {
          id: "income",
          name: "Income",
          amount: 100,
          kind: "income",
          recurrence: { kind: "monthly", dayOfMonth: 1 },
        },
      ],
    });
    // End of day: +100 −50 = 50; never recorded as deficit
    expect(result.series[0]?.balance).toBe(50);
    expect(result.summary.firstDeficitDate).toBeNull();
    expect(result.dailyDeltas[0]?.delta).toBe(50);
  });

  it("exposes dailyDeltas for P1 surplus stream", () => {
    const result = projectSchedule({
      startingBalance: 1000,
      startDate: "2024-01-01",
      horizonDays: 2,
      items: [
        {
          id: "a",
          name: "A",
          amount: 10,
          kind: "income",
          recurrence: { kind: "monthly", dayOfMonth: 1 },
        },
      ],
    });
    expect(result.dailyDeltas).toEqual([
      { date: "2024-01-01", delta: 10 },
      { date: "2024-01-02", delta: 0 },
    ]);
  });
});
