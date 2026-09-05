import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "AI Agent Evaluation — Measuring the Operator Directing the Agent",
  description:
    "AI agent evaluation focuses on the agent. But agents are directed by operators. SigRank measures the operator — the operator directing the AI agent — with public evals ranked by Yield (Υ).",
  alternates: { canonical: "/ai-agent-evaluation" },
  openGraph: {
    title: "AI Agent Evaluation — Measuring the Operator Directing the Agent | SigRank SignalAF",
    description:
      "AI agent evaluation focuses on the agent. SigRank measures the operator — the operator directing the AI agent.",
    url: "https://sigeconomy.com/ai-agent-evaluation",
    type: "website",
  },
};

export default function AiAgentEvaluationPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "AI Agent Evaluation — Measuring the Operator Directing the Agent",
            "AI agent evaluation focuses on the agent. But agents are directed by operators. SigRank measures the operator — the operator directing the AI agent — with public evals ranked by Yield (Υ).",
            "/ai-agent-evaluation",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI Agent Evaluation", path: "/ai-agent-evaluation" },
          ]),
          faqSchema([
            {
              question: "What is AI agent evaluation?",
              answer:
                "AI agent evaluation measures whether an autonomous AI agent achieves its goal end-to-end. Frameworks like SWE-bench, WebArena, and GAIA test agents on real tasks — coding, web navigation, multi-step reasoning. Agent evaluation focuses on the agent's performance, not the operator directing it.",
            },
            {
              question: "Why evaluate the operator, not just the agent?",
              answer:
                "Because agents are directed by operators. An AI agent does not operate in a vacuum — an operator structures its context, defines its tasks, and manages its cascade. Two operators using the same agent can have 100× different Yield. Agent evaluation measures the tool; operator evaluation measures the wielder. Both are needed.",
            },
            {
              question: "How does SigRank evaluate AI agent operators?",
              answer:
                "SigRank evaluates the operator using token telemetry from real sessions with AI agents. Yield (Υ) = (cache_read × output) / input² measures token-cascade efficiency — how well the operator structures context reuse, output extraction, and input minimization. The four token pillars are input, output, cache-read, and cache-write. Token counts only — never prompt content.",
            },
            {
              question: "Is SigRank a replacement for agent evaluation frameworks?",
              answer:
                "No. SigRank is a complement. Agent evaluation frameworks (SWE-bench, WebArena, GAIA) measure whether the agent completes tasks. SigRank measures how effectively the operator directs the agent. Both are needed: agent evals test the tool, operator evals test the wielder. They answer different questions and use different methods.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">AI Agent Evaluation</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AI agent evaluation focuses on the agent — did it complete the task?
          But agents are directed by operators. SigRank measures the operator —
          the operator directing the AI agent — with public, content-free evals.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Agents are tools. Operators wield them.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Agent evaluation measures the tool. Operator evaluation measures the
          wielder. Two operators using the same agent can have 100× different
          Yield. SigRank makes that difference visible.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Agent Evaluation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Measures whether the AI agent achieves its goal end-to-end. Tests
            task completion, reliability, and autonomy.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the AI agent
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> did the
              agent complete the task?
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> SWE-bench,
              WebArena, GAIA
            </li>
            <li>
              <strong className="text-foreground">Method:</strong> task-based
              benchmarks
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">Operator Evaluation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Measures how effectively the operator directs the AI agent.
            Tests cascade architecture, context reuse, and input efficiency.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the
              operator
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> who is the
              best AI operator?
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> SigRank
              (the only one)
            </li>
            <li>
              <strong className="text-foreground">Method:</strong> token
              telemetry — Yield (Υ)
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">The operator is the missing variable</h2>
        <p className="text-muted-foreground">
          Agent evaluation frameworks treat the operator as a constant — the same
          operator, the same prompts, the same context. But in reality, the
          operator is the most important variable. Two operators using the same
          agent, the same model, and similar prompts can have 100× different
          Yield. The difference is the cascade architecture — how the operator
          structures context reuse, output extraction, and input minimization.
        </p>
        <p className="text-muted-foreground">
          SigRank measures that architecture using four token pillars — input,
          output, cache-read, cache-write — and computes Yield (Υ) = (cache_read
          × output) / input². The measurement is privacy-preserving: token
          counts only, never prompt content, never code.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          Υ = (cache_read × output) / input²
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Complementary, not competitive</h2>
        <p className="text-muted-foreground">
          Agent evaluation and operator evaluation are complements, not
          competitors. Agent evaluation tells you whether the tool works.
          Operator evaluation tells you whether the operator is using it well. A
          great agent with a poor operator produces poor results. A poor agent
          with a great operator can still produce good results. You need both
          measurements to understand the full picture.
        </p>
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
          href="/ai-evaluation"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">AI Evaluation</h3>
          <p className="text-sm text-muted-foreground">
            The four layers of AI evaluation and where the operator layer fits.
          </p>
        </Link>
        <Link
          href="/vs/braintrust"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">SigRank vs Braintrust</h3>
          <p className="text-sm text-muted-foreground">
            Public operator evals vs private output evaluation.
          </p>
        </Link>
        <Link
          href="/vs/langfuse"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-1">SigRank vs Langfuse</h3>
          <p className="text-sm text-muted-foreground">
            Public operator evals vs private LLM observability.
          </p>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold">What is AI agent evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              AI agent evaluation measures whether an autonomous AI agent
              achieves its goal end-to-end. Frameworks like SWE-bench,
              WebArena, and GAIA test agents on real tasks — coding, web
              navigation, multi-step reasoning. Agent evaluation focuses on the
              agent&apos;s performance, not the operator directing it.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Why evaluate the operator, not just the agent?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Because agents are directed by operators. An AI agent does not
              operate in a vacuum — an operator structures its context,
              defines its tasks, and manages its cascade. Two operators using
              the same agent can have 100× different Yield. Agent evaluation
              measures the tool; operator evaluation measures the wielder. Both
              are needed.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank evaluate AI agent operators?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank evaluates the operator using token telemetry from
              real sessions with AI agents. Yield (Υ) = (cache_read × output) /
              input² measures token-cascade efficiency — how well the operator
              structures context reuse, output extraction, and input
              minimization. The four token pillars are input, output,
              cache-read, and cache-write. Token counts only — never prompt
              content.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Is SigRank a replacement for agent evaluation frameworks?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              No. SigRank is a complement. Agent evaluation frameworks
              (SWE-bench, WebArena, GAIA) measure whether the agent completes
              tasks. SigRank measures how effectively the operator
              directs the agent. Both are needed: agent evals test the tool,
              operator evals test the wielder. They answer different questions
              and use different methods.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
