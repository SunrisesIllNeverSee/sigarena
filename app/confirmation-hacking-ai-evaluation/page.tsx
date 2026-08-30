import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Confirmation Hacking in AI Evaluation",
  description:
    "Confirmation hacking is designing evaluations that confirm what you already believe. SigRank avoids it with content-free telemetry — Yield (Υ) = (cache_read × output) / input².",
  alternates: { canonical: "/confirmation-hacking-ai-evaluation" },
  openGraph: {
    title: "Confirmation Hacking in AI Evaluation | SigRank SignalAF",
    description:
      "Confirmation hacking is designing evaluations that confirm what you already believe. SigRank avoids it with content-free telemetry.",
    url: "https://sigeconomy.com/confirmation-hacking-ai-evaluation",
    type: "website",
  },
};

export default function ConfirmationHackingAiEvaluationPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "Confirmation Hacking in AI Evaluation",
            "Confirmation hacking is designing evaluations that confirm what you already believe. SigRank avoids it with content-free telemetry — Yield (Υ) = (cache_read × output) / input².",
            "/confirmation-hacking-ai-evaluation",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Confirmation Hacking in AI Evaluation", path: "/confirmation-hacking-ai-evaluation" },
          ]),
          faqSchema([
            {
              question: "What is confirmation hacking in AI evaluation?",
              answer:
                "Confirmation hacking is the practice of designing evaluations that confirm what you already believe, rather than tests that could falsify your beliefs. In AI evaluation, this means choosing benchmarks, metrics, or test cases that favor a particular model, output, or operator — while ignoring cases where it performs poorly. It is a form of evaluation bias that produces misleading results.",
            },
            {
              question: "How does SigRank avoid confirmation hacking?",
              answer:
                "SigRank avoids confirmation hacking through content-free telemetry. Because SigRank measures only token counts — input, output, cache-read, cache-write — and computes Yield (Υ) = (cache_read × output) / input², there is no opportunity to cherry-pick test cases, design favorable prompts, or select outputs that confirm a hypothesis. The metric is computed from all real session telemetry, not a curated subset. The evaluation is public, so results cannot be selectively reported.",
            },
            {
              question: "Why is content-free telemetry important for avoiding bias?",
              answer:
                "Content-free telemetry eliminates the main vector for confirmation hacking: selecting which content to evaluate. When evaluations involve prompt content or output text, the evaluator can choose favorable examples. With token counts only, there is nothing to cherry-pick. The four token pillars (input, output, cache-read, cache-write) are numeric, objective, and complete — every session contributes, not just the ones that look good.",
            },
            {
              question: "Can confirmation hacking happen in model benchmarks too?",
              answer:
                "Yes. Model benchmarks are vulnerable to confirmation hacking through benchmark selection, prompt engineering, and contamination. A lab can choose benchmarks where their model excels, craft prompts that favor their model, or train on benchmark data (contamination). This is why independent benchmarks like Vals AI and contamination-free benchmarks like LiveBench exist. SigRank applies the same principle to the operator layer: independent, public, content-free evaluation that cannot be gamed through content selection.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Confirmation Hacking in AI Evaluation</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Confirmation hacking is designing evaluations that confirm what you
          already believe. SigRank avoids it with content-free telemetry —
          measuring token counts, not curated content.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          The best evaluation is one that could prove you wrong.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          SigRank&apos;s content-free telemetry removes the main vector for
          confirmation hacking: selecting which content to evaluate.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">What is confirmation hacking?</h2>
        <p className="text-muted-foreground">
          Confirmation hacking is the practice of designing evaluations that
          confirm what you already believe, rather than tests that could
          falsify your beliefs. In AI evaluation, this takes several forms:
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Benchmark selection:</strong>{" "}
            choosing benchmarks where your model, output, or operator excels,
            while ignoring benchmarks where it performs poorly.
          </li>
          <li>
            <strong className="text-foreground">Prompt engineering:</strong>{" "}
            crafting test prompts that favor a particular system, rather than
            using standardized or adversarial prompts.
          </li>
          <li>
            <strong className="text-foreground">Output cherry-picking:</strong>{" "}
            selecting favorable outputs to evaluate while discarding
            unfavorable ones.
          </li>
          <li>
            <strong className="text-foreground">Selective reporting:</strong>{" "}
            publishing only the results that confirm your hypothesis, while
            burying the rest.
          </li>
        </ul>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">How SigRank avoids confirmation hacking</h2>
        <p className="text-muted-foreground">
          SigRank avoids confirmation hacking through three structural
          mechanisms:
        </p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">1. Content-free telemetry.</strong>{" "}
            SigRank measures only token counts — the four pillars of input,
            output, cache-read, and cache-write. There is no content to
            cherry-pick. You cannot select favorable prompts, craft favorable
            outputs, or curate a favorable test set. The telemetry is numeric,
            objective, and complete.
          </p>
          <p>
            <strong className="text-foreground">2. Universal coverage.</strong>{" "}
            Yield (Υ) = (cache_read × output) / input² is computed from all real
            session telemetry, not a curated subset. Every session contributes.
            You cannot exclude bad sessions or include only good ones — the
            metric reflects the operator&apos;s actual performance across all
            their work.
          </p>
          <p>
            <strong className="text-foreground">3. Public results.</strong>{" "}
            Results are published on a public leaderboard. You cannot
            selectively report favorable outcomes — the full ranking is visible
            to everyone. This creates accountability and makes confirmation
            hacking structurally difficult.
          </p>
        </div>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          Υ = (cache_read × output) / input²
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">The same principle as independent benchmarks</h2>
        <p className="text-muted-foreground">
          Independent model benchmarks like Vals AI exist because labs cannot
          be trusted to evaluate their own models — the incentive to
          confirmation-hack is too strong. Contamination-free benchmarks like
          LiveBench exist because training on benchmark data is a form of
          confirmation hacking. SigRank applies the same principle to the
          operator layer: independent, public, content-free evaluation that
          cannot be gamed through content selection.
        </p>
        <p className="text-muted-foreground">
          The governance framework MO§ES defines the measurement specification,
          privacy boundaries, and public accountability requirements that make
          this possible. The evaluation is governed, auditable, and resistant
          to the biases that plague self-reported or content-based evaluations.
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
            <dt className="font-semibold">What is confirmation hacking in AI evaluation?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Confirmation hacking is the practice of designing evaluations
              that confirm what you already believe, rather than tests that
              could falsify your beliefs. In AI evaluation, this means choosing
              benchmarks, metrics, or test cases that favor a particular model,
              output, or operator — while ignoring cases where it performs
              poorly. It is a form of evaluation bias that produces misleading
              results.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How does SigRank avoid confirmation hacking?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              SigRank avoids confirmation hacking through content-free
              telemetry. Because SigRank measures only token counts — input,
              output, cache-read, cache-write — and computes Yield (Υ) =
              (cache_read × output) / input², there is no opportunity to
              cherry-pick test cases, design favorable prompts, or select
              outputs that confirm a hypothesis. The metric is computed from all
              real session telemetry, not a curated subset. The evaluation is
              public, so results cannot be selectively reported.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Why is content-free telemetry important for avoiding bias?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Content-free telemetry eliminates the main vector for
              confirmation hacking: selecting which content to evaluate. When
              evaluations involve prompt content or output text, the evaluator
              can choose favorable examples. With token counts only, there is
              nothing to cherry-pick. The four token pillars (input, output,
              cache-read, cache-write) are numeric, objective, and complete —
              every session contributes, not just the ones that look good.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Can confirmation hacking happen in model benchmarks too?</dt>
            <dd className="text-sm text-muted-foreground mt-1">
              Yes. Model benchmarks are vulnerable to confirmation hacking
              through benchmark selection, prompt engineering, and
              contamination. A lab can choose benchmarks where their model
              excels, craft prompts that favor their model, or train on
              benchmark data (contamination). This is why independent
              benchmarks like Vals AI and contamination-free benchmarks like
              LiveBench exist. SigRank applies the same principle to the
              operator layer: independent, public, content-free evaluation that
              cannot be gamed through content selection.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
