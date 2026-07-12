import { notFound } from "next/navigation";
import { getOperator } from "@/lib/api";
import {
  operatorDisplayName,
  platformColor,
  formatYield,
  formatNumber,
  formatMovement,
} from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus, Share2, Swords } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ codename: string }>;
}) {
  const { codename } = await params;
  const op = await getOperator(codename);

  if (!op) notFound();

  const name = operatorDisplayName(op.display_name, op.codename);
  const movement = formatMovement(op.movement_24h);
  const m7d = formatMovement(op.movement_7d);
  const m = op.current_metrics;
  const pillars = [
    { label: "Cache Read", value: op.cache_read_tokens, color: "bg-blue-500" },
    { label: "Output", value: op.output_tokens, color: "bg-green-500" },
    { label: "Input", value: op.input_tokens, color: "bg-orange-500" },
    { label: "Cache Write", value: op.cache_creation_tokens, color: "bg-purple-500" },
  ];
  const maxPillar = Math.max(...pillars.map((p) => p.value));

  const shareText = `I'm #${op.current_rank.global} on the AI User Leaderboard with Υ ${formatYield(op.current_metrics.yield_)}. Where do you rank?`;
  const shareUrl = `https://arena.signalaf.com/operator/${op.codename}`;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All operators
      </Link>

      {/* Profile header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`rounded border px-2 py-0.5 text-xs font-medium ${platformColor(op.platform)}`}
              >
                {op.platform}
              </span>
              {op.claimed && (
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Claimed
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-3xl font-bold tabular-nums">
              #{op.current_rank.global}
            </div>
            <div className="text-sm text-muted-foreground">
              {op.current_rank.percentile.toFixed(0)}th percentile
            </div>
          </div>
        </div>

        {/* Headline metric */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="text-2xl font-bold tabular-nums">
              {formatYield(m.yield_)}
            </div>
            <div className="text-xs text-muted-foreground">Υ Yield</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="text-2xl font-bold tabular-nums">
              {m.leverage.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Leverage</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="text-2xl font-bold tabular-nums">
              {m.dev10x.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">10xDEV</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="text-2xl font-bold tabular-nums">
              {m.signa_rate.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">SIGNA Rate</div>
          </div>
        </div>

        {/* Movement */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">24h:</span>
            <span
              className={
                movement.direction === "up"
                  ? "text-green-600"
                  : movement.direction === "down"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }
            >
              {movement.direction === "up" && <ArrowUp className="inline h-3 w-3" />}
              {movement.direction === "down" && <ArrowDown className="inline h-3 w-3" />}
              {movement.direction === "none" && <Minus className="inline h-3 w-3" />}
              {movement.text}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">7d:</span>
            <span
              className={
                m7d.direction === "up"
                  ? "text-green-600"
                  : m7d.direction === "down"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }
            >
              {m7d.direction === "up" && <ArrowUp className="inline h-3 w-3" />}
              {m7d.direction === "down" && <ArrowDown className="inline h-3 w-3" />}
              {m7d.direction === "none" && <Minus className="inline h-3 w-3" />}
              {m7d.text}
            </span>
          </div>
        </div>
      </div>

      {/* Token pillars */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Token cascade</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {op.cascade_str} — the four pillars that compute Υ Yield
        </p>
        <div className="mt-4 space-y-3">
          {pillars.map((p) => (
            <div key={p.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{p.label}</span>
                <span className="font-medium tabular-nums">
                  {formatNumber(p.value)}
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${p.color}`}
                  style={{ width: `${(p.value / maxPillar) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional metrics */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Full metrics</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Velocity", value: m.velocity.toFixed(3) },
            { label: "SNR", value: m.snr.toFixed(3) },
            { label: "Compression", value: `${(m.compression_ratio * 100).toFixed(1)}%` },
            { label: "Session Depth", value: m.session_depth.toString() },
            { label: "Cross Thread", value: m.cross_thread.toString() },
            { label: "Signal Force", value: m.signal_force.toFixed(1) },
            { label: "Prompt Complexity", value: m.prompt_complexity.toFixed(2) },
            { label: "Token Throughput", value: formatNumber(m.token_throughput) },
            { label: "Op Ratio", value: op.op_ratio.toFixed(3) },
          ].map((metric) => (
            <div key={metric.label} className="rounded-lg bg-muted/30 p-3">
              <div className="text-sm font-semibold tabular-nums">{metric.value}</div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted/50"
        >
          <Share2 className="h-4 w-4" />
          Post my rank on X
        </a>
        <Link
          href={`/compare?a=${op.codename}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted/50"
        >
          <Swords className="h-4 w-4" />
          Challenge this operator
        </Link>
        <a
          href="https://signalaf.com/score"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Check my rank
        </a>
      </div>
    </div>
  );
}
