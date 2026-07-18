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
- [Leaderboard](https://signaaf.com/): live operator rankings — who's #1 right now
- [Weekly drop](https://signaaf.com/weekly): this week's rankings drop — biggest movers, new challengers, class distribution
- [How it works](https://signaaf.com/how-it-works): the 60-second Yield (Υ) explainer
- [Compare](https://signaaf.com/compare): head-to-head operator comparison — who's better?

## Topic hubs
- [Best AI User](https://signaaf.com/best-ai-user): who is the best AI user? The definitive ranking by Yield (Υ)
- [AI User Leaderboard](https://signaaf.com/ai-user-leaderboard): the competitive leaderboard for AI operators
- [AI User Ranking](https://signaaf.com/ai-user-ranking): how AI users are ranked — the Yield cascade explained
- [AI Power Users](https://signaaf.com/ai-power-users): the top AI power users, ranked by Yield

## Metric-specific rankings (9 canonical token metrics)
Each question below is answered by a different canonical token metric. 4 of 8
metrics have a different #1 — metric rotation is a real variety axis.
- [Best AI User](https://signaaf.com/best-ai-user): Who is the best AI user? — Yield (Υ) = (cache_read × output) / input². #1: Richard Fu (claude) Υ 2,462,656
- [Most Output Per Token](https://signaaf.com/most-output-per-token): Who gets the most output per token? — Velocity = output / input. #1: limp (chatgpt) 218.3
- [Most Context Reuse](https://signaaf.com/most-context-reuse): Who reuses context the most? — Leverage = cache_read / input. #1: Richard Fu (claude) 30,345
- [Cleanest Signal](https://signaaf.com/cleanest-signal): Who has the cleanest signal? — SNR = output / (input + output). #1: limp (chatgpt) 0.9954
- [Most Normalized](https://signaaf.com/most-normalized): Who's the most normalized? — 10xDEV = log₁₀(leverage). #1: Richard Fu (claude) 4.48
- [Most Efficient Overall](https://signaaf.com/most-efficient-overall): Who's the most efficient overall? — Efficiency = ((cache_read + cache_create + output) / input) / 4. #1: Richard Fu (claude) 7835
- [Largest Scale](https://signaaf.com/largest-scale): Who operates at the largest scale? — Scale V = log₁₀(total_tokens). #1: grenadeoftacoss (other) 15.96
- [Cheapest Tokens](https://signaaf.com/cheapest-tokens): Who gets the cheapest tokens? — $/1M = blended cost per million tokens. #1: MO§ES™ (claude) ≈$0/M
- [Best Op Ratio](https://signaaf.com/best-op-ratio): Who has the best operating ratio? — Op Ratio = cache:input:output. #1: Richard Fu (claude)

## Comparisons
- [vs topaiusers.com](https://signaaf.com/vs/topaiusers): SigRank vs TopAIUsers — measured vs curated
- [vs ccusage](https://signaaf.com/vs/ccusage): SigRank vs ccusage — yield vs raw token count
- [vs Langfuse](https://signaaf.com/vs/langfuse): SigRank vs Langfuse — user efficiency vs LLM observability
- [vs Braintrust](https://signaaf.com/vs/braintrust): SigRank vs Braintrust — user evaluation vs AI app evaluation
- [vs LangChain + LangSmith](https://signaaf.com/vs/langchain): SigRank vs LangChain/LangSmith — operator ranking vs agent framework + observability
- [vs LMSYS Arena](https://signaaf.com/vs/lmsys-arena): ranking humans vs ranking models
- [vs WakaTime](https://signaaf.com/vs/wakatime): token efficiency vs time tracking

## Data
- [SigRank API](https://signalaf.com/api/v1/leaderboard): public top-N JSON endpoint
- [Prompt registry](https://signaaf.com/prompts.json): machine-readable prompt registry (JSON) — shared with the bestuser-router-mcp
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
