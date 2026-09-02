import { getLeaderboard, getFullLeaderboard, sortLeaderboard } from "@/lib/api";
import { buildWeeklyDrop } from "@/lib/campaign";
import { formatYield, operatorDisplayName, formatNumber } from "@/lib/utils";
import {
  Crown,
  TrendingUp,
  TrendingDown,
  Share2,
  Users,
  Calendar,
  Zap,
  Layers,
  Gauge,
  Activity,
  Scale,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Weekly Operator Evals Drop — Public LLM Operator Rankings",
  description:
    "This week's operator evals: biggest movers, new challengers, class distribution. Public LLM operator evals powered by SigRank.",
  alternates: { canonical: "/weekly" },
  openGraph: {
    title: "Weekly Operator Evals Drop — SigRank SignalAF",
    description:
      "This week's operator evals: biggest movers, new challengers, class distribution.",
    url: "https://sigeconomy.com/weekly",
    type: "website",
  },
};

export default async function WeeklyPage() {
  const data = await getLeaderboard("all_time", 200, "yield");

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
    <p className="text-xs text-muted-foreground">Last updated: {new Date(data.generated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
    <JsonLd data={[
      leaderboardSchema(data.entries, "Weekly Rankings Drop", "https://sigeconomy.com/weekly"),
      articleSchema(
        "Weekly Operator Evals Drop — SigRank SignalAF",
        "This week's operator evals: biggest movers, new challengers, class distribution.",
        "/weekly",
      ),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Weekly Drop", path: "/weekly" },
      ]),
      faqSchema([
        {
          question: "What is the weekly operator evals drop?",
          answer:
            "The weekly drop summarizes the biggest movers, new challengers, and class distribution on the public operator evals leaderboard. It tracks which AI users are climbing, which are shifting rank, and how the field is evolving week over week.",
        },
        {
          question: "How often do the AI user rankings update?",
          answer:
            "The leaderboard updates continuously as new operator telemetry is submitted. The weekly drop captures a snapshot of the biggest changes \u2014 rank movements, new entrants, and class tier shifts \u2014 every week.",
        },
        {
          question: "What metrics are tracked in the weekly drop?",
          answer:
            "The weekly drop tracks Yield (\u03a5) as the headline metric, along with class tier distribution. Yield = (cache_read \u00d7 output) / input\u00b2 \u2014 token-cascade efficiency across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool.",
        },
        {
          question: "How do I get featured in the weekly drop?",
          answer:
            "Submit your token telemetry at signalaf.com/score to get ranked. If your Yield score moves significantly, you'll appear in the weekly drop as a biggest mover or new challenger. Token counts only \u2014 never prompt content or code.",
        },
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
              {operatorDisplayName(drop.topOperator.display_name, drop.topOperator.codename)}
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
        <TrendingDown className="mx-auto h-5 w-5 text-muted-foreground" />
        <div className="mt-2 text-2xl font-bold tabular-nums">
          {drop.fieldMovement.length}
        </div>
        <div className="text-xs text-muted-foreground">Field movement</div>
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
                    {operatorDisplayName(op.display_name, op.codename)}
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
                  {operatorDisplayName(op.display_name, op.codename)}
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

    {/* Hall Top-Ten Boards — compact per-metric leaderboards from the hall.
        Fetches the full board once (already fetched for the weekly drop),
        then sorts locally for each metric. Shows top 5 per metric in a
        compact grid (the hall shows top 10 — this is the weekly summary). */}
    <HallTopTenBoards data={data} />

    {/* Spotlight Comparison — head-to-head between the #1 on different metrics.
        Picks the Yield leader vs the Velocity leader vs the Leverage leader
        and shows their stats side by side. */}
    <SpotlightComparison data={data} />

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

// ============================================================================
// HallTopTenBoards — compact per-metric top-5 leaderboards from the hall.
// Fetches the full board once (already in `data`), sorts locally for each
// metric. The hall on signalaf.com/hall shows top 10 per metric; this is the
// weekly summary showing top 5 across 6 key metrics.
// ============================================================================
const HALL_METRICS = [
  { id: "yield" as const, label: "Yield (Υ)", icon: Crown, format: (v: number) => formatYield(v), field: "yield_" as const },
  { id: "velocity" as const, label: "Velocity", icon: Zap, format: (v: number) => `${v.toFixed(1)}×`, field: "velocity" as const },
  { id: "leverage" as const, label: "Leverage", icon: Layers, format: (v: number) => `${formatNumber(v)}×`, field: "leverage" as const },
  { id: "snr" as const, label: "SNR", icon: Activity, format: (v: number) => v.toFixed(3), field: "snr" as const },
  { id: "efficiency" as const, label: "Efficiency", icon: Gauge, format: (v: number) => `${(v * 100).toFixed(1)}%`, field: "efficiency" as const },
  { id: "scale_v" as const, label: "Scale V", icon: Scale, format: (v: number) => formatNumber(v), field: "scale_v" as const },
];

function HallTopTenBoards({ data }: { data: NonNullable<Awaited<ReturnType<typeof getLeaderboard>>> }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Crown className="h-5 w-5 text-amber-600" />
          Hall Top Boards
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The top 5 operators on each canonical metric, fresh from the hall.{" "}
          <Link href="https://signalaf.com/hall" className="text-primary hover:underline">
            View full hall →
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HALL_METRICS.map((metric) => {
          const sorted = [...data.entries]
            .filter((e) => typeof e[metric.field] === "number" && e[metric.field] > 0)
            .sort((a, b) => (b[metric.field] as number) - (a[metric.field] as number))
            .slice(0, 5);
          if (sorted.length === 0) return null;
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="rounded-lg border border-border bg-card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {metric.label}
              </h3>
              <div className="mt-3 space-y-1.5">
                {sorted.map((entry, i) => (
                  <Link
                    key={entry.codename}
                    href={`https://signalaf.com/user/${entry.codename}`}
                    className="flex items-center justify-between rounded px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 text-xs font-bold text-muted-foreground tabular-nums">
                        {i + 1}
                      </span>
                      <span className="truncate font-medium">
                        {operatorDisplayName(entry.display_name, entry.codename)}
                      </span>
                    </div>
                    <span className="ml-2 shrink-0 font-bold tabular-nums">
                      {metric.format(entry[metric.field] as number)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SpotlightComparison — head-to-head between the #1 on different metrics.
// Picks the Yield leader, Velocity leader, and Leverage leader and shows
// their stats side by side so the reader can see how different "best" looks
// across metrics.
// ============================================================================
function SpotlightComparison({ data }: { data: NonNullable<Awaited<ReturnType<typeof getLeaderboard>>> }) {
  const entries = data.entries;
  if (entries.length < 2) return null;

  const yieldLeader = [...entries].sort((a, b) => b.yield_ - a.yield_)[0];
  const velocityLeader = [...entries].sort((a, b) => b.velocity - a.velocity)[0];
  const leverageLeader = [...entries].sort((a, b) => b.leverage - a.leverage)[0];

  // Deduplicate — if the same operator leads multiple metrics, pick the next
  const contenders = [yieldLeader];
  if (velocityLeader.codename !== yieldLeader.codename) contenders.push(velocityLeader);
  if (leverageLeader.codename !== yieldLeader.codename && leverageLeader.codename !== velocityLeader.codename) {
    contenders.push(leverageLeader);
  }
  if (contenders.length < 2) return null;

  const stats = [
    { label: "Yield (Υ)", getValue: (e: typeof entries[0]) => formatYield(e.yield_) },
    { label: "Velocity", getValue: (e: typeof entries[0]) => `${e.velocity.toFixed(1)}×` },
    { label: "Leverage", getValue: (e: typeof entries[0]) => `${formatNumber(e.leverage)}×` },
    { label: "SNR", getValue: (e: typeof entries[0]) => e.snr.toFixed(3) },
    { label: "Output", getValue: (e: typeof entries[0]) => formatNumber(e.output_tokens) },
    { label: "Cache Read", getValue: (e: typeof entries[0]) => formatNumber(e.cache_read_tokens) },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Activity className="h-5 w-5 text-primary" />
          Spotlight Comparison
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The #1 operator on different metrics, head to head. Different metrics reward different AI usage patterns.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 text-left font-semibold text-muted-foreground">Metric</th>
              {contenders.map((c, i) => (
                <th key={c.codename} className="py-2 px-4 text-left font-semibold">
                  <Link
                    href={`https://signalaf.com/user/${c.codename}`}
                    className="hover:underline"
                  >
                    {operatorDisplayName(c.display_name, c.codename)}
                  </Link>
                  <div className="text-xs font-normal text-muted-foreground">
                    {i === 0 && "Yield leader"}
                    {i === 1 && c.codename === velocityLeader.codename && "Velocity leader"}
                    {i === 1 && c.codename === leverageLeader.codename && "Leverage leader"}
                    {i === 2 && "Leverage leader"}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.label} className="border-b border-border/50 last:border-0">
                <td className="py-2 pr-4 text-muted-foreground">{stat.label}</td>
                {contenders.map((c) => {
                  const values = contenders.map((e) => stat.getValue(e));
                  const max = Math.max(...values.map((v) => parseFloat(v.replace(/[^0-9.-]/g, "")) || 0));
                  const currentVal = parseFloat(stat.getValue(c).replace(/[^0-9.-]/g, "")) || 0;
                  const isBest = currentVal === max && currentVal > 0;
                  return (
                    <td key={c.codename} className={`py-2 px-4 font-bold tabular-nums ${isBest ? "text-primary" : ""}`}>
                      {stat.getValue(c)}
                      {isBest && <span className="ml-1 text-xs text-primary">★</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t border-border">
              <td className="py-2 pr-4 text-muted-foreground">Class</td>
              {contenders.map((c) => (
                <td key={c.codename} className="py-2 px-4 text-sm">{c.class_tier}</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 text-muted-foreground">Platform</td>
              {contenders.map((c) => (
                <td key={c.codename} className="py-2 px-4 text-sm">{c.platform}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <Scale className="h-4 w-4" />
          Compare any two operators →
        </Link>
      </div>
    </div>
  );
}
