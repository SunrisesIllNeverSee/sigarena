import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI User Ranking — How Operator Evals Work | SigRank SignalAF",
  description:
    "How does SigRank rank AI users? The Yield (Υ) cascade explained — cache_read, output, input, leverage, velocity, SNR, class tiers. Public operator evals methodology.",
  alternates: { canonical: "/ai-user-ranking" },
  openGraph: {
    title: "AI User Ranking — How Operator Evals Work | SigRank SignalAF",
    description:
      "How public operator evals rank AI users. The Yield (Υ) cascade explained.",
    url: "https://sigeconomy.com/ai-user-ranking",
    type: "website",
  },
};

export default function AIUserRankingPage() {
  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">Last updated: August 14, 2026</p>
      <JsonLd data={[
        articleSchema(
          "AI User Ranking — How Operator Evals Work",
          "How does SigRank rank AI users? The Yield cascade explained. Public operator evals methodology.",
          "/ai-user-ranking",
        ),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "AI User Ranking", path: "/ai-user-ranking" },
        ]),
        faqSchema([
          {
            question: "How are AI users ranked on SigRank?",
            answer:
              "AI users are ranked by Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2. Yield measures token-cascade efficiency \u2014 whether signal is compounding or tokens are being burned. Higher Yield means the AI user reuses cached context efficiently and produces substantial output relative to fresh input.",
          },
          {
            question: "What metrics does the operator evals leaderboard use?",
            answer:
              "SigRank's portable core uses five metrics: Yield, Velocity, Leverage, SNR, and 10xDEV. The leaderboard adds four product-level views: Efficiency, Scale V, $/1M, and Op Ratio. Yield is the headline metric.",
          },
          {
            question: "What are the class tiers for AI users?",
            answer:
              "Operator classes qualify operating scale and participation; they are not an efficiency score or a substitute for rank. Yield and the other metrics are evaluated separately.",
          },
          {
            question: "Does the ranking work across different AI tools?",
            answer:
              "Yes. The Yield metric is platform-agnostic \u2014 it works across Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and any AI coding tool that produces token telemetry. The ranking measures the operator's efficiency, not the AI model's capability.",
          },
          {
            question: "How do I get my AI user ranking?",
            answer:
              "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, rank, class, five portable core metrics, and product-level views. Token counts only \u2014 never prompt content, never code.",
          },
        ]),
      ]} />
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">AI User Ranking</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          How AI users are ranked — the Yield (Υ) cascade explained
        </p>
      </div>

      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <section>
          <h2 className="text-xl font-semibold">What is Yield (Υ)?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong className="text-foreground">Yield (Υ)</strong> = (cache_read × output) / input².
            It&apos;s the headline efficiency metric. Yield measures how
            effectively an operator uses AI tokens — rewarding context reuse
            (cache_read), meaningful output, and minimal wasteful input.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Volume is noise. Yield is signal. The operator who burns 10M tokens
            to produce 1K output has lower Yield than the operator who uses
            100K tokens to produce the same output.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">The four token pillars</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium">Pillar</th>
                  <th className="px-4 py-3 text-left font-medium">What it measures</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-semibold">Cache Read</td>
                  <td className="px-4 py-3 text-muted-foreground">Reused context from previous turns — the signal of compounding</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-semibold">Output</td>
                  <td className="px-4 py-3 text-muted-foreground">Tokens produced by the AI — the actual work done</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-semibold">Input</td>
                  <td className="px-4 py-3 text-muted-foreground">Tokens sent to the AI — the cost. Squared in the formula to penalize waste</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Cache Write</td>
                  <td className="px-4 py-3 text-muted-foreground">Context written to cache for future reuse — investment in compounding</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Class tiers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Operators are classified into tiers based on their Yield and
            behavioral profile:
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { tier: "APEX", desc: "The top operators. Yield is off the charts." },
              { tier: "S_CLASS", desc: "Elite. Consistently high yield." },
              { tier: "A_CLASS", desc: "Strong. Above-average efficiency." },
              { tier: "B_CLASS", desc: "Solid. Learning the cascade." },
              { tier: "BASE", desc: "Starting out. Room to grow." },
            ].map((c) => (
              <div key={c.tier} className="rounded-lg bg-muted/30 p-3">
                <div className="font-bold">{c.tier}</div>
                <div className="text-xs text-muted-foreground">{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Other metrics in the cascade</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Leverage</strong> — cache_read / input. How much cached context amplifies your input.</li>
            <li><strong className="text-foreground">Velocity</strong> — output / session_time. Token production rate.</li>
            <li><strong className="text-foreground">SNR</strong> — signal_tokens / total_tokens. Signal density.</li>
            <li><strong className="text-foreground">10xDEV</strong> — log₁₀(Leverage). Developer amplification factor.</li>
            <li><strong className="text-foreground">Compression Ratio</strong> — output / input. Output per input token.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How to get ranked</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Run the SigRank scanner on your AI coding sessions. It reads
            token telemetry locally (privacy-preserving — token counts only,
            never prompt content). Submit a signed snapshot to the leaderboard.
          </p>
          <a
            href="https://signalaf.com/score"
            className="mt-4 inline-flex items-center justify-center rounded-lg gradient-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
          >
            Check my rank
          </a>
        </section>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/best-ai-user" className="text-primary font-medium hover:underline">
          Who is #1? →
        </Link>
        <Link href="/ai-user-leaderboard" className="text-primary font-medium hover:underline">
          Full leaderboard →
        </Link>
        <Link href="/compare" className="text-primary font-medium hover:underline">
          Compare operators →
        </Link>
      </div>
    </div>
  );
}
