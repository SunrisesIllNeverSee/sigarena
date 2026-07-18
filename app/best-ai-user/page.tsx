import { getSortedLeaderboard, computeDeltaFromAverage } from "@/lib/api";
import { RankCard } from "@/components/rank-card";
import Link from "next/link";
import { Trophy, Crown } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema } from "@/lib/jsonld";
import { formatYield } from "@/lib/utils";
import { PLATFORMS, getActivePrompts, type Platform, type View } from "@/lib/prompts";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Best AI User — Who Is the Best AI User Alive?",
  description:
    "The definitive ranking of the best AI users. Ranked by Yield (Υ) — token-cascade efficiency, not raw spend. See who's #1, who's climbing, and who got dethroned.",
  alternates: { canonical: "/best-ai-user" },
  openGraph: {
    title: "Best AI User — Who Is the Best AI User Alive?",
    description:
      "The definitive ranking. Powered by SigRank's Yield (Υ) metric.",
    url: "https://signaaf.com/best-ai-user",
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

function promptUrl(slug: string, platform: Platform, view: View): string {
  const params = new URLSearchParams();
  if (platform !== "all") params.set("platform", platform);
  if (view !== "peak") params.set("view", view);
  const qs = params.toString();
  return qs ? `/${slug}?${qs}` : `/${slug}`;
}

export default async function BestAIUserPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const platform = parsePlatform(sp.platform);
  const view = parseView(sp.view);

  const data = await getSortedLeaderboard("yield", platform, view, 50, "all_time");

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

  return (
    <div className="space-y-6">
      <JsonLd data={[
        leaderboardSchema(data.entries, "Best AI User — Top 10", "https://signaaf.com/best-ai-user"),
        articleSchema(
          "Best AI User — Who Is the Best AI User Alive?",
          "The definitive ranking of the best AI users by Yield.",
          "/best-ai-user",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Best AI User", path: "/best-ai-user" },
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
            href={promptUrl("best-ai-user", p, view)}
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
          href={promptUrl("best-ai-user", platform, "peak")}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${
            view === "peak"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          The Peak
        </Link>
        <Link
          href={promptUrl("best-ai-user", platform, "center")}
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

      {/* Top 10 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Top {data.entries.length} AI users{platform !== "all" && ` on ${platform}`}{view === "center" && " (Center)"}
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
