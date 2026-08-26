import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Sparkles, Zap, TrendingUp, AlertCircle, ArrowLeft } from "lucide-react";
import { decodeShareParams, buildShareCard, type ShareCardMetrics, type ShareCardError } from "@/lib/share/mcp-card";

// CRITICAL: without force-dynamic the build will fail (the page reads search
// params and fetches the MCP endpoint at request time).
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ t?: string; d?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const toolName = sp.t || "MCP Tool";
  const params = decodeShareParams(sp.d ?? null);
  const subject = params?.codename || params?.operator_a || "operator";
  return {
    title: `${toolName} — ${subject} | SigEconomy`,
    description: `SigEconomy MCP tool result: ${toolName}`,
    openGraph: {
      title: `${toolName} — SigEconomy MCP`,
      description: `SigEconomy MCP tool result: ${toolName}`,
      url: `https://sigeconomy.com/share/mcp?t=${sp.t || ""}&d=${sp.d || ""}`,
      type: "website",
      images: [{ url: `/share/mcp/opengraph-image?t=${encodeURIComponent(sp.t || "")}&d=${encodeURIComponent(sp.d || "")}`, width: 1200, height: 630, alt: `SigEconomy MCP — ${toolName}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${toolName} — SigEconomy MCP`,
      description: `SigEconomy MCP tool result: ${toolName}`,
      images: [{ url: `/share/mcp/opengraph-image?t=${encodeURIComponent(sp.t || "")}&d=${encodeURIComponent(sp.d || "")}`, alt: `SigEconomy MCP — ${toolName}` }],
    },
  };
}

const TOOL_LABELS: Record<string, string> = {
  get_best_operator: "Best Operator",
  compare_operators: "Compare Operators",
  explain_this_operator: "Operator Profile",
  discover_peers: "Discover Peers",
  optimize_efficiency: "Optimize Efficiency",
  describe_power_user: "Power User Profile",
  operator_gap: "Operator Gap",
  field_anomaly: "Field Anomaly",
};

export default async function ShareMcpPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const toolName = sp.t || "";
  const params = decodeShareParams(sp.d ?? null);

  if (!toolName || !params) {
    return <ErrorState message="Missing or invalid share parameters. The URL needs both ?t=<tool> and ?d=<encoded-params>." />;
  }

  // Re-execute the tool via the local MCP endpoint.
  // We use a relative URL — Next.js fetch resolves against the deployment origin.
  const baseUrl = process.env.NODE_ENV === "production"
    ? "https://sigeconomy.com"
    : "http://localhost:3001";
  const result = await buildShareCard(toolName, params, baseUrl);

  if ("error" in result) {
    return <ErrorState message={result.error} toolName={toolName} />;
  }

  return <ShareCard result={result} />;
}

function ErrorState({ message, toolName }: { message: string; toolName?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div>
        <h1 className="text-xl font-semibold">
          {toolName ? `Could not load ${TOOL_LABELS[toolName] ?? toolName}` : "Invalid share link"}
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leaderboard
      </Link>
    </div>
  );
}

function ShareCard({ result }: { result: ShareCardMetrics }) {
  const label = TOOL_LABELS[result.toolName] ?? result.toolName;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        sigeconomy.com
      </Link>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Header band */}
        <div className="gradient-primary px-6 py-5 text-white">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            SigEconomy MCP
          </div>
          <div className="mt-1 text-sm text-white/70">{label}</div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{result.headline}</h1>
          {result.subheadline && (
            <p className="mt-1 text-sm text-white/80">{result.subheadline}</p>
          )}
        </div>

        {/* Metrics grid */}
        {result.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {result.metrics.map((m) => (
              <div key={m.label} className="bg-card p-4 text-center">
                <div className="text-xl font-bold tabular-nums text-foreground">{m.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Interpretation */}
        {result.interpretation && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-foreground">{result.interpretation}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Powered by SigRank SignalAF</span>
          </div>
          <div className="text-xs text-muted-foreground">
            sigeconomy.com
          </div>
        </div>
      </div>

      {/* Share text + copy hint */}
      {result.shareText && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Share text</div>
          <p className="mt-1 text-sm text-foreground">{result.shareText}</p>
        </div>
      )}

      {/* Params debug (collapsed) */}
      <details className="rounded-lg border border-border bg-muted/20 p-4">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
          Tool parameters
        </summary>
        <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">
          {JSON.stringify(result.params, null, 2)}
        </pre>
      </details>
    </div>
  );
}
