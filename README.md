# sigarena

AI User Leaderboard — SigRank's satellite site.

A read-only leaderboard microsite that displays AI operator rankings from
signalaf.com's public API. Every CTA routes to signalaf.com for measurement
and submission. No accounts, no database, no auth.

## The SigRank ecosystem

| Repo | What it is | Install |
|------|-----------|---------|
| **[sigrank-app](https://github.com/SunrisesIllNeverSee/sigrank-app)** | The leaderboard — signalaf.com. Privacy-preserving operator profiles, class tiers, board rankings. | [signalaf.com](https://signalaf.com) |
| **[sigrank-mcp](https://github.com/SunrisesIllNeverSee/sigrank-mcp)** | The instrument — extracts 4 token pillars, computes the cascade, submits to the leaderboard. MCP server + TUI dashboard. | `npx sigrank` |
| **[bestuser-router-mcp](https://github.com/SunrisesIllNeverSee/bestuser-router-mcp)** | The intent layer — routes "who is the best AI user?" queries to SigRank's leaderboard. MCP server for AI assistants. | `npx bestuser-router-mcp` |
| **[sigarena](https://github.com/SunrisesIllNeverSee/sigarena)** (this repo) | The satellite — public LLM operator evals at sigeconomy.com. Read-only leaderboard, SEO/AEO surface. | [sigeconomy.com](https://sigeconomy.com) |
| **[signaf](https://github.com/SunrisesIllNeverSee/signa)** | The coach — reads your session logs, builds a taste profile, measures ASI, coaches you on token efficiency. | `npx @burnmydays/signaf` |
| **[sigrank-vscode](https://github.com/SunrisesIllNeverSee/sigrank-vscode)** | The IDE extension — see your cascade metrics inline in VS Code. | `code --install-extension sigrank.sigrank` |
| **[fundscore](https://github.com/SunrisesIllNeverSee/fundscore)** | The repo scorer — investor-readiness scoring for GitHub repos. CLI + MCP server. | `npx fundscore` |

### Also in the MO§ES™ suite

| Site | What it is |
| ---- | ---------- |
| **[SIGNOMY](https://signomy.xyz)** | Governed AI agent marketplace where ranked agents form teams, fill slots, run missions, and earn revenue under constitutional protocol. Agents are free. Operators pay. |
| **[MO§ES](https://mos2es.com)** | The governance framework that underpins SigRank, SIGNOMY, and all governed agent operations. Structural accountability for agentic systems. |

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
- `/operator-evals` — what are operator evals? (hub page)
- `/public-operator-evals` — public operator evals thesis
- `/articles/why-operator-evals-matter` — why operator evals matter
- `/articles/operator-evals-vs-model-evals` — operator evals vs model evals
- `/ai-user-leaderboard` — what is this? (SEO page)
- `/ai-user-ranking` — how ranking works (SEO page)
- `/ai-power-users` — AI power users (SEO page)
- `/weekly` — weekly rankings drop
- `/compare` — head-to-head comparison
- `/how-it-works` — 60-second Υ Yield explainer
- `/vs/vals-ai` — SigRank vs Vals AI (operator evals vs model evals)
- `/vs/topaiusers`, `/vs/ccusage`, `/vs/langfuse`, etc. — 12 competitor comparison pages
- `/prompts.json` — machine-readable prompt registry (shared with bestuser-router-mcp)

## Development

```bash
npm install
npm run dev    # localhost:3001
```

## Deployment

Cloudflare Workers via OpenNext adapter. Domain: **sigeconomy.com**.

### Auto-deploy (GitHub Actions)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds via
`@opennextjs/cloudflare` and deploys the Worker to Cloudflare. No manual
`wrangler` commands needed.

**One-time setup — add GitHub secrets** (repo → Settings → Secrets and variables → Actions):

| Secret | Where to find it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → any Worker → Settings → Account ID (or the dashboard URL) |

Once both secrets are set, every push to `main` auto-deploys to sigeconomy.com.

### Manual deploy (fallback)

```bash
npm run cf:deploy    # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

Worker routes: `sigeconomy.com/*` and `www.sigeconomy.com/*` → `signaaf` worker.
Staging URL: `https://signaaf.sigrank.workers.dev`.

## CI

- **`.github/workflows/ci.yml`** — typecheck + Next.js build + gitleaks secret scan on PRs
- **`.github/workflows/deploy.yml`** — build + deploy to Cloudflare Workers on push to main
- **`.github/workflows/codeql.yml`** — GitHub CodeQL SAST analysis (weekly + on PR)

## Design

Visually mimics the yapper board pattern (yappers.context.dev):
light, clean, minimal. Not signalaf.com's scientific look.
"Powered by SigRank" footer links to signalaf.com.
