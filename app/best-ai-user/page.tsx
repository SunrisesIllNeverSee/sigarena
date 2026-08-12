import { getSortedLeaderboard, getFullLeaderboard, computeDeltaFromAverage } from "@/lib/api";
import { deriveSpotlight, checkDethrone } from "@/lib/campaign";
import { RankCard } from "@/components/rank-card";
import { ShareBar } from "@/components/share-bar";
import { SpotlightSection } from "@/components/spotlight";
import Link from "next/link";
import { Trophy, Crown } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/jsonld";
import { formatYield } from "@/lib/utils";
import { PLATFORMS, getActivePrompts, type Platform, type View, type Category, type Window, WINDOWS, WINDOW_LABELS } from "@/lib/prompts";

// Force-dynamic: render at request time so the HTML always contains real
// leaderboard data (not a loading spinner). The API response is edge-cached
// for 5 minutes via cachedFetch() in lib/api.ts.
// The page renders with default filter values (all platforms, peak view,
// human category, all_time window). Filter buttons remain as visual navigation
// but the server-rendered content is always the canonical default.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Best AI User — Who Is the Best AI User Alive?",
  description:
    "The definitive ranking of the best AI users. Ranked by Yield (Υ) — token-cascade efficiency, not raw spend. See who's #1, who's climbing, and who got dethroned.",
  alternates: { canonical: "/best-ai-user" },
  openGraph: {
    title: "Best AI User — Who Is the Best AI User Alive?",
    description:
      "The definitive ranking. Powered by SigRank's Yield (Υ) metric.",
    url: "https://sigeconomy.com/best-ai-user",
    type: "website",
  },
};

function parsePlatform(s: string | undefined): Platform {
  if (s && (PLATFORMS as string[]).includes(s)) return s as Platform;
  return "all";
}

function parseView(s: string | undefined): View {
  if (s === "center" || s === "peak") return s;
  return "peak";
}

function parseCategory(s: string | undefined): Category {
  if (s === "all") return "all";
  return "human";
}

function parseWindow(s: string | undefined): Window {
  if (s === "7d" || s === "30d" || s === "90d" || s === "all_time") return s;
  return "all_time";
}

function promptUrl(slug: string, platform: Platform, view: View, category: Category, window: Window): string {
  const params = new URLSearchParams();
  if (platform !== "all") params.set("platform", platform);
  if (view !== "peak") params.set("view", view);
  if (category !== "human") params.set("category", category);
  if (window !== "all_time") params.set("window", window);
  const qs = params.toString();
  return qs ? `/${slug}?${qs}` : `/${slug}`;
}

