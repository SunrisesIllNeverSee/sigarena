import { NextResponse } from "next/server";
import { SIGRANK_STANDARD_VERSION } from "@/lib/sigrank-standard";

export const revalidate = 3600;

export async function GET() {
  const body = `# Public LLM Operator Evals — SigRank SignalAF — Full Content

> Public LLM operator evals — the public evaluation layer for AI operators. Like Vals AI evaluates models, SigRank evaluates the humans using AI. Ranked by Yield (Υ), not raw token count.

## What is this?

SigRank SignalAF (sigeconomy.com) is the public evaluation platform for AI operators.
It reads from SigRank's public API (signalaf.com) and evaluates operators on
operator telemetry and leaderboard dimensions — the "yield cascade." Unlike model
evals (Vals AI, LMSYS Arena, LiveBench), this runs public OPERATOR evals —
evaluating the HUMANS using AI, not the models themselves. Powered by SigRank SignalAF.

## Model evals vs operator evals

| Dimension | Model Evals | Operator Evals |
|-----------|------------|----------------|
| Subject | The AI model (GPT, Claude, Gemini) | The human operator |
| Question | Which model is best? | Who is the best AI operator? |
| Method | Standardized benchmark suites | Token telemetry from real sessions |
| Metric | Accuracy, pass rate, Elo | Yield (Υ) = (cache_read × output) / input² |
| Data source | Test prompts run against models | Operator's own session telemetry |
| Public? | Yes (Vals AI, LMSYS, LiveBench) | Yes (SigRank — the only one) |
| Examples | Vals AI, LMSYS Arena, LiveBench | SigRank |

Model evals tell you which model to use. Operator evals tell you how well you're using it.
A great operator with a mediocre model can out-Yield a poor operator with the best model.

## The eval metric: Yield (Υ)

Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency, not raw spend.

Volume is noise. Yield is signal. The operator who burns 10M tokens to produce 1K output
has lower Yield than the operator who uses 100K tokens to produce the same 1K output.

### Five portable-core metrics and four product/leaderboard dimensions

The first five rows are the ${SIGRANK_STANDARD_VERSION} portable core. Efficiency,
Scale V, cost, and Op Ratio are useful product views but are not required for
base SigRank compatibility.

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

4 of 9 leaderboard dimensions have a different #1 — metric rotation is a real variety axis.

## Operator evals

- [Operator Evals](https://sigeconomy.com/operator-evals): the public evaluation layer for AI operators — model evals vs operator evals
- [Public Operator Evals Thesis](https://sigeconomy.com/public-operator-evals): why public operator evals matter — the case for public AI operator evaluation
- [SigRank vs Vals AI](https://sigeconomy.com/vs/vals-ai): operator evals vs model evals — different subjects, different metrics

## SigRank Standard and operator measurement

- [AI Operator Standard](https://sigeconomy.com/ai-operator-standard): proposed portable specification for the human operator layer
- [AI Operator Metrics](https://sigeconomy.com/ai-operator-metrics): I/O/W/R plus the five-metric SigRank v0.1 draft core
- [Model vs Agent vs Operator Evals](https://sigeconomy.com/model-vs-agent-vs-operator-evals): the evaluation layers and what each measures
- [Privacy-Preserving AI Telemetry](https://sigeconomy.com/privacy-preserving-ai-telemetry): content-independent measurement and its limits

## Articles

- [Why Operator Evals Matter](https://sigeconomy.com/articles/why-operator-evals-matter): the case for public AI operator evaluation
- [Operator Evals vs Model Evals](https://sigeconomy.com/articles/operator-evals-vs-model-evals): different subjects, different metrics, different questions

## Core pages

- [Leaderboard](https://sigeconomy.com/): live operator evals — who's #1 right now
- [Weekly drop](https://sigeconomy.com/weekly): this week's rankings drop — biggest movers, new challengers, class distribution
- [How it works](https://sigeconomy.com/how-it-works): the 60-second Yield (Υ) explainer
- [Compare](https://sigeconomy.com/compare): head-to-head operator comparison — who's better?

## Topic hubs

- [Best AI User](https://sigeconomy.com/best-ai-user): who is the best AI user? The definitive ranking by Yield (Υ)
- [AI User Leaderboard](https://sigeconomy.com/ai-user-leaderboard): the public operator evals leaderboard
- [AI User Ranking](https://sigeconomy.com/ai-user-ranking): how AI operators are evaluated — the Yield cascade explained
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

- [vs Vals AI](https://sigeconomy.com/vs/vals-ai): operator evals vs model evals — different subjects, different metrics
- [vs topaiusers.com](https://sigeconomy.com/vs/topaiusers): SigRank vs TopAIUsers — measured vs curated
- [vs ccusage](https://sigeconomy.com/vs/ccusage): SigRank vs ccusage — yield vs raw token count
- [vs Langfuse](https://sigeconomy.com/vs/langfuse): SigRank vs Langfuse — operator evals vs LLM observability
- [vs Braintrust](https://sigeconomy.com/vs/braintrust): SigRank vs Braintrust — operator evaluation vs AI app evaluation
- [vs LangChain + LangSmith](https://sigeconomy.com/vs/langchain): SigRank vs LangChain/LangSmith — operator ranking vs agent framework + observability
- [vs LMSYS Arena](https://sigeconomy.com/vs/lmsys-arena): operator evals vs model evals — ranking humans vs ranking models
- [vs WakaTime](https://sigeconomy.com/vs/wakatime): token efficiency vs time tracking
- [vs VibeRank](https://sigeconomy.com/vs/viberank): measured Yield vs vibe coding leaderboard — popularity vs efficiency
- [vs TokenMaxxer](https://sigeconomy.com/vs/tokenmaxxer): efficiency vs token maximization — volume vs Yield
- [vs WhoBurnedMore](https://sigeconomy.com/vs/whoburnedmore): Yield vs token burning contest — waste vs efficiency
- [vs AIUsage](https://sigeconomy.com/vs/aiusage): operator ranking vs usage dashboard — numbers vs a score
- [vs ccburn](https://sigeconomy.com/vs/ccburn): Yield vs Claude Code burn rate — speed vs efficiency
- [vs ccflare](https://sigeconomy.com/vs/ccflare): operator ranking vs Claude usage flare — charts vs a score
- [vs ccstatusline](https://sigeconomy.com/vs/ccstatusline): operator ranking vs Claude status display — inline stats vs a rank
- [vs TokenForest](https://sigeconomy.com/vs/token-forest): Yield vs token tree visualization — structure vs efficiency
- [vs SessionWatcher](https://sigeconomy.com/vs/sessionwatcher): Yield vs live session monitoring — activity vs efficiency
- [vs Omnara](https://sigeconomy.com/vs/omnara): operator ranking vs AI usage dashboard — numbers vs a score
- [vs Sculptor](https://sigeconomy.com/vs/sculptor): cross-tool Yield vs single-tool metrics
- [vs VibeIsland](https://sigeconomy.com/vs/vibe-island): measured Yield vs vibe coding community — social vs measured
- [vs NotchPilot](https://sigeconomy.com/vs/notch-pilot): operator evals vs AI coding assistant metrics
- [vs Opcode](https://sigeconomy.com/vs/opcode): operator evals vs AI coding tool metrics
- [vs Lineman](https://sigeconomy.com/vs/lineman): operator evals vs AI coding tool stats
- [vs CodeBurn](https://sigeconomy.com/vs/codeburn): Yield vs code burn tracking — volume vs efficiency
- [vs ClaudeCount](https://sigeconomy.com/vs/claudecount): Yield vs Claude token counting — volume vs efficiency
- [vs ccgather](https://sigeconomy.com/vs/ccgather): Yield vs Claude Code data gathering — raw collection vs a score
- [vs ClaudeRank](https://sigeconomy.com/vs/clauderank): cross-tool Yield vs Claude-only ranking

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

SigRank is the public evaluation layer for AI operators — public LLM operator evals.
Like Vals AI evaluates models, SigRank evaluates the humans using AI.
The AI User Leaderboard — who's the best AI user? Unlike model leaderboards
that rank AI models, SigRank ranks the HUMANS using AI — their skill at
efficiently using AI tools. Operator skill should be measurable, comparable, and public.

- GitHub: https://github.com/SunrisesIllNeverSee
- X/Twitter: https://x.com/burnmydays
- Main site: https://signalaf.com
- Leaderboard: https://sigeconomy.com
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
