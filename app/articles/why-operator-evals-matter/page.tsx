import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Why Operator Evals Matter \u2014 The Case for Public AI Operator Evaluation",
  description:
    "Models have public evals. Operators don't. Why public operator evals matter for accountability, hiring, and the future of AI-assisted work.",
  alternates: { canonical: "/articles/why-operator-evals-matter" },
  openGraph: {
    title: "Why Operator Evals Matter \u2014 The Case for Public AI Operator Evaluation",
    description:
      "Models have public evals. Operators don't. Why public operator evals matter for accountability, hiring, and the future of AI-assisted work.",
    url: "https://sigeconomy.com/articles/why-operator-evals-matter",
    type: "article",
  },
};

export default function WhyOperatorEvalsMatterPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <JsonLd
        data={[
          articleSchema(
            "Why Operator Evals Matter \u2014 The Case for Public AI Operator Evaluation",
            "Models have public evals. Operators don't. Why public operator evals matter for accountability, hiring, and the future of AI-assisted work.",
            "/articles/why-operator-evals-matter",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles/why-operator-evals-matter" },
            { name: "Why Operator Evals Matter", path: "/articles/why-operator-evals-matter" },
          ]),
          faqSchema([
            {
              question: "What are operator evals?",
              answer:
                "Operator evals are public evaluations of AI operators — the humans using AI. Unlike model evals that test AI models, operator evals measure how effectively a person uses AI, based on token telemetry from their real sessions.",
            },
            {
              question: "Why do operator evals matter?",
              answer:
                "Operator evals create accountability for AI users. Before public evals, operator skill was vibes. After public evals, it's a measurable, comparable number. The same transparency that public model evals brought to AI labs, public operator evals bring to AI operators.",
            },
            {
              question: "What is the accountability gap?",
              answer:
                "Models have public evals (Vals AI, LMSYS Arena, LiveBench). Operators don't. This creates an accountability gap where operator skill is invisible. Public operator evals close that gap.",
            },
            {
              question: "How do operator evals help with hiring?",
              answer:
                "Companies hiring AI operators can look at public Yield scores instead of take-home assignments. A 6-month Yield history is more reliable than a 2-hour coding test. The leaderboard is the portfolio.",
            },
            {
              question: "Are operator evals private?",
              answer:
                "SigRank collects token counts only — never prompt content, never code, never conversation. The evaluation is public; the work is private. Your Yield score is on the leaderboard; your code is not.",
            },
            {
              question: "What metric do operator evals use?",
              answer:
                "Yield (Υ) = (cache_read × output) / input². It measures token-cascade efficiency — whether signal is compounding or tokens are being burned.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Why Operator Evals Matter</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The case for public AI operator evaluation
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          The accountability gap
        </h2>
        <p>
          Models have Vals AI, LMSYS Arena, LiveBench. Operators have nothing.
          This creates an accountability gap where operator skill is invisible.
        </p>
        <p>
          Public model evals created accountability for AI labs. Before public
          evals, model quality was marketing copy. After public evals, it was
          measurable. Operators deserve the same transparency \u2014 a public,
          comparable number that says &quot;this is how well you use AI.&quot;
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          What operator evals measure
        </h2>
        <p>
          Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2. It measures
          cascade architecture \u2014 whether you&apos;re compounding signal or
          burning tokens. Not how much you spent, but what you got for what you
          spent.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          \u03a5 = (cache_read \u00d7 output) / input\u00b2
        </div>
        <p>
          The square on input means waste is non-linear. Operators who reuse
          context and extract real work score higher. Operators who burn fresh
          tokens on every turn score lower. Yield rewards the cascade, not the
          spend.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          The hiring problem
        </h2>
        <p>
          Companies hiring AI operators rely on take-home tests and vibes.
          Public operator evals replace vibes with data. A 6-month Yield history
          is more reliable than a 2-hour coding test.
        </p>
        <p>
          A take-home test measures performance under artificial pressure for a
          single session. A Yield history measures performance across hundreds
          of real sessions \u2014 the actual cascade architecture the operator
          brings to real work. Hiring on vibes is how you end up with operators
          who talk about AI fluently but burn tokens inefficiently.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          The tooling question
        </h2>
        <p>
          If Claude Code operators consistently out-Yield Cursor operators,
          that&apos;s public data. Tool selection becomes evidence-based.
        </p>
        <p>
          Today, teams pick AI tools based on marketing, hype, and whichever
          influencer shouted loudest this week. Public operator evals turn tool
          selection into a measurable question \u2014 which tool produces the
          best cascade architectures in the hands of real operators doing real
          work.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          Privacy by design
        </h2>
        <p>
          Token counts only. Never prompt content. Never code. The evaluation is
          public; the work is private.
        </p>
        <p>
          SigRank collects telemetry \u2014 input tokens, cache reads, output
          tokens. It never sees what you typed, what the model returned, or what
          code you shipped. The evaluation is public and comparable. The work
          stays yours.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              What are operator evals?
            </h3>
            <p>
              Operator evals are public evaluations of AI operators — the humans using AI. Unlike model evals that test AI models, operator evals measure how effectively a person uses AI, based on token telemetry from their real sessions.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              Why do operator evals matter?
            </h3>
            <p>
              Operator evals create accountability for AI users. Before public evals, operator skill was vibes. After public evals, it&apos;s a measurable, comparable number. The same transparency that public model evals brought to AI labs, public operator evals bring to AI operators.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              What is the accountability gap?
            </h3>
            <p>
              Models have public evals (Vals AI, LMSYS Arena, LiveBench). Operators don&apos;t. This creates an accountability gap where operator skill is invisible. Public operator evals close that gap.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              How do operator evals help with hiring?
            </h3>
            <p>
              Companies hiring AI operators can look at public Yield scores instead of take-home assignments. A 6-month Yield history is more reliable than a 2-hour coding test. The leaderboard is the portfolio.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              Are operator evals private?
            </h3>
            <p>
              SigRank collects token counts only — never prompt content, never code, never conversation. The evaluation is public; the work is private. Your Yield score is on the leaderboard; your code is not.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              What metric do operator evals use?
            </h3>
            <p>
              Yield (Υ) = (cache_read × output) / input². It measures token-cascade efficiency — whether signal is compounding or tokens are being burned.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Get your public operator eval.</p>
        <p className="mt-2 text-white/80">
          Measure your Yield. See your rank. Join the public evaluation.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </div>

      <div className="flex flex-wrap gap-3 justify-center text-sm">
        <Link
          href="/operator-evals"
          className="text-primary hover:underline"
        >
          Operator evals \u2192
        </Link>
        <span className="text-muted-foreground">|</span>
        <Link
          href="/public-operator-evals"
          className="text-primary hover:underline"
        >
          Public operator evals \u2192
        </Link>
        <span className="text-muted-foreground">|</span>
        <Link
          href="/vs/vals-ai"
          className="text-primary hover:underline"
        >
          SigRank vs Vals AI \u2192
        </Link>
      </div>
    </div>
  );
}
