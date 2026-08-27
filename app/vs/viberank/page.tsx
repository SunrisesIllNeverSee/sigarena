import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs viberank — Burn Rate vs Cascade Yield",
  description:
    "viberank ranks developers by token burn. SigRank ranks by cascade yield. Burn rate is participation; yield is skill. The difference matters.",
  alternates: { canonical: "/vs/viberank" },
  openGraph: {
    title: "SigRank vs viberank — Burn Rate vs Cascade Yield",
    description: "Token burn vs token efficiency. Which matters?",
    url: "https://sigeconomy.com/vs/viberank",
    type: "website",
  },
};

export default function VsViberankPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs viberank \u2014 Burn Rate vs Cascade Yield", "viberank ranks developers by token burn. SigRank ranks by cascade yield. Burn rate is participation; yield is skill.", "/vs/viberank"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/viberank" },
        ]),
        faqSchema([
          { question: "What is the difference between SigRank and viberank?", answer: "viberank ranks developers by token burn \u2014 how many tokens you consumed. SigRank ranks by cascade yield: \u03a5 = (cache_read \u00d7 output) / input\u00b2. Burn rate measures participation; yield measures skill. An operator who burns 50M tokens re-sending context will top viberank but rank low on SigRank." },
          { question: "Why is burn rate not a skill metric?", answer: "Burn rate rewards the operator who never stops typing. An operator who re-sends the same context every turn and burns 50M input tokens will top a burn-rate leaderboard. An operator who compounds cached context and produces the same output with 5M tokens will rank lower on burn but higher on yield. Fuel consumption is not lap time." },
          { question: "Can I use both viberank and SigRank?", answer: "Yes. viberank gives you the gamified burn-rate competition. SigRank gives you the efficiency layer. Run sigrank submit to publish your cascade score, and keep your viberank profile for the burn crowd. The same local logs feed both." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs viberank</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Burn rate vs cascade yield — participation vs skill
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">viberank</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it ranks</td>
              <td className="px-4 py-3 text-muted-foreground">Cascade yield (Υ = cache_read × output / input²)</td>
              <td className="px-4 py-3 text-muted-foreground">Token burn (total tokens consumed)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you compound signal</td>
              <td className="px-4 py-3 text-muted-foreground">How much you participated</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by token burn</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Platform coverage</td>
              <td className="px-4 py-3 text-muted-foreground">Claude Code, Cursor, Copilot, Gemini, 15+</td>
              <td className="px-4 py-3 text-muted-foreground">Web-based, limited tool coverage</td>
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
          Burn rate is participation. Yield is skill.
        </h2>
        <p>
          viberank is a public leaderboard for AI coding token usage. It ranks
          developers by token burn — how many tokens you consumed. That&apos;s a
          participation metric, not a skill metric. An operator who re-sends the
          same context every turn and burns 50M input tokens will top the board.
          An operator who compounds cached context and produces the same output
          with 5M tokens will rank lower.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures whether your cascade is
          compounding or burning. viberank counts the fuel; SigRank measures the
          lap time. Both matter. Only one tells you who is winning.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What is the difference between SigRank and viberank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              viberank ranks developers by token burn — how many tokens you consumed. SigRank ranks by cascade yield: Υ = (cache_read × output) / input². Burn rate measures participation; yield measures skill.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Why is burn rate not a skill metric?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Burn rate rewards the operator who never stops typing. An operator who re-sends the same context every turn and burns 50M input tokens will top a burn-rate leaderboard. An operator who compounds cached context and produces the same output with 5M tokens will rank lower on burn but higher on yield.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Can I use both viberank and SigRank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes. viberank gives you the gamified burn-rate competition. SigRank gives you the efficiency layer. The same local logs feed both.
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
        <p className="text-xl font-bold">Stop burning. Start compounding.</p>
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
