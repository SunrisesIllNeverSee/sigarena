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
- `/operator/[codename]` — operator profile card (shareable)
- `/compare` — head-to-head comparison
- `/how-it-works` — 60-second Υ Yield explainer

## Development

```bash
npm install
npm run dev    # localhost:3001
```

## Deploy

Cloudflare Workers via OpenNext adapter. Domain: **signaaf.com**.

```bash
npm run cf:deploy    # build + deploy to Cloudflare Workers
```

Worker routes: `signaaf.com/*` and `www.signaaf.com/*` → `signaaf` worker.
Staging URL: `https://signaaf.sigrank.workers.dev`.

## Design

Visually mimics the yapper board pattern (yappers.context.dev):
light, clean, minimal. Not signalaf.com's scientific look.
"Powered by SigRank" footer links to signalaf.com.
