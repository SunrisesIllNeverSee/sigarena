# AGENTS.md — sigarena

> Satellite leaderboard site. Deploy target: Cloudflare Workers (via @opennextjs/cloudflare).
> Live at **signaaf.com**. Read-only — no accounts, no database, no auth.

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
checks against deployed signaaf.com.

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
`~/Desktop/SigRank-repos/D-REP-SCRATCH.md`. All task assignment and reporting
goes through that scratchpad. Do not bypass it.

## Data dependency

All data comes from signalaf.com's public API. If the API is down or returns
errors, the leaderboard will show stale data (ISR cache) or error states.
Do not mock or fake data — fix the API integration or wait for signalaf.com
to recover.
