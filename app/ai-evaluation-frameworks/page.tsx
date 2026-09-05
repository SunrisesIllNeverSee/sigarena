import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Evaluation Frameworks — From Models to Operators",
  description:
    "AI evaluation frameworks from NIST AI RMF to OpenAI Evals to SigRank. SigRank is the framework for the operator layer — public, content-free, governed evaluation of AI operators.",
  alternates: { canonical: "/ai-evaluation-frameworks" },
  openGraph: {
    title: "AI Evaluation Frameworks — From Models to Operators | SigRank SignalAF",
    description:
      "AI evaluation frameworks from NIST AI RMF to SigRank. SigRank is the framework for the operator layer.",
    url: "https://sigeconomy.com/ai-evaluation-frameworks",
    type: "website",
  },
};

export default function AiEvaluationFrameworksPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Evaluation Frameworks — From Models to Operators",
            "AI evaluation frameworks from NIST AI RMF to OpenAI Evals to SigRank. SigRank is the framework for the operator layer — public, content-free, governed evaluation of AI operators.",
            "/ai-evaluation-frameworks",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Evaluation Frameworks", path: "/ai-evaluation-frameworks" },
          ]),
          faqSchema([
            {
              question: "What are AI evaluation frameworks?",
              answer:
                "AI evaluation frameworks are structured methodologies for assessing AI system performance. They range from governance frameworks (NIST AI RMF, EU AI Act) to technical frameworks (OpenAI Evals, DeepEval, Braintrust) to operator frameworks (SigRank). Each framework defines what to measure, how to measure it, and what the results mean.",
            },
            {
              question: "How does SigRank differ from other AI evaluation frameworks?",
              answer:
                "SigRank is the only framework for the operator layer. NIST AI RMF is a governance framework for AI risk management. OpenAI Evals is a framework for model evaluation. DeepEval and Braintrust are frameworks for output evaluation. SigRank evaluates the operator using token telemetry — Yield (Υ) = (cache_read × output) / input² — and is public, content-free, and governed by the MO§ES framework.",
            },
            {
              question: "What is the NIST AI RMF?",
              answer:
                "The NIST AI Risk Management Framework (AI RMF) is a voluntary governance framework for managing risks associated with AI systems. It defines four functions: Govern, Map, Measure, and Manage. The Measure function calls for continuous, auditable evaluation of AI systems. SigRank supports the Measure function by providing governed, continuous operator evaluation.",
            },
            {
              question: "How do I choose an AI evaluation framework?",
              answer:
                "Choose based on what you need to evaluate. For governance and compliance, use NIST AI RMF. For model benchmarking, use OpenAI Evals or Vals AI. For output quality, use DeepEval or Braintrust. For operator evaluation, use SigRank. Most organizations need multiple frameworks — one per layer of the AI evaluation stack.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Evaluation Frameworks</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          From NIST AI RMF to OpenAI Evals to SigRank — the landscape of AI
          evaluation frameworks spans governance, models, outputs, and
          operators. SigRank is the framework for the operator layer.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Every layer has a framework. Except the operator layer — until now.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          NIST AI RMF governs. OpenAI Evals benchmarks models. DeepEval scores
          outputs. SigRank evaluates operators. The stack is now complete.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">NIST AI RMF</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A governance framework for managing AI risks. Defines four
            functions: Govern, Map, Measure, Manage.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Layer:</strong> governance
            </li>
            <li>
              <strong className="text-foreground">Scope:</strong> organizational
              AI risk
            </li>
            <li>
              <strong className="text-foreground">Type:</strong> voluntary,
              non-regulatory
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">OpenAI Evals</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A framework for evaluating AI models on custom and standardized
            tasks. Open-source, extensible, model-agnostic.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Layer:</strong> model
            </li>
            <li>
              <strong className="text-foreground">Scope:</strong> model
              capability
            </li>
            <li>
              <strong className="text-foreground">Type:</strong> technical,
              open-source
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">DeepEval & Braintrust</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Frameworks for evaluating AI outputs — unit-testing for LLM outputs
            and production evaluation pipelines.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Layer:</strong> output
            </li>
            <li>
              <strong className="text-foreground">Scope:</strong> output quality
              and correctness
            </li>
            <li>
              <strong className="text-foreground">Type:</strong> technical,
              CI/CD-integrated
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">SigRank</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The framework for the operator layer. Public, content-free,
            governed by MO§ES. Measures the operator using AI.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Layer:</strong> operator
            </li>
            <li>
              <strong className="text-foreground">Scope:</strong> operator
              skill
            </li>
            <li>
              <strong className="text-foreground">Type:</strong> public,
              governed, continuous
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">SigRank as an evaluation framework</h2>
        <p className="text-muted-foreground">
          SigRank is more than a leaderboard — it is a framework for operator
          evaluation. It defines what to measure (Yield, computed from four
          token pillars: input, output, cache-read, cache-write), how to measure
          it (token telemetry from real sessions, never prompt content), and
          what the results mean (operator skill, ranked publicly with class
          tiers from NOVICE to SINGULARITY).
        </p>
        <p className="text-muted-foreground">
          The framework is governed by MO§ES, which defines the measurement
          specification, privacy boundaries, and public accountability
          requirements. This makes SigRank suitable for compliance contexts
          where auditable, governed evaluation is required.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          Υ = (cache_read × output) / input²
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/ai-operator-standard"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">AI Operator Standard</h3>
          <p className="text-sm text-muted-foreground">
            The Upsilon measurement specification for the operator layer.
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
          href="/ai-operator-metrics"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">AI Operator Metrics</h3>
          <p className="text-sm text-muted-foreground">
            The metrics behind operator evaluation — Yield, Velocity, Leverage,
            and more.
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
            <dt className="font-semibold">What are AI evaluation frameworks?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              AI evaluation frameworks are structured methodologies for assessing
              AI system performance. They range from governance frameworks
              (NIST AI RMF, EU AI Act) to technical frameworks (OpenAI Evals,
              DeepEval, Braintrust) to operator frameworks (SigRank). Each
              framework defines what to measure, how to measure it, and what the
              results mean.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank differ from other AI evaluation frameworks?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank is the only framework for the operator layer. NIST AI RMF
              is a governance framework for AI risk management. OpenAI Evals is
              a framework for model evaluation. DeepEval and Braintrust are
              frameworks for output evaluation. SigRank evaluates the
              operator using token telemetry — Yield (Υ) = (cache_read ×
              output) / input² — and is public, content-free, and governed by
              the MO§ES framework.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What is the NIST AI RMF?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              The NIST AI Risk Management Framework (AI RMF) is a voluntary
              governance framework for managing risks associated with AI
              systems. It defines four functions: Govern, Map, Measure, and
              Manage. The Measure function calls for continuous, auditable
              evaluation of AI systems. SigRank supports the Measure function by
              providing governed, continuous operator evaluation.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How do I choose an AI evaluation framework?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Choose based on what you need to evaluate. For governance and
              compliance, use NIST AI RMF. For model benchmarking, use OpenAI
              Evals or Vals AI. For output quality, use DeepEval or Braintrust.
              For operator evaluation, use SigRank. Most organizations need
              multiple frameworks — one per layer of the AI evaluation stack.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
