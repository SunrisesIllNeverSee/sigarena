# AGENTS.md — sigarena

> Satellite leaderboard site. Deploy target: Cloudflare Workers (via @opennextjs/cloudflare).
> Live at **sigeconomy.com**. Read-only — no accounts, no database, no auth.

## Quick reference

| What | Command |
|------|---------|
| Type check | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Build (Next.js) | `npm run build` |
| Cloudflare build | `npm run cf:build` |
| Cloudflare preview | `npm run cf:preview` |
| Cloudflare deploy | `npm run cf:deploy` |
| Dev server | `npm run dev` (port 3001) |

**Local dev caveat:** Machine runs Node 25, repo may pin a different version.
If `next dev` or `next build` fails locally, verify via `tsc --noEmit` + live
checks against deployed sigeconomy.com.

## Verification protocol (before every commit)

1. `npx tsc --noEmit` — 0 errors
2. `npm run lint` — 0 errors
3. If touching API routes or data fetching, verify against live signalaf.com API

## Deploy

```bash
npm run cf:build && npm run cf:deploy
```

This builds with OpenNext and deploys to Cloudflare Workers. The worker name
is `signaaf` (see `wrangler.toml`). Manual deploy — no auto-deploy on push.

## Architecture

- **Next.js 15 + React 19** — App Router (`app/` directory)
- **Tailwind CSS** — styling
- **Data source:** signalaf.com public API (fetch + ISR, revalidate 300s)
- **Hosting:** Cloudflare Workers via @opennextjs/cloudflare adapter
- **No database, no auth, no accounts** — this is a read-only satellite site

## Routes

- `/` — full leaderboard
- `/best-ai-user` — Yield leaderboard (SEO-protected, 30-50 hits/day)
- `/most-output-per-token` — Velocity leaderboard
- `/most-context-reuse` — Leverage leaderboard
- `/cleanest-signal` — SNR leaderboard
- `/most-normalized` — 10xDEV leaderboard
- `/most-efficient-overall` — Efficiency leaderboard
- `/largest-scale` — Scale V leaderboard
- `/cheapest-tokens` — $/1M cost-efficiency leaderboard
- `/best-op-ratio` — Op Ratio leaderboard
- `/operator/[codename]` — operator profile card (shareable)
- `/compare` — head-to-head comparison

## SEO/AEO/GEO content (DO NOT TOUCH)

The following are intentional SEO/AEO/GEO pages and discovery surfaces. They
are strategic. NEVER remove them, flag them as dead links, or 404s to fix:

- `llms.txt`, sitemap
- Routes: `/best-ai-user`, `/most-output-per-token`, `/most-context-reuse`,
  `/cleanest-signal`, `/most-normalized`, `/most-efficient-overall`,
  `/largest-scale`, `/cheapest-tokens`, `/best-op-ratio`

If unsure whether something is SEO strategy or a real bug, ASK THE OWNER.

## Code conventions

- **TypeScript strict mode** — all files type-checked, 0 errors required
- **Match surrounding style** — read neighboring files before editing
- **No new dependencies** without explicit approval
- **Don't add/remove comments** unless asked
- **Display names:** Use `operatorDisplayName()` for visible user-facing text.
  Never render raw `.codename` as display text (use as URL keys only).

## Project structure

```
app/          — Next.js App Router pages + API routes
components/   — React components (leaderboard, profile, compare, share)
lib/          — Core logic (api, seo, jsonld, utils)
scripts/      — Utility scripts (patch-opennext-cache.mjs)
public/       — Static assets
```

## Coordination

This repo is worked on by Drep1 (lead) and Drep2 (one-off tasks) via
`~/Developer/active/SigRank-repos/D-REP-SCRATCH.md`. All task assignment and reporting
goes through that scratchpad. Do not bypass it.

## Data dependency

All data comes from signalaf.com's public API. If the API is down or returns
errors, the leaderboard will show stale data (ISR cache) or error states.
Do not mock or fake data — fix the API integration or wait for signalaf.com
to recover.

## Upsilon Architecture Context (2026-08-28)

**Architecture:** `MO§ES → Upsilon → SigRank | SignalAF`

- **Upsilon** = measurement engine / enterprise product (the engine that measures)
- **SigRank** = public leaderboard / benchmark / proof surface (live at signalaf.com)
- **SignalAF** = public distribution / platform brand
- **Yield (Υ)** = metric inside Upsilon: `(cache_read × output) / input²`
- **MO§ES™** = governance framework / methodology

**Owner clarification (2026-08-28):** The primary change is the Upsilon pilot.
agent-universe and sigrank-app changes are minimal — just pointing toward the
pilot and establishing architecture context. All repos get this context so they
understand where it came from and don't try rewriting everything every time.

**Do NOT:**
- Rename package/repo/CLI names (sigrank-app, sigrank-mcp, npx sigrank) — these are technical identifiers
- Rename "SigRank" where it means the public leaderboard/benchmark
- Conflate "Upsilon" (product) with "Yield" (metric) — they are different things
- Mass-rewrite historical/archive content to conform to new branding
- Change patent claims without legal review

**Preserved:**
- `npx sigrank` CLI command
- `sigrank` npm package name
- `sigrank-app`, `sigrank-mcp` repo names
- All URLs (signalaf.com, sigeconomy.com, mos2es.org, signomy.xyz)
- "SigRank leaderboard/board/ranks" references
- Historical and archive content

**Canon source:** Search Authority (commit 790d403). Load canon context before
modifying product definitions, metrics, or terminology:
```bash
export SEARCH_AUTHORITY_PATH="${SEARCH_AUTHORITY_PATH:-$HOME/Developer/_control/search-authority}"
python3 "$SEARCH_AUTHORITY_PATH/canon_cli.py" context sigrank
python3 "$SEARCH_AUTHORITY_PATH/canon_cli.py" context upsilon
```

## stickypads — check the shared board

Before starting work, check the shared operational board for tasks assigned
to you or this repo:

```bash
python3 ~/Developer/_control/stickypads/scripts/check_in.py --agent <your-name>
```

Or clone the ello-ops repo and run from there. The board has:
- TODOs across all repos
- Memos/notes from other agents and the owner
- Current session state

If you discover work that can't be completed immediately, create a task or
drop a note:

```bash
# Create a formal task
python3 ~/Developer/_control/stickypads/scripts/create_task.py \
    --title "Specific actionable title" \
    --project <this-repo-name> \
    --owner <your-name>

# Drop a quick memo (no format required)
python3 ~/Developer/_control/stickypads/scripts/drop.py \
    --from <this-repo-name> \
    "Quick note about what needs attention"
```

At session end or meaningful completion, reconcile this repo's coord kit
state into stickypads:

```bash
python3 ~/Developer/_control/stickypads/scripts/reconcile_coord.py \
    --repo-path . --dry-run
```


## Filesystem MCP — REQUIRED for file operations

This is a core framework/search/ello/product repository. When performing
file operations, prefer the Filesystem MCP tools over ad-hoc shell commands:

- `list_directory` / `directory_tree` — structured directory traversal
- `search_files` — glob-pattern file search within allowed paths
- `read_multiple_files` — batch file reads (failures do not stop the batch)
- `edit_file` with `dryRun: true` — preview structural changes before applying

Allowed paths: ~/Developer, ~/.config/devin, ~/.config/sigrank, ~/Desktop

For single-file reads and edits, native tools are acceptable. For multi-file
operations, directory exploration, and structural changes, use the Filesystem MCP.
