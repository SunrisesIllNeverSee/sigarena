import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "SigRank vs Copilot — Token Tracking for AI Tools",
  description:
    "Copilot is an AI pair programmer. SigRank measures how efficiently you drive it. Copilot shows what you wrote; SigRank shows how you drove the AI.",
  alternates: { canonical: "/vs/copilot" },
  openGraph: {
    title: "SigRank vs Copilot — Token Tracking for AI Tools",
    description:
      "Copilot is an AI pair programmer. SigRank measures how efficiently you drive it. Copilot shows what you wrote; SigRank shows how you drove the AI.",
    url: "https://sigeconomy.com/vs/copilot",
    type: "website",
  },
};

export default function VsCopilotPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs Copilot \u2014 Token Tracking for AI Tools", "Copilot is an AI pair programmer. SigRank measures how efficiently you drive it. Copilot shows what you wrote; SigRank shows how you drove the AI.", "/vs/copilot"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/copilot" },
        ]),
        faqSchema([
          { question: "What is the difference between SigRank and GitHub Copilot?", answer: "GitHub Copilot is an AI pair programmer \u2014 it writes inline code and chat suggestions. SigRank measures how efficiently you drive it. Copilot shows what you wrote; SigRank shows how you drove the AI. Yield (\u03a5) tells you whether your tokens compounded signal or burned." },
          { question: "Does SigRank compete with Copilot?", answer: "No \u2014 they measure different things. Copilot is the tool you drive; SigRank is the instrument that measures your driving. A developer using AI can run Copilot for code generation and SigRank for efficiency ranking. They're complementary." },
          { question: "What score does SigRank use?", answer: "Yield (\u03a5) = (cache_read \u00d7 output) / input\u00b2 \u2014 token-cascade efficiency from real sessions. Works across Claude, GPT, Gemini, Cursor, Copilot, and any AI coding tool." },
          { question: "How do I get my AI user score and rank?", answer: "Visit signalaf.com/score to enroll and submit your token telemetry. SigRank will compute your Yield, your rank, and your operator class. Token counts only \u2014 never prompt content, never code." },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs GitHub Copilot</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Copilot shows what you wrote — SigRank shows how you drove the AI
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">Copilot</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it measures</td>
              <td className="px-4 py-3 text-muted-foreground">Token-cascade efficiency (Yield, Leverage, SNR, Velocity)</td>
              <td className="px-4 py-3 text-muted-foreground">AI pair programmer (inline + chat)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Headline metric</td>
              <td className="px-4 py-3 text-muted-foreground">Yield (Υ) = (cache_read × output) / input²</td>
              <td className="px-4 py-3 text-muted-foreground">Lines accepted, suggestions shown</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">What it tells you</td>
              <td className="px-4 py-3 text-muted-foreground">How efficiently you use AI — are tokens compounding?</td>
              <td className="px-4 py-3 text-muted-foreground">What you wrote with AI assistance</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Leaderboard</td>
              <td className="px-4 py-3 text-muted-foreground">Yes — ranked by Yield, class tiers, weekly drops</td>
              <td className="px-4 py-3 text-muted-foreground">No — org-level adoption dashboards only</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">API</td>
              <td className="px-4 py-3 text-muted-foreground">Public REST API + MCP tools</td>
              <td className="px-4 py-3 text-muted-foreground">GitHub Copilot metrics API (org-level)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Comparison</td>
              <td className="px-4 py-3 text-muted-foreground">Head-to-head operator comparison</td>
              <td className="px-4 py-3 text-muted-foreground">No</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Limited (GitHub org-level data)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          Copilot writes code. SigRank measures how efficiently you drove it.
        </h2>
        <p>
          GitHub Copilot is an AI pair programmer. It generates inline
          suggestions and chat responses, and it shows you what you wrote with
          its help. That&apos;s useful for productivity — but it doesn&apos;t
          tell you whether your AI usage was{" "}
          <em>efficient</em>.
        </p>
        <p>
          An operator who accepts every suggestion and burns 10M tokens to
          produce 1K output looks productive in Copilot&apos;s dashboard. But
          their cascade architecture is leaking signal. An operator who uses
          100K tokens to produce the same 1K output has a lower token count but
          a{" "}
          <strong className="text-foreground">10x higher Yield</strong>.
        </p>
        <p>
          SigRank&apos;s Yield (Υ) metric measures the{" "}
          <em>architecture</em> of your token cascade — is signal compounding,
          or are tokens burned? Copilot shows what you wrote. SigRank shows how
          you drove the AI.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">What is the difference between SigRank and GitHub Copilot?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              GitHub Copilot is an AI pair programmer {"\u2014"} it writes inline code and chat suggestions. SigRank measures how efficiently you drive it. Copilot shows what you wrote; SigRank shows how you drove the AI. Yield ({"\u03a5"}) tells you whether your tokens compounded signal or burned.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Does SigRank compete with Copilot?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No {"\u2014"} they measure different things. Copilot is the tool you drive; SigRank is the instrument that measures your driving. A developer using AI can run Copilot for code generation and SigRank for efficiency ranking. They&apos;re complementary.
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
        <p className="text-xl font-bold">Stop writing. Start measuring.</p>
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
