import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Evaluation Platform — SigRank SignalAF",
  description:
    "SigRank is an AI evaluation platform for operators. Public, content-free, continuous, governed. Ranked by Yield (Υ) = (cache_read × output) / input². Integrate via API and MCP.",
  alternates: { canonical: "/ai-evaluation-platform" },
  openGraph: {
    title: "AI Evaluation Platform — SigRank SignalAF",
    description:
      "SigRank is an AI evaluation platform for operators. Public, content-free, continuous, governed.",
    url: "https://sigeconomy.com/ai-evaluation-platform",
    type: "website",
  },
};

export default function AiEvaluationPlatformPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Evaluation Platform — SigRank SignalAF",
            "SigRank is an AI evaluation platform for operators. Public, content-free, continuous, governed. Ranked by Yield (Υ) = (cache_read × output) / input².",
            "/ai-evaluation-platform",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Evaluation Platform", path: "/ai-evaluation-platform" },
          ]),
          faqSchema([
            {
              question: "What is an AI evaluation platform?",
              answer:
                "An AI evaluation platform is a system that systematically assesses AI performance at scale. It defines what to measure, how to measure it, and how to present results. Existing platforms evaluate models (Vals AI, LMSYS Arena) or outputs (Braintrust, Langfuse). SigRank is the only AI evaluation platform for the operator layer — measuring operators using AI.",
            },
            {
              question: "How is SigRank different from other AI evaluation platforms?",
              answer:
                "SigRank is the only platform that evaluates operators, not models or outputs. It is public (results on a public leaderboard), content-free (token counts only, never prompt content), continuous (real session telemetry, not one-time tests), and governed (by the MO§ES framework). Other platforms are either private (Braintrust, Langfuse) or model-focused (Vals AI, LMSYS Arena).",
            },
            {
              question: "How does SigRank protect privacy?",
              answer:
                "SigRank is privacy-preserving by design. It collects token counts only — the four pillars of input, output, cache-read, and cache-write. It never collects prompt content, response text, source code, or conversation. Yield (Υ) = (cache_read × output) / input² is computed entirely from numeric telemetry. The evaluation is public; the work is private.",
            },
            {
              question: "How do I integrate with the SigRank platform?",
              answer:
                "SigRank reads from signalaf.com's public API. Developers can access leaderboard data, operator profiles, and metrics programmatically. An MCP server is also available for AI-assisted integration. Visit signalaf.com/score to enroll as an operator and submit token telemetry. See the developers page for API documentation and the MCP page for the model context protocol server.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Evaluation Platform</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          SigRank is an AI evaluation platform for operators. Public,
          content-free, continuous, and governed — the only platform that
          evaluates the operator, not the model or the output.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          The only AI evaluation platform for operators.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Other platforms evaluate models or outputs. SigRank evaluates
          operators — operators wielding AI — with public, governed, continuous
          evals.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Public</h2>
          <p className="text-sm text-muted-foreground">
            Results are visible on a public leaderboard, not locked in a private
            dashboard. Anyone can see the rankings, the Yield scores, and the
            operator class tiers. What gets measured publicly gets better
            publicly.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Content-free</h2>
          <p className="text-sm text-muted-foreground">
            Token counts only — never prompt content, never code, never
            conversation. The four token pillars (input, output, cache-read,
            cache-write) are sufficient to compute Yield without exposing what
            the operator is building.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Continuous</h2>
          <p className="text-sm text-muted-foreground">
            Evaluation runs from real session telemetry, not one-time test
            suites. The operator&apos;s skill is measured as it evolves, in
            production, over time. The leaderboard updates continuously.
          </p>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">Governed</h2>
          <p className="text-sm text-muted-foreground">
            The MO§ES framework defines the measurement specification, privacy
            boundaries, and public accountability requirements. This makes
            SigRank suitable for compliance contexts where auditable evaluation
            is required.
          </p>
        </div>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Platform architecture</h2>
        <p className="text-muted-foreground">
          SigRank is a read-only satellite leaderboard site that reads from
          signalaf.com&apos;s public API. The architecture is: MO§ES (governance
          framework) → Upsilon (measurement engine) → SigRank (public
          leaderboard) | SignalAF (public distribution). This site is the
          discovery surface; signalaf.com is the canonical source.
        </p>
        <p className="text-muted-foreground">
          The platform is platform-agnostic — it works with Claude, GPT,
          Gemini, Cursor, Copilot, Windsurf, Codex, and any AI tool that
          produces token telemetry. Yield measures the operator&apos;s cascade
          architecture, not the model&apos;s capability.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          Υ = (cache_read × output) / input²
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
          href="/developers"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">Developers</h3>
          <p className="text-sm text-muted-foreground">
            API documentation and developer resources for integrating with
            SigRank.
          </p>
        </Link>
        <Link
          href="/mcp"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">MCP Server</h3>
          <p className="text-sm text-muted-foreground">
            Model Context Protocol server for AI-assisted integration with
            SigRank.
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
            <dt className="font-semibold">What is an AI evaluation platform?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              An AI evaluation platform is a system that systematically assesses
              AI performance at scale. It defines what to measure, how to
              measure it, and how to present results. Existing platforms
              evaluate models (Vals AI, LMSYS Arena) or outputs (Braintrust,
              Langfuse). SigRank is the only AI evaluation platform for the
              operator layer — measuring operators using AI.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How is SigRank different from other AI evaluation platforms?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank is the only platform that evaluates operators, not models
              or outputs. It is public (results on a public leaderboard),
              content-free (token counts only, never prompt content), continuous
              (real session telemetry, not one-time tests), and governed (by the
              MO§ES framework). Other platforms are either private (Braintrust,
              Langfuse) or model-focused (Vals AI, LMSYS Arena).
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank protect privacy?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank is privacy-preserving by design. It collects token counts
              only — the four pillars of input, output, cache-read, and
              cache-write. It never collects prompt content, response text,
              source code, or conversation. Yield (Υ) = (cache_read × output) /
              input² is computed entirely from numeric telemetry. The
              evaluation is public; the work is private.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How do I integrate with the SigRank platform?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank reads from signalaf.com&apos;s public API. Developers can
              access leaderboard data, operator profiles, and metrics
              programmatically. An MCP server is also available for AI-assisted
              integration. Visit signalaf.com/score to enroll as an operator and
              submit token telemetry. See the developers page for API
              documentation and the MCP page for the model context protocol
              server.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
