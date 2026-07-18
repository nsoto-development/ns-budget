---
name: nudl-branch
description: Create a branch from context, roadmap kind, and optional diff — or propose the name only when asked. Does not start full milestone implementation.
disable-model-invocation: true
---

# NUDL branch

Read [`docs/process/cursor-workflow.md`](../../../docs/process/cursor-workflow.md) **§1.6** and **§2.2**. Branch-only utility — does **not** implement, verify, or commit. For full kickoff use [`/nudl-start-milestone`](../nudl-start-milestone/SKILL.md).

## When to use

- Work started on `main` (or wrong branch) — need a correctly named branch before committing
- Ad-hoc fix/chore — infer name from chat context without the full milestone ritual
- Planning / name check only — user asks for the **proposed name** without creating

**Not** a substitute for `/read-branch` (Cursor command that loads merge-base diff for agent context).

## Default vs propose-only

- **Default:** derive the name, then **create** the branch (`git checkout -b`) after guardrails. State the name + brief rationale when done.
- **Propose-only:** stop after naming when the user asks only for the proposed name (e.g. “propose”, “name only”, “what would you call it”, “suggest a branch name”). Do **not** create unless they then say to create/checkout.

## Input priority (use first match; skip later steps)

1. **Pasted scope** — work item + kind + milestone (below) → derive name from that
2. **Thread + anchors** — `@docs/roadmap.md`, feature doc, epic, or prior `/nudl-plan` output → derive name from that
3. **Diff fallback only** — when kind or topic still cannot be inferred after 1–2 → `git diff --stat` or unstaged diff; merge-base diff only if stat is insufficient

Same §2.2 naming rules as `/nudl-start-milestone` Phase 2 in all cases.

## Phase A — Name

**Do not run git for naming** when input priority 1 or 2 pins kind and topic. Derive immediately from context.

1. **Infer kind → prefix** (§2.2)
   - `[feature]` → `feature/`; `[chore]` → `chore/`; `[bugfix]` → `fix/`; `[debt]` → `refactor/`
   - Docs-only pass → `docs/`; spike → `spike/`
   - Unknown kind: infer from thread if possible; else diff fallback (step 3 only); else default `feature/` and state assumption
   - Epic SSOT does not change prefix — use work-item kind

   **Kind inference (NUDL kit or operator app):** use **product capability**, not file type. New `/nudl-*` skills, rituals, or operator-facing behavior → `[feature]` (`feature/`). Renames, migrations, convention-only doc alignment, smoke-test fixture tweaks → `[chore]`. Do not default to `[chore]` just because the diff is mostly `templates/` or `docs/`.

2. **Derive slug**
   - Primary: work item topic + milestone (e.g. `wire-verify-commands`, `sign-up-m1`)
   - Diff fallback only: short slug from changed area; avoid `updates` or `fixes`

3. **Output** — full branch name + brief rationale (kind, slug source).
   - **Propose-only?** Stop here.
   - **Default?** Continue to Phase B.

## Phase B — Create (default)

Run **one** batched guardrail check, then checkout:

```bash
git branch --show-current && git status -sb && git branch --list <proposed-name> && git branch -a --list "*<proposed-name>*"
```

- Merge/rebase in progress? Stop; report status
- Already on matching `feature/*`, `chore/*`, `fix/*`, `refactor/*`, `docs/*`, or `spike/*`? Confirm; do not rename unless user asks
- Name exists locally/remotely? Suggest `-m2` or `-2` and **ask before** creating an alternate
- Then: `git checkout -b <name>` (uncommitted changes carry over)
- Stop — suggest `/nudl-start-milestone` if implementation has not started, or continue on the new branch

## Optional paste (fastest naming — zero git until create)

```text
@docs/roadmap.md

/nudl-branch

Work item: [P-tier line #]
Work kind: [feature | chore | bugfix | debt | spike | docs-only]
Milestone / this pass: [e.g. M1 sign-up only, or whole item if small]
```