export default async function BestAIUserPage() {
  // Default filter values — ISR with 12h revalidate. Filter buttons remain
  // as visual navigation but the server-rendered content is always the
  // canonical default view.
  const platform = "all" as Platform;
  const view = "peak" as View;
  const category = "human" as Category;
  const win = "all_time" as Window;

  const data = await getSortedLeaderboard("yield", platform, view, 50, win, category);

  if (!data || data.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Leaderboard refreshing</h2>
      </div>
    );
  }

  const { deltas } = computeDeltaFromAverage(data.entries);
  const top = data.entries[0];
  const topName = top.display_name ?? top.codename;
  const allPrompts = getActivePrompts();

  // Spotlight + dethrone watch — only on the canonical unfiltered view.
  // The spotlight is a global-board feature (biggest mover, closest challenger);
  // it doesn't make sense on a platform-filtered or Center-trimmed view. Fetching
  // the full board only on the default view avoids an extra 1640-row fetch on
  // filtered variants.
  const isCanonicalView = platform === "all" && view === "peak";
  const fullBoard = isCanonicalView ? await getFullLeaderboard("all_time") : null;
  const spotlight = fullBoard ? deriveSpotlight(fullBoard) : null;
  const dethrone = fullBoard ? checkDethrone(fullBoard) : null;

  return (
    <div className="space-y-6">
      <JsonLd data={[
        leaderboardSchema(data.entries, "Best AI User — Top 10", "https://sigeconomy.com/best-ai-user"),
        articleSchema(
          "Best AI User — Who Is the Best AI User Alive?",
          "The definitive ranking of the best AI users by Yield.",
          "/best-ai-user",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Best AI User", path: "/best-ai-user" },
        ]),
        faqSchema([
          {
            question: "Who is the best AI user?",
            answer: `${topName} is #1 with \u03a5 Yield ${formatYield(top.yield_)}. ${data.total_operators} AI users ranked on the public operator evals leaderboard. The ranking is based on Yield \u2014 token-cascade efficiency, not raw token count.`,
          },
          {
            question: "How is the best AI user determined?",
            answer: "The best AI user is determined by Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2. Yield measures token-cascade efficiency \u2014 whether signal is compounding or tokens are being burned. It works across any AI platform: Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and others.",
          },
          {
            question: "What is Yield and how is it calculated?",
            answer: "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2. It measures token-cascade efficiency. Higher Yield means the AI user reuses cached context efficiently and produces substantial output relative to fresh input. Token counts only \u2014 never prompt content or code.",
          },
          {
            question: "How often does the AI user ranking change?",
            answer: "The leaderboard updates as new operator telemetry is submitted. Operators can climb or fall as new sessions are measured. The ranking reflects real-time token-cascade efficiency from actual AI coding sessions.",
          },
          {
            question: "How do I get my AI user score and rank?",
            answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code. The score is public; the work is private. Works with Claude, ChatGPT, Cursor, Copilot, and other AI coding tools.",
          },
        ]),
      ]} />
      {/* Hero */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Who is the best</span>
          <br />
          <span className="gradient-text">AI user alive?</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {topName} is #1 with Υ {formatYield(top.yield_)}.{" "}
          {data.total_operators} operators ranked{platform !== "all" && ` on ${platform}`}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ranked by <span className="font-semibold text-foreground">Υ Yield</span> —
          token-cascade efficiency, not raw spend.{" "}
          <Link href="/how-it-works" className="text-primary font-medium hover:underline">
            What&apos;s Υ?
          </Link>
        </p>
      </div>

      {/* Platform filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform:
        </span>
        {PLATFORMS.map((p) => (
          <Link
            key={p}
            href={promptUrl("best-ai-user", p, view, category, win)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              platform === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {/* Peak / Center view toggle */}
      <div className="flex items-center justify-center gap-2">
        <Link
          href={promptUrl("best-ai-user", platform, "peak", category, win)}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${
            view === "peak"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          The Peak
        </Link>
        <Link
          href={promptUrl("best-ai-user", platform, "center", category, win)}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${
            view === "center"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          The Center
        </Link>
        <span className="ml-2 text-xs text-muted-foreground">
          {view === "peak"
            ? "Full board, outliers included"
            : "Outliers trimmed, dense middle visible"}
        </span>
      </div>

      {/* Human / +Outliers category toggle — mirrors signalaf.com's board filter */}
      <div className="flex items-center justify-center gap-2">
        <Link
          href={promptUrl("best-ai-user", platform, view, "human", win)}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${
            category === "human"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          Human
        </Link>
        <Link
          href={promptUrl("best-ai-user", platform, view, "all", win)}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${
            category === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          + Outliers
        </Link>
        <span className="ml-2 text-xs text-muted-foreground">
          {category === "human"
            ? "Human Center of Mass — outliers & bots excluded"
            : "Including outliers & bots"}
        </span>
      </div>

      {/* Window selector — 7d / 30d / 90d / All time */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Window:
        </span>
        {WINDOWS.map((w) => (
          <Link
            key={w}
            href={promptUrl("best-ai-user", platform, view, category, w)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              win === w
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {WINDOW_LABELS[w]}
          </Link>
        ))}
      </div>

      {/* The #1 citable answer block (AEO/GEO) */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-600" />
          <span className="text-sm font-semibold text-amber-900">
            #{top.rank} — {topName}
          </span>
          <span className="rounded-md border border-amber-300 bg-white px-2 py-0.5 text-xs font-semibold text-amber-800">
            {top.platform}
          </span>
          <span className="rounded-md border border-amber-300 bg-white px-2 py-0.5 text-xs font-semibold text-amber-800">
            {top.class_tier}
          </span>
        </div>
        <p className="mt-2 text-sm text-amber-900">
          <strong>Υ {formatYield(top.yield_)}</strong> —{" "}
          <span className="font-mono text-xs">(cache_read × output) / input²</span>
        </p>
        <p className="mt-1 text-xs text-amber-700">
          Token breakdown: {top.input_tokens.toLocaleString()} input ·{" "}
          {top.output_tokens.toLocaleString()} output ·{" "}
          {top.cache_read_tokens.toLocaleString()} cache_read ·{" "}
          {top.cache_creation_tokens.toLocaleString()} cache_create
        </p>
      </div>

      {/* Spotlight + dethrone watch — canonical view only */}
      {spotlight && dethrone && (
        <SpotlightSection spotlight={spotlight} dethrone={dethrone} />
      )}

      {/* Share on X */}
      <ShareBar
        tweetTemplate="Who is the best AI user?\n\nTop 100 ranked by Yield (Υ) — (cache_read × output) / input².\n\nWhere do you rank? {url}"
        url="https://sigeconomy.com/best-ai-user"
        promptSlug="best-ai-user"
        platform={platform}
        view={view}
        category={category}
      />

      {/* Top 10 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Top {data.entries.length} AI users{platform !== "all" && ` on ${platform}`}{view === "center" && " (Center)"}{category === "all" && " (+ Outliers)"}{win !== "all_time" && ` (${WINDOW_LABELS[win]})`}
        </h2>
        <div className="space-y-2">
          {data.entries.map((entry) => (
            <RankCard
              key={entry.codename}
              entry={entry}
              deltaFromAverage={deltas.get(entry.codename)}
            />
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Who is the best AI user?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{topName}</span> is #1 with {"\u03a5"} Yield {formatYield(top.yield_)}. {data.total_operators} AI users ranked on the public operator evals leaderboard.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">How is the best AI user determined?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The best AI user is determined by Yield ({"\u03a5"}) = (cache_read {"\u00d7"} output) / input{"\u00b2"}. Yield measures token-cascade efficiency {"\u2014"} whether signal is compounding or tokens are being burned. Works across Claude, ChatGPT, Gemini, Cursor, Copilot, and any AI coding tool.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">What is Yield and how is it calculated?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yield ({"\u03a5"}) = (cache_read {"\u00d7"} output) / input{"\u00b2"}. Higher Yield means the AI user reuses cached context efficiently and produces substantial output relative to fresh input. Token counts only {"\u2014"} never prompt content or code.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">How often does the AI user ranking change?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The leaderboard updates as new operator telemetry is submitted. Operators can climb or fall as new sessions are measured.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">How do I get my AI user score and rank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only {"\u2014"} never prompt content, never code.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Think you can beat them?</p>
        <p className="mt-2 text-white/80">
          Measure your AI usage and get your rank.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </div>

      {/* Other metric rankings — cross-links to the 8 new routes */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Other AI user rankings</h2>
        <p className="text-xs">
          Yield is the flagship metric, but there are other ways to measure AI skill.
          Each question below is answered by a different canonical token metric — and
          4 of 8 have a different #1.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {allPrompts
            .filter((p) => p.slug !== "best-ai-user")
            .map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <div className="font-medium text-foreground group-hover:text-primary">
                  {p.question}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.metric_label} — {p.current_leader.name} leads
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* SEO content */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          How is the best AI user determined?
        </h2>
        <p>
          The best AI user is determined by <strong className="text-foreground">Yield (Υ)</strong> —
          a token-cascade efficiency metric that measures how effectively an
          operator uses AI tokens. Yield = (cache_read × output) / input².
          It rewards operators who build on cached context (high cache_read),
          produce meaningful output (high output), and minimize wasteful input
          (low input²). Volume is noise. Yield is signal.
        </p>
        <p>
          Unlike raw token count (which rewards spending more), Yield rewards
          spending <em>smart</em>. The operator who uses 100K tokens
          efficiently beats the operator who burns 10M tokens to produce the
          same output. This is the difference between tokenmaxxing and
          token efficiency.
        </p>
        <p>
          The leaderboard updates continuously. Rankings shift as operators
          submit new sessions. The weekly drop page tracks the biggest movers,
          new challengers, and class distribution changes week over week.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/ai-user-leaderboard" className="text-primary font-medium hover:underline">
            AI User Leaderboard →
          </Link>
          <Link href="/ai-user-ranking" className="text-primary font-medium hover:underline">
            How ranking works →
          </Link>
          <Link href="/weekly" className="text-primary font-medium hover:underline">
            This week&apos;s drop →
          </Link>
        </div>
      </div>
    </div>
  );
}
