# Cursor workflow — product discipline (NUDL)

**Human operator cheat sheet:** [`docs/how-to-use.md`](../how-to-use.md). This file is the full ritual and prompt library for agents and planning threads.

Use this to stay aligned with the roadmap and avoid one-off work that fights future priorities, without waterfall specs.

## 0. How NUDL maps to Cursor

| Primitive | In your project |
|-----------|----------------|
| **Rules** | `.cursor/rules/*.mdc` — always-on core + glob-gated discipline |
| **Skills** | `.cursor/skills/nudl-*` — invoke explicitly with `/skill-name` |
| **Hooks** | `.cursor/hooks.json` — optional; verify-on-stop off by default |
| **AGENTS.md** | Start here for paths and habits |
| **nudl.json** | Anchor paths, flags, verify commands |
| **User rules** | Your global Cursor settings; NUDL complements, not replaces |

**`@` mentions are the primary skill** — attach anchors in the first message of serious threads. Rules are guardrails, not a substitute.

### Planning vocabulary (use these terms consistently)

| Term | Lives in | Answers |
|------|----------|---------|
| **MVP** | [`mvp-scope.md`](../mvp-scope.md) | What does a **shipped v1** mean? What is explicitly **out of scope** for launch? |
| **Priority (P0 / P1 / P2)** | [`roadmap.md`](../roadmap.md) tiers | How **important** is this bucket vs everything else? (Not a work unit.) |
| **Backlog** | [`roadmap.md`](../roadmap.md) | Pending **work items**, ordered by P-tier — “what’s on the roadmap.” |
| **Work item** | [`roadmap.md`](../roadmap.md) numbered lines | A **planned task** on the backlog: feature, bugfix, chore, or debt. Kind tag sets branch prefix at kickoff — see §2.2. |
| **Feature** | Product + [`docs/features/<topic>.md`](../features/) | A **capability** the product delivers. Often one `[feature]` work item per feature; the **feature doc** is SSOT for its behavior (not every work item gets one). |
| **Epic** | [`docs/epics/<topic>.md`](../epics/) | **Ephemeral** multi-slice execution SSOT (large chore, cross-cutting effort). Milestones required. **Delete or archive when Done** — not living product docs. |
| **Milestone (M1, M2, …)** | Feature doc when large; otherwise **this pass’s scope** | The **next shippable slice** with a clear done definition. |
| **PR** | Git | The **reviewable merge**. One milestone may split across several PRs. |

**Typical flow:** MVP sets the launch bar → P-tiers sort the **backlog** → you pick a **work item** → for large **feature** work, add a **feature doc** with **milestones**; for large multi-slice **non-feature** work, add an **epic** → invoke **`/nudl-start-milestone`** to ship **one milestone** → split into **PRs** when the diff is hard to review.

**Do not conflate P and M:** P0 means “must have eventually,” not “build all of P0 in this thread.” Always name the **milestone / this-pass scope** at kickoff.

