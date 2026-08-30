import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Evaluator — What SigRank Does Differently",
  description:
    "An AI evaluator assesses AI performance. SigRank is an AI evaluator for the operator layer — public, content-free, continuous, governed. Ranked by Yield (Υ) = (cache_read × output) / input².",
  alternates: { canonical: "/ai-evaluator" },
  openGraph: {
    title: "AI Evaluator — What SigRank Does Differently | SigRank SignalAF",
    description:
      "SigRank is an AI evaluator for the operator layer — public, content-free, continuous, governed.",
    url: "https://sigeconomy.com/ai-evaluator",
    type: "website",
  },
};

export default function AiEvaluatorPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Evaluator — What SigRank Does Differently",
            "An AI evaluator assesses AI performance. SigRank is an AI evaluator for the operator layer — public, content-free, continuous, governed.",
            "/ai-evaluator",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Evaluator", path: "/ai-evaluator" },
          ]),
          faqSchema([
            {
              question: "What is an AI evaluator?",
              answer:
                "An AI evaluator is a system or platform that assesses AI performance. AI evaluators exist at multiple layers: model evaluators (Vals AI, LMSYS Arena) test AI models on benchmarks, output evaluators (Braintrust, Langfuse) score individual outputs, and operator evaluators (SigRank) measure the human using AI. Each type of evaluator answers a different question.",
            },
            {
              question: "What makes SigRank different as an AI evaluator?",
              answer:
                "SigRank is the only AI evaluator for the operator layer. Every other public evaluator assesses the AI model or the AI output. SigRank assesses the human operator using token telemetry — Yield (Υ) = (cache_read × output) / input² — from real sessions. It is public (not private), content-free (token counts only, never prompts), continuous (not one-time), and governed (by the MO§ES framework).",
            },
            {
              question: "What are SigRank's five core capabilities as an AI evaluator?",
              answer:
                "SigRank's five capabilities: (1) Public — results are visible on a public leaderboard, not locked in a private dashboard. (2) Content-free — token counts only, never prompt content or code. (3) Continuous — evaluation runs from real session telemetry, not one-time tests. (4) Governed — the MO§ES framework defines measurement, privacy, and accountability. (5) Platform-agnostic — works with Claude, GPT, Cursor, Copilot, and any tool that produces token telemetry.",
            },
            {
              question: "How do I get evaluated by SigRank?",
              answer:
                "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield (Υ), your rank, and your operator class. Token counts only — never prompt content, never code. The score is public; the work is private. Works with Claude, ChatGPT, Cursor, Copilot, and other AI coding tools.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Evaluator</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          An AI evaluator assesses AI performance. SigRank is an AI evaluator
          for the operator layer — the only one that evaluates the human, not
          the model or the output.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Every AI layer has an evaluator. Except the operator layer — until
          SigRank.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Vals AI evaluates models. Braintrust evaluates outputs. SigRank
          evaluates operators. The evaluation stack is now complete.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Five capabilities that make SigRank different</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">1. Public.</strong>{" "}
            Results are visible on a public leaderboard, not locked in a
            private dashboard. Anyone can see the rankings. This creates
            accountability — what gets measured publicly gets better publicly.
          </p>
          <p>
            <strong className="text-foreground">2. Content-free.</strong>{" "}
            Token counts only — never prompt content, never code, never
            conversation. The four token pillars (input, output, cache-read,
            cache-write) are sufficient to compute Yield without exposing what
            the operator is building.
          </p>
          <p>
            <strong className="text-foreground">3. Continuous.</strong>{" "}
            Evaluation runs from real session telemetry, not one-time test
            suites. The operator&apos;s skill is measured as it evolves, in
            production, over time.
          </p>
          <p>
            <strong className="text-foreground">4. Governed.</strong>{" "}
            The MO§ES framework defines the measurement specification, privacy
            boundaries, and public accountability requirements. This makes
            SigRank suitable for compliance contexts.
          </p>
          <p>
            <strong className="text-foreground">5. Platform-agnostic.</strong>{" "}
            Works with Claude, GPT, Gemini, Cursor, Copilot, Windsurf, Codex,
            and any AI tool that produces token telemetry. Yield measures the
            human&apos;s cascade architecture, not the model&apos;s capability.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">The evaluation metric</h2>
        <p className="text-muted-foreground">
          SigRank evaluates operators using Yield (Υ), a token-cascade
          efficiency score.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          Υ = (cache_read × output) / input²
        </div>
        <div className="grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">cache_read</strong> — rewards
            context reuse. Operators who build on prior turns score higher.
          </div>
          <div>
            <strong className="text-foreground">output</strong> — rewards
            productive generation. Operators who extract real work score
            higher.
          </div>
          <div>
            <strong className="text-foreground">input²</strong> — penalizes
            fresh input. The square means waste is non-linear.
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
          href="/ai-evaluation"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">AI Evaluation</h3>
          <p className="text-sm text-muted-foreground">
            The four layers of AI evaluation and where the operator layer fits.
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
            <dt className="font-semibold">What is an AI evaluator?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              An AI evaluator is a system or platform that assesses AI
              performance. AI evaluators exist at multiple layers: model
              evaluators (Vals AI, LMSYS Arena) test AI models on benchmarks,
              output evaluators (Braintrust, Langfuse) score individual outputs,
              and operator evaluators (SigRank) measure the human using AI. Each
              type of evaluator answers a different question.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What makes SigRank different as an AI evaluator?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank is the only AI evaluator for the operator layer. Every
              other public evaluator assesses the AI model or the AI output.
              SigRank assesses the human operator using token telemetry — Yield
              (Υ) = (cache_read × output) / input² — from real sessions. It is
              public (not private), content-free (token counts only, never
              prompts), continuous (not one-time), and governed (by the MO§ES
              framework).
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What are SigRank&apos;s five core capabilities as an AI evaluator?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank&apos;s five capabilities: (1) Public — results are visible
              on a public leaderboard, not locked in a private dashboard. (2)
              Content-free — token counts only, never prompt content or code.
              (3) Continuous — evaluation runs from real session telemetry, not
              one-time tests. (4) Governed — the MO§ES framework defines
              measurement, privacy, and accountability. (5) Platform-agnostic —
              works with Claude, GPT, Cursor, Copilot, and any tool that
              produces token telemetry.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How do I get evaluated by SigRank?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Visit signalaf.com/score to enroll and submit your token
              telemetry. SigRank will compute your Yield (Υ), your rank, and
              your operator class. Token counts only — never prompt content,
              never code. The score is public; the work is private. Works with
              Claude, ChatGPT, Cursor, Copilot, and other AI coding tools.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
