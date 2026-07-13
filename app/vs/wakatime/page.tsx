import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "SigRank vs WakaTime — Token Efficiency vs Time Tracking",
  description:
    "WakaTime tracks how long you code. SigRank measures how efficiently you use AI tokens. Time spent doesn't equal value produced. Yield does.",
  openGraph: {
    title: "SigRank vs WakaTime — Token Efficiency vs Time Tracking",
    description: "Time tracking vs token efficiency.",
    url: "https://sigarena.signalaf.com/vs/wakatime",
    type: "website",
  },
};

export default function VsWakaTimePage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs WakaTime</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Token efficiency vs time tracking — Yield vs hours
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">WakaTime</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tracks</td>
              <td className="px-4 py-3 text-muted-foreground">AI token usage — the cascade</td>
              <td className="px-4 py-3 text-muted-foreground">Coding time — hours, languages, editors</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) — token-cascade efficiency</td>
              <td className="px-4 py-3 text-muted-foreground">Hours coded per day/week</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI</td>
              <td className="px-4 py-3 text-muted-foreground">How long you coded</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">AI-specific?</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — designed for AI coding sessions</td>
              <td className="px-4 py-3 text-muted-foreground">No — general coding time tracker</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by hours coded</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">File names, project names, time stamps</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Time spent ≠ value produced
        </h2>
        <p>
          WakaTime tells you how many hours you coded. That&apos;s useful for
          time management. But in the AI era, time spent doesn&apos;t correlate
          with value produced. An operator who uses AI efficiently can produce
          in 2 hours what used to take 8.
        </p>
        <p>
          SigRank measures the <em>quality</em> of your AI usage, not the
          quantity of your time. Yield (Υ) tells you whether your AI sessions
          are compounding signal or burning tokens. Two operators can code for
          the same number of hours — the one with higher Yield is getting more
          value from AI.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Efficiency &gt; hours.</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my Yield
        </a>
      </div>
    </div>
  );
}
