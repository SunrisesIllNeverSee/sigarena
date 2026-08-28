import type { Metadata } from "next";
import Link from "next/link";
import { getFullLeaderboard, computeDeltaFromAverage, sortLeaderboard, computeAggregates, formatTokenCount } from "@/lib/api";
import { deriveSpotlight, checkDethrone } from "@/lib/campaign";
import { RankCard } from "@/components/rank-card";
import { SpotlightSection } from "@/components/spotlight";
import { Trophy, TrendingUp, Crown, Sparkles, BarChart3, Layers, Zap, Search } from "lucide-react";
import { JsonLd, leaderboardSchema, articleSchema, websiteSchemaWithStats } from "@/lib/jsonld";
import { getPromptOfTheDay, getActivePrompts, getPlatformOfTheDay } from "@/lib/prompts";
import { formatYield, operatorDisplayName } from "@/lib/utils";

// Force-dynamic: render at request time so the HTML always contains real
// leaderboard data (not a loading spinner). The API response is edge-cached
// for 5 minutes via cachedFetch() in lib/api.ts, so the render is fast after
// the first request. This fixes the SEO/Lighthouse issue where the static
// build baked in "Loading rankings…" because the API wasn't reachable from CI.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Performative Evals & Leaderboard for AI Users — Ranked by Yield | SigRank SignalAF",
  description:
    "SigRank is the public proof surface for AI operators, powered by Upsilon's privacy-preserving measurement engine. Public rankings by Yield—not raw token volume.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Performative Evals & Leaderboard for AI Users | SigRank SignalAF",
    description:
      "The statistical layer for AI users. Performative evals and ranking for users not models. Ranked by Yield — like ERA for baseball, but for AI.",
    url: "https://sigeconomy.com",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Performative Evals & Leaderboard for AI Users — SigRank SignalAF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Performative Evals for AI Users — SigRank SignalAF",
    description: "The statistical layer for AI users. Evals and ranking for users not models. Ranked by Yield.",
    images: [{ url: "/og.png", alt: "Performative Evals & Leaderboard for AI Users — SigRank SignalAF" }],
  },
};

