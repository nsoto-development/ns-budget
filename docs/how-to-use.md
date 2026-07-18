# How to use NUDL in your project

**The one-line version:** NUDL sets up *how you and Cursor work together* in **your app repo**. You decide *what* to build. Cursor builds it *inside* the scope you set.

This guide walks through “I just ran `nudl init`… now what?” — step by step.

**More prompts:** [`docs/process/cursor-workflow.md`](process/cursor-workflow.md)  
**File map:** [`AGENTS.md`](../AGENTS.md)

---

## The big picture (30 seconds)

You are the **product owner** (what matters, what’s in scope, what “done” means).  
Cursor is the **developer** (writes code inside that scope).

After `nudl init`, **your project** has:

- **Rules and skills** under `.cursor/` — habits for Cursor in your repo
- **`docs/roadmap.md`** and **`docs/mvp-scope.md`** — shells **you** fill in with your product plan
- **This guide** — what to do next

NUDL does not pick features, read your mind, or block bad ideas. It keeps the same conversation straight every time you start a feature.

---

## Step 0 — Get the CLI (once per machine)

Skip if your project was already bootstrapped for you.

1. Install the **NUDL kit** (zip extract or git clone — use the install instructions that came with your download).
2. Add a shortcut so `nudl` works from any folder:

```powershell
# PowerShell profile — path to wherever you installed the kit
function nudl { node "C:\path\to\nudl\cli\nudl.js" @args }
```

3. **Node 18+** is required when running the CLI from source.

There is **no Cursor plugin**. `nudl init` copies files into **your** project; Cursor reads them from there.

---

## Step 1 — Bootstrap your project

In your app folder (new or existing repo):

```bash
cd my-app
nudl init
nudl doctor
```

**What happened:** NUDL copied a standard layout into **your repo**:

| Path | Purpose |
|------|---------|
| `.cursor/rules/` | How Cursor should behave in chat |
| `.cursor/skills/` | `/nudl-plan`, `/nudl-start-milestone`, etc. |
| `docs/roadmap.md` | Your backlog — **you fill in** |
| `docs/mvp-scope.md` | Your v1 bar — **you fill in** |
| `AGENTS.md` | Map of paths and habits |

`nudl doctor` should say **PASS**. A warning about empty `verify.commands` is normal until you add lint/test commands.

**Then what?** Open **your project** in Cursor. Don’t start feature code yet.

---

## Step 2 — Say what you’re building

Before any planned work, edit two files **for your product**. Use standard SDLC terms (full glossary in [`cursor-workflow.md`](process/cursor-workflow.md)):

| Term | File | Meaning |
|------|------|---------|
| **MVP** | `mvp-scope.md` | Launch bar — what v1 means |
| **Backlog** | `roadmap.md` | Pending work items, ordered by P-tier |
| **Priority (P0/P1/P2)** | `roadmap.md` | How important a bucket is |
| **Work item** | `roadmap.md` numbered lines | A planned task (feature, bugfix, chore, …) |
| **Feature** | product + `docs/features/*.md` | A capability; usually one `[feature]` work item; feature doc = SSOT |
| **Milestone (M1, M2…)** | feature doc when large | Next shippable slice |

### `docs/roadmap.md` — ordered backlog

```markdown
## P0
1. [feature] User can sign up and log in
2. [feature] User can create and list widgets
3. [bugfix] Session cookie not set on redirect

## P1
4. [chore] Wire test/lint into verify.commands
```

Kind tags (`[feature]`, `[bugfix]`, `[chore]`, `[debt]`) are optional but help scope mixed backlogs.

### `docs/mvp-scope.md` — v1 bar + non-goals

```markdown
## MVP bar
- Sign up, log in, CRUD widgets

## Non-goals (for now)
- Teams / multi-tenant
- Mobile app
```

Rough is fine. Change anytime.

**Then what?** Pick your **first P0 work item** from the backlog. If it’s a large **feature**, plan **milestones** (M1, M2) in a feature doc in Step 3. If it’s small, one milestone covers the whole item.

---

## Step 3 — Plan (explore, then promote if needed)

Open a **new Cursor chat** in your project. This thread is for **thinking** — no production code until `/nudl-start-milestone`.

1. Type **`/nudl-plan`**, or paste below.
2. `@`-mention `docs/roadmap.md` and `docs/mvp-scope.md`.

