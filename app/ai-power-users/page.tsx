import { getLeaderboard } from "@/lib/api";
import { RankCard } from "@/components/rank-card";
import { computeDeltaFromAverage } from "@/lib/api";
import { operatorSlug } from "@/lib/utils";
import Link from "next/link";
import { Trophy, Zap } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema } from "@/lib/jsonld";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI Power Users — The Top AI Users Ranked",
  description:
    "The top AI power users, ranked by Yield (Υ). See who's dominating the leaderboard, who's climbing, and what makes a power user.",
  alternates: { canonical: "/ai-power-users" },
  openGraph: {
    title: "AI Power Users — The Top AI Users Ranked",
    description: "The top AI power users, ranked by Yield (Υ).",
    url: "https://sigarena.signalaf.com/ai-power-users",
    type: "website",
  },
};

export default async function AIPowerUsersPage() {
  const data = await getLeaderboard("all_time", 25, "yield");

  if (!data || data.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Leaderboard refreshing</h2>
      </div>
    );
  }

  const { deltas } = computeDeltaFromAverage(data.entries);
  const climbers = [...data.entries]
    .filter((e) => e.movement_7d > 0)
    .sort((a, b) => b.movement_7d - a.movement_7d)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <JsonLd data={[
        leaderboardSchema(data.entries, "AI Power Users — Top 25", "https://sigarena.signalaf.com/ai-power-users"),
        articleSchema(
          "AI Power Users — The Top AI Users Ranked",
          "The top AI power users, ranked by Yield.",
          "/ai-power-users",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "AI Power Users", path: "/ai-power-users" },
        ]),
      ]} />
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">AI Power Users</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          The top {data.total_operators} AI operators, ranked by Υ Yield
        </p>
      </div>

      {/* Climbers */}
      {climbers.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            <h2 className="text-sm font-semibold text-green-900">
              Climbing this week
            </h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {climbers.map((op) => (
              <Link
                key={op.codename}
                href={`/operator/${operatorSlug(op.display_name, op.codename)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-green-900 border border-green-200 hover:bg-green-100"
              >
                <span className="text-green-600">+{op.movement_7d}</span>
                {op.display_name ?? op.codename}
                <span className="text-muted-foreground">#{op.rank}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Top 25 */}
      <div className="space-y-2">
        {data.entries.map((entry) => (
          <RankCard
            key={entry.codename}
            entry={entry}
            deltaFromAverage={deltas.get(entry.codename)}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Are you a power user?</p>
        <p className="mt-2 text-white/80">
          Measure your AI usage and see where you rank.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          What makes an AI power user?
        </h2>
        <p>
          An AI power user isn&apos;t someone who uses AI the most — it&apos;s
          someone who uses AI the <em>best</em>. Power users have high Yield (Υ),
          meaning they extract maximum value from every token. They build on
          cached context, produce meaningful output, and minimize wasteful input.
        </p>
        <p>
          The operators on this leaderboard run the SigRank scanner on their
          AI coding sessions (Claude, ChatGPT, Cursor, Copilot, Windsurf).
          The scanner reads token telemetry locally — privacy-preserving,
          token counts only, never prompt content.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/best-ai-user" className="text-primary font-medium hover:underline">
            Who is #1? →
          </Link>
          <Link href="/ai-user-ranking" className="text-primary font-medium hover:underline">
            How ranking works →
          </Link>
        </div>
      </div>
    </div>
  );
}
