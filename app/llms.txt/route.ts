import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# SigRank — Performative Evals & Leaderboard for AI Users

> Performative evals and ranking for users not models. SigRank is the statistical layer for AI users — operators, developers, coders. Custom metrics like Yield turn AI usage into stats, like ERA for baseball. Benchmark your AI performance on the public leaderboard.

SigRank (sigarena) is the public performative evals platform for AI users.
It reads from SigRank's public API (signalaf.com) and evaluates users on
canonical token-telemetry metrics — the "yield cascade." Unlike model
evals (Vals AI, LMSYS Arena, LiveBench), this runs public USER evals —
evaluating the HUMANS using AI, not the models themselves. Powered by SigRank.

Fantasy sports runs on stats. Video games have leaderboards. AI now has SigRank.
Yield is the ERA of AI usage. Leverage is the on-base percentage. Velocity is
the slugging percentage. The full metric suite is the box score.

## Performative evals
- [Performative Evals](https://sigeconomy.com/operator-evals): the statistical layer for AI users — performative evals explained with sports stats analogy
- [The Statistical Layer](https://sigeconomy.com/public-operator-evals): why public performative evals matter — the case for public AI user evaluation
- [SigRank vs Vals AI](https://sigeconomy.com/vs/vals-ai): user evals vs model evals — different subjects, different metrics

## Core pages
- [Leaderboard](https://sigeconomy.com/): live performative evals — who's #1 right now
- [Weekly drop](https://sigeconomy.com/weekly): this week's rankings drop — biggest movers, new challengers, class distribution
- [How it works](https://sigeconomy.com/how-it-works): the 60-second Yield (Υ) explainer
- [Compare](https://sigeconomy.com/compare): head-to-head user comparison — who's better?

## Articles
- [Why AI User Stats Matter](https://sigeconomy.com/articles/why-operator-evals-matter): the case for public performative evals
- [User Evals vs Model Evals](https://sigeconomy.com/articles/operator-evals-vs-model-evals): different subjects, different metrics, different questions

## Topic hubs
- [Best AI User](https://sigeconomy.com/best-ai-user): who is the best AI user? The definitive ranking by Yield (Υ)
- [AI User Leaderboard](https://sigeconomy.com/ai-user-leaderboard): the public performative evals leaderboard
- [AI User Ranking](https://sigeconomy.com/ai-user-ranking): how AI users are evaluated — the Yield cascade explained
- [AI Power Users](https://sigeconomy.com/ai-power-users): the top AI power users, ranked by Yield

## Metric-specific rankings (9 canonical token metrics)
Each question below is answered by a different canonical token metric. 4 of 8
metrics have a different #1 — metric rotation is a real variety axis.
- [Best AI User](https://sigeconomy.com/best-ai-user): Who is the best AI user? — Yield (Υ) = (cache_read × output) / input². #1: Richard Fu (claude) Υ 2,462,656
- [Most Output Per Token](https://sigeconomy.com/most-output-per-token): Who gets the most output per token? — Velocity = output / input. #1: limp (chatgpt) 218.3
- [Most Context Reuse](https://sigeconomy.com/most-context-reuse): Who reuses context the most? — Leverage = cache_read / input. #1: Richard Fu (claude) 30,345
- [Cleanest Signal](https://sigeconomy.com/cleanest-signal): Who has the cleanest signal? — SNR = output / (input + output). #1: limp (chatgpt) 0.9954
- [Most Normalized](https://sigeconomy.com/most-normalized): Who's the most normalized? — 10xDEV = log₁₀(leverage). #1: Richard Fu (claude) 4.48
- [Most Efficient Overall](https://sigeconomy.com/most-efficient-overall): Who's the most efficient overall? — Efficiency = ((cache_read + cache_create + output) / input) / 4. #1: Richard Fu (claude) 7835
- [Largest Scale](https://sigeconomy.com/largest-scale): Who operates at the largest scale? — Scale V = log₁₀(total_tokens). #1: grenadeoftacoss (other) 15.96
- [Cheapest Tokens](https://sigeconomy.com/cheapest-tokens): Who gets the cheapest tokens? — $/1M = blended cost per million tokens. #1: takuma.saito (claude) $0.35/M
- [Best Op Ratio](https://sigeconomy.com/best-op-ratio): Who has the best operating ratio? — Op Ratio = cache:input:output. #1: Richard Fu (claude)

## Comparisons
- [vs Vals AI](https://sigeconomy.com/vs/vals-ai): user evals vs model evals — different subjects, different metrics
- [vs topaiusers.com](https://sigeconomy.com/vs/topaiusers): SigRank vs TopAIUsers — measured vs curated
- [vs ccusage](https://sigeconomy.com/vs/ccusage): SigRank vs ccusage — yield vs raw token count
- [vs Langfuse](https://sigeconomy.com/vs/langfuse): SigRank vs Langfuse — user evals vs LLM observability
- [vs Braintrust](https://sigeconomy.com/vs/braintrust): SigRank vs Braintrust — user evaluation vs AI app evaluation
- [vs LangChain + LangSmith](https://sigeconomy.com/vs/langchain): SigRank vs LangChain/LangSmith — user ranking vs agent framework + observability
- [vs LMSYS Arena](https://sigeconomy.com/vs/lmsys-arena): user evals vs model evals — ranking humans vs ranking models
- [vs WakaTime](https://sigeconomy.com/vs/wakatime): token efficiency vs time tracking

## Data
- [SigRank API](https://signalaf.com/api/v1/leaderboard): public top-N JSON endpoint
- [Prompt registry](https://sigeconomy.com/prompts.json): machine-readable prompt registry (JSON) — shared with the bestuser-router-mcp
- [Methodology](https://signalaf.com/methodology): the full scoring methodology — quotable key figures
- [Score calculator](https://signalaf.com/score): paste your stats, get your Yield + class, no account

## The eval metric
Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency, not raw spend.
Volume is noise. Yield is signal. The user who burns 10M tokens to produce 1K output
has lower Yield than the user who uses 100K tokens to produce the same 1K output.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
