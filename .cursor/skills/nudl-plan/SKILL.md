---
name: nudl-plan
description: Plan work with /nudl-plan — explore scope, then on user confirm write a feature doc or epic. Use before /nudl-start-milestone for non-trivial work.
disable-model-invocation: true
---

# NUDL plan

Follow [`docs/process/cursor-workflow.md`](../../../docs/process/cursor-workflow.md) **§5**. Ensure these anchors are in context or ask the user to `@`-mention them:

- `docs/roadmap.md`
- `docs/mvp-scope.md`
- `docs/process/cursor-workflow.md`

## Phase A — Explore (default)

**No repo edits** until scope is agreed and the user asks to promote.

For the user's goal:

1. Summarize what the codebase already has (relevant to the goal).
2. Confirm **work item** (P-tier + line # if on roadmap) and **kind** (`[feature]`, `[chore]`, `[bugfix]`, `[debt]`, or other). Ask if missing; you may propose + confirm.
3. Propose **scope** in one short paragraph plus explicit **non-goals**.
4. Assess **complexity** — one achievable `/nudl-start-milestone` pass, or **multi-slice**?
5. Recommend an artefact (advice only — user may skip):
   - **None** — one-pass; go to `/nudl-start-milestone`
   - **Feature doc** — `docs/features/<slug>.md` — persistent product/system SSOT (capabilities, contracts). Large features: include milestone table in the feature doc.
   - **Epic** — `docs/epics/<slug>.md` — ephemeral multi-slice execution SSOT (large chores, cross-cutting efforts). **Only when sliced.** Trash when Done.
6. List open questions / risks.
7. End with: *Say **promote** or **write it** to save the feature doc or epic; or use `/nudl-start-milestone` for one-pass work.*

Do **not** recommend `docs/plans/` or saving the full chat transcript. Do **not** use a copy-paste promote checklist.

**Edge case:** multi-slice chore that changes long-lived contracts → epic for execution; update the relevant feature doc when contracts land (same milestone PR).

## Phase B — Promote (on explicit user approval)

Triggers include: `promote`, `write it`, `approved`, `looks good — save it`.

When triggered:

1. Write or update from template:
   - [`docs/features/_template.md`](../../../docs/features/_template.md) → `docs/features/<slug>.md`, or
   - [`docs/epics/_template.md`](../../../docs/epics/_template.md) → `docs/epics/<slug>.md`
2. Distill agreed scope only — not the full exploration thread.
3. You may make one conventional **docs** commit (e.g. `docs(plan): add epic for …`). No production code in this phase.

Then hand off to `/nudl-start-milestone` for M1 (or the only pass).

If anything is unclear during explore, ask before recommending a final scope.
