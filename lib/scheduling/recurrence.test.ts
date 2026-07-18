import { describe, expect, it } from "vitest";
import {
  addDays,
  clampDayOfMonth,
  daysInMonth,
  isLeapYear,
  weekdayOf,
} from "./dates.js";
import { generateOccurrences } from "./recurrence.js";

describe("dates", () => {
  it("detects leap years", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });

  it("clamps month-end days", () => {
    expect(clampDayOfMonth(2024, 2, 31)).toBe(29);
    expect(clampDayOfMonth(2023, 2, 31)).toBe(28);
    expect(clampDayOfMonth(2024, 4, 31)).toBe(30);
    expect(daysInMonth(2024, 1)).toBe(31);
  });

  it("adds days across month boundaries", () => {
    expect(addDays("2024-01-31", 1)).toBe("2024-02-01");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2023-02-28", 1)).toBe("2023-03-01");
  });
});

describe("generateOccurrences", () => {
  it("weekly: every week on Friday from anchor", () => {
    // 2024-01-05 is Friday
    expect(weekdayOf("2024-01-05")).toBe(5);
    const dates = generateOccurrences(
      {
        kind: "weekly",
        weekday: 5,
        intervalWeeks: 1,
        anchor: "2024-01-05",
      },
      "2024-01-01",
      "2024-01-31",
    );
    expect(dates).toEqual([
      "2024-01-05",
      "2024-01-12",
      "2024-01-19",
      "2024-01-26",
    ]);
  });

  it("biweekly: every 14 days from anchor", () => {
    const dates = generateOccurrences(
      {
        kind: "biweekly",
        weekday: 5,
        anchor: "2024-01-05",
      },
      "2024-01-01",
      "2024-02-29",
    );
    expect(dates).toEqual([
      "2024-01-05",
      "2024-01-19",
      "2024-02-02",
      "2024-02-16",
    ]);
  });

  it("monthly: day 31 clamps to month end", () => {
    const dates = generateOccurrences(
      { kind: "monthly", dayOfMonth: 31 },
      "2024-01-01",
      "2024-04-30",
    );
    expect(dates).toEqual([
      "2024-01-31",
      "2024-02-29",
      "2024-03-31",
      "2024-04-30",
    ]);
  });

  it("semiMonthly: 1st and 15th", () => {
    const dates = generateOccurrences(
      { kind: "semiMonthly", days: [1, 15] },
      "2024-01-01",
      "2024-02-29",
    );
    expect(dates).toEqual([
      "2024-01-01",
      "2024-01-15",
      "2024-02-01",
      "2024-02-15",
    ]);
  });

  it("semiMonthly: 15 and 31 clamps February", () => {
    const dates = generateOccurrences(
      { kind: "semiMonthly", days: [15, 31] },
      "2023-02-01",
      "2023-02-28",
    );
    expect(dates).toEqual(["2023-02-15", "2023-02-28"]);
  });

  it("yearly: Feb 29 clamps in non-leap years", () => {
    const dates = generateOccurrences(
      { kind: "yearly", month: 2, day: 29 },
      "2023-01-01",
      "2025-12-31",
    );
    expect(dates).toEqual(["2023-02-28", "2024-02-29", "2025-02-28"]);
  });

  it("returns empty when range is inverted", () => {
    expect(
      generateOccurrences(
        { kind: "monthly", dayOfMonth: 1 },
        "2024-02-01",
        "2024-01-01",
      ),
    ).toEqual([]);
  });
});