**Use the right word in context:** **backlog** for the list; **work item** for a roadmap line (#, P-tier); **feature** for product capability and its doc; **milestone** for the next slice you ship. A `[feature]` work item and a feature doc are usually 1:1 — bugfix/chore items often have no feature doc.

### Roles (kit vs project)

| Term | Who | Meaning |
|------|-----|---------|
| **Operator** | You in a bootstrapped project | Runs `nudl init`, uses the ritual daily (SA/PO). Not a retail “buyer” — there is no commercial product until P2 distribution. |
| **Maintainer** | Kit meta-repo only | Edits `cli/`, `templates/`, and ships releases. See meta-repo `AGENTS.md` if you contribute to NUDL itself. |

## 1. Put anchors in context first

In the **first message** of a feature thread, `@`-mention:

| Anchor | When |
|--------|------|
| [`docs/roadmap.md`](../roadmap.md) | Almost always — confirms work item + P-tier fit |
| [`docs/features/<topic>.md`](../features/) | **Feature** SSOT; milestones (M1, M2, …) when delivery is large |
| [`docs/epics/<topic>.md`](../epics/) | **Epic** SSOT while a multi-slice chore/initiative is in flight |
| [`docs/mvp-scope.md`](../mvp-scope.md) | MVP boundaries, pre-launch scope, non-goals |
| [`.cursor/rules/nudl-product-discipline.mdc`](../../.cursor/rules/nudl-product-discipline.mdc) | Full product checklist in **docs-only** chats (not auto-attached without code files open) |
| Methodology plan (if set in `nudl.json`) | Stack, testing, methodology questions |
| Specific code folders | Narrow implementation work |

Cursor indexes these; attaching them beats pasting vague “build X.”

**Doc-only planning:** product-discipline may not auto-attach. `@` the roadmap or product-discipline rule explicitly.

## 1.5 Plan (`/nudl-plan`)

**Explore first, promote on confirm.** `/nudl-plan` scopes work: tradeoffs, roadmap fit, complexity, and which artefact to write (if any). Invoke explicitly; skills never auto-run.

**Phase A (explore):** no repo edits until scope is agreed.

**Phase B (promote):** when the user says **promote** / **write it** / equivalent, write or update:

- [`docs/features/<topic>.md`](../features/) — **persistent** product/system SSOT, or
- [`docs/epics/<topic>.md`](../epics/) — **ephemeral** multi-slice execution SSOT (trash when Done)

**Save decisions, not transcripts.** Do not add `docs/plans/` or archive full chat threads. One-pass work needs no file — go to `/nudl-start-milestone`.

After promote (or for small work), start a **new thread** for implementation when the diff will be large; use **`/nudl-start-milestone`** with `@` the feature doc or epic.

**Small work:** same thread for plan + implement is fine (see §7).

## 1.6 Branch only (`/nudl-branch`)

**Name or create a branch without the full milestone ritual.** Invoke when work already started, you're on `main`, or you only need branch naming from context and/or diff.

Uses the same prefix rules as §2.2. Does **not** implement, verify, or commit.

Typical flow: **propose from paste or thread with no git** → user approves → **one batched guardrail check** → `git checkout -b`. Git on propose only for diff fallback when kind/topic are unknown (`git diff --stat` preferred). **Kind:** new operator-facing skills/rituals are `[feature]` even when the diff is docs/templates — not `[chore]` by file type alone.

| Need | Use |
|------|-----|
| Full kickoff (scope + branch + build + verify + commit) | **`/nudl-start-milestone`** |
| Branch name or checkout only | **`/nudl-branch`** |
| Merge-base diff for agent context (Cursor command, not NUDL) | **`/read-branch`** |

## 2. Start milestone (`/nudl-start-milestone`)

**One kickoff** for implementation threads: scope → branch → build → verify → **one commit**. Invoke explicitly; skills never auto-run.

**`/nudl-quick-gate`** is a legacy alias for **§2.1 only** (scope alignment, no branch or code). Prefer **`/nudl-start-milestone`** for the full ritual. **Branch only?** **`/nudl-branch`** (§1.6).

**Story lives in PR + feature doc**, not in many mid-work commits. Default: **one conventional commit per milestone** after verify. Optional layer-boundary commits only when `flags.autoCommitOnCheckpoint` is `true` in [`.cursor/nudl.json`](../../.cursor/nudl.json).

### 2.1 Quick gate (scope)

Answer briefly (you or the agent):

1. **Which work item** (P-tier + line #, or explicit **spike** / out-of-scope experiment)?
2. **Milestone / this pass** — one sentence with a clear done definition (e.g. “M1: sign-up only” or “whole work item #2 if small”).
3. **Non-goals** — what we are *not* doing this pass.
4. **Future hook** — anything a later milestone will need — stub interface, flag, or doc note only if cheap.

If the work is **not** on the roadmap, either update [`docs/roadmap.md`](../roadmap.md) first or label a **timeboxed spike** (throwaway branch / no merge without a follow-up decision).

Skip §2.1 when the user pasted agreed scope from a planning thread.

### 2.2 Branch

Derive a lowercase hyphenated slug from the work item + milestone. Choose the prefix from **work item kind** (roadmap tag or quick-gate answer), not from whether SSOT is a feature doc vs epic:

| Work item kind | Branch prefix | Example |
|----------------|---------------|---------|
| `[feature]` | `feature/` | `feature/sign-up-m1` |
| `[chore]` | `chore/` | `chore/wire-verify-commands` |
| `[bugfix]` | `fix/` | `fix/session-cookie-expiry` |
| `[debt]` | `refactor/` | `refactor/extract-auth-service` |
| Docs-only pass | `docs/` | `docs/cursor-workflow-kickoff` |
| Spike | `spike/` | `spike/oauth-provider-compare` |

When kind is unknown, default to `feature/` and confirm kind during quick gate.

**Guardrails:** if already on a matching branch (`feature/*`, `chore/*`, `fix/*`, `refactor/*`, `docs/*`, or `spike/*`), confirm and continue. If the tree is dirty or a merge/rebase is in progress, stop and report. On name collision, append `-m2` or `-2`.

### 2.3 Implement

Implement **only** the agreed milestone scope. Follow [`.cursor/rules`](../../.cursor/rules/) and [`AGENTS.md`](../../AGENTS.md). Minimal diffs. New env vars → [`.env.example`](../../.env.example) + feature doc.

### 2.4 Finish (verify + commit)

1. Run `verify.commands` from [`.cursor/nudl.json`](../../.cursor/nudl.json) when configured.
2. **One commit** after verify — message tied to scope (e.g. `feat(auth): M1 sign-up and session cookie`). No editor attribution. Do **not** commit on every edit.
3. Large diff? See §3 and `/nudl-milestone-pr`. Update the feature doc when long-lived contracts changed.

## 3. Milestone and PR sizing (practical)

A **milestone** is a shippable slice (M1 in a feature doc, or a small whole work item). A **PR** is what you merge — often one milestone, sometimes several PRs per milestone.

For **larger milestones**, keep merges reviewable without fixed rules or line-count thresholds.

- **Start with an outline**: files likely touched, layers, **tests**, order of work. Two vertical slices often mean a natural **PR split**.
- **Split across PRs** when several **independent subsystems** land in one diff, the change is **hard to summarize in one sentence**, or the thread **keeps scope-creeping** — stop, merge what works, continue in a follow-up PR.
- **Checkpoint** before merge: `git diff --stat` across unrelated areas is a sign to narrow the next merge.
- **Quality gates** after substantive edits: run commands in `nudl.json` `verify.commands` (see [`AGENTS.md`](../../AGENTS.md)).

Do **not** mandate “always N PRs per milestone” — split when **complexity or review pain** warrants it.

**Doc sync:** when a milestone changes long-lived contracts, update the feature doc (and roadmap / MVP if the launch bar shifted) in the **same PR** as that milestone.

## 4. When to add or update `docs/features/*.md`

A **feature doc** describes a **feature** (product capability), not every work item. Add or extend one when feature work — or a bugfix/chore that changes **long-lived contracts** — touches:

- Schema or migrations
- Auth, sessions, tenancy assumptions
- Webhooks, background jobs, new env vars
- Integrations or API contracts future work must respect

Keep it short: problem, v1 behavior, non-goals, future hooks. See [`docs/features/_template.md`](../features/_template.md).

**Large multi-slice chores** (not product capabilities) → [`docs/epics/<topic>.md`](../epics/) from [`docs/epics/_template.md`](../epics/_template.md). Epic when execution spans multiple milestones; delete when Done. If the chore changes long-lived contracts, update the relevant feature doc when those contracts land.

## 5. Copy-paste prompt templates

**Exploration & plan (new thread — no code / no repo edits):**

Type **`/nudl-plan`**, or paste below.

```text
@docs/roadmap.md
@docs/mvp-scope.md
@docs/process/cursor-workflow.md

We want to explore: [goal].
Work kind (if known): [feature | chore | bugfix | debt | other]

Please:
1. Summarize what the codebase already has (relevant areas).
2. Confirm work item + kind (ask if missing).
3. Propose scope in one paragraph plus explicit non-goals.
4. Assess complexity — one pass vs multi-slice; recommend feature doc, epic, or neither.
5. List open questions / risks.
6. End with how to promote (say "promote" or "write it") or go to /nudl-start-milestone for one-pass work.

Do not recommend docs/plans/ or saving the full chat thread.
```

**Start milestone (kickoff — preferred after planning):**

Type **`/nudl-start-milestone`**, or paste:

```text
@docs/roadmap.md
@docs/process/cursor-workflow.md

/nudl-start-milestone

Work item: [P0 line # / spike / small fix]
Milestone / this pass: [one sentence — e.g. M1 sign-up only]
Non-goals: [bullets]
[Paste agreed scope from planning thread if you have it.]
```

**Branch only (name or checkout — no implement or commit):**

Type **`/nudl-branch`**, or paste:

```text
@docs/roadmap.md

/nudl-branch

Work item: [P-tier line #]
Work kind: [feature | chore | bugfix | debt | spike | docs-only]
Milestone / this pass: [e.g. M1 sign-up only, or whole item if small]
```

Proposes from context with no git; say **create it** to checkout. Ad-hoc on `main` with no scope pasted? Agent may use diff fallback.

**Scope only (legacy — prefer start-milestone):**

```text
@docs/roadmap.md

/nudl-quick-gate

Goal: [one sentence]
Work item: [P0/P1/P2 line # / “spike, not merging” / “small fix, no roadmap change”]
Milestone / this pass: [one sentence — e.g. M1 sign-up only]
```

**Review / debt check (occasional):**

```text
Scan recent changes for env vars, new jobs/queues, and schema changes. Anything misaligned with docs/roadmap.md? Suggest doc or roadmap updates only — no drive-by refactors.
```

## 6. Repo rules already enforce part of this

- **Always-on:** `.cursor/rules/nudl-core.mdc`
- **When editing matched paths:** `nudl-product-discipline.mdc` (see globs in `.cursor/nudl.json`)
- **Human index:** [`AGENTS.md`](../../AGENTS.md)

## 7. Cursor UI habits

- **Pin** this file or `docs/roadmap.md` when starting a multi-turn feature.
- **Small work:** same thread for plan + implement is fine.
- **Large features:** split threads once the plan lives in a **feature doc**, **PR description**, or pasted summary — so scope does not drift.
