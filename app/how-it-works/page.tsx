import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works — Yield, Leverage & AI User Scoring | SigRank",
  description:
    "How does SigRank score AI users? The 60-second explainer on Yield (Υ), Leverage, 10xDEV, and the token-cascade efficiency formula. See how AI operators are ranked.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How It Works — Yield, Leverage & AI User Scoring | SigRank",
    description: "How does SigRank score AI users? The 60-second explainer.",
    url: "https://sigarena.signalaf.com/how-it-works",
    type: "website",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <Zap className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">How it works</h1>
        <p className="mt-2 text-muted-foreground">
          The 60-second explainer. The full methodology lives on{" "}
          <Link href="https://signalaf.com/methodology" className="text-primary hover:underline">
            signalaf.com
          </Link>
          .
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">What is Υ Yield?</h2>
        <p className="mt-3 text-muted-foreground">
          <strong className="text-foreground">Υ Yield</strong> measures how efficiently
          you use AI tokens. It&apos;s your cache reads multiplied by your outputs,
          divided by your inputs squared.
        </p>
        <div className="mt-4 rounded-lg bg-muted/30 p-4 text-center">
          <code className="text-lg font-mono">
            Υ = (cache_read × output) / input²
          </code>
        </div>
        <p className="mt-3 text-muted-foreground">
          In plain English: how efficiently do you reuse cached context and produce
          output relative to what you send to the model. Higher is better.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Why Yield, not volume?</h2>
        <p className="mt-3 text-2xl font-bold text-primary">
          Volume is noise. Yield is signal.
        </p>
        <p className="mt-3 text-muted-foreground">
          Anyone can spend tokens. The question is whether you&apos;re using them
          efficiently. A power user with 10K tokens and high cache reuse can beat
          someone with 10M tokens and no cache strategy. Υ Yield rewards skill, not
          spend.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">The four pillars</h2>
        <div className="mt-4 space-y-3">
          {[
            { name: "Cache Read", desc: "Tokens served from cache — free, instant, smart." },
            { name: "Output", desc: "Tokens the model produced for you — your results." },
            { name: "Input", desc: "Tokens you sent to the model — your cost." },
            { name: "Cache Write", desc: "Tokens written to cache for future reuse — investment." },
          ].map((p) => (
            <div key={p.name} className="flex gap-3">
              <div className="shrink-0 rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                {p.name}
              </div>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          The cascade string (e.g., <code className="font-mono">1.5×10.2×24.5</code>)
          shows the ratio between these pillars. A high cache-read ratio is the
          hallmark of a power user.
        </p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-lg font-semibold">Ready to measure yourself?</p>
        <p className="mt-1 text-muted-foreground">
          Get your Υ Yield, your rank, and your operator class on SigRank.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Check my rank
        </a>
        <p className="mt-3 text-sm text-muted-foreground">
          Want the full methodology?{" "}
          <Link href="https://signalaf.com/methodology" className="text-primary hover:underline">
            Read the docs on signalaf.com
          </Link>
        </p>
      </div>
    </div>
  );
}
