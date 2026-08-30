import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Evaluation — The Operator Layer",
  description:
    "AI evaluation has four layers: model, agent, output, and operator. SigRank covers the operator layer with public evals for the humans wielding AI. Ranked by Yield (Υ) — token-cascade efficiency.",
  alternates: { canonical: "/ai-evaluation" },
  openGraph: {
    title: "AI Evaluation — The Operator Layer | SigRank SignalAF",
    description:
      "AI evaluation has four layers. SigRank covers the operator layer — public evals for the humans wielding AI.",
    url: "https://sigeconomy.com/ai-evaluation",
    type: "website",
  },
};

export default function AiEvaluationPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Evaluation — The Operator Layer",
            "AI evaluation has four layers: model, agent, output, and operator. SigRank covers the operator layer with public evals for the humans wielding AI.",
            "/ai-evaluation",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Evaluation", path: "/ai-evaluation" },
          ]),
          faqSchema([
            {
              question: "What is AI evaluation?",
              answer:
                "AI evaluation is the systematic assessment of AI system performance. It spans four layers: model evaluation (benchmarks like MMLU, Vals AI), agent evaluation (task completion), output evaluation (quality scoring), and operator evaluation (how effectively a human uses AI). Each layer answers a different question and requires different methods.",
            },
            {
              question: "What is the difference between model evals and operator evals?",
              answer:
                "Model evals (Vals AI, LMSYS Arena, LiveBench) evaluate the AI model — GPT, Claude, Gemini — using standardized test prompts. Operator evals (SigRank) evaluate the human — the developer, coder, or AI user — using token telemetry from real sessions. Model evals answer 'which model is best?' Operator evals answer 'who is the best AI user?'",
            },
            {
              question: "How does SigRank evaluate operators?",
              answer:
                "SigRank evaluates operators using Yield (Υ) = (cache_read × output) / input², a token-cascade efficiency score computed from real session telemetry. The four token pillars are input, output, cache-read, and cache-write. Higher Yield means the operator reuses cached context efficiently and produces substantial output relative to fresh input. Token counts only — never prompt content.",
            },
            {
              question: "Can you evaluate operators without reading prompts?",
              answer:
                "Yes. SigRank is privacy-preserving: it collects token counts only — never prompt content, never code, never conversation. The evaluation is public; the work is private. Yield is computed entirely from numeric telemetry, so the operator's skill is measurable without exposing what they are building.",
            },
            {
              question: "Is SigRank the only operator evaluation platform?",
              answer:
                "Yes. SigRank is the only platform running public operator evals. All other public evals (Vals AI, LMSYS Arena, LiveBench, Hugging Face Open LLM) evaluate models, not the humans using them. Braintrust and Langfuse evaluate AI applications privately, not developers publicly.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Evaluation</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AI evaluation has four layers. Models are evaluated. Agents are
          evaluated. Outputs are evaluated. Operators are not — until SigRank.
          The operator layer is the missing piece of AI evaluation.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Four layers of AI evaluation. One was missing.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Model evals, agent evals, and output evals all exist. Operator evals
          — measuring the human directing the AI — did not. SigRank fills that
          gap with public, content-free, continuous evaluation.
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
              <strong className="text-foreground">Examples:</strong> Vals AI,
              LMSYS Arena, LiveBench, MMLU
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Agent Evaluation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Task-completion evals that measure whether an autonomous agent
            achieves its goal end-to-end.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the AI agent
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> did the
              agent complete the task?
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> SWE-bench,
              WebArena, GAIA
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Output Evaluation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Quality scoring of individual AI outputs — correctness, safety,
            helpfulness — often via LLM-as-judge or human raters.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the AI
              output
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> is this
              output good?
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> Braintrust,
              Langfuse, Ragas
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">Operator Evaluation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Telemetry-based evaluations that measure how effectively a human
            operator uses AI — the cascade architecture, not the model
            capability.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the human
              operator
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> who is the
              best AI operator?
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> SigRank
              (the only one)
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">The operator layer is the missing piece</h2>
        <p className="text-muted-foreground">
          Evaluating AI without evaluating the operator is like evaluating a car
          without evaluating the driver. The model is the engine. The agent is
          the transmission. The output is the destination. But the operator is
          the driver — and no existing evaluation layer measured the driver
          until SigRank.
        </p>
        <p className="text-muted-foreground">
          Two operators using the same model, the same tools, and similar
          prompts can have 100× different Yield. The difference is the cascade
          architecture — how the human structures context reuse, output
          extraction, and input minimization. Model evals cannot see this.
          Agent evals cannot see this. Output evals cannot see this. Only
          operator evals can.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">How SigRank evaluates operators</h2>
        <p className="text-muted-foreground">
          SigRank measures operators using Yield (Υ), a token-cascade efficiency
          score computed from real session telemetry.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          Υ = (cache_read × output) / input²
        </div>
        <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">Four token pillars:</strong>{" "}
            input, output, cache-read, cache-write. These are the only telemetry
            primitives needed.
          </div>
          <div>
            <strong className="text-foreground">Privacy-preserving:</strong>{" "}
            token counts only — never prompt content, never code, never
            conversation.
          </div>
        </div>
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
          href="/best-ai-user"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">Best AI User Leaderboard</h3>
          <p className="text-sm text-muted-foreground">
            See the top operators ranked by Yield on the public leaderboard.
          </p>
        </Link>
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
          href="/how-it-works"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">How It Works</h3>
          <p className="text-sm text-muted-foreground">
            The full methodology behind Yield, token telemetry, and operator
            measurement.
          </p>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold">What is AI evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              AI evaluation is the systematic assessment of AI system
              performance. It spans four layers: model evaluation (benchmarks
              like MMLU, Vals AI), agent evaluation (task completion), output
              evaluation (quality scoring), and operator evaluation (how
              effectively a human uses AI). Each layer answers a different
              question and requires different methods.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What is the difference between model evals and operator evals?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Model evals (Vals AI, LMSYS Arena, LiveBench) evaluate the AI
              model — GPT, Claude, Gemini — using standardized test prompts.
              Operator evals (SigRank) evaluate the human — the developer,
              coder, or AI user — using token telemetry from real sessions.
              Model evals answer &quot;which model is best?&quot; Operator evals
              answer &quot;who is the best AI user?&quot;
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank evaluate operators?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank evaluates operators using Yield (Υ) = (cache_read ×
              output) / input², a token-cascade efficiency score computed from
              real session telemetry. The four token pillars are input, output,
              cache-read, and cache-write. Higher Yield means the operator
              reuses cached context efficiently and produces substantial output
              relative to fresh input. Token counts only — never prompt content.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Can you evaluate operators without reading prompts?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Yes. SigRank is privacy-preserving: it collects token counts only
              — never prompt content, never code, never conversation. The
              evaluation is public; the work is private. Yield is computed
              entirely from numeric telemetry, so the operator&apos;s skill is
              measurable without exposing what they are building.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Is SigRank the only operator evaluation platform?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Yes. SigRank is the only platform running public operator evals.
              All other public evals (Vals AI, LMSYS Arena, LiveBench, Hugging
              Face Open LLM) evaluate models, not the humans using them.
              Braintrust and Langfuse evaluate AI applications privately, not
              developers publicly.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
