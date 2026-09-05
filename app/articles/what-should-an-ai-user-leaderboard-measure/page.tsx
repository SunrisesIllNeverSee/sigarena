import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "What Should an AI User Leaderboard Measure? Usage Volume vs Efficiency",
  description:
    "Token volume, cost, activity, output/input ratios, context reuse, Yield, privacy, provenance, gaming resistance, and measurement limitations compared. What should an AI user leaderboard actually measure?",
  alternates: { canonical: "/articles/what-should-an-ai-user-leaderboard-measure" },
  openGraph: {
    title: "What Should an AI User Leaderboard Measure? Usage Volume vs Efficiency",
    description:
      "Comparing token volume, cost, activity, efficiency, Yield, privacy, provenance, and gaming resistance for AI user leaderboards.",
    url: "https://sigeconomy.com/articles/what-should-an-ai-user-leaderboard-measure",
    type: "article",
  },
};

const MEASURES = [
  {
    name: "Token volume",
    what: "Total input + output + cache tokens consumed.",
    pros: "Easy to measure. Correlates with activity and spend.",
    cons: "Rewards spending, not skill. A user who burns tokens inefficiently ranks highly. No efficiency signal.",
  },
  {
    name: "Cost",
    what: "Total dollar spend on AI API calls.",
    pros: "Directly tied to budget. Useful for cost management.",
    cons: "Depends on pricing tiers, model selection, and provider. Not portable across tools. Rewards spending.",
  },
  {
    name: "Activity",
    what: "Session count, message count, or time spent.",
    pros: "Simple. Shows engagement.",
    cons: "Does not distinguish productive use from idle churn. A user with many low-quality sessions ranks highly.",
  },
  {
    name: "Output / input ratio",
    what: "Output tokens divided by input tokens.",
    pros: "Captures how much an operator produces relative to what they feed in.",
    cons: "Ignores context reuse. An operator who reuses cached context efficiently may have a low ratio because cache reads are not counted as input.",
  },
  {
    name: "Context reuse",
    what: "Cache-read tokens relative to fresh input.",
    pros: "Rewards operators who build on prior context rather than re-prompting from scratch.",
    cons: "Does not account for output volume. High reuse with low output is not necessarily efficient.",
  },
  {
    name: "Yield (Υ)",
    what: "(cache_read × output) / input². Token-cascade efficiency.",
    pros: "Combines context reuse and output production into a single metric. Rewards operators who reuse cached context and produce substantial output relative to fresh input. Does not reward raw spending.",
    cons: "Measures a token-flow relationship, not productivity, quality, or skill. Can be gamed by inflating cache reads or output. Does not capture task correctness or business value.",
  },
];

const DIMENSIONS = [
  {
    name: "Privacy",
    question: "Does the metric require prompt content or code?",
    answer: "Yield and raw token metrics use only token counts. They do not require prompt text, response text, source code, or transcripts. This is a privacy boundary, not a guarantee of zero metadata risk.",
  },
  {
    name: "Provenance",
    question: "Can the telemetry be verified?",
    answer: "Signed, server-verifiable token telemetry provides provenance. Without it, self-reported token counts are unverifiable. TTEOP (Token Telemetry Evaluation Operator Protocol) defines the telemetry envelope and provenance levels.",
  },
  {
    name: "Gaming resistance",
    question: "Can the metric be manipulated?",
    answer: "Every metric can be gamed. Token volume can be inflated by running pointless sessions. Yield can be inflated by manufacturing cache reads or output. Signed telemetry and outlier detection reduce but do not eliminate gaming. No metric is fully gaming-proof.",
  },
  {
    name: "Measurement limitations",
    question: "What does the metric not capture?",
    answer: "Token-cascade metrics do not measure correctness, novelty, user satisfaction, economic value, code quality, safety, talent, effort, intelligence, productivity, professional skill, task correctness, employee performance, or business value. They measure a token-flow relationship.",
  },
];

