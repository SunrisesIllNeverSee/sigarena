# sigarena

AI User Leaderboard — SigRank's satellite site.

A read-only leaderboard microsite that displays AI operator rankings from
signalaf.com's public API. Every CTA routes to signalaf.com for measurement
and submission. No accounts, no database, no auth.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS + shadcn/ui-style components
- Geist font
- Data: signalaf.com public API (fetch + ISR, revalidate 300s)
- Hosting: Cloudflare Workers (via @opennextjs/cloudflare adapter)

## Routes

- `/` — the leaderboard (full scrollable ranked list)
- `/best-ai-user` — canonical Yield leaderboard (30-50 hits/day, SEO-protected)
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
- `/how-it-works` — 60-second Υ Yield explainer
- `/prompts.json` — machine-readable prompt registry (shared with bestuser-router-mcp)

## Development

```bash
npm install
npm run dev    # localhost:3001
```

## Deployment

Cloudflare Workers via OpenNext adapter. Domain: **signaaf.com**.

### Auto-deploy (GitHub Actions)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds via
`@opennextjs/cloudflare` and deploys the Worker to Cloudflare. No manual
`wrangler` commands needed.

**One-time setup — add GitHub secrets** (repo → Settings → Secrets and variables → Actions):

| Secret | Where to find it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → any Worker → Settings → Account ID (or the dashboard URL) |

Once both secrets are set, every push to `main` auto-deploys to signaaf.com.

### Manual deploy (fallback)

```bash
npm run cf:deploy    # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

Worker routes: `signaaf.com/*` and `www.signaaf.com/*` → `signaaf` worker.
Staging URL: `https://signaaf.sigrank.workers.dev`.

## CI

- **`.github/workflows/ci.yml`** — typecheck + Next.js build + gitleaks secret scan on PRs
- **`.github/workflows/deploy.yml`** — build + deploy to Cloudflare Workers on push to main
- **`.github/workflows/codeql.yml`** — GitHub CodeQL SAST analysis (weekly + on PR)

## Design

Visually mimics the yapper board pattern (yappers.context.dev):
light, clean, minimal. Not signalaf.com's scientific look.
"Powered by SigRank" footer links to signalaf.com.
