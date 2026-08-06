import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# AI User Leaderboard — Full Content

> Who's the best AI user? The competitive leaderboard for AI operators — ranked by Yield (Υ), not raw token count.

## What is this?

The AI User Leaderboard (sigarena) is the competitive arena for AI operators.
It reads from SigRank's public API (signalaf.com) and ranks operators on
canonical token-telemetry metrics — the "yield cascade." Unlike model
leaderboards (LMSYS, LiveBench), this ranks the HUMANS using AI — not the
models themselves. Powered by SigRank.

## The metric: Yield (Υ)

Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency, not raw spend.

Volume is noise. Yield is signal. The operator who burns 10M tokens to produce 1K output
has lower Yield than the operator who uses 100K tokens to produce the same 1K output.

### All 9 canonical metrics

| Metric | Formula | Question | #1 Operator |
|--------|---------|----------|-------------|
| Yield (Υ) | (cache_read × output) / input² | Who is the best AI user? | Richard Fu (claude) Υ 2,462,656 |
| Velocity | output / input | Who gets the most output per token? | limp (chatgpt) 218.3 |
| Leverage | cache_read / input | Who reuses context the most? | Richard Fu (claude) 30,345 |
| SNR | output / (input + output) | Who has the cleanest signal? | limp (chatgpt) 0.9954 |
| 10xDEV | log₁₀(leverage) | Who's the most normalized? | Richard Fu (claude) 4.48 |
| Efficiency | ((cache_read + cache_create + output) / input) / 4 | Who's the most efficient overall? | Richard Fu (claude) 7835 |
| Scale V | log₁₀(total_tokens) | Who operates at the largest scale? | grenadeoftacoss (other) 15.96 |
| $/1M | blended cost per million tokens | Who gets the cheapest tokens? | takuma.saito (claude) $0.35/M |
| Op Ratio | cache:input:output | Who has the best operating ratio? | Richard Fu (claude) |

4 of 8 metrics have a different #1 — metric rotation is a real variety axis.

## Core pages

- [Leaderboard](https://sigeconomy.com/): live operator rankings — who's #1 right now
- [Weekly drop](https://sigeconomy.com/weekly): this week's rankings drop — biggest movers, new challengers, class distribution
- [How it works](https://sigeconomy.com/how-it-works): the 60-second Yield (Υ) explainer
- [Compare](https://sigeconomy.com/compare): head-to-head operator comparison — who's better?

## Topic hubs

- [Best AI User](https://sigeconomy.com/best-ai-user): who is the best AI user? The definitive ranking by Yield (Υ)
- [AI User Leaderboard](https://sigeconomy.com/ai-user-leaderboard): the competitive leaderboard for AI operators
- [AI User Ranking](https://sigeconomy.com/ai-user-ranking): how AI users are ranked — the Yield cascade explained
- [AI Power Users](https://sigeconomy.com/ai-power-users): the top AI power users, ranked by Yield

## Metric-specific rankings

- [Best AI User](https://sigeconomy.com/best-ai-user): Yield (Υ) = (cache_read × output) / input²
- [Most Output Per Token](https://sigeconomy.com/most-output-per-token): Velocity = output / input
- [Most Context Reuse](https://sigeconomy.com/most-context-reuse): Leverage = cache_read / input
- [Cleanest Signal](https://sigeconomy.com/cleanest-signal): SNR = output / (input + output)
- [Most Normalized](https://sigeconomy.com/most-normalized): 10xDEV = log₁₀(leverage)
- [Most Efficient Overall](https://sigeconomy.com/most-efficient-overall): Efficiency = ((cache_read + cache_create + output) / input) / 4
- [Largest Scale](https://sigeconomy.com/largest-scale): Scale V = log₁₀(total_tokens)
- [Cheapest Tokens](https://sigeconomy.com/cheapest-tokens): $/1M = blended cost per million tokens
- [Best Op Ratio](https://sigeconomy.com/best-op-ratio): Op Ratio = cache:input:output

## Comparisons

- [vs topaiusers.com](https://sigeconomy.com/vs/topaiusers): SigRank vs TopAIUsers — measured vs curated
- [vs ccusage](https://sigeconomy.com/vs/ccusage): SigRank vs ccusage — yield vs raw token count
- [vs Langfuse](https://sigeconomy.com/vs/langfuse): SigRank vs Langfuse — user efficiency vs LLM observability
- [vs Braintrust](https://sigeconomy.com/vs/braintrust): SigRank vs Braintrust — user evaluation vs AI app evaluation
- [vs LangChain + LangSmith](https://sigeconomy.com/vs/langchain): SigRank vs LangChain/LangSmith — operator ranking vs agent framework + observability
- [vs LMSYS Arena](https://sigeconomy.com/vs/lmsys-arena): ranking humans vs ranking models
- [vs WakaTime](https://sigeconomy.com/vs/wakatime): token efficiency vs time tracking

## Data

- [SigRank API](https://signalaf.com/api/v1/leaderboard): public top-N JSON endpoint
- [Prompt registry](https://sigeconomy.com/prompts.json): machine-readable prompt registry (JSON) — shared with the bestuser-router-mcp
- [Methodology](https://signalaf.com/methodology): the full scoring methodology — quotable key figures
- [Score calculator](https://signalaf.com/score): paste your stats, get your Yield + class, no account

## Class tiers

Operators are classified into 8 base tiers based on total token volume:

| Tier | Token range | Description |
|------|-------------|-------------|
| NOVICE | < 10K | Just starting |
| APPRENTICE | 10K – 100K | Learning the ropes |
| OPERATOR | 100K – 1M | Active user |
| REFINER | 1M – 10M | Efficient operator |
| ENGINEER | 10M – 100M | Power user |
| ARCHITECT | 100M – 1B | Expert |
| VISIONARY | 1B – 10B | Elite |
| SINGULARITY | > 10B | Transcendent |

Each tier has 3 sub-stages (I, II, III) for 24 total classes.

## About SigRank

SigRank ranks AI users by token-cascade efficiency (Yield). The AI User Leaderboard — who's the best AI user? Unlike model leaderboards that rank AI models, SigRank ranks the HUMANS using AI — their skill at efficiently using AI tools.

- GitHub: https://github.com/SunrisesIllNeverSee
- X/Twitter: https://x.com/burnmydays
- Main site: https://signalaf.com
- Leaderboard: https://sigeconomy.com
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
