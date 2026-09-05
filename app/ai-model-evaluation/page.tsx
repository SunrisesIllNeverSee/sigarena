import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Model Evaluation vs Operator Evaluation",
  description:
    "AI model evaluation is necessary but not sufficient. SigRank is the complementary operator layer — public evals for operators using AI. Ranked by Yield (Υ).",
  alternates: { canonical: "/ai-model-evaluation" },
  openGraph: {
    title: "AI Model Evaluation vs Operator Evaluation | SigRank SignalAF",
    description:
      "AI model evaluation is necessary but not sufficient. SigRank is the complementary operator layer.",
    url: "https://sigeconomy.com/ai-model-evaluation",
    type: "website",
  },
};

export default function AiModelEvaluationPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Model Evaluation vs Operator Evaluation",
            "AI model evaluation is necessary but not sufficient. SigRank is the complementary operator layer — public evals for operators using AI.",
            "/ai-model-evaluation",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Model Evaluation", path: "/ai-model-evaluation" },
          ]),
          faqSchema([
            {
              question: "What is AI model evaluation?",
              answer:
                "AI model evaluation is the systematic assessment of an AI model's capabilities using standardized benchmarks. Frameworks like MMLU (knowledge), HumanEval (coding), GSM8K (math), and Vals AI (independent benchmarks) test models on reasoning, coding, math, and knowledge tasks. LMSYS Arena uses human voting to rank models by Elo. Model evaluation answers the question: 'which model is best?'",
            },
            {
              question: "What is the difference between model evaluation and operator evaluation?",
              answer:
                "Model evaluation tests the AI model — GPT, Claude, Gemini — on standardized benchmarks. Operator evaluation (SigRank) tests the operator — the developer, coder, or AI user — using token telemetry from real sessions. Model evals answer 'which model is best?' Operator evals answer 'who is the best AI user?' They evaluate different subjects, use different methods, and answer different questions.",
            },
            {
              question: "Why do you need both model evaluation and operator evaluation?",
              answer:
                "Because model quality and operator skill are independent variables. A great model with a poor operator produces poor results. A weaker model with a great operator can still produce good results. Model evaluation tells you the ceiling; operator evaluation tells you how close the operator gets to it. Two operators using the same model can have 100× different Yield. You need both measurements to understand the full picture.",
            },
            {
              question: "How does SigRank complement model evaluation?",
              answer:
                "SigRank is a complement, not a competitor, to model evaluation. Model evals (Vals AI, LMSYS Arena, LiveBench) already cover model quality well. SigRank covers the layer they cannot: the operator. SigRank measures operators using Yield (Υ) = (cache_read × output) / input² from four token pillars — input, output, cache-read, cache-write. Token counts only, never prompt content. Together, model evals and operator evals provide a complete picture of AI system performance.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Model Evaluation vs Operator Evaluation</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Model evaluation is necessary but not sufficient. It tells you which
          model is best, but not who is best at using it. SigRank is the
          complementary operator layer.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Model evals measure the engine. Operator evals measure the driver.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          You need both. Model evaluation tells you the ceiling. Operator
          evaluation tells you how close the operator gets to it.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Model Evaluation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Standardized benchmark suites that measure how well an AI model
            performs on reasoning, coding, math, and knowledge tasks.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the AI model
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> which model
              is best?
            </li>
            <li>
              <strong className="text-foreground">Method:</strong> standardized
              test prompts
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> Vals AI,
              LMSYS Arena, LiveBench, MMLU, HumanEval
            </li>
            <li>
              <strong className="text-foreground">Output:</strong> benchmark
              scores (accuracy, pass rate, Elo)
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">Operator Evaluation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Telemetry-based evaluations that measure how effectively an
            operator uses AI — the cascade architecture, not the model
            capability.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the
              operator
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> who is the
              best AI operator?
            </li>
            <li>
              <strong className="text-foreground">Method:</strong> token
              telemetry from real sessions
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> SigRank
              (the only one)
            </li>
            <li>
              <strong className="text-foreground">Output:</strong> Yield (Υ),
              class tier, rank
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Why model evaluation is not enough</h2>
        <p className="text-muted-foreground">
          Model evaluation tells you the ceiling — the maximum capability of the
          model. But it does not tell you how close any given operator gets to
          that ceiling. Two operators using the same model, the same tools, and
          similar prompts can have 100× different Yield. The difference is the
          cascade architecture — how the operator structures context reuse, output
          extraction, and input minimization.
        </p>
        <p className="text-muted-foreground">
          Model evals cannot see this difference because they test the model
          with standardized prompts, not the operator with real sessions. Only
          operator evals — measuring token telemetry from real work — can
          reveal the skill gap between operators using the same model.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Complementary, not competitive</h2>
        <p className="text-muted-foreground">
          Model evaluation and operator evaluation are complements, not
          competitors. Model evals (Vals AI, LMSYS Arena, LiveBench) already
          cover model quality well. SigRank covers the layer they cannot: the
          operator. Together, they provide a complete picture of AI
          system performance — the model&apos;s capability and the
          operator&apos;s skill.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          Υ = (cache_read × output) / input²
        </div>
        <p className="text-sm text-muted-foreground">
          SigRank measures operators using four token pillars — input, output,
          cache-read, cache-write — and is privacy-preserving: token counts
          only, never prompt content.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/model-vs-agent-vs-operator-evals"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">Model vs Agent vs Operator Evals</h3>
          <p className="text-sm text-muted-foreground">
            A detailed comparison of the three evaluation layers and why each
            matters.
          </p>
        </Link>
        <Link
          href="/vs/lmsys-arena"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">SigRank vs LMSYS Arena</h3>
          <p className="text-sm text-muted-foreground">
            Operator evals vs human-voted model rankings.
          </p>
        </Link>
        <Link
          href="/operator-evals"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">Public Operator Evals</h3>
          <p className="text-sm text-muted-foreground">
            The public evaluation layer for AI operators — ranked by Yield (Υ).
          </p>
        </Link>
        <Link
          href="/ai-evaluation"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">AI Evaluation</h3>
          <p className="text-sm text-muted-foreground">
            The four layers of AI evaluation and where the operator layer fits.
          </p>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold">What is AI model evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              AI model evaluation is the systematic assessment of an AI
              model&apos;s capabilities using standardized benchmarks.
              Frameworks like MMLU (knowledge), HumanEval (coding), GSM8K
              (math), and Vals AI (independent benchmarks) test models on
              reasoning, coding, math, and knowledge tasks. LMSYS Arena uses
              human voting to rank models by Elo. Model evaluation answers the
              question: &quot;which model is best?&quot;
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What is the difference between model evaluation and operator evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Model evaluation tests the AI model — GPT, Claude, Gemini — on
              standardized benchmarks. Operator evaluation (SigRank) tests the
              operator — the developer, coder, or AI user — using token
              telemetry from real sessions. Model evals answer &quot;which model
              is best?&quot; Operator evals answer &quot;who is the best AI
              user?&quot; They evaluate different subjects, use different
              methods, and answer different questions.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Why do you need both model evaluation and operator evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Because model quality and operator skill are independent
              variables. A great model with a poor operator produces poor
              results. A weaker model with a great operator can still produce
              good results. Model evaluation tells you the ceiling; operator
              evaluation tells you how close the operator gets to it. Two
              operators using the same model can have 100× different Yield. You
              need both measurements to understand the full picture.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank complement model evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank is a complement, not a competitor, to model evaluation.
              Model evals (Vals AI, LMSYS Arena, LiveBench) already cover model
              quality well. SigRank covers the layer they cannot: the
              operator. SigRank measures operators using Yield (Υ) = (cache_read
              × output) / input² from four token pillars — input, output,
              cache-read, cache-write. Token counts only, never prompt content.
              Together, model evals and operator evals provide a complete
              picture of AI system performance.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
