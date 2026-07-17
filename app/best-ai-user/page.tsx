import { getLeaderboard } from "@/lib/api";
import { deriveSpotlight } from "@/lib/campaign";
import { RankCard } from "@/components/rank-card";
import { SpotlightSection } from "@/components/spotlight";
import { computeDeltaFromAverage } from "@/lib/api";
import { formatYield, operatorSlug } from "@/lib/utils";
import Link from "next/link";
import { Trophy, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema } from "@/lib/jsonld";

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

export default async function BestAIUserPage() {
  const data = await getLeaderboard("all_time", 50, "yield");

  if (!data || data.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Leaderboard refreshing</h2>
      </div>
    );
  }

  const spotlight = deriveSpotlight(data);
  const { deltas } = computeDeltaFromAverage(data.entries);
  const top = data.entries[0];
  const topName = top.display_name ?? top.codename;

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
          {data.total_operators} operators ranked.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ranked by <span className="font-semibold text-foreground">Υ Yield</span> —
          token-cascade efficiency, not raw spend.{" "}
          <Link href="/how-it-works" className="text-primary font-medium hover:underline">
            What&apos;s Υ?
          </Link>
        </p>
      </div>

      {/* Spotlight */}
      <SpotlightSection spotlight={spotlight} dethrone={{ active: false, kingName: "", kingYield: 0, challengerName: "", challengerYield: 0, gap: 0 }} />

      {/* Top 10 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Top 10 AI users</h2>
        <div className="space-y-2">
          {data.entries.slice(0, 10).map((entry) => (
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
