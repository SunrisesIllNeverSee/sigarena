---
type: Reference
title: DREP Coordination Root — system-devin
description: Canonical DREP coordination root for sigarena. rep1=LEAD, rep2=ASSIST, OWNER=human. Single operational coordination state.
tags: [repo-standard, coordination, drep, system-devin]
timestamp: 2026-08-18
---

# DREP Coordination Root

This directory is the canonical DREP coordination root for `sigarena`.

## Role mapping (canonical, non-negotiable)

| DREP name | Standard name | Human/Agent | Role |
|-----------|--------------|-------------|------|
| OWNER | OWNER | Human (Deric) | Decisions, external actions |
| rep1 | LEAD | Agent | Primary build coordination, documentation, big-picture |
| rep2 | ASSIST | Agent | Bounded support lane, one-off tasks, reports to rep1 |

## Structure

```
system-devin/
├── rep1/                          ← rep1 (LEAD) state
│   ├── onboarding.md              ← onboarding for a new rep1 session
│   └── handoffs/
│       ├── active/                ← current handoff
│       └── archive/               ← old handoffs
├── rep2/                          ← rep2 (ASSIST) state
│   ├── onboarding.md              ← onboarding for a new rep2 session
│   └── handoffs/
│       ├── active/                ← current handoff
│       └── archive/               ← old handoffs
└── README.md                      ← this file
```

## Single coordination state

The live coordination bus is `.coord/micro/SCRATCHPAD.md`.
The live session state is `.coord/micro/STATE.md`.

`system-devin/` holds per-role onboarding and handoff state.
It does NOT hold a competing scratchpad or state file.

`.coord/micro/` is the adapter/interface layer over the DREP state.
There is ONE operational coordination state per repository.

## Pre-existing coordination (preserved)

This repo previously coordinated via `~/Developer/active/SigRank-repos/D-REP-SCRATCH.md`
(legacy Drep1/Drep2 naming). That legacy scratchpad is preserved as a historical
record and is NOT the active coordination bus. The canonical bus is now
`.coord/micro/SCRATCHPAD.md`.
