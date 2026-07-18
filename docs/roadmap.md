# ns-budget — product roadmap

Ordered **backlog**: **priority tiers** (P0/P1/P2) group **numbered work items**. See [`docs/process/cursor-workflow.md`](process/cursor-workflow.md) for backlog vs **feature** vs **milestone**.

**Work item kinds** (optional tags): `[feature]`, `[bugfix]`, `[chore]`, `[debt]`. A `[feature]` work item usually pairs with a feature doc; other kinds often do not. Branch prefix at kickoff follows kind — see [`cursor-workflow.md`](process/cursor-workflow.md) §2.2.

---

## Status (where we are)

- **Current focus:** P0 #1 — cash flow scheduler, **M3** (plan persistence). See [`features/cash-flow-scheduler.md`](features/cash-flow-scheduler.md). M1 engine + M2 app/UX done.
- **Pre-launch / MVP:** see [`mvp-scope.md`](mvp-scope.md)

---

## Priority framework

**P-tiers are importance bands — not work units.** A large `[feature]` work item may take several milestones (M1, M2, …) in `docs/features/<topic>.md`.

| Tier | Meaning |
|------|--------|
| **P0** | Must have — product is not viable without this |
| **P1** | Strong improvements after P0 |
| **P2** | Differentiation / scale — after P1 sticks |

---

## P0

1. [feature] **Cash flow scheduler** — recurring income/bills, horizon projection, deficit visualization, named shareable plans. Feature doc: [`features/cash-flow-scheduler.md`](features/cash-flow-scheduler.md) (M1 → M2 → M3).
2. ~~[chore] **Wire verify commands**~~ — **Done (M2)** — `npm test` / `npm run check` / `npm run lint` in `.cursor/nudl.json`.

---

## P1

1. [feature] **Investment strategy comparison** — parallel compounding of the scheduler's surplus stream (cash/HYSA vs. market-style assumptions); charted together. Layer on P0 output; no rewrite of scheduling engine.

---

## P2

_(empty — add when P1 sticks)_

---

## When to update

- **Ship a milestone** → update status in the feature doc; mark the **work item** **Done** only when all milestones for that item are complete (or the whole item was one milestone).
- **Reprioritize** → move work items between P-tiers or reorder the backlog.
