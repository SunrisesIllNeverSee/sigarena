import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, faqSchema } from "@/lib/jsonld";

/**
 * app/mcp/page.tsx — the SigEconomy MCP server landing page.
 *
 * Human-facing page that explains what the SigEconomy MCP server does, how to
 * connect, and what tools, resources, and prompts it exposes. SigEconomy is the
 * interpretation/discovery layer — it reads from SignalAF's public API and
 * answers intent-driven questions about AI operators.
 */

export const metadata: Metadata = {
  title: "MCP Server — 8 tools for AI operator discovery",
  description:
    "SigEconomy MCP server gives AI agents 8 remote tools (Streamable HTTP, no install) to discover, compare, and explain AI operators on the live leaderboard. Find the best operator, compare head-to-head, discover peers, optimize efficiency, and scan for field anomalies. Works with Claude, Cursor, Cline, Windsurf, Cloudflare Playground, and any MCP-compatible client.",
  alternates: { canonical: "/mcp" },
  openGraph: {
    title: "MCP Server — 8 tools for AI operator discovery | SigEconomy",
    description:
      "The SigEconomy MCP server gives AI agents 8 remote tools to discover, compare, and explain AI operators. The interpretation and discovery layer for the SigRank leaderboard.",
    url: "https://sigeconomy.com/mcp",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SigEconomy MCP Server — 8 tools for AI operator discovery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SigEconomy MCP Server — 8 tools for AI operator discovery",
    description:
      "The interpretation and discovery layer for the SigRank leaderboard. 8 remote tools over Streamable HTTP.",
    images: [{ url: "/og.png", alt: "SigEconomy MCP Server — 8 tools for AI operator discovery" }],
  },
};

const TOOLS = [
  {
    name: "get_best_operator",
    desc: "Find the #1 AI operator by any metric on any time window",
  },
  {
    name: "compare_operators",
    desc: "Head-to-head comparison with yield gap decomposition",
  },
  {
    name: "describe_power_user",
    desc: "Profile of the top 10% — what does a power user look like?",
  },
  {
    name: "discover_peers",
    desc: "Find operators with similar metrics to you",
  },
  {
    name: "optimize_efficiency",
    desc: "Actionable recommendations to improve your yield",
  },
  {
    name: "operator_gap",
    desc: "Decompose the yield gap between two operators by pillar",
  },
  {
    name: "field_anomaly",
    desc: "Scan the leaderboard for unusual patterns and outliers",
  },
  {
    name: "explain_this_operator",
    desc: "Natural-language explanation of any operator's profile",
  },
];

const RESOURCES = [
  {
    uri: "sigeconomy://leaderboard",
    desc: "Live leaderboard snapshot",
  },
  {
    uri: "sigeconomy://methodology",
    desc: "How SigEconomy interprets operator data",
  },
  {
    uri: "sigeconomy://platforms",
    desc: "AI platforms tracked",
  },
  {
    uri: "sigeconomy://metrics",
    desc: "Metric definitions and interpretations",
  },
];

const PROMPTS = [
  {
    name: "who-is-the-best",
    desc: "Find and explain the #1 operator",
  },
  {
    name: "compare-two-operators",
    desc: "Head-to-head with gap decomposition",
  },
  {
    name: "find-my-peers",
    desc: "Discover similar operators",
  },
  {
    name: "how-can-i-improve",
    desc: "Actionable efficiency recommendations",
  },
  {
    name: "whats-interesting-on-the-board",
    desc: "Field anomaly scan",
  },
];

