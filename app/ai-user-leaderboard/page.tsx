import { getLeaderboard, computeDeltaFromAverage } from "@/lib/api";
import { RankCard } from "@/components/rank-card";
import Link from "next/link";
import { Trophy, Shield, Zap, Scale, Eye, Lock, FileText, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "AI User Leaderboard — Top AI Operators Ranked | SigArena",
  description:
    "The AI User Leaderboard ranks operator profiles by token-cascade efficiency (Yield Υ), not model quality or raw token consumption. See who ranks highest and get your own rank.",
  alternates: { canonical: "/ai-user-leaderboard" },
  openGraph: {
    title: "AI User Leaderboard — Top AI Operators Ranked | SigArena",
    description:
      "The AI User Leaderboard ranks operator profiles by token-cascade efficiency, not model quality or raw token consumption.",
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
      <p className="text-xs text-muted-foreground">Last updated: September 4, 2026</p>
      <JsonLd data={[
        leaderboardSchema(data.entries, "AI User Leaderboard", "https://sigeconomy.com/ai-user-leaderboard"),
        articleSchema(
          "AI User Leaderboard — Top AI Operators Ranked",
          "The AI User Leaderboard ranks operator profiles by token-cascade efficiency, not model quality or raw token consumption.",
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
              "The AI User Leaderboard ranks operator profiles using token-cascade measurements derived from input, output, cache-write, and cache-read telemetry. Unlike AI model leaderboards, it ranks the accounts operating AI tools. Unlike raw usage boards, it does not rank users solely by how many tokens they consume.",
          },
          {
            question: "How are AI users scored on the leaderboard?",
            answer:
              "AI users are scored by Yield (Υ) = (cache_read × output) / input². Higher Yield means the operator reuses cached context efficiently and produces substantial output relative to fresh input. Token counts only — never prompt content or code.",
          },
          {
            question: "How many AI users are on the leaderboard?",
            answer: `${data.total_operators} operator profiles are currently ranked on the public leaderboard. The ranking updates as new operator telemetry is submitted.`,
          },
          {
            question: "Are these real people or AI models?",
            answer:
              "The leaderboard ranks operator profiles — the individuals whose AI-work telemetry is measured. An operator is not necessarily a legal person, employer, or unique human. Some profiles are claimed by their owners; others are pseudonymous or unclaimed. Profiles are not AI models.",
          },
          {
            question: "How do I get on the AI User Leaderboard?",
            answer:
              "Visit signalaf.com/score to enroll and submit your token telemetry. SigArena will display your Yield, your rank, and your operator class. Works with Claude, ChatGPT, Cursor, Copilot, and any AI coding tool. Token counts only — never prompt content, never code.",
          },
          {
            question: "Does a high Yield mean someone is a better developer?",
            answer:
              "No. Yield measures a token-flow relationship. It does not measure productivity, work quality, professional skill, task correctness, cognition, or business value. A high Yield means an operator ranks highly under the stated metric and time window — nothing more.",
          },
        ]),
      ]} />
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">AI User Leaderboard</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {data.total_operators} operator profiles ranked by Υ Yield.
        </p>
      </div>

      {/* Concise direct answer above the leaderboard */}
      <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
        <p>
          The SigArena AI User Leaderboard ranks operator profiles using
          token-cascade measurements derived from input, output, cache-write,
          and cache-read telemetry. Unlike AI model leaderboards, it ranks the{" "}
          <strong className="text-foreground">accounts operating AI tools</strong>.
          Unlike raw usage boards, it does not rank users solely by how many
          tokens they consume.
        </p>
      </div>

      {/* The leaderboard itself */}
      <div className="space-y-2">
        {data.entries.map((entry) => (
          <RankCard
            key={entry.codename}
            entry={entry}
            deltaFromAverage={deltas.get(entry.codename)}
          />
        ))}
      </div>

      {/* Primary + secondary CTAs */}
      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Think you can beat them?</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://signalaf.com/score"
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
          >
            Check My Rank
          </a>
          <a
            href="https://signalaf.com/score"
            className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            Preview My Score
          </a>
        </div>
      </div>

      {/* Seeded vs live disclosure */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          Field size and data status
        </h2>
        <p className="text-sm text-muted-foreground">
          {data.total_operators} operator profiles are currently ranked. The
          field includes a mix of seeded profiles (derived from public
          telemetry snapshots) and live profiles (actively maintained by
          enrolled operators). As more operators enroll and submit signed
          telemetry, the field grows and rankings shift.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Claimed profiles</strong> are
          linked to an authenticated operator account.{" "}
          <strong className="text-foreground">Unclaimed profiles</strong> exist
          in the public dataset but have no authenticated owner link.{" "}
          <strong className="text-foreground">Pseudonymous profiles</strong>{" "}
          use a display name that does not map to a verified legal identity.{" "}
          <strong className="text-foreground">Verified profiles</strong> have
          an authenticated account link but are not equated with a specific
          legal person — one operator can have devices, submissions, and an
          optional authenticated account link.
        </p>
      </div>

      {/* User leaderboard vs model leaderboard */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Scale className="h-5 w-5 text-muted-foreground" />
          User leaderboard vs model leaderboard
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-semibold text-foreground">Dimension</th>
                <th className="py-2 pr-4 text-left font-semibold text-foreground">Model leaderboards</th>
                <th className="py-2 text-left font-semibold text-foreground">AI User Leaderboard</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">What is ranked</td>
                <td className="py-2 pr-4">AI models (GPT, Claude, Gemini, Llama)</td>
                <td className="py-2">Operator profiles (accounts using AI tools)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">Core question</td>
                <td className="py-2 pr-4">Which model is best?</td>
                <td className="py-2">Who ranks highest under the stated metric?</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">Typical metric</td>
                <td className="py-2 pr-4">Accuracy, pass rate, preference, ELO</td>
                <td className="py-2">Yield (Υ) — token-cascade efficiency</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">Data source</td>
                <td className="py-2 pr-4">Benchmark suites, human preference</td>
                <td className="py-2">Privacy-preserving token telemetry</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">Examples</td>
                <td className="py-2 pr-4">LMSYS Arena, LiveBench, Hugging Face</td>
                <td className="py-2">SigArena (this page)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Efficiency vs raw usage */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-muted-foreground" />
          Efficiency vs raw usage
        </h2>
        <p className="text-sm text-muted-foreground">
          Raw usage boards rank by total tokens, cost, or session count. The
          AI User Leaderboard ranks by{" "}
          <strong className="text-foreground">Yield (Υ)</strong> = (cache_read ×
          output) / input², a token-cascade efficiency metric. An operator who
          burns millions of tokens without reusing context will not rank
          highly here, even if their total spend is the largest. An operator
          who efficiently reuses cached context and produces substantial
          output relative to fresh input can rank highly even at lower total
          volume.
        </p>
        <p className="text-sm text-muted-foreground">
          This distinction matters because efficiency and volume measure
          different things. A high token count does not imply skill, and a
          high Yield does not imply productivity, work quality, or business
          value. Yield measures a token-flow relationship — nothing more.
        </p>
      </div>

      {/* Brief methodology */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Ranking methodology
        </h2>
        <p className="text-sm text-muted-foreground">
          Operators are ranked by Yield (Υ) = (cache_read × output) / input²,
          computed from four token telemetry primitives: input, output,
          cache-write, and cache-read. The telemetry is collected via TTEOP
          (Token Telemetry Evaluation Operator Protocol), an open,
          vendor-neutral interoperability protocol. Upsilon, the SignalAF
          measurement engine, implements TTEOP and produces the measurements
          displayed here.
        </p>
        <p className="text-sm text-muted-foreground">
          The leaderboard shows the all-time window with the default OCM
          category filter. Token counts only — never prompt content, response
          text, source code, or repository contents.
        </p>
      </div>

      {/* Privacy and non-inference */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Privacy and what this does not measure
        </h2>
        <p className="text-sm text-muted-foreground">
          SigArena only reads token counts — input, output, cache-write, and
          cache-read. It never reads, stores, or transmits prompt content,
          response text, source code, or transcripts. Sessions stay on the
          operator&apos;s machine.
        </p>
        <p className="text-sm text-muted-foreground">
          Yield and related metrics quantify token-flow relationships. They do
          not measure correctness, novelty, user satisfaction, economic value,
          code quality, safety, talent, effort, intelligence, productivity,
          professional skill, task correctness, employee performance, or
          business value. A pseudonymous account is not equated with a
          verified legal person. &quot;Best AI operator&quot; means
          highest-ranked under the stated metric and time window — nothing
          more.
        </p>
      </div>

      {/* Ecosystem links */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          Ecosystem and protocol
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="https://signalaf.com/score" className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-primary/40 transition-colors">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span>SignalAF scoring — get your rank</span>
          </Link>
          <Link href="https://signalaf.com/methodology" className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-primary/40 transition-colors">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span>SignalAF methodology</span>
          </Link>
          <Link href="https://signalaf.com/privacy" className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-primary/40 transition-colors">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span>SignalAF privacy policy</span>
          </Link>
          <Link href="https://github.com/SunrisesIllNeverSee/tteop-spec" className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-primary/40 transition-colors">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <span>TTEOP — open telemetry protocol</span>
          </Link>
        </div>
      </div>

      {/* Internal links */}
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
        <Link href="/ai-power-users" className="text-primary font-medium hover:underline">
          AI power users →
        </Link>
        <Link href="/weekly" className="text-primary font-medium hover:underline">
          Weekly drop →
        </Link>
      </div>
    </div>
  );
}
