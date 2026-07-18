---
name: nudl-verify-on-stop
description: Runs verify commands from nudl.json after substantive edits. Use when the user asks to verify work or invokes verify-on-stop.
disable-model-invocation: true
---

# NUDL verify

Read `verify.commands` from [`.cursor/nudl.json`](../../../.cursor/nudl.json).

If empty, suggest adding commands (e.g. linter, typecheck, tests) to `nudl.json` for this project.

If configured, run each command (or tell the user exactly what to run) and report failures. See [`docs/process/cursor-workflow.md`](../../../docs/process/cursor-workflow.md) **§3** quality gates.
