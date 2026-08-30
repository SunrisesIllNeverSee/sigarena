import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Evaluation Tools — The Complete Landscape",
  description:
    "Four categories of AI evaluation tools: model benchmarks, output scorers, safety testers, and operator evals. SigRank is the only public operator evaluation tool. Ranked by Yield (Υ).",
  alternates: { canonical: "/ai-evaluation-tools" },
  openGraph: {
    title: "AI Evaluation Tools — The Complete Landscape | SigRank SignalAF",
    description:
      "Four categories of AI evaluation tools. SigRank is the only public operator evaluation tool.",
    url: "https://sigeconomy.com/ai-evaluation-tools",
    type: "website",
  },
};

export default function AiEvaluationToolsPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Evaluation Tools — The Complete Landscape",
            "Four categories of AI evaluation tools: model benchmarks, output scorers, safety testers, and operator evals. SigRank is the only public operator evaluation tool.",
            "/ai-evaluation-tools",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Evaluation Tools", path: "/ai-evaluation-tools" },
          ]),
          faqSchema([
            {
              question: "What are AI evaluation tools?",
              answer:
                "AI evaluation tools are software platforms and frameworks that assess AI system performance. They fall into four categories: model benchmark tools (Vals AI, LMSYS Arena), output scoring tools (Braintrust, Langfuse, Ragas), safety testing tools (Garak, AI safety benchmarks), and operator evaluation tools (SigRank). Each category evaluates a different layer of the AI stack.",
            },
            {
              question: "What are the categories of AI evaluation tools?",
              answer:
                "The four categories are: (1) Model evaluation tools — benchmark suites like Vals AI, LMSYS Arena, LiveBench that test AI models on standardized tasks. (2) Output evaluation tools — LLM-as-judge and human-rater platforms like Braintrust, Langfuse, Ragas that score individual outputs. (3) Safety evaluation tools — adversarial testing and red-teaming tools like Garak. (4) Operator evaluation tools — telemetry-based platforms like SigRank that measure the human using AI.",
            },
            {
              question: "How do I choose AI evaluation tools?",
              answer:
                "Choose based on what layer you need to evaluate. If you need to pick a model, use model benchmark tools (Vals AI, LMSYS Arena). If you need to score outputs in production, use output evaluation tools (Braintrust, Langfuse). If you need to test safety, use safety tools (Garak). If you need to evaluate the human operator, use SigRank — the only public operator evaluation tool. Most teams need tools from multiple categories.",
            },
            {
              question: "What makes SigRank different from other AI evaluation tools?",
              answer:
                "SigRank is the only public operator evaluation tool. Every other public evaluation tool evaluates the AI model (Vals AI, LMSYS Arena) or the AI output (Braintrust, Langfuse). SigRank evaluates the human operator using token telemetry — Yield (Υ) = (cache_read × output) / input² — from real sessions. It is privacy-preserving (token counts only, never prompt content) and platform-agnostic (works with Claude, GPT, Cursor, Copilot).",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Evaluation Tools</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          The complete landscape of AI evaluation tools across four categories.
          SigRank is the only public operator evaluation tool — every other
          category is well-served.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Four categories. One was empty.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Model, output, and safety evaluation tools all exist. Operator
          evaluation tools did not — until SigRank. The operator layer is now
          covered.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Model Evaluation Tools</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Benchmark suites that test AI models on standardized reasoning,
            coding, math, and knowledge tasks.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Vals AI</strong> —
              independent model benchmarks
            </li>
            <li>
              <strong className="text-foreground">LMSYS Arena</strong> —
              human-voted Elo rankings
            </li>
            <li>
              <strong className="text-foreground">LiveBench</strong> —
              automated, contamination-free benchmarks
            </li>
            <li>
              <strong className="text-foreground">Hugging Face Open LLM</strong>
              {" "}— open leaderboard
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Output Evaluation Tools</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Platforms that score individual AI outputs for correctness,
            helpfulness, and quality — often via LLM-as-judge or human raters.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Braintrust</strong> —
              evaluation and prompt playground
            </li>
            <li>
              <strong className="text-foreground">Langfuse</strong> —
              LLM observability and tracing
            </li>
            <li>
              <strong className="text-foreground">Ragas</strong> —
              RAG evaluation framework
            </li>
            <li>
              <strong className="text-foreground">DeepEval</strong> —
              unit-testing for LLM outputs
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Safety Evaluation Tools</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Adversarial testing, red-teaming, and safety benchmarking tools that
            probe AI systems for harmful behaviors and vulnerabilities.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Garak</strong> —
              LLM vulnerability scanner
            </li>
            <li>
              <strong className="text-foreground">AI Safety Benchmarks</strong>
              {" "}— standardized safety suites
            </li>
            <li>
              <strong className="text-foreground">PAIR / GCG</strong> —
              adversarial attack frameworks
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">Operator Evaluation Tools</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Telemetry-based platforms that measure how effectively a human
            operator uses AI — the cascade architecture, not the model
            capability.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">SigRank</strong> —
              the only public operator evaluation tool
            </li>
            <li>
              <strong className="text-foreground">Metric:</strong> Yield (Υ) =
              (cache_read × output) / input²
            </li>
            <li>
              <strong className="text-foreground">Privacy:</strong> token counts
              only — never prompt content
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Why the operator category was empty</h2>
        <p className="text-muted-foreground">
          Model evaluation tools ask &quot;which model is best?&quot; Output
          evaluation tools ask &quot;is this output good?&quot; Safety
          evaluation tools ask &quot;is this system safe?&quot; But no tool
          asked &quot;who is the best AI operator?&quot; — because measuring the
          human requires a different kind of telemetry.
        </p>
        <p className="text-muted-foreground">
          SigRank fills this gap with token-cascade telemetry. The four token
          pillars — input, output, cache-read, cache-write — are sufficient to
          compute Yield (Υ) without ever reading a prompt or seeing a line of
          code. The evaluation is public; the work is private.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
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
          href="/vs/vals-ai"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">SigRank vs Vals AI</h3>
          <p className="text-sm text-muted-foreground">
            Operator evals vs model evals — different subjects, different
            metrics.
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
          href="/vs/langfuse"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">SigRank vs Langfuse</h3>
          <p className="text-sm text-muted-foreground">
            Public operator evals vs private LLM observability.
          </p>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold">What are AI evaluation tools?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              AI evaluation tools are software platforms and frameworks that
              assess AI system performance. They fall into four categories:
              model benchmark tools (Vals AI, LMSYS Arena), output scoring tools
              (Braintrust, Langfuse, Ragas), safety testing tools (Garak, AI
              safety benchmarks), and operator evaluation tools (SigRank). Each
              category evaluates a different layer of the AI stack.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What are the categories of AI evaluation tools?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              The four categories are: (1) Model evaluation tools — benchmark
              suites like Vals AI, LMSYS Arena, LiveBench that test AI models on
              standardized tasks. (2) Output evaluation tools — LLM-as-judge and
              human-rater platforms like Braintrust, Langfuse, Ragas that score
              individual outputs. (3) Safety evaluation tools — adversarial
              testing and red-teaming tools like Garak. (4) Operator evaluation
              tools — telemetry-based platforms like SigRank that measure the
              human using AI.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How do I choose AI evaluation tools?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Choose based on what layer you need to evaluate. If you need to
              pick a model, use model benchmark tools (Vals AI, LMSYS Arena). If
              you need to score outputs in production, use output evaluation
              tools (Braintrust, Langfuse). If you need to test safety, use
              safety tools (Garak). If you need to evaluate the human operator,
              use SigRank — the only public operator evaluation tool. Most teams
              need tools from multiple categories.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What makes SigRank different from other AI evaluation tools?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank is the only public operator evaluation tool. Every other
              public evaluation tool evaluates the AI model (Vals AI, LMSYS
              Arena) or the AI output (Braintrust, Langfuse). SigRank evaluates
              the human operator using token telemetry — Yield (Υ) = (cache_read
              × output) / input² — from real sessions. It is privacy-preserving
              (token counts only, never prompt content) and platform-agnostic
              (works with Claude, GPT, Cursor, Copilot).
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
