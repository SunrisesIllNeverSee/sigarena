import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Privacy-Preserving AI Telemetry — Measure Usage Without Reading Prompts",
  description:
    "How AI operator telemetry can measure token-level operating patterns without requiring prompt text, source code, response content, or repository access.",
  alternates: { canonical: "/privacy-preserving-ai-telemetry" },
};

export default function PrivacyTelemetryPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "Privacy-Preserving AI Telemetry — Measure Usage Without Reading Prompts",
            "A category guide to content-independent AI operator telemetry and the SigRank privacy boundary.",
            "/privacy-preserving-ai-telemetry",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy-Preserving AI Telemetry", path: "/privacy-preserving-ai-telemetry" },
          ]),
          faqSchema([
            {
              question: "Can AI usage be measured without reading employee prompts?",
              answer:
                "Yes. A telemetry system can measure numeric usage characteristics without collecting prompt text. The SigRank draft core uses input, output, cache-write, and cache-read token counts and does not require semantic payloads to calculate its core metrics.",
            },
            {
              question: "Does privacy-preserving telemetry prove productivity?",
              answer:
                "No. Token telemetry describes operator-layer behavior. Productivity, task quality, and business outcomes are external measures that can be joined separately when appropriate.",
            },
          ])
        ]}
      />

      <header className="text-center py-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Data minimization</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Privacy-Preserving AI Telemetry</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Measure the operating pattern without requiring the semantic content of the work.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold">Core telemetry</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Input-token count</li>
            <li>Output-token count</li>
            <li>Cache-write / cache-creation count</li>
            <li>Cache-read count</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Not required for core measurement</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Prompt text</li>
            <li>Response text</li>
            <li>Source code</li>
            <li>Repository contents</li>
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Content independence is a boundary, not a magic guarantee</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Privacy still depends on implementation details such as identity handling, retention, access controls, transport, enrichment, and whether external outcome data is joined later. The important architectural point is that the core operator measurements do not require semantic inspection in the first place.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Use the right layer for the right question</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Content-independent telemetry can answer questions about operating patterns. If an organization needs correctness, code quality, accepted-change data, incidents, or business outcomes, those signals should be added as explicit external layers rather than smuggled into the operator metric.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/ai-operator-metrics" className="text-primary hover:underline">AI operator metrics →</Link>
          <Link href="https://signalaf.com/standard" className="text-primary hover:underline">SigRank Standard →</Link>
        </div>
      </section>
    </div>
  );
}
