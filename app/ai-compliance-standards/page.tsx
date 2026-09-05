import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Compliance Standards and Operator Evaluation",
  description:
    "NIST AI RMF, EU AI Act require auditable evaluation. SigRank provides governed operator evaluation — public, content-free, continuous. Ranked by Yield (Υ).",
  alternates: { canonical: "/ai-compliance-standards" },
  openGraph: {
    title: "AI Compliance Standards and Operator Evaluation | SigRank SignalAF",
    description:
      "NIST AI RMF, EU AI Act require auditable evaluation. SigRank provides governed operator evaluation.",
    url: "https://sigeconomy.com/ai-compliance-standards",
    type: "website",
  },
};

export default function AiComplianceStandardsPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Compliance Standards and Operator Evaluation",
            "NIST AI RMF, EU AI Act require auditable evaluation. SigRank provides governed operator evaluation — public, content-free, continuous.",
            "/ai-compliance-standards",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Compliance Standards", path: "/ai-compliance-standards" },
          ]),
          faqSchema([
            {
              question: "What are AI compliance standards?",
              answer:
                "AI compliance standards are frameworks and regulations that require organizations to assess, document, and manage AI system risks. Key examples include the NIST AI Risk Management Framework (AI RMF), the EU AI Act, and ISO/IEC 42001. These standards require auditable, continuous evaluation of AI systems. SigRank supports compliance by providing governed, public, continuous operator evaluation under the MO§ES framework.",
            },
            {
              question: "How does SigRank help with AI compliance?",
              answer:
                "SigRank supports the Measure function of the NIST AI RMF by providing governed, continuous, auditable operator evaluation. The MO§ES framework defines the measurement specification, privacy boundaries, and public accountability requirements. SigRank's evaluation is public (auditable), content-free (privacy-compliant), and continuous (not one-time). This makes it suitable for compliance contexts where organizations must demonstrate ongoing evaluation of their AI operators.",
            },
            {
              question: "What is the NIST AI RMF?",
              answer:
                "The NIST AI Risk Management Framework (AI RMF) is a voluntary, non-regulatory framework for managing risks associated with AI systems. It defines four functions: Govern (establish governance), Map (identify risks), Measure (assess and evaluate), and Manage (prioritize and mitigate). The Measure function calls for continuous, auditable evaluation. SigRank directly supports the Measure function for the operator layer.",
            },
            {
              question: "How does SigRank handle privacy compliance?",
              answer:
                "SigRank is privacy-preserving by design. It collects token counts only — the four pillars of input, output, cache-read, and cache-write. It never collects prompt content, response text, source code, or conversation. Yield (Υ) = (cache_read × output) / input² is computed entirely from numeric telemetry. This means SigRank can evaluate operators without creating privacy risks or requiring data processing agreements for sensitive content.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Compliance Standards</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          NIST AI RMF, the EU AI Act, and ISO/IEC 42001 require auditable,
          continuous evaluation of AI systems. SigRank provides governed
          operator evaluation — public, content-free, and continuous.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Compliance requires evaluation. Evaluation requires the operator
          layer.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          NIST AI RMF calls for continuous, auditable evaluation. SigRank
          delivers it for the operator layer — governed by MO§ES, privacy by
          design.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">NIST AI RMF</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A voluntary framework for managing AI risks. Four functions: Govern,
            Map, Measure, Manage.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Relevance:</strong> the
              Measure function requires continuous evaluation
            </li>
            <li>
              <strong className="text-foreground">SigRank role:</strong>{" "}
              governed operator evaluation under MO§ES
            </li>
            <li>
              <strong className="text-foreground">Status:</strong> voluntary,
              non-regulatory
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">EU AI Act</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A regulatory framework for AI in the European Union. Risk-based
            classification with obligations for high-risk systems.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Relevance:</strong>{" "}
              high-risk systems require continuous monitoring and evaluation
            </li>
            <li>
              <strong className="text-foreground">SigRank role:</strong>{" "}
              content-free telemetry avoids data processing risks
            </li>
            <li>
              <strong className="text-foreground">Status:</strong> binding
              regulation
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">ISO/IEC 42001</h2>
          <p className="text-sm text-muted-foreground mb-4">
            An AI management system standard. Provides a certifiable framework
            for AI governance.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Relevance:</strong> requires
              documented evaluation processes
            </li>
            <li>
              <strong className="text-foreground">SigRank role:</strong>{" "}
              auditable, public evaluation records
            </li>
            <li>
              <strong className="text-foreground">Status:</strong>{" "}
              certifiable standard
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">MO§ES Framework</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The governance framework behind SigRank. Defines measurement,
            privacy, and accountability for operator evaluation.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Scope:</strong> operator-layer
              measurement and governance
            </li>
            <li>
              <strong className="text-foreground">Privacy:</strong> content-free
              by design — token counts only
            </li>
            <li>
              <strong className="text-foreground">Accountability:</strong>{" "}
              public, auditable results
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">SigRank and the NIST AI RMF Measure function</h2>
        <p className="text-muted-foreground">
          The NIST AI RMF Measure function calls for &quot;quantitative analysis
          of AI system performance and risk.&quot; SigRank directly supports
          this for the operator layer. It provides quantitative, continuous,
          auditable measurement of how effectively operators use AI — using Yield
          (Υ) = (cache_read × output) / input², computed from four token
          pillars: input, output, cache-read, cache-write.
        </p>
        <p className="text-muted-foreground">
          The measurement is governed by MO§ES, which defines the specification,
          privacy boundaries, and public accountability requirements. This makes
          SigRank suitable for organizations that need to demonstrate ongoing,
          auditable evaluation of their AI operators as part of their compliance
          program.
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
          href="/ai-evaluation-frameworks"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">AI Evaluation Frameworks</h3>
          <p className="text-sm text-muted-foreground">
            From NIST AI RMF to SigRank — the landscape of evaluation
            frameworks.
          </p>
        </Link>
        <Link
          href="/privacy-preserving-ai-telemetry"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">Privacy-Preserving AI Telemetry</h3>
          <p className="text-sm text-muted-foreground">
            How content-free token telemetry enables evaluation without privacy
            risk.
          </p>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold">What are AI compliance standards?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              AI compliance standards are frameworks and regulations that
              require organizations to assess, document, and manage AI system
              risks. Key examples include the NIST AI Risk Management Framework
              (AI RMF), the EU AI Act, and ISO/IEC 42001. These standards
              require auditable, continuous evaluation of AI systems. SigRank
              supports compliance by providing governed, public, continuous
              operator evaluation under the MO§ES framework.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank help with AI compliance?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank supports the Measure function of the NIST AI RMF by
              providing governed, continuous, auditable operator evaluation. The
              MO§ES framework defines the measurement specification, privacy
              boundaries, and public accountability requirements. SigRank&apos;s
              evaluation is public (auditable), content-free (privacy-compliant),
              and continuous (not one-time). This makes it suitable for
              compliance contexts where organizations must demonstrate ongoing
              evaluation of their AI operators.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What is the NIST AI RMF?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              The NIST AI Risk Management Framework (AI RMF) is a voluntary,
              non-regulatory framework for managing risks associated with AI
              systems. It defines four functions: Govern (establish governance),
              Map (identify risks), Measure (assess and evaluate), and Manage
              (prioritize and mitigate). The Measure function calls for
              continuous, auditable evaluation. SigRank directly supports the
              Measure function for the operator layer.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank handle privacy compliance?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank is privacy-preserving by design. It collects token counts
              only — the four pillars of input, output, cache-read, and
              cache-write. It never collects prompt content, response text,
              source code, or conversation. Yield (Υ) = (cache_read × output) /
              input² is computed entirely from numeric telemetry. This means
              SigRank can evaluate operators without creating privacy risks or
              requiring data processing agreements for sensitive content.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
