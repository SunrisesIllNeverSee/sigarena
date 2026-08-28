import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import {
  SIGRANK_CORE_METRICS,
  SIGRANK_CORE_TELEMETRY,
} from "@/lib/sigrank-standard";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Operator Metrics — Measuring the Human Operating AI",
  description:
    "How do you measure AI token efficiency privately? Learn Upsilon's four numeric primitives, five portable metrics, privacy boundary, and SigRank proof surface.",
  alternates: { canonical: "/ai-operator-metrics" },
};

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
                "AI operator metrics describe how a human operates an AI system, distinct from model capability or task correctness. Upsilon uses token telemetry to calculate Yield, Leverage, Velocity, SNR, and 10xDEV.",
            },
            {
              question: "What data does Upsilon need?",
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
          {SIGRANK_CORE_TELEMETRY.map((primitive) => (
            <div key={primitive.key}>
              <strong>{primitive.name} ({primitive.symbol})</strong>
              <p className="text-sm text-muted-foreground">{primitive.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">SigRank v0.1 draft core</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SIGRANK_CORE_METRICS.map((metric) => (
            <div key={metric.key} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold">{metric.name}</h3>
              <code className="mt-2 block text-sm text-primary">{metric.formula}</code>
              <p className="mt-2 text-sm text-muted-foreground">{metric.description}</p>
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
          This page is a discovery surface. Upsilon is the SignalAF measurement engine; SigRank is the public leaderboard and proof surface. The compatibility record remains versioned as sigrank/0.1-draft.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="https://signalaf.com/standard" className="text-primary hover:underline">SigRank Standard →</Link>
          <Link href="https://signalaf.com/upsilon" className="text-primary hover:underline">Upsilon →</Link>
          <Link href="/ai-operator-standard" className="text-primary hover:underline">AI operator standard →</Link>
          <Link href="/operator-evals" className="text-primary hover:underline">Operator evals →</Link>
        </div>
      </section>
    </div>
  );
}
