import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "SigRank vs LangChain + LangSmith — User Ranking vs Agent Framework",
  description:
    "LangChain builds AI agents. LangSmith observes and evaluates them. SigRank ranks the humans operating AI. Framework + observability vs operator efficiency — which do you need?",
  alternates: { canonical: "/vs/langchain" },
  openGraph: {
    title: "SigRank vs LangChain + LangSmith — User Ranking vs Agent Framework",
    description: "Building and observing AI apps vs ranking the humans who use AI.",
    url: "https://signaaf.com/vs/langchain",
    type: "website",
  },
};

export default function VsLangChainPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs LangChain + LangSmith \u2014 User Ranking vs Agent Framework", "LangChain builds AI agents. LangSmith observes and evaluates them. SigRank ranks the humans who use AI.", "/vs/langchain"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/langchain" },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs LangChain + LangSmith</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Agent framework + observability vs operator efficiency ranking
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">LangChain / LangSmith</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it is</td>
              <td className="px-4 py-3 text-muted-foreground">Operator efficiency ranking — measures the human</td>
              <td className="px-4 py-3 text-muted-foreground">Agent framework (LangChain) + observability platform (LangSmith) — builds and monitors the AI app</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">The question</td>
              <td className="px-4 py-3 text-muted-foreground">Who is the best AI user?</td>
              <td className="px-4 py-3 text-muted-foreground">How do I build, debug, and evaluate my AI agent?</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Trace latency, token cost, eval scores (LangSmith)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — operators ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">No — LangSmith dashboard shows your own traces/evals</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Audience</td>
              <td className="px-4 py-3 text-muted-foreground">AI operators (developers using AI tools to code)</td>
              <td className="px-4 py-3 text-muted-foreground">AI engineers (developers building AI agents and apps)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Open source?</td>
              <td className="px-4 py-3 text-muted-foreground">Scanner is open source. API is public. Data is CC-BY-4.0.</td>
              <td className="px-4 py-3 text-muted-foreground">LangChain: MIT-licensed. LangSmith: closed-source SaaS.</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">GitHub stars</td>
              <td className="px-4 py-3 text-muted-foreground">Growing (newer project)</td>
              <td className="px-4 py-3 text-muted-foreground">100K+ (one of the most popular AI frameworks)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">MCP integration</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — SigRank MCP tools</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — LangChain agents support MCP tools</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Full prompt/response traced in LangSmith (configurable)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Build the agent vs rank the operator
        </h2>
        <p>
          LangChain is one of the most popular AI frameworks on Earth —
          100K+ GitHub stars, used to build agents and LLM-powered applications
          everywhere. LangSmith is its companion platform for tracing,
          evaluating, and debugging those applications in production. Together
          they cover the build-and-observe side of AI engineering.
        </p>
        <p>
          SigRank answers a different question entirely. Not &quot;how do I
          build an AI agent?&quot; or &quot;is my agent working?&quot; — but
          &quot;am <em>I</em> good at using AI?&quot; SigRank measures the
          human operator&apos;s token-cascade efficiency. Yield (Υ) rewards
          context reuse, meaningful output, and minimal waste. It ranks
          operators against each other on a public leaderboard.
        </p>
        <p>
          They&apos;re complementary. If you build AI agents, use LangChain to
          build them and LangSmith to observe them. If you use AI to code, use
          SigRank to measure your own efficiency and see how you rank. Both
          integrate with MCP — you can wire SigRank into a LangChain agent
          as a tool.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Rank the operator, not just the agent.</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my Yield
        </a>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/vs/langfuse" className="text-primary font-medium hover:underline">
          vs Langfuse →
        </Link>
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
