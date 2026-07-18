---
name: nudl-quick-gate
description: Scope alignment only (quick gate phase 1). Prefer /nudl-start-milestone for full kickoff — branch, implement, verify, and one commit.
disable-model-invocation: true
---

# NUDL quick gate (scope only)

**Prefer [`/nudl-start-milestone`](../nudl-start-milestone/SKILL.md)** for the full kickoff (gate → branch → implement → verify → one commit).

If the user invoked **quick gate only**, read [`docs/process/cursor-workflow.md`](../../../docs/process/cursor-workflow.md) **§2.1 Quick gate** and answer briefly:

1. **Which work item** (P-tier + line #, or explicit **spike**)?
2. **Milestone / this pass** — one sentence with a clear done definition (not the whole P-tier).
3. **Non-goals** — what we are *not* doing this pass.
4. **Future hook** — anything a later milestone needs (stub, flag, or doc note only if cheap).

If work is **not** on [`docs/roadmap.md`](../../../docs/roadmap.md), suggest updating the roadmap first or label a **timeboxed spike**.

Do not create a branch, write production code, or commit unless the user explicitly moves to implementation (suggest `/nudl-start-milestone` or `/nudl-branch` for branch-only).
