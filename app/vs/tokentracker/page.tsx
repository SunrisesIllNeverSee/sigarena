import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs Token Tracker — Efficiency vs Tracking",
  description:
    "Token Tracker monitors token volume across 29 tools. SigRank ranks by Yield (Υ) — token-cascade efficiency. Tracking vs measuring — which matters?",
  alternates: { canonical: "/vs/tokentracker" },
  openGraph: {
    title: "SigRank vs Token Tracker — Efficiency vs Tracking",
    description: "Yield (Υ) vs token tracking — skill vs monitoring.",
    url: "https://sigeconomy.com/vs/tokentracker",
    type: "website",
  },
};

export default function VsTokenTrackerPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs Token Tracker \u2014 Efficiency vs Tracking", "Token Tracker monitors token volume across 29 tools. SigRank ranks by Yield (Υ) — token-cascade efficiency. Tracking vs measuring.", "/vs/tokentracker"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/tokentracker" },
        ]),
        faqSchema([
          { question: "What is the difference between SigRank and Token Tracker?", answer: "Token Tracker monitors token volume across 29 tools with desktop widgets. SigRank measures token-cascade efficiency with Yield. Tracking tells a developer how much they burned; Yield tells them how well. One monitors volume; the other measures skill." },
          { question: "Does SigRank compete with Token Tracker?", answer: "No \u2014 they serve different needs. Token Tracker gives an always-on view of token volume across many tools. SigRank ranks AI operators by efficiency. A person using AI can track volume with Token Tracker and measure skill with SigRank." },
          { question: "What score does SigRank use?", answer: "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2 \u2014 token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs Token Tracker</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Yield (Υ) vs token tracking — skill vs monitoring
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">Token Tracker</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">Token volume across 29 tools (desktop widgets)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Total tokens tracked</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI — are tokens compounding?</td>
              <td className="px-4 py-3 text-muted-foreground">How much you spent — volume only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by total volume</td>
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
          Tracking vs measuring
        </h2>
        <p>
          Token Tracker covers 29 tools and ships desktop widgets for
          at-a-glance monitoring. If you want a always-on view of how many
          tokens you&apos;re burning across every tool, the widget UX is
          polished and convenient.
        </p>
        <p>
          But tracking volume doesn&apos;t tell you if you&apos;re{" "}
          <em>good</em> at using AI. An operator who burns 10M tokens to
          produce 1K output has a high token count — but low efficiency. An
          operator who uses 100K tokens to produce the same 1K output has a
          lower token count but{" "}
          <strong className="text-foreground">10x higher Yield</strong>.
          Tracking rewards monitoring. Efficiency rewards skill.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the{" "}
          <em>architecture</em> of your token cascade — is signal compounding
          through cache reuse and tight output, or are tokens burned in long
          input chains? Token Tracker tells you how much you burned. SigRank
          tells you whether those tokens were well spent.
        </p>
        <p>
          The key difference: Token Tracker tracks volume. SigRank measures
          efficiency. One monitors. The other measures.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Stop tracking. Start measuring.</p>
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
