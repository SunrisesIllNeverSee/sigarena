import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs ccburn — Claude Code Burn vs Cascade Yield",
  description:
    "ccburn tracks Claude Code token burn. SigRank scores cascade yield. Burn is the input; yield is the output.",
  alternates: { canonical: "/vs/ccburn" },
  openGraph: {
    title: "SigRank vs ccburn — Claude Code Burn vs Cascade Yield",
    description: "Claude Code burn vs yield",
    url: "https://sigeconomy.com/vs/ccburn",
    type: "website",
  },
};

export default function VsuccburnPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs ccburn — Claude Code Burn vs Cascade Yield", "ccburn tracks Claude Code token burn. SigRank scores cascade yield. Burn is the input; yield is the output.", "/vs/ccburn"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/ccburn" },
        ]),
        faqSchema([
          { question: "What is the difference between SigRank and ccburn?", answer: "ccburn tracks Claude Code token burn. SigRank scores cascade yield. Burn is the input; yield is the output. SigRank's Yield (Υ) = (cache_read × output) / input² measures cascade efficiency — whether your tokens are compounding signal or burning." },
          { question: "Can I use both ccburn and SigRank?", answer: "Yes. They're complementary. Use ccburn for its function, and run sigrank submit to publish your cascade score to the leaderboard. The same local logs feed both." },
          { question: "What score does SigRank use?", answer: "Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only — never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs ccburn — Claude Code Burn vs Cascade Yield</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Claude Code burn vs yield</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">ccburn</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Cascade yield (Υ = cache_read × output / input²)</td>
              <td className="px-4 py-3 text-muted-foreground">Claude Code token burn</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you compound signal</td>
              <td className="px-4 py-3 text-muted-foreground">How much you burned on Claude Code</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers</td>
              <td className="px-4 py-3 text-muted-foreground">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Platform coverage</td>
              <td className="px-4 py-3 text-muted-foreground">Claude Code, Cursor, Copilot, Gemini, 15+</td>
              <td className="px-4 py-3 text-muted-foreground">Limited</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">MCP server</td>
              <td className="px-4 py-3 text-muted-foreground">Yes</td>
              <td className="px-4 py-3 text-muted-foreground">No</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          The difference that matters
        </h2>
        <p>ccburn tracks Claude Code token burn. SigRank scores cascade yield. Burn is the input; yield is the output.</p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the architecture of your
          token cascade — is signal compounding, or are tokens burned? That&apos;s
          the question ccburn can&apos;t answer.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What is the difference between SigRank and ccburn?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ccburn tracks Claude Code token burn. SigRank scores cascade yield. Burn is the input; yield is the output. SigRank's Yield (Υ) = (cache_read × output) / input² measures cascade efficiency.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Can I use both ccburn and SigRank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes. They're complementary. Use ccburn for its function, and run sigrank submit to publish your cascade score to the leaderboard.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">What score does SigRank use?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">How do I get my AI user score and rank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only — never prompt content, never code.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Stop tracking burn. Start measuring yield.</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my Yield
        </a>
      </div>
    </div>
  );
}
