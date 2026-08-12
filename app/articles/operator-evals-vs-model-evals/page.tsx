import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Operator Evals vs Model Evals \u2014 Different Subjects, Different Metrics",
  description:
    "Model evals measure AI models. Operator evals measure the humans using AI. Why they're complementary, not competing \u2014 and why both matter.",
  alternates: { canonical: "/articles/operator-evals-vs-model-evals" },
  openGraph: {
    title: "Operator Evals vs Model Evals \u2014 Different Subjects, Different Metrics",
    description:
      "Model evals measure AI models. Operator evals measure the humans using AI. Why they're complementary, not competing \u2014 and why both matter.",
    url: "https://sigeconomy.com/articles/operator-evals-vs-model-evals",
    type: "article",
  },
};

export default function OperatorEvalsVsModelEvalsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <JsonLd
        data={[
          articleSchema(
            "Operator Evals vs Model Evals \u2014 Different Subjects, Different Metrics",
            "Model evals measure AI models. Operator evals measure the humans using AI. Why they're complementary, not competing \u2014 and why both matter.",
            "/articles/operator-evals-vs-model-evals",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles/operator-evals-vs-model-evals" },
            { name: "Operator Evals vs Model Evals", path: "/articles/operator-evals-vs-model-evals" },
          ]),
          faqSchema([
            {
              question:
                "What is the difference between operator evals and model evals?",
              answer:
                "Model evals evaluate AI models (GPT, Claude, Gemini) using standardized benchmarks. Operator evals evaluate the humans using AI using token telemetry from real sessions. The subject is different: one evaluates the tool, the other evaluates the person wielding it.",
            },
            {
              question: "Are operator evals and model evals competing?",
              answer:
                "No, they're complementary. Model evals tell you which model to use. Operator evals tell you how well you're using it. A great operator with a mediocre model can out-Yield a poor operator with the best model.",
            },
            {
              question: "What are examples of model evals?",
              answer:
                "Vals AI, LMSYS Arena, LiveBench, and Hugging Face Open LLM Leaderboard are all public model evals. They run standardized test prompts against models and publish the results.",
            },
            {
              question: "What is the only public operator eval?",
              answer:
                "SigRank is the only platform running public operator evals. All other public evals (Vals AI, LMSYS Arena, LiveBench) evaluate models, not operators.",
            },
            {
              question: "Why is there a missing layer in AI evaluation?",
              answer:
                "Models are evaluated publicly. Applications are evaluated privately (Braintrust, Langfuse). But operators — the humans using AI — had no public evaluation layer until SigRank. That's the missing layer.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Operator Evals vs Model Evals</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Different subjects, different metrics, different questions
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          The model eval
        </h2>
        <p>
          What Vals AI, LMSYS Arena, LiveBench do. Standardized benchmarks.
          Subject = the model. Question = &quot;which model is best?&quot;
          Method = test prompts. Output = accuracy/Elo scores.
        </p>
        <p>
          Model evals run standardized test prompts against an AI model and
          measure how well it performs. The subject is the model. The question
          is &quot;which model is best?&quot; The method is a benchmark suite.
          The output is a score \u2014 accuracy, pass rate, Elo rating. Model
          evals created accountability for AI labs. Before them, model quality
          was marketing copy.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          The operator eval
        </h2>
        <p>
          What SigRank does. Telemetry from real sessions. Subject = the human.
          Question = &quot;who is the best AI operator?&quot; Method = token
          cascade analysis. Output = Yield (\u03a5).
        </p>
        <p>
          Operator evals measure telemetry from real work sessions \u2014 not
          test prompts, not benchmarks. The subject is the human operator. The
          question is &quot;who is the best AI operator?&quot; The method is
          token cascade analysis. The output is Yield (\u03a5), a single
          comparable number that reflects how well the operator compounds signal
          across a session.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center">
          Model evals vs operator evals
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium">Feature</th>
                <th className="px-4 py-3 text-left font-medium">Model Evals</th>
                <th className="px-4 py-3 text-left font-medium">Operator Evals</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Subject</td>
                <td className="px-4 py-3 text-muted-foreground">
                  The AI model
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  The human operator
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Question</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Which model is best?
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Who is the best AI operator?
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Method</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Standardized test prompts
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Token cascade analysis
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Metric</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Accuracy / Elo scores
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Yield (\u03a5)
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Data source</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Benchmark suites run against models
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Telemetry from real work sessions
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Public?</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Yes \u2014 public results, public benchmarks
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Yes \u2014 public leaderboard, public methodology
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Examples</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Vals AI, LMSYS Arena, LiveBench
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  SigRank
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          Why they&apos;re complementary
        </h2>
        <p>
          Model evals tell you which model to use. Operator evals tell you how
          well you&apos;re using it. A great operator with a mediocre model can
          out-Yield a poor operator with the best model.
        </p>
        <p>
          They answer different questions and they&apos;re both important. Model
          evals are about the tool. Operator evals are about the craft. You need
          both to understand AI-assisted work \u2014 a great tool in unskilled
          hands produces mediocre results, and a mediocre tool in skilled hands
          can still compound signal efficiently.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          The missing layer
        </h2>
        <p>
          Model evals became infrastructure. Operator evals will too. The gap:
          nobody was evaluating the human. SigRank fills that gap.
        </p>
        <p>
          Vals AI, LMSYS Arena, and LiveBench built the public evaluation layer
          for models. That layer is now infrastructure \u2014 every AI lab checks
          it, every buyer references it. The same thing will happen for operator
          evals. The gap was simple: nobody was evaluating the human wielding
          the model. SigRank is the public evaluation layer for operators.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              What is the difference between operator evals and model evals?
            </h3>
            <p>
              Model evals evaluate AI models (GPT, Claude, Gemini) using standardized benchmarks. Operator evals evaluate the humans using AI using token telemetry from real sessions. The subject is different: one evaluates the tool, the other evaluates the person wielding it.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              Are operator evals and model evals competing?
            </h3>
            <p>
              No, they&apos;re complementary. Model evals tell you which model to use. Operator evals tell you how well you&apos;re using it. A great operator with a mediocre model can out-Yield a poor operator with the best model.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              What are examples of model evals?
            </h3>
            <p>
              Vals AI, LMSYS Arena, LiveBench, and Hugging Face Open LLM Leaderboard are all public model evals. They run standardized test prompts against models and publish the results.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              What is the only public operator eval?
            </h3>
            <p>
              SigRank is the only platform running public operator evals. All other public evals (Vals AI, LMSYS Arena, LiveBench) evaluate models, not operators.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              Why is there a missing layer in AI evaluation?
            </h3>
            <p>
              Models are evaluated publicly. Applications are evaluated privately (Braintrust, Langfuse). But operators — the humans using AI — had no public evaluation layer until SigRank. That&apos;s the missing layer.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Get your operator eval.</p>
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
          href="/vs/vals-ai"
          className="text-primary hover:underline"
        >
          SigRank vs Vals AI \u2192
        </Link>
        <span className="text-muted-foreground">|</span>
        <Link
          href="/how-it-works"
          className="text-primary hover:underline"
        >
          How it works \u2192
        </Link>
      </div>
    </div>
  );
}
