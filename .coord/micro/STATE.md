---
type: State
title: Micro Session State
description: Save/resume slot for the current repository build state.
tags: [repo-standard, coordination, state]
timestamp: 2026-08-26
---


# Micro Session State

## Current

- Status: complete
- In progress: none
- Last: /mcp page, share cards, prompts, OperatorEvaluation, shareable responses (commits 4f40e5e, 75c3b93, 48b862e, 5c25c18)
- Next: none — all planned work complete
- Blockers: none

## Resume order

1. Read this file.
2. Read the latest scratchpad entries.
3. Read the active handoff if one exists.
4. Check the roster.
5. If this is a cross-repo build, read `.coord/macro/MACRO_STATE.md`.
