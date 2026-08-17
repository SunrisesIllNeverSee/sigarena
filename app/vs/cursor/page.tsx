import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs Cursor — Cross-Tool Token Metrics",
  description:
    "Cursor is an AI editor with built-in metrics. SigRank is platform-neutral — works with Cursor, Claude Code, Copilot, and 15+ tools.",
  alternates: { canonical: "/vs/cursor" },
  openGraph: {
    title: "SigRank vs Cursor — Cross-Tool Token Metrics",
    description:
      "Cursor is an AI editor with built-in metrics. SigRank is platform-neutral — works with Cursor, Claude Code, Copilot, and 15+ tools.",
    url: "https://sigeconomy.com/vs/cursor",
    type: "website",
  },
};

export default function VsCursorPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs Cursor \u2014 Cross-Tool Token Metrics", "Cursor is an AI editor with built-in metrics. SigRank is platform-neutral \u2014 works with Cursor, Claude Code, Copilot, and 15+ tools.", "/vs/cursor"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/cursor" },
        ]),
        faqSchema([
          { question: "What is the difference between SigRank and Cursor?", answer: "Cursor is an AI code editor with built-in usage stats \u2014 lines accepted, edits, tabs. SigRank is platform-neutral: it measures token-cascade efficiency (Yield) across Cursor, Claude Code, Copilot, and 15+ tools. Cursor tells you what happened inside its editor; SigRank tells you how efficiently you drive AI everywhere." },
          { question: "Does SigRank compete with Cursor?", answer: "No \u2014 they measure different things. Cursor&apos;s built-in metrics are editor-locked and editor-scoped. SigRank is platform-neutral and works across every AI coding tool. Keep Cursor for editing; add SigRank for the cross-tool score." },
          { question: "What score does SigRank use?", answer: "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2 \u2014 token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs Cursor</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Editor-locked stats vs platform-neutral token efficiency
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">Cursor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">Built-in usage stats (lines accepted, edits, tabs)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Acceptance rate</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI across all tools</td>
              <td className="px-4 py-3 text-muted-foreground">How many suggestions you accepted in Cursor</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">No — editor-internal stats only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">API</td>
              <td className="px-4 py-3 text-muted-foreground">Public REST API + MCP tools</td>
              <td className="px-4 py-3 text-muted-foreground">No public API for metrics</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Comparison</td>
              <td className="px-4 py-3 text-muted-foreground">Head-to-head operator comparison</td>
              <td className="px-4 py-3 text-muted-foreground">No</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Cursor-internal data</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Cross-platform</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — Cursor + Claude Code + Copilot + 15+</td>
              <td className="px-4 py-3 text-muted-foreground">No — Cursor only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Cursor measures your editor. SigRank measures your driving.
        </h2>
        <p>
          Cursor is an excellent AI code editor with built-in usage stats —
          lines accepted, edits made, tabs used. But those metrics are{" "}
          <em>editor-locked</em> and <em>editor-scoped</em>. They tell you what
          happened inside Cursor, and nothing else.
        </p>
        <p>
          Most developers don&apos;t use one tool. You might run Cursor for
          edits, Claude Code in the terminal, and Copilot in the browser.
          Cursor&apos;s dashboard can&apos;t see any of that. Your real
          efficiency is scattered across every tool you touch.
        </p>
        <p>
          SigRank is <strong className="text-foreground">platform-neutral</strong>.
          It measures token-cascade efficiency — Yield (Υ) — across Cursor,
          Claude Code, Copilot, and 15+ tools. One score, one rank, one
          operator class. Cursor tells you how many suggestions you accepted.
          SigRank tells you how efficiently you drive AI everywhere.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What is the difference between SigRank and Cursor?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cursor is an AI code editor with built-in usage stats {"\u2014"} lines accepted, edits, tabs. SigRank is platform-neutral: it measures token-cascade efficiency (Yield) across Cursor, Claude Code, Copilot, and 15+ tools. Cursor tells you what happened inside its editor; SigRank tells you how efficiently you drive AI everywhere.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Does SigRank compete with Cursor?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No {"\u2014"} they measure different things. Cursor&apos;s built-in metrics are editor-locked and editor-scoped. SigRank is platform-neutral and works across every AI coding tool. Keep Cursor for editing; add SigRank for the cross-tool score.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">What score does SigRank use?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yield ({"\u03a5"}) = (cache_read {"\u00d7"} output) / input{"\u00b2"} {"\u2014"} token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">How do I get my AI user score and rank?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only {"\u2014"} never prompt content, never code.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Keep Cursor. Add the score.</p>
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
