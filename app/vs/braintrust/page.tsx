import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "SigRank vs Braintrust — User Evaluation vs AI App Evaluation",
  description:
    "Braintrust evaluates your AI application's outputs. SigRank evaluates the human operating the AI. Different sides of the same coin — which evaluation do you need?",
  openGraph: {
    title: "SigRank vs Braintrust — User Evaluation vs AI App Evaluation",
    description: "Evaluating the AI app vs evaluating the AI user.",
    url: "https://sigarena.signalaf.com/vs/braintrust",
    type: "website",
  },
};

export default function VsBraintrustPage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs Braintrust</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Evaluating the AI user vs evaluating the AI application — different sides of the same coin
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">Braintrust</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it evaluates</td>
              <td className="px-4 py-3 text-muted-foreground">The human operator — how efficiently you use AI</td>
              <td className="px-4 py-3 text-muted-foreground">The AI application — prompt quality, model selection, output accuracy</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">The question</td>
              <td className="px-4 py-3 text-muted-foreground">Who is the best AI user?</td>
              <td className="px-4 py-3 text-muted-foreground">Is my AI app producing good outputs?</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Eval scores (accuracy, factuality, semantic similarity)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — operators ranked by Yield, class tiers</td>
              <td className="px-4 py-3 text-muted-foreground">No — experiment comparison dashboard (your runs vs your runs)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Audience</td>
              <td className="px-4 py-3 text-muted-foreground">AI operators (developers using AI tools to code)</td>
              <td className="px-4 py-3 text-muted-foreground">AI engineers (developers building AI applications)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Data source</td>
              <td className="px-4 py-3 text-muted-foreground">Operator&apos;s AI coding session telemetry (token counts)</td>
              <td className="px-4 py-3 text-muted-foreground">Application eval datasets + production traces</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Scoring method</td>
              <td className="px-4 py-3 text-muted-foreground">Computed from token telemetry — deterministic, objective</td>
              <td className="px-4 py-3 text-muted-foreground">LLM-as-judge, code-based scorers, human review</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">MCP integration</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — SigRank MCP tools for AI assistants</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — Braintrust MCP server for coding agents</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Full prompt/response content in eval datasets</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Two sides of the same coin
        </h2>
        <p>
          Braintrust is a serious AI evaluation platform. It helps you define
          what &quot;good&quot; looks like for your AI application, run
          experiments, score outputs with LLMs or code, and catch regressions
          before they reach production. It&apos;s the right tool if you&apos;re
          building an AI product and need to evaluate the AI&apos;s outputs.
        </p>
        <p>
          SigRank evaluates a different thing: the <em>human</em> operating
          the AI. Not &quot;is this output good?&quot; but &quot;is this
          person good at using AI?&quot; Yield (Υ) measures how efficiently
          an operator uses tokens — rewarding context reuse, meaningful
          output, and minimal waste. It&apos;s the difference between
          evaluating the tool and evaluating the person wielding it.
        </p>
        <p>
          They&apos;re complementary. If you build AI apps, use Braintrust to
          evaluate your app&apos;s outputs. If you use AI to code, use SigRank
          to measure your own efficiency and see how you rank against other
          operators. Both have MCP servers — you can wire both into your
          coding agent.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Evaluate the operator, not just the app.</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my Yield
        </a>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/vs/langfuse" className="text-primary font-medium hover:underline">
          vs Langfuse →
        </Link>
        <Link href="/vs/ccusage" className="text-primary font-medium hover:underline">
          vs ccusage →
        </Link>
        <Link href="/best-ai-user" className="text-primary font-medium hover:underline">
          Who is #1? →
        </Link>
      </div>
    </div>
  );
}
