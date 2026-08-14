import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Performative Evals for AI Users — The Statistical Layer | SigRank",
  description:
    "Performative evals and ranking for users not models. SigRank is the statistical layer for AI users — like ERA for baseball, Yield turns AI usage into stats. Benchmark your AI performance on the public leaderboard.",
  alternates: { canonical: "/operator-evals" },
  openGraph: {
    title: "Performative Evals for AI Users — SigRank",
    description:
      "The statistical layer for AI users. Evals and ranking for users not models. Like ERA for baseball, but for AI.",
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
            "Performative Evals for AI Users \u2014 The Statistical Layer",
            "Performative evals and ranking for users not models. SigRank is the statistical layer for AI users \u2014 like ERA for baseball, Yield turns AI usage into stats.",
            "/operator-evals",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Performative Evals", path: "/operator-evals" },
          ]),
          faqSchema([
            {
              question: "What are performative evals for AI users?",
              answer:
                "Performative evals are public evaluations of AI users \u2014 the humans using AI. Unlike model evals (Vals AI, LMSYS Arena) that test AI models on benchmarks, performative evals measure how effectively a person uses AI, based on token telemetry from their real coding sessions. Think of it as stats for AI users, like ERA for baseball.",
            },
            {
              question: "How are AI users measured and ranked?",
              answer:
                "AI users are measured by Yield (\u03a5), a token-cascade efficiency score computed from their real session telemetry. Yield = (cache_read \u00d7 output) / input\u00b2. Users are ranked on a public leaderboard by Yield, with class tiers from NOVICE to SINGULARITY. The measurement uses token counts only \u2014 never prompt content or code.",
            },
            {
              question: "What is the difference between evaluating AI models and evaluating AI users?",
              answer:
                "Model evals (Vals AI, LMSYS Arena, LiveBench) evaluate the AI model \u2014 GPT, Claude, Gemini \u2014 using standardized test prompts. Performative evals (SigRank) evaluate the human \u2014 the developer, coder, or AI user \u2014 using token telemetry from real sessions. Model evals answer &quot;which model is best?&quot; Performative evals answer &quot;who is the best AI user?&quot;",
            },
            {
              question: "Why do public benchmarks for AI coders matter?",
              answer:
                "Public benchmarks create accountability. Before public model evals, model quality was marketing copy. After public evals, it was measurable. The same applies to AI coders: before public performative evals, skill was vibes \u2014 &quot;they seem productive.&quot; After public evals, it&apos;s a measurable, comparable, public score. What gets measured publicly gets better publicly.",
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
                "Yes. SigRank is the only platform running public performative evals for AI users. All other public evals (Vals AI, LMSYS Arena, LiveBench, Hugging Face Open LLM) evaluate models, not the humans using them. Braintrust and Langfuse evaluate AI applications privately, not developers publicly.",
            },
            {
              question: "Does SigRank work with Claude, GPT, Cursor, and Copilot?",
              answer:
                "Yes. SigRank measures token-cascade efficiency from any AI coding tool that produces token telemetry \u2014 Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and others. The Yield metric is platform-agnostic because it measures the human&apos;s cascade architecture, not the AI model&apos;s capability.",
            },
          ]),
        ]}
      />

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Performative Evals</span>
          <br />
          <span className="gradient-text">for AI Users</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          The statistical layer for AI users.{" "}
          <span className="font-semibold text-foreground">Users not models.</span>{" "}
          Like ERA for baseball, Yield turns AI usage into stats.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-2xl font-bold">
          Fantasy sports runs on stats. Video games have leaderboards. AI now has SigRank.
        </p>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">
          Custom metrics take your AI usage and turn it into the equivalent of
          ERA, batting average, and OPS. Identify the best. Mark growth. Study
          the field. Get better.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold mb-4">
          The sports stats analogy
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Baseball has ERA, batting average, OPS, and WAR. These stats turned
          raw performance into universally understood numbers. SigRank does the
          same for AI users. Yield is the ERA of AI usage. Leverage is the
          on-base percentage. Velocity is the slugging percentage. The full
          metric suite is the box score.
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium">Baseball stat</th>
                <th className="px-4 py-3 text-left font-medium">SigRank equivalent</th>
                <th className="px-4 py-3 text-left font-medium">What it measures</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">ERA</td>
                <td className="px-4 py-3 font-semibold text-primary">Yield ({"\u03a5"})</td>
                <td className="px-4 py-3 text-muted-foreground">Overall efficiency {"\u2014"} the headline number</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">On-base %</td>
                <td className="px-4 py-3 font-semibold text-primary">Leverage</td>
                <td className="px-4 py-3 text-muted-foreground">How often you &quot;get on base&quot; via cache reuse</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Slugging %</td>
                <td className="px-4 py-3 font-semibold text-primary">Velocity</td>
                <td className="px-4 py-3 text-muted-foreground">Power {"\u2014"} output per token spent</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Batting avg</td>
                <td className="px-4 py-3 font-semibold text-primary">SNR</td>
                <td className="px-4 py-3 text-muted-foreground">Clean signal {"\u2014"} quality of output</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">OPS</td>
                <td className="px-4 py-3 font-semibold text-primary">Efficiency</td>
                <td className="px-4 py-3 text-muted-foreground">Combined score</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Games played</td>
                <td className="px-4 py-3 font-semibold text-primary">Scale V</td>
                <td className="px-4 py-3 text-muted-foreground">Volume {"\u2014"} how much you&apos;ve played</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Cost per win</td>
                <td className="px-4 py-3 font-semibold text-primary">$/1M</td>
                <td className="px-4 py-3 text-muted-foreground">Cost efficiency</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">WAR</td>
                <td className="px-4 py-3 font-semibold text-primary">10xDEV</td>
                <td className="px-4 py-3 text-muted-foreground">Normalized value above replacement</td>
              </tr>
            </tbody>
          </table>
        </div>
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
          <h2 className="text-xl font-semibold mb-3">User Evals (Performative)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Telemetry-based evaluations that measure how effectively a human
            uses AI {"\u2014"} the cascade architecture, not the model
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
              ({"\u03a5"}), class tier, rank
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">
          Why public performative evals matter
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              1. Accountability for AI users.
            </strong>{" "}
            Public model evals created accountability for AI labs. Before public
            evals, model quality was marketing copy. After public evals, it was
            measurable. Public performative evals do the same for AI users {"\u2014"}
            operator skill becomes a measurable, comparable, public number
            instead of vibes.
          </p>
          <p>
            <strong className="text-foreground">
              2. The skill gap is real and measurable.
            </strong>{" "}
            Two operators using the same model, the same tools, and the same
            prompts can have 100x different Yield. The difference isn&apos;t the
            model {"\u2014"} it&apos;s the cascade architecture. Public performative
            evals make that difference visible.
          </p>
          <p>
            <strong className="text-foreground">
              3. Telemetry, not self-report.
            </strong>{" "}
            Performative evals are measured from actual session telemetry {"\u2014"}
            token counts, cache ratios, output volumes. Not surveys, not
            self-assessment, not &quot;I feel productive.&quot; The data
            doesn&apos;t lie about your cascade.
          </p>
          <p>
            <strong className="text-foreground">4. Privacy-preserving.</strong>{" "}
            SigRank collects token counts only {"\u2014"} never prompt content, never
            code, never conversation. The evaluation is public; the work is
            private.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">The evaluation metric: Yield</h2>
        <p className="text-sm text-muted-foreground">
          Yield ({"\u03a5"}) is the public performative evaluation metric. It measures
          token-cascade efficiency {"\u2014"} whether signal is compounding or
          tokens are being burned.
        </p>
        <div className="rounded-lg bg-muted/30 p-4 text-center font-mono text-lg">
          {"\u03a5"} = (cache_read {"\u00d7"} output) / input{"\u00b2"}
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
          The public evals landscape
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
          <h3 className="font-semibold mb-2">The Public Evals Thesis</h3>
          <p className="text-sm text-muted-foreground">
            Why public operator evals are the next frontier in AI accountability.
          </p>
        </Link>
        <Link
          href="/vs/vals-ai"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-2">SigRank vs Vals AI</h3>
          <p className="text-sm text-muted-foreground">
            Operator evals vs model evals \u2014 different subjects, different
            metrics.
          </p>
        </Link>
        <Link
          href="/best-ai-user"
          className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
        >
          <h3 className="font-semibold mb-2">See the evals</h3>
          <p className="text-sm text-muted-foreground">
            The public operator leaderboard \u2014 ranked by Yield (\u03a5).
          </p>
        </Link>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What are performative evals for AI users?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Performative evals are public evaluations of AI users {"\u2014"} the humans using AI. Unlike model evals (Vals AI, LMSYS Arena) that test AI models on benchmarks, performative evals measure how effectively a person uses AI, based on token telemetry from their real coding sessions. Think of it as stats for AI users, like ERA for baseball.
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
              Model evals (Vals AI, LMSYS Arena, LiveBench) evaluate the AI model {"\u2014"} GPT, Claude, Gemini {"\u2014"} using standardized test prompts. Performative evals (SigRank) evaluate the human {"\u2014"} the developer, coder, or AI user {"\u2014"} using token telemetry from real sessions. Model evals answer &quot;which model is best?&quot; Performative evals answer &quot;who is the best AI user?&quot;
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Why do public benchmarks for AI coders matter?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Public benchmarks create accountability. Before public model evals, model quality was marketing copy. After public evals, it was measurable. The same applies to AI coders: before public performative evals, skill was vibes. After public evals, it&apos;s a measurable, comparable, public score.
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
              Yes. SigRank is the only platform running public performative evals for AI users. All other public evals (Vals AI, LMSYS Arena, LiveBench, Hugging Face Open LLM) evaluate models, not the humans using them. Braintrust and Langfuse evaluate AI applications privately, not developers publicly.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Does SigRank work with Claude, GPT, Cursor, and Copilot?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes. SigRank measures token-cascade efficiency from any AI coding tool that produces token telemetry {"\u2014"} Claude, ChatGPT, Gemini, Cursor, Copilot, Windsurf, Codex, and others. The Yield metric is platform-agnostic because it measures the human&apos;s cascade architecture, not the AI model&apos;s capability.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Get your AI user stats.</p>
        <p className="mt-2 text-white/80">
          Measure your Yield. See your rank. Join the public leaderboard.
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
