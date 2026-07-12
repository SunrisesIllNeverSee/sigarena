# sigarena

AI User Leaderboard — SigRank's satellite site.

A read-only leaderboard microsite that displays AI operator rankings from
signalaf.com's public API. Every CTA routes to signalaf.com for measurement
and submission. No accounts, no database, no auth.

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS + shadcn/ui-style components
- Geist font (Vercel)
- Data: signalaf.com public API (fetch + ISR, revalidate 300s)

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

Push to `main` → Vercel auto-builds. Domain: `arena.sig-rank.com` (placeholder).

## Design

Visually mimics the yapper board pattern (yappers.context.dev):
light, clean, minimal. Not signalaf.com's scientific look.
"Powered by SigRank" footer links to signalaf.com.
