---
type: Coordination
title: Micro Coordination Bus
description: Append-only working coordination bus for agents operating inside this repository.
tags: [repo-standard, coordination, scratchpad]
timestamp: 2026-08-18
---


# Micro Coordination Bus

## Protocol

- Read the tail before beginning material work.
- Append assignments, blockers, decisions, and completion reports.
- Do not use this as durable product documentation; promote durable knowledge into the appropriate repo document.

## Log

### 2026-08-21 — GPT-5.6 Sol
- Assignment: implement Ora agent-readiness fixes for sigeconomy.com on `fix/ora-agent-readiness-2026-08-21`.
- Scope: real unknown-path 404s, markdown negotiation Vary, SSR/semantic content, developer discovery/portal, OpenAPI typed errors + operationIds + rate-limit/deprecation docs, homepage docs link, agent when-to-use guidance, trust pages, Organization schema completeness, MCP discovery verification, tests and production smoke checks.
- Constraints: preserve current product behavior and visual design; no fabricated API keys, sandbox, contact phone, or physical address.
- Status: in progress.

### 2026-08-26 — Devin (GLM-5.2 High)

- Assignment: complete MCP infrastructure for SigEconomy — OperatorEvaluation, prompts, share cards, /mcp page, server card updates.
- Scope:
  - OperatorEvaluation wired into get_best_operator and explain_this_operator (commit 4f40e5e)
  - 5 MCP prompts: who-is-the-best, compare-two-operators, find-my-peers, how-can-i-improve, whats-interesting-on-the-board (commit 4f40e5e)
  - Shareable responses (share_url/share_text) on 5 tools (commit 75c3b93)
  - /share/mcp route with visual share cards + OG image (commit 75c3b93)
  - Prompts added to mcp.json and mcp server cards (commit 75c3b93)
  - Human-facing /mcp page with tools, resources, prompts, boundary note (commit 48b862e)
  - Middleware fix: /mcp and /share/ added to allowlist (commits 75c3b93, 5c25c18)
- Decision: lightweight inline evaluation function instead of importing from @sigrank/cascade — SigEconomy reads from SignalAF API and doesn't have the cascade module locally.
- Deployed via Cloudflare (worker: signaaf). All live-verified.
- Status: complete.

