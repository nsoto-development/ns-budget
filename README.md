# ns-budget

Cash flow scheduler for the nsoto.dev portfolio — recurring income and bills, calendar-accurate projection, deficit visualization, and (later) anonymous shareable plans.

**Status:** M1 complete — plain TypeScript scheduling engine with Vitest coverage. No UI yet.

Planned live URL: [budget.nsoto.dev](https://budget.nsoto.dev) (or similar)

## About

Users configure recurring **income** and **bills**, a starting balance, and a horizon. The app projects a running balance forward and flags deficit vs. surplus periods.

The interesting part for this repo is a **framework-agnostic scheduling engine** (recurrence → events → running balance) that works client-side for live preview and can run on the server later. Public demos use synthetic or user-entered data only — never real personal finances.

Feature SSOT: [`docs/features/cash-flow-scheduler.md`](docs/features/cash-flow-scheduler.md)

## Features

### Shipped — M1

- `lib/scheduling/` — calendar-accurate recurrence (`weekly`, `biweekly`, `monthly`, `semiMonthly`, `yearly`)
- Event generation and day-by-day running balance (`projectSchedule`)
- Same-day order: incomes then bills; civil `YYYY-MM-DD` dates only (no DST math)
- `dailyDeltas` surplus stream hook for a later P1 investing comparison
- Vitest unit tests for month-end, semi-monthly, leap years, and deficit cases

### Planned — M2

- SvelteKit scaffold + nsoto design-system consumption
- Income/bill config UI, starting balance + horizon
- Running-balance chart (deficit highlighted) and summary stats wired to the engine

### Planned — M3

- Named plans, save/load API, Neon Postgres on Vercel
- Anonymous shareable plan IDs (no accounts)

### Later

| Priority | Feature |
|----------|---------|
| P1 | Investment strategy comparison on the surplus stream |
| P2 | Deploy to portfolio subdomain |

See [`docs/roadmap.md`](docs/roadmap.md) for the full backlog and [`docs/mvp-scope.md`](docs/mvp-scope.md) for the launch bar.

## Tech stack

| Layer | Choice |
|-------|--------|
| Engine (now) | TypeScript (strict) + Vitest |
| App (M2) | SvelteKit |
| Host / DB (M2–M3) | Vercel + Neon |
| Auth | None — anonymous plan IDs |

## Architecture

```
lib/scheduling/
├── types.ts        # IsoDate, RecurrenceRule, ScheduleInput/Result
├── dates.ts        # Civil calendar helpers
├── recurrence.ts   # Occurrence generation
├── events.ts       # Income/bill → dated events
├── schedule.ts     # projectSchedule (running balance)
└── index.ts        # Public exports
```

Pipeline: recurrence rules → event generation → running-balance series.

## Getting started

```bash
npm install
npm test
```

Watch mode: `npm run test:watch`

## Docs

| Doc | Purpose |
|-----|---------|
| [`docs/roadmap.md`](docs/roadmap.md) | Backlog / P-tiers |
| [`docs/mvp-scope.md`](docs/mvp-scope.md) | v1 launch bar |
| [`docs/features/cash-flow-scheduler.md`](docs/features/cash-flow-scheduler.md) | Feature SSOT + milestones |
| [`docs/how-to-use.md`](docs/how-to-use.md) | NUDL / Cursor workflow |
| [`AGENTS.md`](AGENTS.md) | Agent quick map |

## License

Private portfolio project — not published as an npm package.
