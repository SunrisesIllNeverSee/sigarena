import { getLeaderboard, computeDeltaFromAverage } from "@/lib/api";
import { RankCard } from "@/components/rank-card";
import Link from "next/link";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "AI User Leaderboard — Public Operator Evals | SigRank",
  description:
    "The public operator evals leaderboard. AI users ranked by Yield (Υ) — token-cascade efficiency. See the full ranking, compare operators, and get your own rank.",
  alternates: { canonical: "/ai-user-leaderboard" },
  openGraph: {
    title: "AI User Leaderboard — Public Operator Evals | SigRank",
    description:
      "The public operator evals leaderboard. AI users ranked by Yield (Υ).",
    url: "https://sigeconomy.com/ai-user-leaderboard",
    type: "website",
  },
};

export default async function AIUserLeaderboardPage() {
  const data = await getLeaderboard("all_time", 200, "yield");

  if (!data || data.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Leaderboard refreshing</h2>
      </div>
    );
  }

  const { deltas } = computeDeltaFromAverage(data.entries);

  return (
    <div className="space-y-6">
      <JsonLd data={[
        leaderboardSchema(data.entries, "AI User Leaderboard", "https://sigeconomy.com/ai-user-leaderboard"),
        articleSchema(
          "AI User Leaderboard — Public Operator Evals",
          "The public operator evals leaderboard. AI users ranked by Yield (Υ).",
          "/ai-user-leaderboard",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "AI User Leaderboard", path: "/ai-user-leaderboard" },
        ]),
        faqSchema([
          {
            question: "What is the AI User Leaderboard?",
            answer:
              "The AI User Leaderboard is the public operator evals leaderboard \u2014 AI users ranked by Yield (\u03a5), a token-cascade efficiency score. It measures how effectively developers, coders, and AI operators use AI tools like Claude, GPT, Gemini, Cursor, and Copilot.",
          },
          {
            question: "How are AI users scored on the leaderboard?",
            answer:
              "AI users are scored by Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2. Higher Yield means the user reuses cached context efficiently and produces substantial output relative to fresh input. Token counts only \u2014 never prompt content or code.",
          },
          {
            question: "How many AI users are on the leaderboard?",
            answer: `${data.total_operators} AI users are currently ranked on the public operator evals leaderboard. The ranking updates as new operator telemetry is submitted.`,
          },
          {
            question: "How do I get on the AI User Leaderboard?",
            answer:
              "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Works with Claude, ChatGPT, Cursor, Copilot, and any AI coding tool. Token counts only \u2014 never prompt content, never code.",
          },
        ]),
      ]} />
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">AI User Leaderboard</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {data.total_operators} operators ranked by Υ Yield.
        </p>
      </div>

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
        <p className="text-xl font-bold">Think you can beat them?</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          What is the AI User Leaderboard?
        </h2>
        <p>
          The AI User Leaderboard is a competitive ranking of AI operators —
          the humans who use AI tools (Claude, ChatGPT, Cursor, Copilot,
          Windsurf, and more). Operators are ranked by{" "}
          <strong className="text-foreground">Yield (Υ)</strong>, a
          token-cascade efficiency metric that measures how effectively an
          operator uses AI tokens.
        </p>
        <p>
          Unlike model leaderboards (LMSYS Arena, LiveBench, Hugging Face Open
          LLM) which rank AI models, this leaderboard ranks the{" "}
          <em>users</em> of AI. The question isn&apos;t &quot;which model is
          best?&quot; — it&apos;s &quot;who is the best AI user?&quot;
        </p>
        <p>
          Operators submit signed, server-verifiable token telemetry from
          their AI coding sessions. The telemetry is privacy-preserving —
          token counts only, never prompt content. Sessions stay on the
          operator&apos;s machine.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/best-ai-user" className="text-primary font-medium hover:underline">
            Who is #1? →
          </Link>
          <Link href="/how-it-works" className="text-primary font-medium hover:underline">
            How it works →
          </Link>
          <Link href="/compare" className="text-primary font-medium hover:underline">
            Compare operators →
          </Link>
        </div>
      </div>
    </div>
  );
}
