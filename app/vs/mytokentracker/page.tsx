import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs mytokentracker — Efficiency vs Spend",
  description:
    "mytokentracker ranks by dollars spent. SigRank ranks by Yield (Υ) — token-cascade efficiency. Spend tells you cost. Yield tells you skill.",
  alternates: { canonical: "/vs/mytokentracker" },
  openGraph: {
    title: "SigRank vs mytokentracker — Efficiency vs Spend",
    description: "Yield (Υ) vs dollars spent — efficiency vs cost.",
    url: "https://sigeconomy.com/vs/mytokentracker",
    type: "website",
  },
};

export default function VsMyTokenTrackerPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs mytokentracker \u2014 Efficiency vs Spend", "mytokentracker ranks by dollars spent. SigRank ranks by Yield (Υ) — token-cascade efficiency. Spend vs efficiency.", "/vs/mytokentracker"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/mytokentracker" },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs mytokentracker</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Yield (Υ) vs dollars spent — efficiency vs cost
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">mytokentracker</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">Dollars spent across 2,300+ model pricings</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Total dollars spent</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI — are tokens compounding?</td>
              <td className="px-4 py-3 text-muted-foreground">How much you spent — volume only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by dollars spent</td>
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
          Spend vs efficiency
        </h2>
        <p>
          mytokentracker ranks #1 for &quot;AI usage leaderboard&quot; and
          covers 2,300+ model pricings. If you want to know exactly how many
          dollars you&apos;ve spent across every model, it&apos;s thorough and
          well-priced for cost tracking.
        </p>
        <p>
          But dollars spent doesn&apos;t tell you if you&apos;re{" "}
          <em>good</em> at using AI. An operator who spends $500 to produce
          1K output has a high spend — but low efficiency. An operator who
          spends $5 to produce the same 1K output has a lower spend but{" "}
          <strong className="text-foreground">100x higher Yield</strong>.
          Spend rewards consumption. Efficiency rewards skill.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the{" "}
          <em>architecture</em> of your token cascade — is signal compounding
          through cache reuse and tight output, or are tokens burned in long
          input chains? mytokentracker tells you how much you spent. SigRank
          tells you whether those dollars were well spent.
        </p>
        <p>
          The key difference: mytokentracker ranks by spend. SigRank ranks by
          efficiency. One measures cost. The other measures skill.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Stop tracking spend. Start measuring skill.</p>
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
