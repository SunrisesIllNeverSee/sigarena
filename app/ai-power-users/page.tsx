import { getLeaderboard } from "@/lib/api";
import { RankCard } from "@/components/rank-card";
import { computeDeltaFromAverage } from "@/lib/api";
import Link from "next/link";
import { Trophy, Zap } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/jsonld";
import { operatorDisplayName } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "AI Power Users — Top Operator Evals Performers | SigRank SignalAF",
  description:
    "The top AI power users, ranked by Yield (Υ) — token-cascade efficiency. See who's dominating the public operator evals, who's climbing, and what makes a power user.",
  alternates: { canonical: "/ai-power-users" },
  openGraph: {
    title: "AI Power Users — Top Operator Evals Performers | SigRank SignalAF",
    description: "The top AI power users, ranked by Yield (Υ). Public operator evals.",
    url: "https://sigeconomy.com/ai-power-users",
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
      <p className="text-xs text-muted-foreground">Last updated: August 14, 2026</p>
      <JsonLd data={[
        leaderboardSchema(data.entries, "AI Power Users — Top 25", "https://sigeconomy.com/ai-power-users"),
        articleSchema(
          "AI Power Users — Top Operator Evals Performers",
          "The top AI power users, ranked by Yield (Υ). Public operator evals.",
          "/ai-power-users",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "AI Power Users", path: "/ai-power-users" },
        ]),
        faqSchema([
          {
            question: "What is an AI power user?",
            answer:
              "An AI power user is a developer, coder, or AI operator who consistently achieves high Yield (\u03a5) scores on the public operator evals leaderboard. Power users reuse cached context efficiently, produce substantial output, and minimize wasted input across Claude, GPT, Gemini, Cursor, Copilot, and other AI tools.",
          },
          {
            question: "Who are the top AI power users?",
            answer: `The top ${data.total_operators} AI operators are ranked on the public operator evals leaderboard by Yield (\u03a5). The ranking reflects real token-cascade efficiency from actual coding sessions.`,
          },
          {
            question: "What makes someone a power user of AI?",
            answer:
              "High Yield \u2014 which means efficient cache reuse (Leverage), productive output (Velocity), and low wasted input. Power users build on prior context instead of starting fresh. The same model, same tools, same prompts can produce 100x different Yield depending on the operator.",
          },
          {
            question: "How do I become an AI power user?",
            answer:
              "Submit your token telemetry at signalaf.com/score to get your Yield score. Then optimize your cascade: reuse context, avoid unnecessary fresh input, and maximize productive output. The leaderboard shows where you stand among other AI developers and coders.",
          },
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
                href={`https://signalaf.com/user/${op.codename}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-green-900 border border-green-200 hover:bg-green-100"
              >
                <span className="text-green-600">+{op.movement_7d}</span>
                {operatorDisplayName(op.display_name, op.codename)}
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
