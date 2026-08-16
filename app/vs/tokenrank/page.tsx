import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs TokenRank — Yield vs Burn-to-Rank",
  description:
    "TokenRank uses burn-to-rank. SigRank ranks by Yield (Υ) — token-cascade efficiency. Burn tells you volume. Yield tells you efficiency.",
  alternates: { canonical: "/vs/tokenrank" },
  openGraph: {
    title: "SigRank vs TokenRank — Yield vs Burn-to-Rank",
    description: "Yield (Υ) vs aggregate token activity — efficiency vs burn.",
    url: "https://sigeconomy.com/vs/tokenrank",
    type: "website",
  },
};

export default function VsTokenRankPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs TokenRank \u2014 Yield vs Burn-to-Rank", "TokenRank uses burn-to-rank. SigRank ranks by Yield (Υ) — token-cascade efficiency. Burn vs efficiency.", "/vs/tokenrank"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/tokenrank" },
        ]),
        faqSchema([
          { question: "What is the difference between SigRank and TokenRank?", answer: "TokenRank uses burn-to-rank \u2014 aggregate token activity. SigRank ranks by Yield \u2014 token-cascade efficiency. Burn tells a developer how much they consumed; Yield tells them whether tokens compounded. Both use token counts only, but one rewards volume and the other rewards skill." },
          { question: "Does SigRank compete with TokenRank?", answer: "No \u2014 both respect privacy but rank differently. TokenRank ranks by aggregate burn; SigRank ranks by efficiency. An AI user who burns 10M tokens for 1K output tops TokenRank but flops on SigRank. They're complementary views for a coder using AI." },
          { question: "What score does SigRank use?", answer: "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2 \u2014 token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs TokenRank</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Yield (Υ) vs aggregate token activity — efficiency vs burn
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">TokenRank</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">Aggregate token activity (burn-to-rank)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Total tokens burned</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI — are tokens compounding?</td>
              <td className="px-4 py-3 text-muted-foreground">How much you spent — volume only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by aggregate burn</td>
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
          Burn vs efficiency
        </h2>
        <p>
          TokenRank uses a burn-to-rank model with similar privacy positioning
          to SigRank — token counts only, no prompt content. If you want a
          volume-based leaderboard that respects privacy, it&apos;s a
          reasonable choice.
        </p>
        <p>
          But aggregate token burn doesn&apos;t tell you if you&apos;re{" "}
          <em>good</em> at using AI. An operator who burns 10M tokens to
          produce 1K output has a high burn — but low efficiency. An operator
          who uses 100K tokens to produce the same 1K output has a lower burn
          but{" "}
          <strong className="text-foreground">10x higher Yield</strong>.
          Burn rewards consumption. Efficiency rewards skill.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the{" "}
          <em>architecture</em> of your token cascade — is signal compounding
          through cache reuse and tight output, or are tokens burned in long
          input chains? TokenRank tells you how much you burned. SigRank tells
          you whether those tokens were well spent.
        </p>
        <p>
          The key difference: TokenRank ranks by burn. SigRank ranks by
          efficiency. Both respect privacy. Only one measures skill.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What is the difference between SigRank and TokenRank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              TokenRank uses burn-to-rank {"\u2014"} aggregate token activity. SigRank ranks by Yield {"\u2014"} token-cascade efficiency. Burn tells a developer how much they consumed; Yield tells them whether tokens compounded. Both use token counts only, but one rewards volume and the other rewards skill.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Does SigRank compete with TokenRank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No {"\u2014"} both respect privacy but rank differently. TokenRank ranks by aggregate burn; SigRank ranks by efficiency. An AI user who burns 10M tokens for 1K output tops TokenRank but flops on SigRank. They&apos;re complementary views for a coder using AI.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">What score does SigRank use?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yield ({"\u03a5"}) = (cache_read {"\u00d7"} output) / input{"\u00b2"} {"\u2014"} token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">How do I get my AI user score and rank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only {"\u2014"} never prompt content, never code.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Stop burning. Start measuring.</p>
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