export default async function HomePage() {
  const data = await getFullLeaderboard("all_time");

  if (!data || data.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Leaderboard refreshing</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;re pulling the latest rankings. Check back in a moment.
        </p>
      </div>
    );
  }

  const { deltas } = computeDeltaFromAverage(data.entries);
  const aggregates = computeAggregates(data);
  const spotlight = deriveSpotlight(data);
  const dethrone = checkDethrone(data);
  const topOperator = data.entries[0];
  const promptOfDay = getPromptOfTheDay();
  const platformOfDay = getPlatformOfTheDay();
  const allPrompts = getActivePrompts();
  const platformCount = Object.keys(aggregates.platforms).length;

  // Sort the already-fetched full board locally for the prompt-of-the-day and
  // platform-spotlight sections. Avoids 2 extra 1640-row network fetches per
  // homepage load (Cloudflare OpenNext uses dummy ISR — no cache between calls).
  const promptTop = sortLeaderboard(data, promptOfDay.metric, "all", "peak", 3).entries;
  const platformTop = sortLeaderboard(data, "yield", platformOfDay, "peak", 3).entries;

  return (
    <div className="space-y-8">
      <p className="text-xs text-muted-foreground">Last updated: August 14, 2026</p>
      <JsonLd data={[
        leaderboardSchema(data.entries.slice(0, 50), "AI User Leaderboard", "https://sigeconomy.com"),
        articleSchema(
          "AI User Leaderboard — Ranked by Yield",
          "Who's the best AI user? The AI User Leaderboard ranks operators by Yield — token-cascade efficiency, not raw spend.",
          "/",
        ),
        websiteSchemaWithStats(aggregates, platformCount),
      ]} />
      {/* Hero */}
      <section className="text-center pt-6 pb-2">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="gradient-text">Public LLM</span>
          <br />
          <span className="gradient-text">Operator Evals</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          The public evaluation layer for AI operators.
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
          sigeconomy.com is the public AI operator leaderboard for SigRank
          SignalAF — not related to the gig economy. Like Vals AI evaluates
          models, SigRank evaluates the humans using AI.{" "}
          Ranked by <span className="font-semibold text-foreground">{"\u03a5"} Yield</span> {"\u2014"} token-cascade efficiency, not raw spend.{" "}
          <Link href="/operator-evals" className="text-primary font-medium hover:underline">
            What are operator evals?
          </Link>
        </p>
      </section>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 border border-amber-200">
          <Crown className="h-4 w-4 text-amber-600" aria-hidden="true" />
          <span className="font-semibold text-amber-900">
            {operatorDisplayName(topOperator.display_name, topOperator.codename)}
          </span>
          <span className="text-amber-700">is #{topOperator.rank}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 border border-blue-200">
          <TrendingUp className="h-4 w-4 text-blue-600" aria-hidden="true" />
          <span className="text-blue-900">{data.total_operators} operators</span>
        </div>
        <div className="text-muted-foreground">
          Updated {new Date(data.generated_at).toLocaleDateString()}
        </div>
      </div>

      {/* Dense product description for AI crawlers and content efficiency */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          What is sigeconomy.com?
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          sigeconomy.com is the public evaluation surface for SigRank SignalAF —
          the AI operator leaderboard. It ranks AI operators (the humans using AI
          tools, not the AI models themselves) by Yield (Υ = cache_read × output /
          input²), a composite token-cascade efficiency metric computed from four
          token pillars: cache_read (reused context), cache_write (new context
          stored), input (tokens sent to the model), and output (tokens produced).
          Unlike model leaderboards such as LMSYS Chatbot Arena or Vals AI that
          rank AI models by human voting or benchmark performance, sigeconomy.com
          evaluates the human factor — how efficiently each operator uses AI
          capabilities. The site is read-only: all data comes from SigRank&apos;s
          public API at signalaf.com. Operators run a local scanner (
          <code className="font-mono">npx sigrank</code>) that reads token
          telemetry and submits signed, privacy-preserving snapshots. No prompt
          content, code, or conversation text ever leaves the machine — only four
          token counts. The leaderboard ranks operators across all-time, 7-day,
          30-day, and 90-day windows, with nine leaderboard dimensions. Five form
          the portable SigRank core: Yield,
          Velocity, Leverage, SNR, 10xDEV, Efficiency, Scale V, cost per million
          tokens, and Op Ratio remain product-level views. Operator classes range from IGNITER through ARCH+
          based on total tokens accumulated. The public REST API, OpenAPI
          specification, MCP server, and CLI tool are documented at{" "}
          <Link href="/developers" className="text-primary font-medium hover:underline">
            /developers
          </Link>
          .
        </p>
        <h3 className="text-lg font-semibold text-foreground pt-2">
          How agents and developers should use this site
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          sigeconomy.com serves three audiences: human visitors who want to see
          who ranks highest among AI operators, AI search engines that need
          structured answers to questions like &quot;who is the best AI user?&quot;,
          and software agents that need machine-readable interfaces. For
          programmatic access, use the{" "}
          <Link href="/openapi.json" className="text-primary font-medium hover:underline">
            OpenAPI specification
          </Link>{" "}
          for typed REST operations, the{" "}
          <Link href="/.well-known/mcp" className="text-primary font-medium hover:underline">
            MCP manifest
          </Link>{" "}
          for Streamable HTTP discovery, the{" "}
          <Link href="/agent-instructions.txt" className="text-primary font-medium hover:underline">
            agent instructions file
          </Link>{" "}
          for when-to-use guidance, or{" "}
          <Link href="/llms.txt" className="text-primary font-medium hover:underline">
            llms.txt
          </Link>{" "}
          for a compact agent-readable index. The official CLI (
          <code className="font-mono">npx sigrank</code>) provides local telemetry
          scanning and an MCP server for agent-native workflows. Trust anchor pages
          are available at{" "}
          <Link href="/about" className="text-primary font-medium hover:underline">/about</Link>,{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">/contact</Link>,
          and{" "}
          <Link href="/privacy" className="text-primary font-medium hover:underline">/privacy</Link>.
          The full scoring methodology is at{" "}
          <a href="https://signalaf.com/methodology" className="text-primary font-medium hover:underline">
            signalaf.com/methodology
          </a>.
        </p>
        <h3 className="text-lg font-semibold text-foreground pt-2">
          The portable core and product views
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          SigRank&apos;s portable core defines five token-cascade metrics: Yield,
          Velocity, Leverage, SNR, and 10xDEV. The leaderboard also presents four
          product-level views, so each dimension answers a different question
          about AI operator performance. Yield (Υ) is the
          flagship: it measures token-cascade efficiency as cache_read multiplied
          by output divided by input squared. Velocity measures output per unit of
          fresh input — who gets the most done with the least new context.
          Leverage measures cache reuse relative to fresh input — who compounds
          prior context most effectively. SNR (Signal-to-Noise Ratio) measures the
          share of fresh conversational traffic represented by output. 10xDEV is
          the log10 of Leverage, normalizing the scale. Efficiency compares an
          operator&apos;s cascade against the theoretical 7:2:1 Anthropic
          attention-allocator baseline. Scale V separates operating scale from
          efficiency using log10 of total tokens. Cost per million tokens
          normalizes spend across providers and pricing tiers. Op Ratio expresses
          the cache:input:output relationship as a single ratio string. Each
          metric has a different number one — four of the eight non-Yield metrics
          have a different leader, which means no single operator dominates every
          dimension of AI usage. The leaderboard updates continuously as operators
          submit new telemetry snapshots through the CLI.
        </p>
        <h3 className="text-lg font-semibold text-foreground pt-2">
          Privacy and data collection
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          SigRank collects only four token counts per snapshot: cache_read,
          cache_write, input, and output. No prompt text, model responses, source
          code, file names, project names, or any other content is transmitted.
          The local scanner reads these counts from the AI provider&apos;s API
          telemetry endpoint and signs the snapshot cryptographically before
          submission. The signature proves the snapshot was generated by the CLI
          without revealing any content. Operators can opt out at any time, and
          all identifying data is scrubbed from every file in the repository. The
          full privacy policy is at{" "}
          <Link href="/privacy" className="text-primary font-medium hover:underline">/privacy</Link>.
          The dataset is published under a Zenodo DOI for reproducibility. The
          theoretical foundation is documented in a separate Zenodo publication
          covering the Yield cascade, the conservation law, and the relationship
          between operator evals and model evals.
        </p>
        <h3 className="text-lg font-semibold text-foreground pt-2">
          Operator classes and ranking windows
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Operators are classified into tiers based on total tokens accumulated:
          IGNITER (entry-level, just starting), BEACON (consistent usage
          emerging), LANTERN (significant scale), COMPASS (established
          high-scale operator), ARCH (top-tier operator with substantial
          cumulative tokens), and ARCH+ (the highest class, reserved for the
          largest-scale operators). Class is a scale qualifier, not an efficiency
          qualifier — a high-class operator is not necessarily a high-Yield
          operator, and vice versa. This separation is intentional: it prevents
          the leaderboard from conflating raw volume with cascade efficiency. The
          leaderboard supports four ranking windows: all-time (the default,
          showing cumulative performance since the operator first appeared),
          90-day, 30-day, and 7-day rolling windows. The weekly drop page
          highlights the biggest movers, new challengers, and class distribution
          changes from the past seven days. Operators can appear on multiple
          metric leaderboards simultaneously, and the prompt-of-the-day feature
          rotates through the nine leaderboard dimensions to surface different
          dimensions of operator performance. The compare page allows
          head-to-head comparison of any two operators across all metrics, with
          visual indicators showing which operator leads on each dimension.
        </p>
        <h3 className="text-lg font-semibold text-foreground pt-2">
          Supported platforms and comparison pages
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          SigRank currently tracks operators across multiple AI platforms
          including Claude (Anthropic), ChatGPT (OpenAI), Cursor, and other
          providers that expose token telemetry through their APIs. The platform
          spotlight feature rotates daily to highlight the top operators on a
          specific platform. Comparison pages position SigRank against
          adjacent tools:{" "}
          <Link href="/vs/vals-ai" className="text-primary font-medium hover:underline">vs Vals AI</Link>{" "}
          (operator evals vs model evals),{" "}
          <Link href="/vs/topaiusers" className="text-primary font-medium hover:underline">vs TopAIUsers</Link>{" "}
          (measured vs curated),{" "}
          <Link href="/vs/ccusage" className="text-primary font-medium hover:underline">vs ccusage</Link>{" "}
          (yield vs raw token count),{" "}
          <Link href="/vs/langfuse" className="text-primary font-medium hover:underline">vs Langfuse</Link>{" "}
          (operator evals vs LLM observability),{" "}
          <Link href="/vs/braintrust" className="text-primary font-medium hover:underline">vs Braintrust</Link>{" "}
          (operator evaluation vs AI app evaluation), and{" "}
          <Link href="/vs/lmsys-arena" className="text-primary font-medium hover:underline">vs LMSYS Arena</Link>{" "}
          (ranking humans vs ranking models). These pages clarify what SigRank
          measures and what it does not, helping AI search engines and agents
          understand the boundary between operator evaluation and model
          evaluation.
        </p>
        <h3 className="text-lg font-semibold text-foreground pt-2">
          Methodology and reproducibility
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          The SigRank methodology is published openly for reproducibility and
          independent verification. Yield (Υ) is defined as cache_read multiplied
          by output divided by input squared — a composite efficiency metric that
          rewards operators who reuse cached context and produce output without
          continually rebuilding context from scratch. The conservation law
          states that total tokens equal cache_read plus cache_write plus input
          plus output, and no operator can increase one pillar without decreasing
          or holding constant the others. This constraint is what makes the
          cascade a zero-sum efficiency problem rather than a simple volume
          contest. The dataset of operator telemetry is published under a Zenodo
          DOI (10.5281/zenodo.21900519) and the theoretical foundation is
          documented under a separate DOI (10.5281/zenodo.20029607). The full
          methodology page at signalaf.com/methodology provides quotable key
          figures, formula derivations, and the relationship between operator
          evals and model evals. A score calculator is available at
          signalaf.com/score where anyone can paste their four token counts and
          receive their Yield and operator class without creating an account. The
          canonical test suite verifies that the MOSES seed values produce the
          expected Yield of 18436.98, ensuring the scoring engine remains stable
          across deployments. SigRank evaluates AI operators, not AI models — the
          harness may measure authority, but it cannot manufacture authority, and
          automated systems may not promote claims into owner-approved truth.
        </p>
      </section>

      {/* Aggregate stats — citable numbers for AI search engines */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
          <div className="text-2xl font-bold tabular-nums">{aggregates.total_operators.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">operators ranked</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Zap className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
          <div className="text-2xl font-bold tabular-nums">{formatTokenCount(aggregates.total_tokens)}</div>
          <div className="text-xs text-muted-foreground">tokens analyzed</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Layers className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
          <div className="text-2xl font-bold tabular-nums">{platformCount}</div>
          <div className="text-xs text-muted-foreground">platforms tracked</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" aria-hidden="true" />
          <div className="text-2xl font-bold tabular-nums">{formatYield(aggregates.median_yield)}</div>
          <div className="text-xs text-muted-foreground">median Yield (Υ)</div>
        </div>
      </div>

      {/* Prompt of the day — featured question + answer */}
      <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Prompt of the day
          </span>
        </div>
        <Link href={`/${promptOfDay.slug}`} className="block">
          <h2 className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">
            {promptOfDay.question}
          </h2>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          Ranked by{" "}
          <span className="font-semibold text-foreground">{promptOfDay.metric_label}</span> —{" "}
          <span className="font-mono text-xs">{promptOfDay.metric_formula}</span>
        </p>
        {promptTop.length > 0 && (
          <div className="mt-4 space-y-2">
            {promptTop.map((entry, i) => (
              <Link
                key={entry.codename}
                href={`https://signalaf.com/user/${entry.codename}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${i === 0 ? "gradient-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-semibold">
                  {operatorDisplayName(entry.display_name, entry.codename)}
                </span>
                <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium">
                  {entry.platform}
                </span>
                <span className="text-sm font-bold tabular-nums gradient-text">
                  {formatMetricDisplay(entry, promptOfDay.metric)}
                </span>
              </Link>
            ))}
          </div>
        )}
        <Link
          href={`/${promptOfDay.slug}`}
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          See full ranking →
        </Link>
      </section>

      {/* Platform spotlight — rotating platform of the day */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Platform spotlight: {platformOfDay}
          </h3>
          <Link
            href={`/best-ai-user?platform=${platformOfDay}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            Full board →
          </Link>
        </div>
        {platformTop.length > 0 ? (
          <div className="space-y-2">
            {platformTop.map((entry, i) => (
              <Link
                key={entry.codename}
                href={`https://signalaf.com/user/${entry.codename}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <span className="text-sm font-bold tabular-nums text-muted-foreground w-6">
                  #{i + 1}
                </span>
                <span className="flex-1 truncate font-medium">
                  {operatorDisplayName(entry.display_name, entry.codename)}
                </span>
                <span className="rounded-md border border-border px-2 py-0.5 text-xs">
                  {entry.class_tier}
                </span>
                <span className="text-sm font-bold tabular-nums gradient-text">
                  Υ {formatYield(entry.yield_)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No operators on this platform yet.</p>
        )}
      </section>

      {/* Spotlight + dethrone watch */}
      <SpotlightSection spotlight={spotlight} dethrone={dethrone} />

      {/* Leaderboard list — top 50 by Yield */}
      <section>
        <h2 className="text-xl font-bold tracking-tight pt-2 pb-3">Top operators by Yield (Υ)</h2>
        <div className="space-y-2">
          {data.entries.slice(0, 50).map((entry) => (
            <RankCard
              key={entry.codename}
              entry={entry}
              deltaFromAverage={deltas.get(entry.codename)}
            />
          ))}
        </div>
      </section>

      {/* Prompt grid — all 9 metric rankings */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">9 ways to rank AI users</h2>
        <p className="text-sm text-muted-foreground">
          Yield is the flagship, but there are other canonical token metrics. Each question
          below has a different #1 — 4 of 8 metrics have a different king.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allPrompts.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group rounded-lg border border-border p-4 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="font-semibold text-foreground group-hover:text-primary">
                {p.question}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {p.metric_label} — {p.current_leader.name} leads
              </div>
              <div className="mt-2 text-xs font-mono text-muted-foreground/70">
                {p.metric_formula}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Server-rendered context for people, crawlers, and agents */}
      <section className="space-y-5 rounded-lg border border-border bg-card p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">How to read a SigRank operator eval</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            SigRank evaluates the operating pattern around an AI model, not the model itself. The public board is built from token telemetry: fresh input, model output, cache write, and cache read. Those four counts are enough to describe how much new context an operator sends, how much the model produces, how much context is stored for reuse, and how much prior context is actually reused. The canonical measurements do not require the words in a prompt, the content of a model response, source code, or private documents.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">What Yield measures</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Yield (Υ) is cache read multiplied by output and divided by fresh input squared. It rises when an operator compounds reusable context and produces output without continually rebuilding the same context from scratch. Yield is an efficiency measure of the token cascade. It is not a direct claim about code quality, business productivity, intelligence, or the value of a downstream outcome. An operator with high Yield is efficient at reusing context and producing output relative to the fresh input they consume. An operator with low Yield may be producing valuable work but is doing so with less cascade efficiency — they send more fresh context per unit of output. The leaderboard ranks by Yield because it normalizes for scale: a small-scale operator can out-Yield a large-scale one if their cascade is more efficient. This is why SigRank separates efficiency (Yield) from scale (Scale V, total tokens) — they measure different things and should not be conflated.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Why the other metrics matter</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Leverage isolates cache reuse relative to fresh input. Velocity isolates output relative to fresh input. SNR describes the share of fresh conversational traffic represented by output. Scale V separates operating scale from efficiency, while cost and operating-ratio views expose different shapes of the same cascade. No single ranking should be read as a complete evaluation of a person or workflow. The nine metrics together form a multi-dimensional view of how an operator interacts with AI: efficiency, reuse, throughput, signal quality, scale, cost, and ratio balance. An operator who leads on Yield may not lead on Velocity, and an operator who leads on Scale V may not lead on Efficiency. This is by design — it prevents any single metric from becoming a proxy for overall quality and encourages operators to understand their own cascade shape rather than optimizing for one number.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">How agents and developers should call it</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Current public rankings are available through the SignalAF REST API, while the SigRank MCP server and CLI provide agent-native and local workflows. The <Link href="/developers" className="text-primary font-medium hover:underline">SigRank SignalAF developer portal</Link> links the OpenAPI contract, MCP discovery, authentication guidance, agent instructions, and the official <code>npx sigrank</code> CLI so software can select the correct interface without scraping the visual board. The REST API is versioned at /api/v1 with URL-based major versioning, and deprecated operations return Deprecation and Sunset headers per RFC 8594. Rate limits are 60 requests per 60 seconds per IP, exposed via RateLimit-Policy and RateLimit structured fields so agents can self-throttle. Error responses use RFC 9457 application/problem+json with a stable machine-readable code field. Unknown paths return a real HTTP 404 with agent recovery links to the sitemap, llms.txt, developer portal, and OpenAPI spec. The homepage supports HTTP content negotiation for text/html and text/markdown with Vary: Accept so shared caches do not mix representations.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Think you can beat them?</p>
        <p className="mt-2 text-white/80">
          Measure your AI usage and get your rank on SigRank.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </section>

      {/* Ask AI about us — copy-pasteable prompts for AI search engines (AEO Item 8b) */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-2">Ask AI about us</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Copy these prompts into ChatGPT, Perplexity, or Google AI Overviews
          to see how AI search engines answer questions about SigRank.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { q: "Who is the best AI user?", link: "/best-ai-user" },
            { q: "What is Yield in AI usage?", link: "/how-it-works" },
            { q: "How are AI operators ranked?", link: "/ai-user-ranking" },
            { q: "What is the AI user leaderboard?", link: "/ai-user-leaderboard" },
            { q: "How does SigRank compare to Vals AI?", link: "/vs/vals-ai" },
            { q: "What are performative evals for AI users?", link: "/operator-evals" },
            { q: "Who reuses context the most in AI coding?", link: "/most-context-reuse" },
            { q: "Who gets the cheapest AI tokens?", link: "/cheapest-tokens" },
          ].map((item) => (
            <a
              key={item.q}
              href={item.link}
              className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
              <span>&ldquo;{item.q}&rdquo;</span>
            </a>
          ))}
        </div>
      </section>

      {/* Weekly drop banner */}
      <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
        New rankings drop every Monday.{" "}
        <Link href="/weekly" className="text-primary font-medium hover:underline">
          See this week&apos;s drop →
        </Link>
      </div>
    </div>
  );
}

/** Format a metric value for display in the prompt-of-the-day section. */
function formatMetricDisplay(
  entry: { yield_: number; velocity: number; leverage: number; snr: number; dev10x: number | null; scale_v: number; efficiency: number; cost_per_million: number | null },
  metric: string,
): string {
  switch (metric) {
    case "yield":
      return formatYield(entry.yield_);
    case "velocity":
      return entry.velocity.toFixed(2);
    case "leverage":
      return entry.leverage.toLocaleString(undefined, { maximumFractionDigits: 0 });
    case "snr":
      return entry.snr.toFixed(4);
    case "dev10x":
      return (entry.dev10x ?? 0).toFixed(2);
    case "scale_v":
      return entry.scale_v.toFixed(2);
    case "efficiency":
      return entry.efficiency.toLocaleString(undefined, { maximumFractionDigits: 0 });
    case "cost_per_million":
      return `$${entry.cost_per_million?.toFixed(4) ?? "—"}/M`;
    case "op_ratio":
      return entry.leverage.toLocaleString(undefined, { maximumFractionDigits: 0 });
    default:
      return formatYield(entry.yield_);
  }
}
