# MVP scope — ns-budget

## Context

- **MVP** = what a **shipped v1** means for this product (launch bar), not execution order.
- **Roadmap / backlog:** [`docs/roadmap.md`](roadmap.md) — priority tiers and work items.
- **Features:** `docs/features/` — SSOT for product capabilities (usually tied to `[feature]` work items).
- **Milestones:** shippable slices — in a feature doc when delivery is large; see [`docs/process/cursor-workflow.md`](process/cursor-workflow.md).

**Portfolio:** ns-budget is a portfolio app on **nsoto.dev** — one subdomain, one deployment, independently deployable (e.g. Vercel/Cloudflare Pages + CNAME). Stack may differ from other portfolio apps.

**Origin:** personal budgeting spreadsheet (`Budget.xlsx`); public app uses **synthetic or user-entered data only** — never real ledger balances or employer details.

## MVP bar (v1 target)

1. User configures recurring income sources and bills, a starting balance, and a projection horizon.
2. App projects a running balance forward with calendar-accurate scheduling (not flat day-offset math).
3. Deficit periods are visually distinct from surplus; summary stats are shown.
4. User can export a named plan to a file and import it to reload; the browser also keeps a local draft so refresh / navigate-away does not lose unsaved work — no accounts, no server-side plan storage.
5. Scheduling engine is tested and portable (plain TypeScript module).

## Non-goals (MVP)

- User authentication or multi-user tenancy.
- Server-side plan storage or anonymous share URLs.
- Real personal financial data in the repo, seeds, or demos.
- Investment strategy comparison (P1).
- Import from Excel or bank feeds.
- Mobile-native app.

## When to update this doc

- MVP bar or non-goals change.
- Something shipped that **changes the launch bar** (tighten wording to match reality).
