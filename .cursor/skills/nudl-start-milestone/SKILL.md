---
name: nudl-start-milestone
description: Kick off a milestone — quick gate, branch, implement, verify, and one commit. Use when starting non-trivial work after planning or for small fixes with clear scope.
disable-model-invocation: true
---

# NUDL start milestone

Read [`docs/process/cursor-workflow.md`](../../../docs/process/cursor-workflow.md) **§2 Start milestone** and run all phases unless the user pasted agreed scope (skip to phase 2).

## Phase 1 — Quick gate (scope)

If scope is not already pinned, answer briefly:

1. **Work item** (P-tier + line #, spike, or “small fix, no roadmap change”) — include **kind** (`[feature]`, `[chore]`, `[bugfix]`, `[debt]`) when known; it sets the branch prefix in phase 2
2. **Milestone / this pass** — one sentence with a clear done definition
3. **Non-goals**
4. **Future hook** — cheap stub, flag, or doc note only

If not on [`docs/roadmap.md`](../../../docs/roadmap.md): suggest updating the roadmap or label a **timeboxed spike**.

Confirm the four answers before phase 2 when anything is ambiguous.

## Phase 2 — Branch

Derive a lowercase hyphenated slug from the work item + milestone (e.g. `feature/sign-up-m1`, `chore/wire-verify-commands`, `fix/session-expiry`, `docs/verify-commands`, `spike/oauth-compare`).

| Situation | Action |
|-----------|--------|
| Already on a matching `feature/*`, `chore/*`, `fix/*`, `refactor/*`, `docs/*`, or `spike/*` branch | Confirm; do not rename |
| Dirty tree or merge/rebase in progress | Stop; report `git status` |
| Docs-only milestone | `docs/<slug>` |
| Spike | `spike/<slug>` |
| `[chore]` work item | `chore/<slug>` |
| `[bugfix]` work item | `fix/<slug>` |
| `[debt]` work item | `refactor/<slug>` |
| `[feature]` or unknown kind (code work) | `feature/<slug>` |
| Name collision | Append `-m2`, `-2`, etc. |

Create and checkout the branch when appropriate. Tell the user the branch name.

## Phase 3 — Implement

`@docs/roadmap.md` and the feature doc or epic if relevant (`docs/features/<topic>.md` or `docs/epics/<topic>.md`). Implement **only** agreed scope. Follow `.cursor/rules` and [`AGENTS.md`](../../../AGENTS.md). Minimal diffs. New env vars → `.env.example` + feature doc.

For **large milestones** across independent layers (schema, API, UI), outline order of work first. At layer boundaries with passing tests, **offer** an optional checkpoint commit only when `flags.autoCommitOnCheckpoint` is `true` in [`.cursor/nudl.json`](../../../.cursor/nudl.json). Otherwise continue without mid-work commits.

## Phase 4 — Finish (verify + commit)

1. Run `verify.commands` from [`.cursor/nudl.json`](../../../.cursor/nudl.json) when configured.
2. **One commit** for the milestone after verify passes — conventional message tied to scope (e.g. `feat(auth): M1 sign-up and session cookie`). No editor attribution. Do **not** commit on every edit.
3. Large diff? Suggest `/nudl-milestone-pr`. Update the feature doc when long-lived contracts changed.
4. **Hand off** — remind the human to review the branch commit graph in the IDE. Do **not** push or open a PR unless explicitly asked. For PR body text, suggest **`/pr-desc`**.

**Planning only?** Use `/nudl-plan`. **Scope alignment only?** `/nudl-quick-gate` runs phase 1. **Branch only?** `/nudl-branch`.
