import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SigRank SignalAF | sigeconomy.com",
  description: "About sigeconomy.com, the public SigRank SignalAF operator-evaluation leaderboard.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 py-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">About</p>
        <h1 className="text-4xl font-bold tracking-tight">About sigeconomy.com and SigRank SignalAF</h1>
      </header>
      <section className="space-y-4 text-muted-foreground">
        <p>
          sigeconomy.com is the public operator-evaluation surface for SigRank SignalAF. It exists to make AI-user performance measurable and comparable in the same way public model evals make model performance comparable. The site ranks operators from privacy-preserving token telemetry rather than reading prompt content, generated code, private documents, or conversation text.
        </p>
        <p>
          The flagship metric is Yield (Υ), defined as cache-read tokens multiplied by output tokens and divided by fresh input tokens squared. Yield is designed to describe how effectively an operator compounds reusable context and output relative to fresh-input burn. The leaderboard also exposes complementary measures such as Velocity, Leverage, signal-to-noise ratio, 10xDEV, Efficiency, Scale V, cost per million tokens, and operating ratio. These measures describe the shape of AI operation; they do not by themselves establish business productivity, code quality, or downstream outcomes.
        </p>
        <p>
          sigeconomy.com is a read-only satellite. The underlying public data API, scoring methodology, enrollment, verified submissions, and operator profiles are provided by SignalAF at signalaf.com. The site publishes machine-readable resources for agents and developers, including llms.txt, OpenAPI, API catalog metadata, authentication documentation, and MCP discovery. The goal is for both people and software agents to be able to determine what SigRank measures, where the data comes from, and which interface is appropriate before relying on a ranking.
        </p>
      </section>
    </article>
  );
}
