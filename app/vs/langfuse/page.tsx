import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "SigRank vs Langfuse — User Efficiency vs LLM Observability",
  description:
    "Langfuse traces your LLM calls for debugging and cost tracking. SigRank measures your token-cascade efficiency for ranking. Same telemetry, different purpose — which do you need?",
  alternates: { canonical: "/vs/langfuse" },
  openGraph: {
    title: "SigRank vs Langfuse — User Efficiency vs LLM Observability",
    description: "Token telemetry for ranking vs token tracing for debugging.",
    url: "https://signaaf.com/vs/langfuse",
    type: "website",
  },
};

export default function VsLangfusePage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs Langfuse \u2014 User Efficiency vs LLM Observability", "Langfuse traces your LLM calls for debugging and cost tracking. SigRank measures your token-cascade efficiency for ranking.", "/vs/langfuse"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/langfuse" },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs Langfuse</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          User efficiency ranking vs LLM observability — same telemetry, different purpose
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">Langfuse</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">The human operator — token-cascade efficiency (Yield)</td>
              <td className="px-4 py-3 text-muted-foreground">The AI application — LLM call traces, cost, latency</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">The question</td>
              <td className="px-4 py-3 text-muted-foreground">Who is the best AI user?</td>
              <td className="px-4 py-3 text-muted-foreground">Is my AI app working correctly?</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Cost, latency, token usage per trace</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — operators ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">No — dashboard for your own app&apos;s traces</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Open source?</td>
              <td className="px-4 py-3 text-muted-foreground">Scanner is open source. API is public. Data is CC-BY-4.0.</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — self-hostable, MIT-ish license</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Audience</td>
              <td className="px-4 py-3 text-muted-foreground">AI operators (developers using AI tools)</td>
              <td className="px-4 py-3 text-muted-foreground">AI engineers (developers building AI apps)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Data source</td>
              <td className="px-4 py-3 text-muted-foreground">Operator&apos;s AI coding session telemetry</td>
              <td className="px-4 py-3 text-muted-foreground">Application&apos;s LLM API calls (OpenAI, Anthropic, etc.)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Full prompt/response content traced (configurable)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Different questions, same telemetry
        </h2>
        <p>
          Langfuse is an excellent LLM observability platform. It traces your
          AI application&apos;s LLM calls — inputs, outputs, cost, latency,
          errors — so you can debug and improve your app. It&apos;s built for
          engineers shipping AI products.
        </p>
        <p>
          SigRank is built for a different question: not &quot;is my AI app
          working?&quot; but &quot;am I good at using AI?&quot; SigRank measures
          the <em>human operator&apos;s</em> efficiency — how effectively you
          use AI tokens in your coding sessions. Yield (Υ) rewards context
          reuse, meaningful output, and minimal waste.
        </p>
        <p>
          They&apos;re complementary. If you build AI apps, use Langfuse to
          monitor your app&apos;s LLM calls. If you use AI to code, use SigRank
          to measure your own efficiency and see how you rank against other
          operators.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Measure the operator, not just the app.</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my Yield
        </a>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/vs/braintrust" className="text-primary font-medium hover:underline">
          vs Braintrust →
        </Link>
        <Link href="/vs/ccusage" className="text-primary font-medium hover:underline">
          vs ccusage →
        </Link>
        <Link href="/best-ai-user" className="text-primary font-medium hover:underline">
          Who is #1? →
        </Link>
      </div>
    </div>
  );
}
