import type { Metadata } from "next";
import Link from "next/link";
import { getFullLeaderboard, computeDeltaFromAverage, sortLeaderboard } from "@/lib/api";
import { deriveSpotlight, checkDethrone } from "@/lib/campaign";
import { RankCard } from "@/components/rank-card";
import { SpotlightSection } from "@/components/spotlight";
import { Trophy, TrendingUp, Crown, Sparkles } from "lucide-react";
import { JsonLd, leaderboardSchema, articleSchema } from "@/lib/jsonld";
import { getPromptOfTheDay, getActivePrompts, getPlatformOfTheDay } from "@/lib/prompts";
import { operatorSlug, formatYield } from "@/lib/utils";

// Static Generation — page is pre-built at deploy time and served as a
// static asset from Cloudflare's ASSETS binding. Zero Worker invocations
// between rebuilds. The cron workflow (Thu+Sun 00:00 UTC) rebuilds + redeploys
// to refresh the data snapshot.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "AI User Leaderboard — Ranked by Yield (Υ) | SigRank",
  description:
    "Who's the best AI user? See how you rank on SigRank. Ranked by Υ Yield — token-cascade efficiency, not raw spend. Compare your AI usage against the top operators.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI User Leaderboard — Ranked by Yield (Υ) | SigRank",
    description: "Who's the best AI user? See how you rank on SigRank.",
    url: "https://signaaf.com",
    type: "website",
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
  const spotlight = deriveSpotlight(data);
  const dethrone = checkDethrone(data);
  const topOperator = data.entries[0];
  const promptOfDay = getPromptOfTheDay();
  const platformOfDay = getPlatformOfTheDay();
  const allPrompts = getActivePrompts();

  // Sort the already-fetched full board locally for the prompt-of-the-day and
  // platform-spotlight sections. Avoids 2 extra 1640-row network fetches per
  // homepage load (Cloudflare OpenNext uses dummy ISR — no cache between calls).
  const promptTop = sortLeaderboard(data, promptOfDay.metric, "all", "peak", 3).entries;
  const platformTop = sortLeaderboard(data, "yield", platformOfDay, "peak", 3).entries;

  return (
    <div className="space-y-6">
      <JsonLd data={[
        leaderboardSchema(data.entries.slice(0, 50), "AI User Leaderboard", "https://signaaf.com"),
        articleSchema(
          "AI User Leaderboard — Ranked by Yield",
          "Who's the best AI user? The AI User Leaderboard ranks operators by Yield — token-cascade efficiency, not raw spend.",
          "/",
        ),
      ]} />
      {/* Headline */}
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Who&apos;s the best</span>
          <br />
          <span className="gradient-text">AI user?</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          See how you rank on SigRank.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ranked by <span className="font-semibold text-foreground">Υ Yield</span> — token-cascade efficiency, not raw spend.{" "}
          <a href="/how-it-works" className="text-primary font-medium hover:underline">
            What&apos;s Υ?
          </a>
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 border border-amber-200">
          <Crown className="h-4 w-4 text-amber-600" />
          <span className="font-semibold text-amber-900">
            {topOperator.display_name ?? topOperator.codename}
          </span>
          <span className="text-amber-700">is #{topOperator.rank}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 border border-blue-200">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span className="text-blue-900">{data.total_operators} operators</span>
        </div>
        <div className="text-muted-foreground">
          Updated {new Date(data.generated_at).toLocaleDateString()}
        </div>
      </div>

      {/* Prompt of the day — featured question + answer */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
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
                href={`/operator/${operatorSlug(entry.display_name, entry.codename)}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${i === 0 ? "gradient-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-semibold">
                  {entry.display_name ?? entry.codename}
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
      </div>

      {/* Platform spotlight — rotating platform of the day */}
      <div className="rounded-xl border border-border bg-card p-5">
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
                href={`/operator/${operatorSlug(entry.display_name, entry.codename)}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <span className="text-sm font-bold tabular-nums text-muted-foreground w-6">
                  #{i + 1}
                </span>
                <span className="flex-1 truncate font-medium">
                  {entry.display_name ?? entry.codename}
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
      </div>

      {/* Spotlight + dethrone watch */}
      <SpotlightSection spotlight={spotlight} dethrone={dethrone} />

      {/* Leaderboard list — top 50 by Yield */}
      <h2 className="text-lg font-semibold pt-2">Top operators by Yield (Υ)</h2>
      <div className="space-y-2">
        {data.entries.slice(0, 50).map((entry) => (
          <RankCard
            key={entry.codename}
            entry={entry}
            deltaFromAverage={deltas.get(entry.codename)}
          />
        ))}
      </div>

      {/* Prompt grid — all 9 metric rankings */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">9 ways to rank AI users</h2>
        <p className="text-xs text-muted-foreground">
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
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
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
      </div>

      {/* Weekly drop banner */}
      <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
        New rankings drop every Monday.{" "}
        <a href="/weekly" className="text-primary font-medium hover:underline">
          See this week&apos;s drop →
        </a>
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
