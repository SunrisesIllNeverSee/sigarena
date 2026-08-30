import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Evaluating AI — The Operator Layer Is the Missing Piece",
  description:
    "Evaluating AI without evaluating the operator is like evaluating a car without evaluating the driver. SigRank fills the gap with public operator evals ranked by Yield (Υ).",
  alternates: { canonical: "/evaluating-ai" },
  openGraph: {
    title: "Evaluating AI — The Operator Layer Is the Missing Piece | SigRank SignalAF",
    description:
      "Evaluating AI without evaluating the operator is like evaluating a car without evaluating the driver. SigRank fills the gap.",
    url: "https://sigeconomy.com/evaluating-ai",
    type: "website",
  },
};

export default function EvaluatingAiPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "Evaluating AI — The Operator Layer Is the Missing Piece",
            "Evaluating AI without evaluating the operator is like evaluating a car without evaluating the driver. SigRank fills the gap with public operator evals ranked by Yield (Υ).",
            "/evaluating-ai",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Evaluating AI", path: "/evaluating-ai" },
          ]),
          faqSchema([
            {
              question: "What does evaluating AI mean?",
              answer:
                "Evaluating AI means systematically assessing AI system performance. It includes model evaluation (benchmarks like MMLU, Vals AI), agent evaluation (task completion), output evaluation (quality scoring), and operator evaluation (how effectively a human uses AI). Evaluating AI is not one thing — it is a stack of evaluations, one per layer.",
            },
            {
              question: "Why is the operator layer missing from AI evaluation?",
              answer:
                "Because measuring the human requires different telemetry than measuring the model. Model evals use standardized test prompts. Output evals use LLM-as-judge. But evaluating the operator requires token telemetry from real sessions — input, output, cache-read, cache-write — which no existing framework collected and analyzed publicly. SigRank is the first to do so.",
            },
            {
              question: "How does SigRank fill the gap?",
              answer:
                "SigRank fills the operator layer gap with public, content-free, continuous evaluation. It measures operators using Yield (Υ) = (cache_read × output) / input², computed from four token pillars: input, output, cache-read, cache-write. Token counts only — never prompt content. The evaluation is public; the work is private. Operators are ranked on a public leaderboard with class tiers from NOVICE to SINGULARITY.",
            },
            {
              question: "Is evaluating the operator really necessary?",
              answer:
                "Yes. Two operators using the same model, the same tools, and similar prompts can have 100× different Yield. The difference is the cascade architecture — how the human structures context reuse, output extraction, and input minimization. Model evals cannot see this. Agent evals cannot see this. Output evals cannot see this. Without operator evaluation, you are evaluating the car but not the driver.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Evaluating AI</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Evaluating AI without evaluating the operator is like evaluating a car
          without evaluating the driver. The operator layer is the missing
          piece — and SigRank fills it.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          You evaluate the engine. You evaluate the transmission. You evaluate
          the destination. But who evaluates the driver?
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          The model is the engine. The agent is the transmission. The output is
          the destination. The operator is the driver. SigRank evaluates the
          driver.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">The analogy</h2>
        <p className="text-muted-foreground">
          Evaluating AI without evaluating the operator is like evaluating a car
          without evaluating the driver. You can measure the engine&apos;s
          horsepower (model evals), the transmission&apos;s gear ratios (agent
          evals), and whether the car arrived at the right destination (output
          evals). But if you never measure the driver, you miss the most
          important variable.
        </p>
        <p className="text-muted-foreground">
          Two drivers in the same car on the same track can post very different
          lap times. The difference is the driver&apos;s skill — how they brake,
          how they corner, how they manage momentum. In AI, two operators using
          the same model and the same tools can have 100× different Yield. The
          difference is the cascade architecture — how the human structures
          context reuse, output extraction, and input minimization.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">How SigRank fills the gap</h2>
        <p className="text-muted-foreground">
          SigRank evaluates operators using Yield (Υ), a token-cascade
          efficiency score computed from real session telemetry.
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
          <div>
            <strong className="text-foreground">Public:</strong> results on a
            public leaderboard with class tiers from NOVICE to SINGULARITY.
          </div>
          <div>
            <strong className="text-foreground">Continuous:</strong> measured
            from real sessions, not one-time tests.
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/ai-evaluation"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">AI Evaluation</h3>
          <p className="text-sm text-muted-foreground">
            The four layers of AI evaluation and where the operator layer fits.
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
            <dt className="font-semibold">What does evaluating AI mean?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Evaluating AI means systematically assessing AI system
              performance. It includes model evaluation (benchmarks like MMLU,
              Vals AI), agent evaluation (task completion), output evaluation
              (quality scoring), and operator evaluation (how effectively a
              human uses AI). Evaluating AI is not one thing — it is a stack of
              evaluations, one per layer.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Why is the operator layer missing from AI evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Because measuring the human requires different telemetry than
              measuring the model. Model evals use standardized test prompts.
              Output evals use LLM-as-judge. But evaluating the operator
              requires token telemetry from real sessions — input, output,
              cache-read, cache-write — which no existing framework collected
              and analyzed publicly. SigRank is the first to do so.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank fill the gap?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank fills the operator layer gap with public, content-free,
              continuous evaluation. It measures operators using Yield (Υ) =
              (cache_read × output) / input², computed from four token pillars:
              input, output, cache-read, cache-write. Token counts only — never
              prompt content. The evaluation is public; the work is private.
              Operators are ranked on a public leaderboard with class tiers
              from NOVICE to SINGULARITY.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Is evaluating the operator really necessary?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Yes. Two operators using the same model, the same tools, and
              similar prompts can have 100× different Yield. The difference is
              the cascade architecture — how the human structures context reuse,
              output extraction, and input minimization. Model evals cannot see
              this. Agent evals cannot see this. Output evals cannot see this.
              Without operator evaluation, you are evaluating the car but not
              the driver.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
