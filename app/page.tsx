import { getLeaderboard, computeDeltaFromAverage } from "@/lib/api";
import { RankCard } from "@/components/rank-card";
import { Trophy, TrendingUp } from "lucide-react";

export const revalidate = 300; // 5 minutes

export default async function HomePage() {
  const data = await getLeaderboard("all_time", 100, "yield");

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

  const { average, deltas } = computeDeltaFromAverage(data.entries);
  const topOperator = data.entries[0];

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Who&apos;s the best AI user?
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          See how you rank on SigRank.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ranked by Υ Yield — token-cascade efficiency, not raw spend.{" "}
          <a href="/how-it-works" className="text-primary hover:underline">
            What&apos;s Υ?
          </a>
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="font-semibold text-foreground">
            {topOperator.display_name ?? topOperator.codename}
          </span>
          <span>is #{topOperator.rank}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>{data.total_operators} operators</span>
        </div>
        <div className="text-muted-foreground">
          Updated {new Date(data.generated_at).toLocaleDateString()}
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-2">
        {data.entries.map((entry) => (
          <RankCard
            key={entry.codename}
            entry={entry}
            deltaFromAverage={deltas.get(entry.codename)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-lg font-semibold">Think you can beat them?</p>
        <p className="mt-1 text-muted-foreground">
          Measure your AI usage and get your rank on SigRank.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Check my rank
        </a>
      </div>

      {/* Weekly drop banner */}
      <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
        📅 New rankings drop every Monday. Come back to see who climbed.
      </div>
    </div>
  );
}
