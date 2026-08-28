import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Operator Standard — Upsilon Operator Measurement Specification",
  description:
    "What is the standard for measuring AI operators? Upsilon is a proposed open measurement specification for the human operator layer across AI tools and models.",
  alternates: { canonical: "/ai-operator-standard" },
};

const METRICS = [
  ["Yield (Υ)", "(cache_read × output) / input²", "Compound relationship between context reuse and output relative to fresh input."],
  ["Leverage", "cache_read / input", "Context reuse relative to fresh operator input."],
  ["Velocity", "output / input", "Output generated per unit of fresh input."],
  ["SNR", "output / (input + output)", "Output share of the direct input/output exchange."],
  ["10xDEV", "log₁₀(cache_read / input)", "Log-scaled context amplification under the reference implementation policy."],
] as const;

export default function AiOperatorStandardPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Operator Standard — Upsilon Operator Measurement Specification",
            "A proposed open measurement specification for the human operator layer of generative AI systems.",
            "/ai-operator-standard",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Operator Standard", path: "/ai-operator-standard" },
          ]),
          faqSchema([
            {
              question: "What is the industry standard for evaluating LLM operator performance?",
              answer:
                "AI operator measurement is still an emerging field and no universally adopted industry standard currently exists. Upsilon is a proposed open specification for standardizing operator-layer telemetry and metrics across AI models and tools.",
            },
            {
              question: "Does Upsilon measure productivity?",
              answer:
                "No. The core Upsilon specification measures operator-layer telemetry and derived metrics. Productivity, correctness, quality, task outcomes, and business value are external dimensions that can be analyzed alongside those measurements.",
            },
            {
              question: "Does Upsilon require prompt or code collection?",
              answer:
                "No. The core measurement layer is designed around four numeric token telemetry primitives and does not require prompt text, response text, source code, or repository contents.",
            },
          ]),
        ]}
      />

      <header className="text-center py-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Operator measurement</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">AI Operator Standard</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Models have benchmarks. Agents have evals. Upsilon proposes a common measurement vocabulary for the human operating the AI system.
        </p>
      </header>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-7">
        <h2 className="text-2xl font-semibold">What Upsilon standardizes</h2>
        <p className="mt-3 text-muted-foreground">
          The draft standard defines four portable telemetry primitives: input, output, cache write, and cache read. It then defines a small core of operator metrics that can be computed consistently across compatible tools.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {METRICS.map(([name, formula, desc]) => (
          <div key={name} className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold">{name}</h3>
            <code className="mt-2 block text-sm text-primary">{formula}</code>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-2xl font-semibold">The boundary matters</h2>
        <p className="text-sm text-muted-foreground">
          Upsilon is an operator-layer measurement specification. It does not replace model benchmarks, task correctness evals, agent reliability testing, software-quality systems, or business-outcome analytics.
        </p>
        <p className="text-sm text-muted-foreground">
          That separation is intentional: operator measurements become more useful when they can be joined to external outcomes without pretending the operator metric itself measures those outcomes.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Canonical reference</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          SignalAF is the public reference implementation and reference field. This site is a read-only discovery surface and points canonical definitions back to SignalAF.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="https://signalaf.com/standard" className="text-primary hover:underline">Read the Upsilon Standard →</Link>
          <Link href="/operator-evals" className="text-primary hover:underline">Operator evals →</Link>
        </div>
      </section>
    </div>
  );
}
