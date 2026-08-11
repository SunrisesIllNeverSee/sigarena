import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs clawdboard — Cascade vs Streaks",
  description:
    "clawdboard ranks by streaks and active days. SigRank ranks by Yield (Υ) — token-cascade efficiency. Consistency vs skill — which matters?",
  alternates: { canonical: "/vs/clawdboard" },
  openGraph: {
    title: "SigRank vs clawdboard — Cascade vs Streaks",
    description: "Yield (Υ) vs streaks and active days — skill vs consistency.",
    url: "https://sigeconomy.com/vs/clawdboard",
    type: "website",
  },
};

export default function VsClawdboardPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs clawdboard \u2014 Cascade vs Streaks", "clawdboard ranks by streaks and active days. SigRank ranks by Yield (Υ) — token-cascade efficiency. Consistency vs skill.", "/vs/clawdboard"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/clawdboard" },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs clawdboard</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Yield (Υ) vs streaks and active days — skill vs consistency
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">clawdboard</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">Cost, tokens, and streak gamification</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Streaks and active days</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI — are tokens compounding?</td>
              <td className="px-4 py-3 text-muted-foreground">How much you spent — volume only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by cost + tokens + streaks</td>
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
              <td className="px-4 py-3 text-muted-foreground">None</td>
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
          Streaks vs efficiency
        </h2>
        <p>
          clawdboard has a clean UI and great streak gamification. If you want
          to build a daily habit of using Claude, the streak counter is
          genuinely motivating. Showing up every day matters.
        </p>
        <p>
          But streaks don&apos;t tell you if you&apos;re{" "}
          <em>good</em> at using AI. An operator who logs in every day and
          burns 10M tokens to produce 1K output has a long streak — but low
          efficiency. An operator who uses 100K tokens to produce the same
          1K output has a shorter streak but{" "}
          <strong className="text-foreground">10x higher Yield</strong>.
          Consistency rewards showing up. Efficiency rewards skill.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the{" "}
          <em>architecture</em> of your token cascade — is signal compounding
          through cache reuse and tight output, or are tokens burned in long
          input chains? clawdboard tells you how consistent you were. SigRank
          tells you how good those sessions actually were.
        </p>
        <p>
          The key difference: clawdboard ranks by streaks and volume. SigRank
          ranks by efficiency. One measures consistency. The other measures
          skill.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Stop counting streaks. Start measuring skill.</p>
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
