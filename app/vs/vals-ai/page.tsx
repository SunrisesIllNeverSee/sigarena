import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs Vals AI — Operator Evals vs Model Evals",
  description:
    "Vals AI runs public evals for LLM models. SigRank runs public evals for LLM operators — the humans using AI. Different subjects, different metrics, different leaderboards.",
  alternates: { canonical: "/vs/vals-ai" },
  openGraph: {
    title: "SigRank vs Vals AI — Operator Evals vs Model Evals",
    description:
      "Public LLM operator evals vs public LLM model evals. Vals AI evaluates models; SigRank evaluates the humans wielding them.",
    url: "https://sigeconomy.com/vs/vals-ai",
    type: "website",
  },
};

export default function VsValsAIPage() {
  return (
    <div className="space-y-6">
      <JsonLd
        data={[
          articleSchema(
            "SigRank vs Vals AI \u2014 Operator Evals vs Model Evals",
            "Vals AI runs public evals for LLM models. SigRank runs public evals for LLM operators \u2014 the humans using AI. Different subjects, different metrics, different leaderboards.",
            "/vs/vals-ai",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/vs/vals-ai" },
          ]),
        ]}
      />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs Vals AI</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Public LLM operator evals vs public LLM model evals
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">Vals AI</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it evaluates</td>
              <td className="px-4 py-3 text-muted-foreground">
                AI operators (the humans using AI)
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                AI models (GPT, Claude, Gemini, etc.)
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">The question</td>
              <td className="px-4 py-3 text-muted-foreground">
                Who is the best AI operator?
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Which AI model is best?
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Eval type</td>
              <td className="px-4 py-3 text-muted-foreground">
                Public operator evals — telemetry-based
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Public model evals — benchmark-based
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Method</td>
              <td className="px-4 py-3 text-muted-foreground">
                Token telemetry \u2014 Yield (\u03a5) from session data
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Standardized benchmark suites (MMLU, HumanEval, etc.)
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Metric</td>
              <td className="px-4 py-3 text-muted-foreground">
                Yield = (cache_read \u00d7 output) / input\u00b2
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Benchmark scores (accuracy, pass rate, etc.)
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Subjective?</td>
              <td className="px-4 py-3 text-muted-foreground">
                No \u2014 measured from token counts
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                No \u2014 measured from benchmark results
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Data source</td>
              <td className="px-4 py-3 text-muted-foreground">
                Operator&apos;s own session telemetry (privacy-preserving)
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Standardized test prompts run against models
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Public?</td>
              <td className="px-4 py-3 text-muted-foreground">
                Yes \u2014 public leaderboard, public methodology
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Yes \u2014 public results, public benchmarks
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Model evals vs operator evals
        </h2>
        <p>
          Vals AI runs <strong>public model evals</strong> {"\u2014"} standardized
          benchmark suites that measure how well an AI model performs on
          reasoning, coding, math, and knowledge tasks. The subject is the
          model. The question is &quot;which model is best?&quot;
        </p>
        <p>
          SigRank runs <strong>public operator evals</strong> {"\u2014"}
          telemetry-based evaluations that measure how effectively a human
          operator uses AI. The subject is the person. The question is
          &quot;who is the best AI operator?&quot;
        </p>
        <p>
          They&apos;re complementary, not competing. Vals AI tells you which
          model to use. SigRank tells you how well you&apos;re using it. A
          great operator with a mediocre model can out-Yield a poor operator
          with the best model \u2014 because Yield measures the cascade
          architecture, not the model&apos;s raw capability.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Why public evals matter
        </h2>
        <p>
          Public model evals (Vals AI, LMSYS Arena, LiveBench) created
          accountability for AI labs. Before public evals, model quality was
          marketing copy. After public evals, it was measurable.
        </p>
        <p>
          Public operator evals do the same for AI users. Before SigRank,
          operator skill was vibes \u2014 &quot;they seem productive.&quot;
          After SigRank, it&apos;s Yield \u2014 a measurable, comparable,
          public number. The same transparency that public model evals brought
          to AI labs, public operator evals bring to AI operators.
        </p>
        <p>
          <Link
            href="/public-operator-evals"
            className="text-primary hover:underline"
          >
            Read the public operator evals thesis \u2192
          </Link>
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">
          Vals AI evaluates the model. SigRank evaluates the operator.
        </p>
        <p className="mt-2 text-white/80">
          Public evals for the humans wielding AI.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Get your operator eval
        </a>
      </div>
    </div>
  );
}
