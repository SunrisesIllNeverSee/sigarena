import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Operator Metrics — Measuring the Human Operating AI",
  description:
    "AI operator metrics measure how humans operate generative AI systems. Learn the SigRank primitives, core metrics, privacy boundary, and what operator metrics do not measure.",
  alternates: { canonical: "/ai-operator-metrics" },
};

const CORE = [
  ["Yield (Υ)", "(cache_read × output) / input²", "Context reuse and output compounded relative to fresh input."],
  ["Leverage", "cache_read / input", "Reusable context amplification relative to fresh input."],
  ["Velocity", "output / input", "Output generated per unit of fresh input."],
  ["SNR", "output / (input + output)", "Output share of the direct input/output exchange."],
  ["10xDEV", "log₁₀(cache_read / input)", "Logarithmic view of context amplification under the reference null policy."],
] as const;

export default function AiOperatorMetricsPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Operator Metrics — Measuring the Human Operating AI",
            "A category guide to operator-layer telemetry and the SigRank measurement framework.",
            "/ai-operator-metrics",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Operator Metrics", path: "/ai-operator-metrics" },
          ]),
          faqSchema([
            {
              question: "What are AI operator metrics?",
              answer:
                "AI operator metrics are measurements of how a human operates an AI system, distinct from measurements of model capability or task correctness. SigRank's draft core uses token telemetry to define Yield, Leverage, Velocity, SNR, and 10xDEV.",
            },
            {
              question: "What data does SigRank need?",
              answer:
                "The core measurement layer uses four token telemetry primitives: input, output, cache write, and cache read. It does not require prompt text, response text, source code, or repository contents.",
            },
            {
              question: "Are operator metrics the same as productivity metrics?",
              answer:
                "No. Operator metrics describe the operator layer. Productivity, task success, code quality, and business value are external outcomes that can be analyzed alongside operator measurements.",
            },
          ])
        ]}
      />

      <header className="text-center py-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Category guide</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">AI Operator Metrics</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Model metrics tell you about the model. Operator metrics describe the human layer that selects, directs, iterates with, and extracts work from that model.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Four portable telemetry primitives</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><strong>Input (I)</strong><p className="text-sm text-muted-foreground">Fresh input tokens.</p></div>
          <div><strong>Output (O)</strong><p className="text-sm text-muted-foreground">Output tokens.</p></div>
          <div><strong>Cache Write (W)</strong><p className="text-sm text-muted-foreground">Tokens written to context cache.</p></div>
          <div><strong>Cache Read (R)</strong><p className="text-sm text-muted-foreground">Tokens reused from context cache.</p></div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">SigRank v0.1 draft core</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CORE.map(([name, formula, description]) => (
            <div key={name} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold">{name}</h3>
              <code className="mt-2 block text-sm text-primary">{formula}</code>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">What operator metrics do not tell you by themselves</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          A token cascade does not independently prove correctness, code quality, task success, employee productivity, hiring suitability, or business ROI. Those are separate outcome layers. Good evaluation joins them without pretending they are the same measurement.
        </p>
      </section>

      <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold">Canonical definitions</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This page is a discovery surface. SignalAF maintains the canonical SigRank Standard draft and public reference implementation.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="https://signalaf.com/standard" className="text-primary hover:underline">SigRank Standard →</Link>
          <Link href="/ai-operator-standard" className="text-primary hover:underline">AI operator standard →</Link>
          <Link href="/operator-evals" className="text-primary hover:underline">Operator evals →</Link>
        </div>
      </section>
    </div>
  );
}
