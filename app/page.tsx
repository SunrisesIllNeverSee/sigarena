import type { Metadata } from "next";
import { getLeaderboard, computeDeltaFromAverage } from "@/lib/api";
import { deriveSpotlight, checkDethrone } from "@/lib/campaign";
import { RankCard } from "@/components/rank-card";
import { SpotlightSection } from "@/components/spotlight";
import { Trophy, TrendingUp, Crown } from "lucide-react";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema } from "@/lib/jsonld";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: "AI User Leaderboard — Ranked by Yield (Υ) | SigRank",
  description:
    "Who's the best AI user? See how you rank on SigRank. Ranked by Υ Yield — token-cascade efficiency, not raw spend. Compare your AI usage against the top operators.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI User Leaderboard — Ranked by Yield (Υ) | SigRank",
    description: "Who's the best AI user? See how you rank on SigRank.",
    url: "https://sigarena.signalaf.com",
    type: "website",
  },
};

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

  const { deltas } = computeDeltaFromAverage(data.entries);
  const spotlight = deriveSpotlight(data);
  const dethrone = checkDethrone(data);
  const topOperator = data.entries[0];

  return (
    <div className="space-y-6">
      <JsonLd data={[
        leaderboardSchema(data.entries, "AI User Leaderboard", "https://sigarena.signalaf.com"),
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

      {/* Spotlight + dethrone watch */}
      <SpotlightSection spotlight={spotlight} dethrone={dethrone} />

      {/* Leaderboard list */}
      <h2 className="text-lg font-semibold pt-2">Top operators by Yield (Υ)</h2>
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
