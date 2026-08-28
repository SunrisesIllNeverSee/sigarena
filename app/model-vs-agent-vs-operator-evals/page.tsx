import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Model Evals vs Agent Evals vs Operator Evals",
  description:
    "Model, task, agent, and operator evaluations measure different layers. See what each answers, what Upsilon measures, and why the layers are complementary.",
  alternates: { canonical: "/model-vs-agent-vs-operator-evals" },
};

const LAYERS = [
  {
    name: "Model eval",
    subject: "Model capability",
    asks: "What can the model do?",
    examples: "accuracy, pass rate, preference, reasoning and coding benchmarks",
  },
  {
    name: "Task eval",
    subject: "Task result",
    asks: "Was the task completed correctly?",
    examples: "tests passed, accepted output, successful completion",
  },
  {
    name: "Agent eval",
    subject: "Agent execution",
    asks: "Did the autonomous or semi-autonomous system execute reliably?",
    examples: "tool use, trajectory, reliability, recovery, policy adherence",
  },
  {
    name: "Operator eval",
    subject: "Human operation of AI",
    asks: "How is the human operating the AI system?",
    examples: "operator telemetry, cascade metrics, field and cohort context",
  },
] as const;

export default function EvalLayersPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "Model Evals vs Agent Evals vs Operator Evals",
            "A comparison of distinct AI evaluation layers and the role of operator measurement.",
            "/model-vs-agent-vs-operator-evals",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Model vs Agent vs Operator Evals", path: "/model-vs-agent-vs-operator-evals" },
          ]),
          faqSchema([
            {
              question: "What is the difference between a model eval and an operator eval?",
              answer:
                "A model eval measures capabilities or outputs of the AI model. An operator eval measures the human layer operating AI. They answer different questions and can be used together.",
            },
            {
              question: "Are operator evals a replacement for agent evals?",
              answer:
                "No. Agent evals test execution behavior and reliability of agents. Operator evals measure the human operator layer. A real workflow may need both, plus task and business outcome measurements.",
            },
          ])
        ]}
      />

      <header className="text-center py-6">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Evaluation stack</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Model Evals vs Agent Evals vs Operator Evals
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          These are not competing names for the same benchmark. They measure different layers of an AI system.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {LAYERS.map((layer) => (
          <div key={layer.name} className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">{layer.name}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="font-medium">Subject</dt><dd className="text-muted-foreground">{layer.subject}</dd></div>
              <div><dt className="font-medium">Core question</dt><dd className="text-muted-foreground">{layer.asks}</dd></div>
              <div><dt className="font-medium">Typical evidence</dt><dd className="text-muted-foreground">{layer.examples}</dd></div>
            </dl>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-2xl font-semibold">Where Upsilon sits</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-background/40 p-4 text-sm">{`BUSINESS OUTCOMES\n        ↑\nORGANIZATIONAL AI PERFORMANCE\n        ↑\nOPERATOR PERFORMANCE      ← UPSILON\n        ↑\nAGENT PERFORMANCE\n        ↑\nTASK PERFORMANCE\n        ↑\nMODEL PERFORMANCE`}</pre>
        <p className="mt-4 text-sm text-muted-foreground">
          Upsilon's draft standard is deliberately narrow: it defines a portable measurement vocabulary for the operator layer. It can be joined to the other layers without pretending to replace them.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Why the distinction matters</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          A strong model can still be operated poorly. An efficient operator can still receive an incorrect model response. A reliable agent can still pursue the wrong task. A successful task can still fail to create business value. Keeping the measurement layers separate makes comparisons more interpretable.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/ai-operator-metrics" className="text-primary hover:underline">AI operator metrics →</Link>
          <Link href="/ai-operator-standard" className="text-primary hover:underline">AI operator standard →</Link>
          <Link href="https://signalaf.com/standard" className="text-primary hover:underline">Canonical Upsilon Standard →</Link>
        </div>
      </section>
    </div>
  );
}
