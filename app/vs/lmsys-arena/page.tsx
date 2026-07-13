import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "SigRank vs LMSYS Arena — Ranking Humans vs Ranking Models",
  description:
    "LMSYS Arena ranks AI models. SigRank ranks the humans who use AI. Different questions, different metrics, different leaderboards.",
  alternates: { canonical: "/vs/lmsys-arena" },
  openGraph: {
    title: "SigRank vs LMSYS Arena — Humans vs Models",
    description: "Ranking AI users vs ranking AI models.",
    url: "https://sigarena.signalaf.com/vs/lmsys-arena",
    type: "website",
  },
};

export default function VsLMSYSArenaPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs LMSYS Arena \u2014 Ranking Humans vs Ranking Models", "LMSYS Arena ranks AI models. SigRank ranks the humans who use AI. Different questions, different answers.", "/vs/lmsys-arena"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/lmsys-arena" },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs LMSYS Arena</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ranking the humans who use AI vs ranking the AI models
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">LMSYS Arena</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it ranks</td>
              <td className="px-4 py-3 text-muted-foreground">AI operators (the humans using AI)</td>
              <td className="px-4 py-3 text-muted-foreground">AI models (GPT, Claude, Gemini, etc.)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">The question</td>
              <td className="px-4 py-3 text-muted-foreground">Who is the best AI user?</td>
              <td className="px-4 py-3 text-muted-foreground">Which AI model is best?</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Method</td>
              <td className="px-4 py-3 text-muted-foreground">Token telemetry — Yield (Υ) from session data</td>
              <td className="px-4 py-3 text-muted-foreground">Human voting — pairwise preference (Elo)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Elo rating from human votes</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Subjective?</td>
              <td className="px-4 py-3 text-muted-foreground">No — measured from token counts</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — based on human preference</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Data source</td>
              <td className="px-4 py-3 text-muted-foreground">Operator&apos;s own session telemetry</td>
              <td className="px-4 py-3 text-muted-foreground">Blind A/B votes on prompt outputs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Different questions, different answers
        </h2>
        <p>
          LMSYS Arena answers &quot;which AI model is best?&quot; — it ranks
          models by human preference in blind A/B tests. That&apos;s valuable
          for model selection.
        </p>
        <p>
          SigRank answers &quot;who is the best AI <em>user</em>?&quot; — it
          ranks the humans who operate AI tools, by measuring how efficiently
          they use tokens. A great operator with a mediocre model can out-Yield
          a poor operator with the best model.
        </p>
        <p>
          They&apos;re not competing — they&apos;re measuring different things.
          LMSYS measures the tool. SigRank measures the person wielding it.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">The tool is the person.</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </div>
    </div>
  );
}
