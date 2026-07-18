# Agent / Cursor notes — ns-budget

**New here?** Read [`docs/how-to-use.md`](docs/how-to-use.md) first — step-by-step “I ran `nudl init`, now what?”

Persistent instructions for AI assistants live in **`.cursor/rules/*.mdc`**: **`nudl-core.mdc`** is always-on; **`nudl-product-discipline.mdc`** attaches when matched files are in context (see globs in `.cursor/nudl.json`). Read those first.

## Quick map

| Area | Path |
|------|------|
| Roadmap | [`docs/roadmap.md`](docs/roadmap.md) — backlog: priority tiers + work items |
| MVP bar | [`docs/mvp-scope.md`](docs/mvp-scope.md) — launch bar (not execution order) |
| Feature docs | `docs/features/` — SSOT per product capability |
| Epics | `docs/epics/` — ephemeral multi-slice efforts; trash when Done |
| **Cursor + roadmap ritual** | [`docs/process/cursor-workflow.md`](docs/process/cursor-workflow.md) |
| **How to use (daily ops)** | [`docs/how-to-use.md`](docs/how-to-use.md) |
| Config | [`.cursor/nudl.json`](.cursor/nudl.json) |

## Working effectively here

- Narrow scope: `@`-mention the roadmap, workflow, or specific folders.
- For new features: `@` **`docs/roadmap.md`** and **[`docs/process/cursor-workflow.md`](docs/process/cursor-workflow.md)**.
- Product checklist: **`.cursor/rules/nudl-product-discipline.mdc`** (or `@`-mention in docs-only chats).
- Skills: `/nudl-start-milestone`, `/nudl-plan`, `/nudl-branch`, `/nudl-milestone-pr`, `/nudl-verify-on-stop` (`/nudl-quick-gate` = scope only, legacy)
- Run `verify.commands` from `.cursor/nudl.json` after substantive edits.

## Git — branch names

Lowercase hyphenated slugs. Prefix follows **work item kind** (see [`docs/process/cursor-workflow.md`](docs/process/cursor-workflow.md) §2.2):

- **`feature/`** — `[feature]` product capability work
- **`chore/`** — `[chore]` maintenance, tooling, no user-facing change
- **`fix/`** — `[bugfix]` defect fixes
- **`refactor/`** — `[debt]` tech-debt reduction
- **`docs/`** — documentation-only passes
- **`spike/`** — timeboxed experiments

## Git — commit messages

Conventional summaries. **One commit per milestone** by default after verify; story lives in PR + feature doc. No editor attribution in commits or PR text.

**Push / PR:** agents do **not** `git push` or open PRs unless the user explicitly asks in that message. Use **`/pr-desc`** for paste-ready PR body text.

## Indexing

**`.cursorignore`** excludes `venv`, `node_modules`, build output, secrets from Cursor index.
