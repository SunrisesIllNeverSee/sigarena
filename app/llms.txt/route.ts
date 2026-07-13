import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# AI User Leaderboard

> Who's the best AI user? The competitive leaderboard for AI operators — ranked by Yield (Υ), not raw token count.

The AI User Leaderboard (sigarena) is the competitive arena for AI operators.
It reads from SigRank's public API (signalaf.com) and ranks operators on
canonical token-telemetry metrics — the "yield cascade." Unlike model
leaderboards (LMSYS, LiveBench), this ranks the HUMANS using AI — not the
models themselves. Powered by SigRank.

## Core pages
- [Leaderboard](https://sigarena.signalaf.com/): live operator rankings — who's #1 right now
- [Weekly drop](https://sigarena.signalaf.com/weekly): this week's rankings drop — biggest movers, new challengers, class distribution
- [How it works](https://sigarena.signalaf.com/how-it-works): the 60-second Yield (Υ) explainer
- [Compare](https://sigarena.signalaf.com/compare): head-to-head operator comparison — who's better?

## Topic hubs
- [Best AI User](https://sigarena.signalaf.com/best-ai-user): who is the best AI user? The definitive ranking
- [AI User Leaderboard](https://sigarena.signalaf.com/ai-user-leaderboard): the competitive leaderboard for AI operators
- [AI User Ranking](https://sigarena.signalaf.com/ai-user-ranking): how AI users are ranked — the Yield cascade explained
- [AI Power Users](https://sigarena.signalaf.com/ai-power-users): the top AI power users, ranked by Yield

## Comparisons
- [vs topaiusers.com](https://sigarena.signalaf.com/vs/topaiusers): SigRank vs TopAIUsers — measured vs curated
- [vs ccusage](https://sigarena.signalaf.com/vs/ccusage): SigRank vs ccusage — yield vs raw token count
- [vs LMSYS Arena](https://sigarena.signalaf.com/vs/lmsys-arena): ranking humans vs ranking models
- [vs WakaTime](https://sigarena.signalaf.com/vs/wakatime): token efficiency vs time tracking

## Data
- [SigRank API](https://signalaf.com/api/v1/leaderboard): public top-N JSON endpoint
- [Methodology](https://signalaf.com/methodology): the full scoring methodology — quotable key figures
- [Score calculator](https://signalaf.com/score): paste your stats, get your Yield + class, no account

## The metric
Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency, not raw spend.
Volume is noise. Yield is signal. The operator who burns 10M tokens to produce 1K output
has lower Yield than the operator who uses 100K tokens to produce the same 1K output.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
