# Feature: Cash flow scheduler

## Purpose

A cash flow scheduler for **ns-budget** on the nsoto.dev portfolio. Users configure recurring **income sources** and **bills** (name, amount, frequency), set a starting balance and a horizon, and the app projects a running balance forward — visually flagging deficit vs. surplus periods.

Generalizes a personal spreadsheet's pay-period deficit simulator into a full scheduling engine (not a fixed biweekly template). Origin: `Budget.xlsx` (Reset Plan + pay-period simulation tabs). **Privacy:** the public app must never ship real personal financial data — synthetic/demo seed or user-entered data only.

## Roadmap

Tracks **[feature] work item #1** on [`docs/roadmap.md`](../roadmap.md). This file is the **SSOT** for the feature.

## v1 scope (agreed)

- Configure arbitrary recurring income and bills (name, amount, frequency).
- Starting balance and projection horizon.
- Calendar-accurate recurrence and running-balance computation (not day-offset shortcuts).
- Running-balance line chart with deficit periods highlighted; summary stats.
- Named plans with anonymous IDs, save/load via API, shareable links — no user accounts.
- Scheduling engine is framework-agnostic plain TypeScript, unit-testable, usable client-side (live preview) and server-side if needed later.

## Non-goals (v1)

- User authentication or accounts.
- Import from the user's real spreadsheet or ledger data.
- Investment strategy comparison (P1 — see roadmap #2).
- Fixed biweekly paycheck templates — the engine handles arbitrary recurrence.

## Future hooks

- **P1 investing comparison:** scheduling output is a surplus-per-period stream; strategies are compounding functions applied in parallel to that stream (no separate forecast logic).
- Engine module boundary: recurrence rules → event generation → running-balance computation.
- **Svelte UI harvest (later):** once app `components/ui/` primitives stabilize (or a second Svelte consumer appears), extract to e.g. `@nsoto/portfolio-ui-svelte` in the design-system repo — same cutover pattern as React `@nsoto/portfolio-ui`. Prefer proven app code over designing the package up front.

## Technical decisions (agreed)

| Area | Choice | Notes |
|------|--------|-------|
| Shape | Static frontend + light persistence | Option B from planning — real client/server + DB for portfolio/interview story without auth overhead |
| M1 package | Plain TypeScript + **Vitest** | Engine-only `package.json`; no app framework until M2 |
| Framework | **SvelteKit** | Chosen for portfolio breadth (vs Next on main site / Vite+React on ns-chess); scaffold at M2 |
| Persistence | API routes / edge functions | Named plans, Pastebin-style share links |
| Database | **Neon** (Postgres) | Free tier; pairs with Vercel app host; wire at M3 |
| Host | **Vercel** | Matches existing portfolio deploys; SvelteKit adapter at M2/M3 |
| Design system | **`@nsoto/portfolio-tokens` + hand-rolled Svelte UI** | Import tokens CSS; app-owned `src/lib/components/ui/` styled with CSS vars. Guided by DS ui_kits / `portfolio-ui` as visual reference only. **`@nsoto/portfolio-ui` is React-only — not a dependency.** |
| Auth | None | Anonymous plan IDs only |
| Dates | Civil `YYYY-MM-DD` only | No timezone / DST math |
| Same-day order | Incomes then bills | Deterministic; end-of-day balance for deficit |

### Recurrence vocabulary (M1)

| `kind` | Fields | Semantics |
|--------|--------|-----------|
| `weekly` | `weekday`, `intervalWeeks`, `anchor` | Every N weeks from anchor; anchor must fall on `weekday` (Sun=0) |
| `biweekly` | `weekday`, `anchor` | Every 14 days from anchor (same weekday rule) |
| `monthly` | `dayOfMonth` | 1–31; clamped to last day of each month |
| `semiMonthly` | `days: [a, b]` | Two days per month; each clamped independently |
| `yearly` | `month`, `day` | Annual; Feb 29 → Feb 28 in non-leap years |

**Portfolio deploy:** one subdomain = one app = one deployment (`budget.nsoto.dev` or similar). Independent Vercel/Cloudflare Pages project per portfolio app — not monorepo path routing.

## Code paths

| Area | Location |
|------|----------|
| Scheduling engine | [`lib/scheduling/`](../../lib/scheduling/) — `projectSchedule`, recurrence, events, dates |
| Engine unit tests | `lib/scheduling/*.test.ts` |
| App UI | `src/` — SvelteKit routes + `src/lib/components/` |
| Plan model + API | TBD — M3 |

## Milestones

| # | Milestone | Status | Deliverables |
|---|-----------|--------|--------------|
| M1 | Scheduling engine | **Done** | Calendar-accurate recurrence (month-end, semi-monthly, leap years); event generation; running-balance + `dailyDeltas` (P1 hook); Vitest unit tests. No UI. |
| M2 | App scaffold + P0 UX | **Done** | SvelteKit + Vercel adapter; `@nsoto/portfolio-tokens` + hand-rolled Svelte `components/ui/`; income/bill config; starting balance + horizon; line chart (deficit in red); summary stats via `projectSchedule` (client-side); verify commands in `nudl.json`. |
| M3 | Plan persistence | Planned | Plan data model; save/load API; Neon on Vercel; anonymous shareable plan IDs. |

**Next pass:** M3 — plan persistence.

**Quick gate:** each implementation thread names **one milestone** (e.g. “M1 only”), not the whole P0 tier.

## Tests / verify

- M1: unit tests for recurrence edge cases and running-balance logic.
- M2: wire lint/test/check into `nudl.json` `verify.commands` at scaffold.
