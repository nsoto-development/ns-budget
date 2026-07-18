---
name: nudl-milestone-pr
description: Milestone and PR sizing heuristics for NUDL projects. Use before merging a large milestone or when the user asks how to split work across PRs.
disable-model-invocation: true
---

# NUDL milestone / PR sizing

Read [`docs/process/cursor-workflow.md`](../../../docs/process/cursor-workflow.md) **§3 Milestone and PR sizing**.

**Milestone** = shippable slice (M1 in a feature doc, or a small whole work item). **PR** = merge unit — may split one milestone across several PRs.

Help the user:

- Outline files/subsystems likely touched and whether the diff should split.
- Apply split heuristics: independent subsystems, hard to summarize in one sentence, scope creep in thread.
- Remind: when a milestone changes long-lived contracts, update the feature doc (and roadmap / MVP if the launch bar shifted) in the **same PR**.

Do not mandate a fixed PR count — split when **complexity or review pain** warrants it.
