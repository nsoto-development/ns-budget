# Feature: Cash flow scheduler

## Purpose

A cash flow scheduler for **ns-budget** on the nsoto.dev portfolio. Users configure recurring **income sources** and **bills** (name, amount, frequency), set a starting balance and a horizon, and the app projects a running balance forward — visually flagging deficit vs. surplus periods.

Generalizes a personal spreadsheet's pay-period deficit simulator into a full scheduling engine (not a fixed biweekly template). Origin: `Budget.xlsx` (Reset Plan + pay-period simulation tabs). **Privacy:** the public app must never ship real personal financial data — synthetic/demo seed or user-entered data only. User plans stay on the user's device (browser draft + file import/export) — no server-side plan storage.

## Roadmap

Tracks **[feature] work item #1** on [`docs/roadmap.md`](../roadmap.md). This file is the **SSOT** for the feature.

## v1 scope (agreed)

- Configure arbitrary recurring income and bills (name, amount, frequency).
- Starting balance and projection horizon.
- Calendar-accurate recurrence and running-balance computation (not day-offset shortcuts).
- Running-balance line chart with deficit periods highlighted; summary stats.
- Named plan document: **export** to a downloadable file and **import** to reload — no accounts, no server persistence.
- **Local draft autosave** in the browser so navigating away / refresh does not lose unsaved edits before the user exports a file.
- Scheduling engine is framework-agnostic plain TypeScript, unit-testable, usable client-side (live preview) and server-side if needed later.

## Non-goals (v1)

- User authentication or accounts.
- Server-side plan storage, anonymous share URLs, or Pastebin-style hosted plans.
- Import from the user's real spreadsheet or ledger data (Excel/CSV/bank feeds).
- Investment strategy comparison (P1 — see roadmap #2).
- Fixed biweekly paycheck templates — the engine handles arbitrary recurrence.

## Future hooks

- **P1 investing comparison:** scheduling output is a surplus-per-period stream; strategies are compounding functions applied in parallel to that stream (no separate forecast logic).
- Engine module boundary: recurrence rules → event generation → running-balance computation.
- **Svelte UI harvest (later):** once app `components/ui/` primitives stabilize (or a second Svelte consumer appears), extract to e.g. `@nsoto/portfolio-ui-svelte` in the design-system repo — same cutover pattern as React `@nsoto/portfolio-ui`. Prefer proven app code over designing the package up front.
- **DDL / hosted persistence:** demonstrate Neon (or similar) + API/schema skills on a **different** portfolio project where the data is not personal finances. Not planned for ns-budget v1.

## Technical decisions (agreed)

| Area | Choice | Notes |
|------|--------|-------|
| Shape | Static frontend (SvelteKit) | Client-side engine + UI; persistence is user-owned files, not a backend DB |
| M1 package | Plain TypeScript + **Vitest** | Engine-only `package.json`; no app framework until M2 |
| Framework | **SvelteKit** | Chosen for portfolio breadth (vs Next on main site / Vite+React on ns-chess); scaffold at M2 |
| Persistence | **File import/export + local draft** | Downloadable plan document + file picker; autosave draft in **`localStorage`** (not cookies — see below) |
| Database | **None (v1)** | See [Persistence decision](#persistence-decision-neon--file-export) — Neon deferred off this product |
| Host | **Vercel** | Matches existing portfolio deploys; SvelteKit adapter at M2 |
| Design system | **`@nsoto/portfolio-tokens` + hand-rolled Svelte UI** | Import tokens CSS; app-owned `src/lib/components/ui/` styled with CSS vars. Guided by DS ui_kits / `portfolio-ui` as visual reference only. **`@nsoto/portfolio-ui` is React-only — not a dependency.** |
| Auth | None | No accounts; no hosted plan IDs |
| Dates | Civil `YYYY-MM-DD` only | No timezone / DST math |
| Same-day order | Incomes then bills | Deterministic; end-of-day balance for deficit |

### Persistence decision (Neon → file export)

**Original choice (planning):** Neon Postgres + API routes + anonymous shareable plan IDs (“Option B” — light client/server persistence without auth). Intent was a portfolio/interview story: real DDL, save/load API, Pastebin-style links on Vercel.

**Why we shifted:** Plan payloads include recurring amounts, bill names, and balances — data users treat as sensitive. Anonymous hosted plans put that on our DB with no ownership model (anyone with the URL can read or overwrite). A downloadable file keeps the plan on the user's machine; they share only if they choose (email, Drive, etc.). DDL/DB skills can be flexed on another portfolio app where the domain fits hosted data better.

**v1 persistence:**

1. **File export/import** — versioned plan document aligned with editor state (`name` + `ScheduleInput`-shaped fields). Portable backup / share-by-file.
2. **Local draft** — autosave the same document shape to **`localStorage`** (`ns-budget:plan-draft:v1`) so refresh or navigating away does not wipe work before export. Reset demo / import overwrite the draft.

**Why not cookies:** cookies are tiny (~4KB), and any cookie not carefully scoped is sent to the server on every request — the opposite of keeping plan data client-only. `localStorage` stays on-device, holds a full plan, and matches the “draft until you export” goal.

No `DATABASE_URL`, no plan API routes.

### Plan document (v1)

```ts
{
  version: 1,
  name: string,
  startingBalance: number,
  startDate: IsoDate,
  horizonDays: number,
  items: CashFlowItem[]
}
```

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
| Plan document | [`src/lib/planDocument.ts`](../../src/lib/planDocument.ts) — serialize/parse |
| Local draft | [`src/lib/planDraft.ts`](../../src/lib/planDraft.ts) — `localStorage` |
| File import/export | [`src/lib/planFile.ts`](../../src/lib/planFile.ts) — download + file read |
| Plan unit tests | `src/lib/planDocument.test.ts`, `src/lib/planDraft.test.ts` |

## Milestones

| # | Milestone | Status | Deliverables |
|---|-----------|--------|--------------|
| M1 | Scheduling engine | **Done** | Calendar-accurate recurrence (month-end, semi-monthly, leap years); event generation; running-balance + `dailyDeltas` (P1 hook); Vitest unit tests. No UI. |
| M2 | App scaffold + P0 UX | **Done** | SvelteKit + Vercel adapter; `@nsoto/portfolio-tokens` + hand-rolled Svelte `components/ui/`; income/bill config; starting balance + horizon; line chart (deficit in red); summary stats via `projectSchedule` (client-side); verify commands in `nudl.json`. |
| M3a | Plan document + local draft | **Done** | Versioned plan schema; parse/serialize tests; `localStorage` draft autosave/restore; plan name in UI; reset demo overwrites draft. |
| M3b | File import/export | **Done** | Export download + import file picker on the same schema; validation errors surfaced; copy updated for on-device draft + portable backup. |

**Next pass:** P1 investing comparison (roadmap) — or portfolio deploy polish as needed.

**Quick gate:** each implementation thread names **one milestone** (e.g. “M1 only”), not the whole P0 tier.

## Tests / verify

- M1: unit tests for recurrence edge cases and running-balance logic.
- M2: wire lint/test/check into `nudl.json` `verify.commands` at scaffold.
- M3: unit tests for plan document parse/serialize and reject-invalid; draft round-trip; UI wired to export/import + restore-on-load.
