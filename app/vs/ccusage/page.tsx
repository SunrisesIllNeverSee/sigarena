import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "SigRank vs ccusage — Yield vs Raw Token Count",
  description:
    "ccusage counts tokens. SigRank measures efficiency. Yield (Υ) tells you whether your tokens are compounding signal or burning. The difference matters.",
  alternates: { canonical: "/vs/ccusage" },
  openGraph: {
    title: "SigRank vs ccusage — Yield vs Raw Token Count",
    description: "Token counting vs token efficiency. Which matters?",
    url: "https://signaaf.com/vs/ccusage",
    type: "website",
  },
};

export default function VsCcusagePage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs ccusage \u2014 Yield vs Raw Token Count", "ccusage counts tokens. SigRank measures efficiency. Yield tells you whether those tokens were well spent.", "/vs/ccusage"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/ccusage" },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs ccusage</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Yield (Υ) vs raw token count — efficiency vs volume
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">ccusage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">Raw token counts (input, output, cache read/write)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Total tokens consumed</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI — are tokens compounding?</td>
              <td className="px-4 py-3 text-muted-foreground">How much you spent — volume only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">No — local CLI output only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">API</td>
              <td className="px-4 py-3 text-muted-foreground">Public REST API + MCP tools</td>
              <td className="px-4 py-3 text-muted-foreground">None — CLI only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Comparison</td>
              <td className="px-4 py-3 text-muted-foreground">Head-to-head operator comparison</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — local CLI</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Counting tokens vs measuring efficiency
        </h2>
        <p>
          ccusage is a great tool for seeing how many tokens you&apos;ve
          consumed. It reads your Claude session logs and shows you the raw
          numbers. That&apos;s useful for cost tracking.
        </p>
        <p>
          But raw token count doesn&apos;t tell you if you&apos;re{" "}
          <em>good</em> at using AI. An operator who burns 10M tokens to
          produce 1K output has a high token count — but low efficiency.
          An operator who uses 100K tokens to produce the same 1K output has
          a lower token count but{" "}
          <strong className="text-foreground">10x higher Yield</strong>.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the{" "}
          <em>architecture</em> of your token cascade — is signal compounding,
          or are tokens burned? ccusage tells you how much you spent. SigRank
          tells you whether it was worth it.
        </p>
        <p className="text-xs">
          Note: SigRank actually bundles ccusage as a dependency for the raw
          token counting layer. They&apos;re complementary — ccusage counts,
          SigRank measures.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Stop counting. Start measuring.</p>
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