```text
@docs/roadmap.md
@docs/mvp-scope.md
@docs/process/cursor-workflow.md

We want to explore: [your first P0 work item in plain English].
Work kind (if known): [feature | chore | bugfix | debt | other]

Please:
1. Summarize what the codebase already has (if anything).
2. Confirm work item + kind (ask if missing).
3. Propose scope in one paragraph plus explicit non-goals.
4. Assess complexity — one pass vs multi-slice; recommend feature doc, epic, or neither.
5. List open questions / risks.
6. End with how to promote (say "promote" or "write it") or go to /nudl-start-milestone for one-pass work.

Do not recommend docs/plans/ or saving the full chat thread.
```

**Goal:** a **milestone-sized slice** — one sentence of scope and a short “not doing yet” list. P0 is not the scope of one thread.

**Then what?** Say **promote** / **write it** to save a feature doc or epic; one-pass work skips to Step 4. Epics are for large multi-slice chores — delete when Done.

## Step 4 — Start milestone (kickoff)

Same chat or a new one. Type **`/nudl-start-milestone`**.

The skill runs the full kickoff:

1. **Quick gate** — work item, milestone, non-goals, future hook (skipped if you paste agreed scope from Step 3)
2. **Branch** — prefix from work item kind: `feature/sign-up-m1`, `chore/wire-verify-commands`, `fix/session-expiry`, `refactor/extract-auth`, `docs/…`, or `spike/…`
3. **Implement** — only the agreed milestone scope
4. **Finish** — verify, then **one commit** with a conventional message (not a commit on every edit)

Optional paste:

```text
@docs/roadmap.md
@docs/process/cursor-workflow.md

/nudl-start-milestone

Work item: [P0 line #]
Milestone / this pass: [e.g. M1 sign-up only]
Non-goals: [bullets]

Agreed scope:
[Paste from Step 3.]
```

Not on the roadmap? Add it there first, or call it a **spike**. Scope-only alignment without building? **`/nudl-quick-gate`** (legacy). Already coding on `main`? **`/nudl-branch`** to name and create a branch first.

**Then what?** Review the diff, update docs if needed, move on.

---

## Step 5 — Wrap up and next

1. Optional: `/nudl-verify-on-stop` if you skipped verify during the skill.
2. Big diff? **`/nudl-milestone-pr`** — split PRs within a milestone?
3. Schema, auth, jobs, env vars? Update **`docs/features/<topic>.md`** — the **feature** SSOT (copy `docs/features/_template.md`).

Mark **milestone** done in the feature doc; mark the **work item** done when all its milestones ship. **Go back to Step 3** for the next milestone or work item.

---

## Step 6 — Repeat

Each pass through the backlog:

```
Work item → Plan (milestones if large) → Start milestone → Wrap up → Next
```

Small typo fix? One chat — invoke `/nudl-start-milestone` and say “small fix, no roadmap change.”

---

## What’s automatic vs not

| Automatic in your project | You do this |
|---------------------------|-------------|
| Core rules every chat | Fill roadmap + MVP |
| Discipline rules when editing code | `@docs/roadmap.md` in serious threads |
| `/nudl-…` when you type it | Invoke skills — they never auto-run |
| | Run tests (until you configure verify) |

---

## Slash commands

| Type `/…` | When |
|-----------|------|
| `/nudl-plan` | Explore scope; promote to write feature doc or epic |
| `/nudl-start-milestone` | Kick off a milestone — gate, branch, build, verify, one commit |
| `/nudl-branch` | Propose or create a branch name from context/diff — no implement or commit |
| `/nudl-quick-gate` | Scope alignment only (legacy — prefer start-milestone) |
| `/nudl-milestone-pr` | Split a large milestone across PRs |
| `/nudl-verify-on-stop` | Run verify commands from `nudl.json` |

---

## Updating NUDL files in your project

When you install a newer NUDL kit on your machine:

```bash
cd path/to/where/you/installed/nudl   # pull or extract update
cd path/to/my-app                     # your project
nudl init --merge
```

`--merge` adds new template files without overwriting your edited roadmap, MVP, or workflow. Renamed or removed kit files (e.g. old skill folders) are pruned automatically; `nudl.json` flags are migrated when keys change.

`nudl init --merge` also copies `docs/epics/_template.md` and adds `anchors.epicsDir` when missing from older projects.

---

## Still stuck?

| Question | Answer |
|----------|--------|
| “Do I need every skill every time?” | No. Steps 3–4 are the core. |
| “Can I skip roadmap/MVP?” | You can, but you lose most of the value. |
| “Does Cursor see my roadmap automatically?” | Only if you `@docs/roadmap.md` (or it’s in context). |
| “Where are all the copy-paste prompts?” | [`cursor-workflow.md`](process/cursor-workflow.md) §5 |
