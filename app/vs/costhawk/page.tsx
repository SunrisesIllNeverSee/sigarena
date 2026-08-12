import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs CostHawk — Yield vs Consumption",
  description:
    "CostHawk ranks by total token consumption. SigRank ranks by Yield (Υ) — token-cascade efficiency. Consumption vs efficiency — which matters?",
  alternates: { canonical: "/vs/costhawk" },
  openGraph: {
    title: "SigRank vs CostHawk — Yield vs Consumption",
    description: "Yield (Υ) vs total token consumption — efficiency vs volume.",
    url: "https://sigeconomy.com/vs/costhawk",
    type: "website",
  },
};

export default function VsCostHawkPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs CostHawk \u2014 Yield vs Consumption", "CostHawk ranks by total token consumption. SigRank ranks by Yield (Υ) — token-cascade efficiency. Consumption vs efficiency.", "/vs/costhawk"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/costhawk" },
        ]),
        faqSchema([
          { question: "What is the difference between SigRank and CostHawk?", answer: "CostHawk ranks by total token consumption \u2014 how much you burned, anonymized. SigRank ranks by Yield \u2014 token-cascade efficiency. Consumption rewards volume; Yield rewards skill. An AI user who burns 10M tokens for 1K output ranks high on CostHawk but low on SigRank." },
          { question: "Does SigRank compete with CostHawk?", answer: "No \u2014 both respect privacy (token counts only) but answer different questions. CostHawk tells a developer how much they consumed. SigRank tells them whether those tokens were well spent. They're complementary for a person using AI who wants both volume and efficiency views." },
          { question: "What score does SigRank use?", answer: "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2 \u2014 token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs CostHawk</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Yield (Υ) vs total token consumption — efficiency vs volume
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">CostHawk</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">Total token consumption (anonymized)</td>
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
              <td className="px-4 py-3 text-muted-foreground">Yes — anonymized, ranked by consumption</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Class tiers</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — 8-tier experience ladder</td>
              <td className="px-4 py-3 text-muted-foreground">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Build archetypes</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — 10 build archetypes</td>
              <td className="px-4 py-3 text-muted-foreground">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">API</td>
              <td className="px-4 py-3 text-muted-foreground">Public REST API + MCP tools</td>
              <td className="px-4 py-3 text-muted-foreground">Limited</td>
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
          Consumption vs efficiency
        </h2>
        <p>
          CostHawk is privacy-first with an anonymized leaderboard. If you want
          to see total token consumption without attaching your name to it,
          the anonymized approach is a legitimate privacy choice.
        </p>
        <p>
          But total consumption doesn&apos;t tell you if you&apos;re{" "}
          <em>good</em> at using AI. An operator who burns 10M tokens to
          produce 1K output has high consumption — but low efficiency. An
          operator who uses 100K tokens to produce the same 1K output has
          lower consumption but{" "}
          <strong className="text-foreground">10x higher Yield</strong>.
          Consumption rewards volume. Efficiency rewards skill.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the{" "}
          <em>architecture</em> of your token cascade — is signal compounding
          through cache reuse and tight output, or are tokens burned in long
          input chains? CostHawk tells you how much you consumed. SigRank
          tells you whether those tokens were well spent.
        </p>
        <p>
          The key difference: CostHawk ranks by consumption. SigRank ranks by
          efficiency. Both respect privacy. Only one measures skill.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Stop consuming. Start measuring.</p>
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