export default function WhatShouldItMeasurePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <JsonLd
        data={[
          articleSchema(
            "What Should an AI User Leaderboard Measure? Usage Volume vs Efficiency",
            "Comparing token volume, cost, activity, efficiency, Yield, privacy, provenance, and gaming resistance for AI user leaderboards.",
            "/articles/what-should-an-ai-user-leaderboard-measure",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: "What Should an AI User Leaderboard Measure?", path: "/articles/what-should-an-ai-user-leaderboard-measure" },
          ]),
          faqSchema([
            {
              question: "Should an AI user leaderboard measure token volume or efficiency?",
              answer:
                "It depends on the question you want to answer. Token volume measures spending and activity. Efficiency (Yield) measures how well an operator reuses cached context and produces output relative to fresh input. Volume rewards spending; efficiency rewards token-cascade behavior. Neither measures productivity, quality, or skill.",
            },
            {
              question: "What is Yield (Υ)?",
              answer:
                "Yield (Υ) = (cache_read × output) / input². It is a token-cascade efficiency metric that combines context reuse and output production into a single number. Higher Yield means the operator reuses cached context efficiently and produces substantial output relative to fresh input.",
            },
            {
              question: "Can Yield be gamed?",
              answer:
                "Yes. Any metric can be gamed. Yield can be inflated by manufacturing cache reads or output. Signed telemetry and outlier detection reduce but do not eliminate gaming. No metric is fully gaming-proof.",
            },
            {
              question: "Does Yield measure productivity?",
              answer:
                "No. Yield measures a token-flow relationship. It does not measure productivity, work quality, professional skill, task correctness, cognition, or business value. A high Yield means an operator ranks highly under the stated metric and time window.",
            },
          ]),
        ]}
      />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Measurement design</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          What Should an AI User Leaderboard Measure?
        </h1>
        <p className="text-lg text-muted-foreground">
          Usage volume vs efficiency. Token counts, cost, activity, context
          reuse, Yield, privacy, provenance, gaming resistance, and
          measurement limitations compared.
        </p>
        <p className="text-xs text-muted-foreground">Published: September 4, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">The design question</h2>
        <p>
          If you are building a leaderboard for AI users (operators), the first
          question is: what should it measure? The answer determines what the
          leaderboard rewards and what it ignores. A leaderboard that measures
          token volume rewards spending. A leaderboard that measures
          efficiency rewards token-cascade behavior. A leaderboard that
          measures task correctness rewards output quality. Each choice has
          trade-offs.
        </p>
        <p>
          This article compares the most common measurement options and
          explains why SigArena uses Yield (Υ) — while being explicit about
          what Yield does and does not measure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Measurement options compared</h2>
        <div className="space-y-3">
          {MEASURES.map((m) => (
            <div key={m.name} className="rounded-lg border border-border p-4 space-y-2">
              <h3 className="font-semibold text-foreground">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.what}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400">Pros</p>
                  <p className="text-sm text-muted-foreground">{m.pros}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">Cons</p>
                  <p className="text-sm text-muted-foreground">{m.cons}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Why SigArena uses Yield</h2>
        <p>
          SigArena ranks operators by Yield (Υ) = (cache_read × output) /
          input² because it captures a token-cascade behavior that raw volume
          and cost do not: how effectively an operator reuses cached context
          and produces output relative to fresh input. An operator who burns
          millions of tokens without reusing context will not rank highly,
          even if their total spend is the largest.
        </p>
        <p>
          This does not mean Yield is &quot;better&quot; than volume in
          general. It means Yield answers a different question. Volume
          answers &quot;who spends the most?&quot; Yield answers &quot;who
          ranks highest under the stated token-cascade metric?&quot; Neither
          answers &quot;who is the best developer?&quot;
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Beyond the metric: design dimensions</h2>
        <p>
          Choosing a metric is necessary but not sufficient. A leaderboard
          also needs to address privacy, provenance, gaming resistance, and
          measurement limitations.
        </p>
        <div className="space-y-3">
          {DIMENSIONS.map((d) => (
            <div key={d.name} className="rounded-lg border border-border p-4 space-y-1">
              <h3 className="font-semibold text-foreground">{d.name}</h3>
              <p className="text-sm font-medium text-foreground">{d.question}</p>
              <p className="text-sm text-muted-foreground">{d.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What Yield does not measure</h2>
        <p>
          Yield and related token-cascade metrics quantify a token-flow
          relationship. They do not measure:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Productivity or work output quality</li>
          <li>Professional skill or developer competence</li>
          <li>Task correctness or code quality</li>
          <li>Cognition, intelligence, or effort</li>
          <li>Employee performance or business value</li>
          <li>Safety, novelty, or user satisfaction</li>
        </ul>
        <p>
          A high Yield means an operator ranks highly under the stated metric
          and time window. It does not mean they are a better developer, a
          more productive worker, or a more valuable employee. Conflating
          token-cascade efficiency with any of these is a category error.
        </p>
      </section>

      <section className="rounded-lg border border-primary/20 bg-primary/5 p-5">
        <h2 className="text-lg font-semibold">See the leaderboard in practice</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The SigArena AI User Leaderboard applies Yield to rank operator
          profiles. See who ranks highest and get your own rank.
        </p>
        <Link
          href="/ai-user-leaderboard"
          className="mt-3 inline-block text-primary font-medium hover:underline"
        >
          View the AI User Leaderboard →
        </Link>
      </section>
    </div>
  );
}