export default function MCPPage() {
  const mcpJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SigEconomy MCP Server",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform (HTTP)",
    description:
      "MCP server giving AI agents 8 remote tools (Streamable HTTP, no install) to discover, compare, and explain AI operators on the live SigRank leaderboard. The interpretation and discovery layer for AI operator evals.",
    url: "https://sigeconomy.com/mcp",
    installUrl: "https://sigeconomy.com/api/mcp",
    author: {
      "@type": "Organization",
      name: "SigRank SignalAF",
      url: "https://signalaf.com",
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <JsonLd data={[
        mcpJsonLd,
        faqSchema([
          {
            question: "What is the SigEconomy MCP server?",
            answer:
              "The SigEconomy MCP server is a Model Context Protocol server that gives AI agents 8 remote tools (Streamable HTTP, no install) to discover, compare, and explain AI operators on the live SigRank leaderboard. Agents can find the best operator by any metric, compare two operators head-to-head with yield gap decomposition, profile the top 10%, discover peers with similar metrics, get actionable efficiency recommendations, decompose the gap between two operators, scan the board for anomalies, and get natural-language explanations of any operator. SigEconomy is the interpretation layer — it reads from SignalAF's public API and answers intent-driven questions about AI operators.",
          },
          {
            question: "How many tools does the SigEconomy MCP server expose?",
            answer:
              "The SigEconomy MCP server exposes 8 remote tools (get_best_operator, compare_operators, describe_power_user, discover_peers, optimize_efficiency, operator_gap, field_anomaly, explain_this_operator) over Streamable HTTP at https://sigeconomy.com/api/mcp. It also exposes 4 resources (sigeconomy://leaderboard, sigeconomy://methodology, sigeconomy://platforms, sigeconomy://metrics) and 5 prompts (who-is-the-best, compare-two-operators, find-my-peers, how-can-i-improve, whats-interesting-on-the-board).",
          },
          {
            question: "What is the difference between SigEconomy and SignalAF?",
            answer:
              "SignalAF (signalaf.com) is the measurement instrument — it runs the local scanner, collects token telemetry, computes the cascade metrics, and hosts the canonical leaderboard API. SigEconomy (sigeconomy.com) is the interpretation and discovery layer — it reads from SignalAF's public API and answers intent-driven questions: who is the best, how do two operators compare, what does a power user look like, who are my peers, how can I improve. SigEconomy does not duplicate the cascade math; it interprets the results.",
          },
        ]),
      ]} />

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigEconomy MCP Server</span>
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          8 remote tools (Streamable HTTP, no install) for AI operator discovery,
          comparison, and explanation. The interpretation and discovery layer for
          the SigRank leaderboard — read-only, no auth required.
        </p>
      </header>

      {/* Remote endpoint */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Remote endpoint
        </h2>
        <div className="rounded-lg border border-border bg-card p-4">
          <code className="font-mono text-sm text-foreground">
            https://sigeconomy.com/api/mcp
          </code>
          <p className="mt-2 text-xs text-muted-foreground">
            Streamable HTTP transport. Protocol 2025-06-18. No auth required.
            Discovery card at{" "}
            <code className="font-mono text-muted-foreground">
              /.well-known/mcp.json
            </code>
            . Works with Cloudflare AI Playground, web agents, and any MCP
            client that supports Streamable HTTP.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Tools ({TOOLS.length})
        </h2>
        <div className="flex flex-col gap-2">
          {TOOLS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-1 rounded-md border border-border bg-card px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <code className="font-mono text-sm font-bold text-foreground sm:min-w-[200px]">
                {t.name}
              </code>
              <span className="text-sm text-muted-foreground">
                {t.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Resources ({RESOURCES.length})
        </h2>
        <div className="flex flex-col gap-2">
          {RESOURCES.map((r) => (
            <div
              key={r.uri}
              className="flex flex-col gap-1 rounded-md border border-border bg-card px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <code className="font-mono text-sm font-bold text-primary sm:min-w-[240px]">
                {r.uri}
              </code>
              <span className="text-sm text-muted-foreground">
                {r.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Prompts */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Prompts ({PROMPTS.length})
        </h2>
        <div className="flex flex-col gap-2">
          {PROMPTS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col gap-1 rounded-md border border-border bg-card px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <code className="font-mono text-sm font-bold text-foreground sm:min-w-[240px]">
                {p.name}
              </code>
              <span className="text-sm text-muted-foreground">
                {p.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Connection info */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          How to connect
        </h2>
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            The SigEconomy MCP server is a remote server — no install needed.
            Point any MCP-compatible client at the endpoint URL:
          </p>
          <div className="rounded-md bg-muted/50 px-3 py-2">
            <code className="font-mono text-sm text-foreground">
              https://sigeconomy.com/api/mcp
            </code>
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Transport:</span>{" "}
              Streamable HTTP
            </p>
            <p>
              <span className="font-semibold text-foreground">Protocol version:</span>{" "}
              2025-06-18 (also supports 2025-03-26)
            </p>
            <p>
              <span className="font-semibold text-foreground">Auth:</span> None required (read-only)
            </p>
            <p>
              <span className="font-semibold text-foreground">Discovery:</span>{" "}
              <code className="font-mono">/.well-known/mcp.json</code>
            </p>
          </div>
        </div>
      </section>

      {/* Boundary note */}
      <section className="space-y-3 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          SigEconomy vs SignalAF — the boundary
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          SigEconomy (sigeconomy.com) is the{" "}
          <span className="font-semibold text-foreground">interpretation and discovery layer</span>.
          It reads from SignalAF&apos;s public API and answers intent-driven
          questions: who is the best, how do two operators compare, what does a
          power user look like, who are my peers, how can I improve. It does not
          duplicate the cascade math — it interprets the results.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          SignalAF (signalaf.com) is the{" "}
          <span className="font-semibold text-foreground">measurement instrument</span>.
          It runs the local scanner (<code className="font-mono">npx sigrank</code>),
          collects privacy-preserving token telemetry, computes the cascade
          metrics (Yield, Leverage, Velocity, SNR, 10xDEV), and hosts the
          canonical leaderboard API. SignalAF also exposes its own MCP server at{" "}
          <a
            href="https://signalaf.com/api/mcp"
            className="font-medium text-primary hover:underline"
          >
            signalaf.com/api/mcp
          </a>{" "}
          with measurement-level tools (rank_paste, diagnose_cascade,
          simulate_change, etc.).
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Use <span className="font-semibold text-foreground">SignalAF</span> to
          measure and score. Use{" "}
          <span className="font-semibold text-foreground">SigEconomy</span> to
          discover and interpret.
        </p>
      </section>

      {/* Links */}
      <section className="flex flex-wrap gap-4 border-t border-border pt-6">
        <Link
          href="/"
          className="font-mono text-sm text-muted-foreground underline hover:text-foreground"
        >
          View the leaderboard →
        </Link>
        <Link
          href="/developers"
          className="font-mono text-sm text-muted-foreground underline hover:text-foreground"
        >
          Developer portal →
        </Link>
        <a
          href="https://signalaf.com/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-muted-foreground underline hover:text-foreground"
        >
          SignalAF MCP server →
        </a>
        <a
          href="https://signalaf.com/methodology"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-muted-foreground underline hover:text-foreground"
        >
          Methodology →
        </a>
      </section>
    </div>
  );
}
