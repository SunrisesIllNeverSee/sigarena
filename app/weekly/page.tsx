import { getLeaderboard } from "@/lib/api";
import { buildWeeklyDrop } from "@/lib/campaign";
import { formatYield } from "@/lib/utils";
import {
  Crown,
  TrendingUp,
  TrendingDown,
  Share2,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema } from "@/lib/jsonld";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Weekly Rankings Drop — AI User Leaderboard",
  description:
    "This week's AI user rankings: biggest movers, new challengers, class distribution. Powered by SigRank.",
  alternates: { canonical: "/weekly" },
  openGraph: {
    title: "Weekly Rankings Drop — AI User Leaderboard",
    description:
      "This week's AI user rankings: biggest movers, new challengers, class distribution.",
    url: "https://signaaf.com/weekly",
    type: "website",
  },
};

export default async function WeeklyPage() {
  const data = await getLeaderboard("all_time", 500, "yield");

  if (!data || data.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Weekly drop refreshing</h2>
        <p className="mt-2 text-muted-foreground">
          Pulling the latest rankings. Check back in a moment.
        </p>
      </div>
    );
  }

  const drop = buildWeeklyDrop(data);

  return (
    <div className="space-y-6">
    <JsonLd data={[
      leaderboardSchema(data.entries, "Weekly Rankings Drop", "https://signaaf.com/weekly"),
      articleSchema(
        "Weekly Rankings Drop — AI User Leaderboard",
        "This week's AI user rankings: biggest movers, new challengers, class distribution.",
        "/weekly",
      ),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Weekly Drop", path: "/weekly" },
      ]),
    ]} />
    {/* Back link */}
    <Link
      href="/"
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      ← All operators
    </Link>

    {/* Header */}
    <div className="text-center py-4">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="gradient-text">Weekly Rankings Drop</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{drop.weekLabel}</p>
    </div>

    {/* Share bar */}
    <div className="flex items-center justify-center gap-3">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(drop.shareText)}&url=${encodeURIComponent(drop.shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted/50"
      >
        <Share2 className="h-4 w-4" />
        Share this drop
      </a>
    </div>

    {/* The King */}
    {drop.topOperator && (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-600" />
          <span className="text-sm font-semibold uppercase tracking-wider text-amber-900">
            The King
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-amber-900">
              {drop.topOperator.display_name ?? drop.topOperator.codename}
            </div>
            <div className="text-sm text-amber-700">
              {drop.topOperator.platform} · {drop.topOperator.class_tier}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold tabular-nums text-amber-900">
              {formatYield(drop.topOperator.yield_)}
            </div>
            <div className="text-xs text-amber-700">Υ Yield</div>
          </div>
        </div>
        <Link
          href={`https://signalaf.com/user/${drop.topOperator.codename}`}
          className="mt-3 inline-block text-sm font-medium text-amber-700 hover:underline"
        >
          View profile →
        </Link>
      </div>
    )}

    {/* Stats summary */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <Users className="mx-auto h-5 w-5 text-muted-foreground" />
        <div className="mt-2 text-2xl font-bold tabular-nums">
          {drop.totalOperators}
        </div>
        <div className="text-xs text-muted-foreground">Operators</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <TrendingUp className="mx-auto h-5 w-5 text-green-600" />
        <div className="mt-2 text-2xl font-bold tabular-nums text-green-600">
          {drop.biggestMovers.length}
        </div>
        <div className="text-xs text-muted-foreground">Climbed</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <TrendingDown className="mx-auto h-5 w-5 text-red-500" />
        <div className="mt-2 text-2xl font-bold tabular-nums text-red-500">
          {drop.biggestLosers.length}
        </div>
        <div className="text-xs text-muted-foreground">Dropped</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <Crown className="mx-auto h-5 w-5 text-amber-600" />
        <div className="mt-2 text-2xl font-bold tabular-nums">
          {Object.keys(drop.classDistribution).length}
        </div>
        <div className="text-xs text-muted-foreground">Classes</div>
      </div>
    </div>

    {/* Biggest movers */}
    {drop.biggestMovers.length > 0 && (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Biggest movers
        </h2>
        <div className="mt-4 space-y-2">
          {drop.biggestMovers.map((op) => (
            <Link
              key={op.codename}
              href={`https://signalaf.com/user/${op.codename}`}
              className="flex items-center justify-between rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-green-600">
                  +{op.movement_24h}
                </span>
                <div>
                  <div className="font-semibold">
                    {op.display_name ?? op.codename}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{op.rank} · {op.platform}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold tabular-nums">
                  {formatYield(op.yield_)}
                </div>
                <div className="text-xs text-muted-foreground">Υ</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}

    {/* New challengers */}
    {drop.newChallengers.length > 0 && (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Crown className="h-5 w-5 text-amber-600" />
          New challengers in top 10
        </h2>
        <div className="mt-4 space-y-2">
          {drop.newChallengers.map((op) => (
            <Link
              key={op.codename}
              href={`https://signalaf.com/user/${op.codename}`}
              className="flex items-center justify-between rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <div className="font-semibold">
                  {op.display_name ?? op.codename}
                </div>
                <div className="text-xs text-muted-foreground">
                  #{op.rank} · {op.class_tier} · 7d: +{op.movement_7d}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold tabular-nums">
                  {formatYield(op.yield_)}
                </div>
                <div className="text-xs text-muted-foreground">Υ</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}

    {/* Class distribution */}
    {Object.keys(drop.classDistribution).length > 0 && (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Class distribution</h2>
        <div className="mt-4 space-y-2">
          {Object.entries(drop.classDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([cls, count]) => (
              <div key={cls}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cls}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {count} ({((count / drop.totalOperators) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full gradient-primary"
                    style={{
                      width: `${(count / drop.totalOperators) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    )}

    {/* CTA */}
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
    </div>
  );
}
