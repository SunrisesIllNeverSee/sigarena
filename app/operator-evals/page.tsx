import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Public LLM Operator Evals — The Public Evaluation Layer for AI Operators",
  description:
    "Public LLM operator evals — the public evaluation layer for AI operators. Like Vals AI evaluates models, SigRank evaluates the humans using AI. Ranked by Yield (Υ) — token-cascade efficiency.",
  alternates: { canonical: "/operator-evals" },
  openGraph: {
    title: "Public LLM Operator Evals — SigRank",
    description:
      "The public evaluation layer for AI operators. Public evals for the humans wielding AI.",
    url: "https://sigeconomy.com/operator-evals",
    type: "website",
  },
};

export default function OperatorEvalsPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          articleSchema(
            "Public LLM Operator Evals \u2014 The Public Evaluation Layer for AI Operators",
            "Public LLM operator evals \u2014 the public evaluation layer for AI operators. Like Vals AI evaluates models, SigRank evaluates the humans using AI.",
            "/operator-evals",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Operator Evals", path: "/operator-evals" },
          ]),
          faqSchema([
            {
              question: "What are public LLM operator evals?",
              answer:
                "Public LLM operator evals are public evaluations of AI operators \u2014 the humans using AI. Unlike model evals (Vals AI, LMSYS Arena) that test AI models on benchmarks, operator evals measure how effectively a person uses AI, based on token telemetry from their real coding sessions.",
            },
            {
              question: "How are AI users measured and ranked?",
              answer:
                "AI users are measured by Yield (\u03a5), a token-cascade efficiency score computed from their real session telemetry. Yield = (cache_read \u00d7 output) / input\u00b2. Users are ranked on a public leaderboard by Yield, with class tiers from NOVICE to SINGULARITY. The measurement uses token counts only \u2014 never prompt content or code.",
            },
            {
              question: "What is the difference between evaluating AI models and evaluating AI users?",
              answer:
                "Model evals (Vals AI, LMSYS Arena, LiveBench) evaluate the AI model \u2014 GPT, Claude, Gemini \u2014 using standardized test prompts. Operator evals (SigRank) evaluate the human \u2014 the developer, coder, or AI user \u2014 using token telemetry from real sessions. Model evals answer 'which model is best?' Operator evals answer 'who is the best AI user?'",
            },
            {
              question: "Why do public benchmarks for AI coders matter?",
              answer:
                "Public benchmarks create accountability. Before public model evals, model quality was marketing copy. After public evals, it was measurable. The same applies to AI coders: before public operator evals, skill was vibes \u2014 'they seem productive.' After public evals, it's a measurable, comparable, public score. What gets measured publicly gets better publicly.",
            },
            {
              question: "What is the Yield score and how is it calculated?",
              answer:
                "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2. It measures token-cascade efficiency \u2014 whether signal is compounding or tokens are being burned. Higher Yield means the AI user reuses cached context efficiently and produces substantial output relative to fresh input. It works across any platform \u2014 Claude, GPT, Gemini, Cursor, Copilot, or any other AI coding agent.",
            },
            {
              question: "How do I get my AI user score and rank?",
              answer:
                "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code. The score is public; the work is private. Works with Claude, ChatGPT, Cursor, Copilot, and other AI coding tools.",
            },
            {
              question: "Is SigRank the only public leaderboard for AI developers?",
              answer:
                "Yes. SigRank is the only platform running public operator evals. All other public evals (Vals AI, LMSYS Arena, LiveBench, Hugging Face Open LLM) evaluate models, not the humans using them. Braintrust and Langfuse evaluate AI applications privately, not developers publicly.",
            },
            {
              question: "Does SigRank work with Claude, GPT, Cursor, and Copilot?",
              answer:
                "Yes. SigRank measures token-cascade efficiency from any AI coding tool that produces token telemetry \u2014 Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and others. The Yield metric is platform-agnostic because it measures the human's cascade architecture, not the AI model's capability.",
            },
            {
              question: "Why not just count tokens?",
              answer:
                "Raw token count measures volume, not efficiency. An operator who burns 10M input tokens with no cache reuse and little output has high volume but low signal. Yield (Υ = cache_read × output / input²) penalizes un-cached volume and rewards compounding — the quadratic input penalty means waste is non-linear. Two operators with the same token count can have 100× different Yield.",
            },
            {
              question: "Isn't this just measuring who spends the most?",
              answer:
                "No — the opposite. Yield's formula (Υ = cache_read × output / input²) penalizes spending. The input² term means every additional fresh input token reduces your score quadratically. Operators who spend more on fresh input without reusing cache or producing output score lower, not higher. SigRank rewards efficiency, not expenditure.",
            },
            {
              question: "Doesn't the model matter more than the user?",
              answer:
                "The data says no. Two operators using the same model, the same tools, and similar prompts can have 100× different Yield. The difference is the cascade architecture — how the human structures context reuse, output extraction, and input minimization. SigRank measures the human's skill, not the model's capability. Model evals (Vals AI, LMSYS) already cover model quality.",
            },
            {
              question: "Is SigRank just for Claude users?",
              answer:
                "No. SigRank is platform-agnostic. It works with Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and any AI coding tool that produces token telemetry. The Yield metric measures the human's cascade architecture, which is independent of which AI model they use. The leaderboard includes operators across multiple platforms.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Public LLM Operator Evals</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          The public evaluation layer for AI operators. Like Vals AI evaluates
          models, SigRank evaluates the humans using AI.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Models are evaluated. Operators are not.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Vals AI, LMSYS Arena, and LiveBench run public evals for LLM models.
          SigRank runs public evals for LLM operators \u2014 the humans wielding
          AI every day.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Model Evals</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Standardized benchmark suites that measure how well an AI model
            performs on reasoning, coding, math, and knowledge tasks.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the AI model
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> which model
              is best?
            </li>
            <li>
              <strong className="text-foreground">Method:</strong> standardized
              test prompts
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> Vals AI,
              LMSYS Arena, LiveBench, Hugging Face Open LLM
            </li>
            <li>
              <strong className="text-foreground">Output:</strong> benchmark
              scores (accuracy, pass rate, Elo)
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-semibold mb-3">Operator Evals</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Telemetry-based evaluations that measure how effectively a human
            operator uses AI \u2014 the cascade architecture, not the model
            capability.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Subject:</strong> the human
              operator
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> who is the
              best AI operator?
            </li>
            <li>
              <strong className="text-foreground">Method:</strong> token
              telemetry from real sessions
            </li>
            <li>
              <strong className="text-foreground">Examples:</strong> SigRank
              (the only one)
            </li>
            <li>
              <strong className="text-foreground">Output:</strong> Yield
              (\u03a5), class tier, rank
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">
          Why public operator evals matter
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              1. Accountability for AI operators.
            </strong>{" "}
            Public model evals created accountability for AI labs. Before public
            evals, model quality was marketing copy. After public evals, it was
            measurable. Public operator evals do the same for AI users \u2014
            operator skill becomes a measurable, comparable, public number
            instead of vibes.
          </p>
          <p>
            <strong className="text-foreground">
              2. The skill gap is real and measurable.
            </strong>{" "}
            Two operators using the same model, the same tools, and the same
            prompts can have 100x different Yield. The difference isn&apos;t the
            model \u2014 it&apos;s the cascade architecture. Public operator
            evals make that difference visible.
          </p>
          <p>
            <strong className="text-foreground">
              3. Telemetry, not self-report.
            </strong>{" "}
            Operator evals are measured from actual session telemetry \u2014
            token counts, cache ratios, output volumes. Not surveys, not
            self-assessment, not &quot;I feel productive.&quot; The data
            doesn&apos;t lie about your cascade.
          </p>
          <p>
            <strong className="text-foreground">4. Privacy-preserving.</strong>{" "}
            SigRank collects token counts only \u2014 never prompt content, never
            code, never conversation. The evaluation is public; the work is
            private.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">What is the evaluation metric for AI operators?</h2>
        <p className="text-sm text-muted-foreground">
          Yield (\u03a5) is the public operator evaluation metric. It measures
          token-cascade efficiency \u2014 whether signal is compounding or
          tokens are being burned.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          \u03a5 = (cache_read \u00d7 output) / input\u00b2
        </div>
        <div className="grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">cache_read</strong> {"\u2014"}
            rewards context reuse. Operators who build on prior turns score
            higher.
          </div>
          <div>
            <strong className="text-foreground">output</strong> {"\u2014"} rewards
            productive generation. Operators who extract real work score higher.
          </div>
          <div>
            <strong className="text-foreground">input{"\u00b2"}</strong> {"\u2014"}
            penalizes fresh input. The square means waste is non-linear.
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/how-it-works"
            className="text-primary hover:underline"
          >
            Read the full methodology \u2192
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center">
          The public operator evals landscape
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium">Platform</th>
                <th className="px-4 py-3 text-left font-medium">Evaluates</th>
                <th className="px-4 py-3 text-left font-medium">Public?</th>
                <th className="px-4 py-3 text-left font-medium">Method</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-primary/5">
                <td className="px-4 py-3 font-semibold">SigRank</td>
                <td className="px-4 py-3 text-muted-foreground">
                  AI operators (humans)
                </td>
                <td className="px-4 py-3 text-muted-foreground">Yes</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Token telemetry \u2014 Yield (\u03a5)
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Vals AI</td>
                <td className="px-4 py-3 text-muted-foreground">
                  AI models
                </td>
                <td className="px-4 py-3 text-muted-foreground">Yes</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Benchmark suites
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">LMSYS Arena</td>
                <td className="px-4 py-3 text-muted-foreground">
                  AI models
                </td>
                <td className="px-4 py-3 text-muted-foreground">Yes</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Human voting (Elo)
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">LiveBench</td>
                <td className="px-4 py-3 text-muted-foreground">
                  AI models
                </td>
                <td className="px-4 py-3 text-muted-foreground">Yes</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Automated benchmarks
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Braintrust</td>
                <td className="px-4 py-3 text-muted-foreground">
                  AI applications (private)
                </td>
                <td className="px-4 py-3 text-muted-foreground">No</td>
                <td className="px-4 py-3 text-muted-foreground">
                  LLM-as-judge evals
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          SigRank is the only platform running{" "}
          <strong className="text-foreground">public operator evals</strong>.
          The rest evaluate models or private applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/public-operator-evals"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-2">Why do public operator evals matter?</h3>
          <p className="text-sm text-muted-foreground">
            Why public operator evals are the next frontier in AI accountability.
          </p>
        </Link>
        <Link
          href="/vs/vals-ai"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-2">How does SigRank compare to Vals AI?</h3>
          <p className="text-sm text-muted-foreground">
            Operator evals vs model evals \u2014 different subjects, different
            metrics.
          </p>
        </Link>
        <Link
          href="/best-ai-user"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-2">Where can I see the operator evals?</h3>
          <p className="text-sm text-muted-foreground">
            The public operator leaderboard \u2014 ranked by Yield (\u03a5).
          </p>
        </Link>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What are public LLM operator evals?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Public LLM operator evals are public evaluations of AI operators {"\u2014"} the humans using AI. Unlike model evals (Vals AI, LMSYS Arena) that test AI models on benchmarks, operator evals measure how effectively a person uses AI, based on token telemetry from their real coding sessions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">How are AI users measured and ranked?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              AI users are measured by Yield ({"\u03a5"}), a token-cascade efficiency score computed from their real session telemetry. Yield = (cache_read {"\u00d7"} output) / input{"\u00b2"}. Users are ranked on a public leaderboard by Yield, with class tiers from NOVICE to SINGULARITY. The measurement uses token counts only {"\u2014"} never prompt content or code.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">What is the difference between evaluating AI models and evaluating AI users?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Model evals (Vals AI, LMSYS Arena, LiveBench) evaluate the AI model {"\u2014"} GPT, Claude, Gemini {"\u2014"} using standardized test prompts. Operator evals (SigRank) evaluate the human {"\u2014"} the developer, coder, or AI user {"\u2014"} using token telemetry from real sessions. Model evals answer &quot;which model is best?&quot; Operator evals answer &quot;who is the best AI user?&quot;
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Why do public benchmarks for AI coders matter?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Public benchmarks create accountability. Before public model evals, model quality was marketing copy. After public evals, it was measurable. The same applies to AI coders: before public operator evals, skill was vibes. After public evals, it&apos;s a measurable, comparable, public score.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">What is the Yield score and how is it calculated?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yield ({"\u03a5"}) = (cache_read {"\u00d7"} output) / input{"\u00b2"}. It measures token-cascade efficiency {"\u2014"} whether signal is compounding or tokens are being burned. Higher Yield means the AI user reuses cached context efficiently and produces substantial output relative to fresh input. It works across any platform {"\u2014"} Claude, GPT, Gemini, Cursor, Copilot, or any other AI coding agent.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">How do I get my AI user score and rank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only {"\u2014"} never prompt content, never code. The score is public; the work is private. Works with Claude, ChatGPT, Cursor, Copilot, and other AI coding tools.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Is SigRank the only public leaderboard for AI developers?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes. SigRank is the only platform running public operator evals. All other public evals (Vals AI, LMSYS Arena, LiveBench, Hugging Face Open LLM) evaluate models, not the humans using them. Braintrust and Langfuse evaluate AI applications privately, not developers publicly.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Does SigRank work with Claude, GPT, Cursor, and Copilot?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes. SigRank measures token-cascade efficiency from any AI coding tool that produces token telemetry {"\u2014"} Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and others. The Yield metric is platform-agnostic because it measures the human&apos;s cascade architecture, not the AI model&apos;s capability.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Why not just count tokens?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Raw token count measures volume, not efficiency. An operator who burns 10M input tokens with no cache reuse and little output has high volume but low signal. Yield ({"\u03a5"} = cache_read {"\u00d7"} output) / input{"\u00b2"} penalizes un-cached volume and rewards compounding {"\u2014"} the quadratic input penalty means waste is non-linear. Two operators with the same token count can have 100{"\u00d7"} different Yield.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Isn&apos;t this just measuring who spends the most?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No {"\u2014"} the opposite. Yield&apos;s formula ({"\u03a5"} = cache_read {"\u00d7"} output) / input{"\u00b2"} penalizes spending. The input{"\u00b2"} term means every additional fresh input token reduces your score quadratically. Operators who spend more on fresh input without reusing cache or producing output score lower, not higher. SigRank rewards efficiency, not expenditure.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Doesn&apos;t the model matter more than the user?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The data says no. Two operators using the same model, the same tools, and similar prompts can have 100{"\u00d7"} different Yield. The difference is the cascade architecture {"\u2014"} how the human structures context reuse, output extraction, and input minimization. SigRank measures the human&apos;s skill, not the model&apos;s capability. Model evals (Vals AI, LMSYS) already cover model quality.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Is SigRank just for Claude users?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No. SigRank is platform-agnostic. It works with Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and any AI coding tool that produces token telemetry. The Yield metric measures the human&apos;s cascade architecture, which is independent of which AI model they use. The leaderboard includes operators across multiple platforms.
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
    </div>
  );
}
