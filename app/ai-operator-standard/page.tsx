import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { SIGRANK_CORE_METRICS, SIGRANK_CORE_TELEMETRY } from "@/lib/sigrank-standard";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Operator Standard — TTEOP Open Telemetry Protocol | SigArena",
  description:
    "TTEOP is the open, vendor-neutral interoperability protocol for measuring AI operator token efficiency. Upsilon is the SignalAF measurement engine that implements it.",
  alternates: { canonical: "/ai-operator-standard" },
};

export default function AiOperatorStandardPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Operator Standard — TTEOP Open Telemetry Protocol",
            "TTEOP is the open, vendor-neutral interoperability protocol for measuring AI operator token efficiency. Upsilon is the SignalAF measurement engine that implements it.",
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
                "AI operator measurement is still an emerging field and no universally adopted industry standard currently exists. TTEOP (Token Telemetry Evaluation Operator Protocol) is an open, vendor-neutral interoperability protocol for the token telemetry / AI operator measurement layer. Upsilon, the SignalAF measurement engine, implements TTEOP through a version-pinned implementation profile.",
            },
            {
              question: "What is TTEOP?",
              answer:
                "TTEOP (Token Telemetry Evaluation Operator Protocol) is the sole interoperability protocol authority for the token telemetry / AI operator measurement layer. It defines four non-negative integer telemetry primitives (input, output, cache write, cache read), five derived metrics, a telemetry envelope schema, privacy modes, provenance levels, conformance tests, and a governance process.",
            },
            {
              question: "What is Upsilon?",
              answer:
                "Upsilon is the SignalAF commercial measurement engine / enterprise product. It consumes privacy-preserving AI usage telemetry and produces diagnostic measures of AI processing behavior. Upsilon implements TTEOP and may add product-specific extensions, but may not redefine TTEOP semantics.",
            },
            {
              question: "Does Upsilon measure productivity?",
              answer:
                "No. Upsilon measures operator-layer token-flow relationships. Productivity, correctness, quality, task outcomes, and business value are external dimensions that can be analyzed alongside those measurements but are not what the metrics themselves measure.",
            },
            {
              question: "Does TTEOP require prompt or code collection?",
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
          Models have benchmarks. Agents have evals. TTEOP defines the open
          protocol for measuring the operator layer. Upsilon implements it.
        </p>
      </header>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-7 space-y-3">
        <h2 className="text-2xl font-semibold">The architecture</h2>
        <p className="text-muted-foreground">
          The ecosystem follows a layered architecture:
          <strong className="text-foreground"> MO§ES → Upsilon → SigRank | SignalAF</strong>.
        </p>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li><strong className="text-foreground">TTEOP</strong> — the open, vendor-neutral interoperability protocol. Defines the telemetry primitives, metrics, envelope schema, privacy modes, and conformance tests.</li>
          <li><strong className="text-foreground">Upsilon</strong> — the SignalAF measurement engine. Implements TTEOP, consumes telemetry, and produces diagnostic measures.</li>
          <li><strong className="text-foreground">SigRank / SigArena</strong> — the public leaderboard / proof surface. Displays results.</li>
          <li><strong className="text-foreground">SignalAF</strong> — the public distribution and platform brand.</li>
          <li><strong className="text-foreground">MO§ES™</strong> — the governance framework.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          TTEOP is the sole protocol authority. Products (SignalAF, SigRank,
          Upsilon) implement TTEOP through version-pinned implementation
          profiles and may not redefine TTEOP semantics. The legacy
          predecessor sigrank-standard (sigrank/0.1-draft) is retained only
          for backward compatibility and migration evidence.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-7 space-y-3">
        <h2 className="text-2xl font-semibold">What TTEOP defines</h2>
        <p className="text-muted-foreground">
          The protocol defines four portable telemetry primitives:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SIGRANK_CORE_TELEMETRY.map((t) => (
            <div key={t.key} className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground pt-2">
          From these primitives, TTEOP defines a small core of operator
          metrics that can be computed consistently across compatible tools:
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {SIGRANK_CORE_METRICS.map((m) => (
          <div key={m.key} className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-semibold">{m.name}</h3>
            <code className="mt-2 block text-sm text-primary">{m.formula}</code>
            <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card p-6 space-y-3">
        <h2 className="text-2xl font-semibold">The boundary matters</h2>
        <p className="text-sm text-muted-foreground">
          TTEOP and Upsilon measure operator-layer token-flow relationships.
          They do not replace model benchmarks, task correctness evals, agent
          reliability testing, software-quality systems, or business-outcome
          analytics.
        </p>
        <p className="text-sm text-muted-foreground">
          That separation is intentional: operator measurements become more
          useful when they can be joined to external outcomes without
          pretending the operator metric itself measures those outcomes.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Canonical references</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          TTEOP is maintained in the tteop-spec repository. SignalAF is the
          public reference implementation. This site is a read-only discovery
          surface and points canonical definitions back to the protocol and
          platform.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="https://github.com/SunrisesIllNeverSee/tteop-spec" className="text-primary hover:underline">TTEOP protocol (tteop-spec) →</Link>
          <Link href="https://signalaf.com/methodology" className="text-primary hover:underline">SignalAF methodology →</Link>
          <Link href="/operator-evals" className="text-primary hover:underline">Operator evals →</Link>
          <Link href="/ai-operator-metrics" className="text-primary hover:underline">Operator metrics →</Link>
        </div>
      </section>
    </div>
  );
}
