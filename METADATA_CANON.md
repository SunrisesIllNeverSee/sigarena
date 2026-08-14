# Canonical Metadata & Terminology — sigeconomy.com

> Single source of truth for public-facing language and encoded metadata.
> Every page, schema, and discovery surface should reference this document.

## The one public tag

**"Performative evals and ranking for users not models."**

This is the canonical one-liner. Everything else supports it.

## The positioning

SigRank is the statistical layer for AI users — the same way ERA, batting
average, and OPS are the statistical layer for baseball. Custom metrics take
raw usage data and turn it into universally understood stats:

- **Identify the best** — who is the #1 AI user
- **Mark growth** — track improvement over time
- **Aggregates & medians** — team-level and population-level stats
- **Get better** — users study their stats to improve
- **Study the field** — teams and hiring managers use the leaderboard

Fantasy sports runs on stats. Video games have leaderboards. AI now has
SigRank.

Yield (Υ) is the ERA of AI usage. Leverage is the on-base percentage.
Velocity is the slugging percentage. The full metric suite is the box score.

## Keyword interchangeability

These terms are interchangeable. Use the accessible variant in visible copy;
encode all variants in metadata.

### The person (visible: "AI user")

| Visible | Metadata variants |
|---------|-------------------|
| AI user | AI operator, operator, developer, coder, human, person using AI, AI developer, AI coder |
| AI users | AI operators, operators, developers, coders, humans using AI |

### The tool (visible: "AI")

| Visible | Metadata variants |
|---------|-------------------|
| AI | LLM, AI model, model, Claude, GPT, Gemini, Cursor, Copilot, Windsurf, Codex, coding agent, AI coding tool, AI platform |

### The measurement (visible: "evals and ranking")

| Visible | Metadata variants |
|---------|-------------------|
| evals | evaluations, benchmarks, metrics, statistics, stats, scores, ratings |
| ranking | leaderboard, rankings, board, standings, tier list |

### The key distinction (always visible)

**"users not models"** — this is the differentiator. Always present.

- SigRank evaluates the human, not the AI
- SigRank ranks users, not models
- SigRank measures the operator, not the tool
- Vals AI / LMSYS Arena evaluate models. SigRank evaluates the humans using them.

### The headline metric (visible: "Yield")

| Visible | Metadata variants |
|---------|-------------------|
| Yield (Υ) | token-cascade efficiency, cascade efficiency, token efficiency, AI usage efficiency, performative efficiency |

## What goes where

### Visible copy (hero, headlines, body text)

Use the accessible variant:
- "AI users" not "AI operators"
- "evals and ranking" not "operator evals"
- "Yield" not "token-cascade efficiency" (except in methodology context)
- "AI" not "LLM" (except in technical/comparison context)
- Sports stats analogy where it fits naturally

### Encoded metadata (title tags, meta descriptions, JSON-LD, OG tags)

Cast the wide net. Include multiple variants:
- Title: "Performative Evals & Leaderboard for AI Users — Ranked by Yield | SigRank"
- Description: include "AI users", "operators", "developers", "benchmarks", "leaderboard", "Yield"
- JSON-LD: use all variant terms across different schemas
- OG/Twitter: accessible language for social sharing

### llms.txt / llms-full.txt (LLM discovery)

Use the full positioning with sports stats analogy. Include all keyword
variants. This is the document AI search engines will read and cite.

### /operator-evals landing page

This page keeps "operator evals" in its URL and title (it's the dedicated
landing page for the concept), but the body uses the sports stats analogy
to make it accessible. It explains:
- What performative evals are (stats for AI users, like ERA for baseball)
- Why users not models is the key distinction
- How Yield works as a statistical metric
- The full metric suite as a box score

## Pages that keep "operator evals" in the URL

These pages were created with "operator-evals" in the URL. The URLs stay
as-is (they're indexed and linked). The visible copy shifts to the
accessible framing:

| Route | Visible title | URL (unchanged) |
|-------|---------------|-----------------|
| /operator-evals | "Performative Evals for AI Users" | /operator-evals |
| /public-operator-evals | "The Statistical Layer for AI" | /public-operator-evals |
| /articles/why-operator-evals-matter | "Why AI User Stats Matter" | /articles/why-operator-evals-matter |
| /articles/operator-evals-vs-model-evals | "User Evals vs Model Evals" | /articles/operator-evals-vs-model-evals |
| /vs/vals-ai | "SigRank vs Vals AI — Users vs Models" | /vs/vals-ai |

## Sports stats mapping

| Baseball stat | SigRank equivalent | What it measures |
|---------------|-------------------|------------------|
| ERA (earned run average) | Yield (Υ) | Overall efficiency — the headline number |
| On-base percentage | Leverage | How often you "get on base" via cache reuse |
| Slugging percentage | Velocity | Power — output per token spent |
| Batting average | SNR | Clean signal — quality of output |
| OPS | Efficiency | Combined score |
| Games played | Scale V | Volume — how much you've played |
| Cost per win | $/1M | Cost efficiency |
| WAR | 10xDEV | Normalized value above replacement |

This mapping is for explanatory copy, not metadata. Use it where the sports
analogy helps a human reader understand. Don't force it into every page.
