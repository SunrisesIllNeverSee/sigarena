import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs LMSYS Arena — Operator Evals vs Model Evals",
  description:
    "LMSYS Arena runs public model evals. SigRank runs public operator evals — evaluating the humans using AI. Different subjects, different metrics, different leaderboards.",
  alternates: { canonical: "/vs/lmsys-arena" },
  openGraph: {
    title: "SigRank vs LMSYS Arena — Humans vs Models",
    description: "Ranking AI users vs ranking AI models.",
    url: "https://sigeconomy.com/vs/lmsys-arena",
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
        faqSchema([
          { question: "What is the difference between SigRank and LMSYS Arena?", answer: "LMSYS Arena ranks AI models by human preference in blind A/B votes (Elo). SigRank ranks the humans who use AI by Yield from token telemetry. LMSYS measures the tool; SigRank measures the person wielding it. A great AI user with a mediocre model can out-Yield a poor one with the best model." },
          { question: "Does SigRank compete with LMSYS Arena?", answer: "No \u2014 they measure different subjects. LMSYS ranks models (GPT, Claude, Gemini); SigRank ranks the developers operating them. They're not competing \u2014 one evaluates the AI, the other evaluates the coder using the AI." },
          { question: "What score does SigRank use?", answer: "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2 \u2014 token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs LMSYS Arena</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Public operator evals vs public model evals
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

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What is the difference between SigRank and LMSYS Arena?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              LMSYS Arena ranks AI models by human preference in blind A/B votes (Elo). SigRank ranks the humans who use AI by Yield from token telemetry. LMSYS measures the tool; SigRank measures the person wielding it. A great AI user with a mediocre model can out-Yield a poor one with the best model.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Does SigRank compete with LMSYS Arena?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No {"\u2014"} they measure different subjects. LMSYS ranks models (GPT, Claude, Gemini); SigRank ranks the developers operating them. They&apos;re not competing {"\u2014"} one evaluates the AI, the other evaluates the coder using the AI.
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
