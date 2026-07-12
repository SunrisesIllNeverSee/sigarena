import { getLeaderboard, getOperator } from "@/lib/api";
import {
  operatorDisplayName,
  classTierColor,
  platformColor,
  formatYield,
} from "@/lib/utils";
import { Crown } from "lucide-react";

export const revalidate = 300;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const params = await searchParams;
  const board = await getLeaderboard("all_time", 100, "yield");

  const codenameA = params.a ?? board?.entries[0]?.codename;
  const codenameB = params.b ?? board?.entries[1]?.codename;

  const [opA, opB] = await Promise.all([
    codenameA ? getOperator(codenameA) : null,
    codenameB ? getOperator(codenameB) : null,
  ]);

  if (!board || !opA || !opB) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">
          Could not load operator data. Try again in a moment.
        </p>
      </div>
    );
  }

  const winner = opA.current_metrics.yield_ >= opB.current_metrics.yield_ ? "a" : "b";
  const metrics = [
    { label: "Υ Yield", a: opA.current_metrics.yield_, b: opB.current_metrics.yield_, format: formatYield },
    { label: "Leverage", a: opA.current_metrics.leverage, b: opB.current_metrics.leverage, format: (n: number) => n.toFixed(1) },
    { label: "10xDEV", a: opA.current_metrics.dev10x, b: opB.current_metrics.dev10x, format: (n: number) => n.toFixed(2) },
    { label: "SIGNA Rate", a: opA.current_metrics.signa_rate, b: opB.current_metrics.signa_rate, format: (n: number) => n.toFixed(1) },
    { label: "Velocity", a: opA.current_metrics.velocity, b: opB.current_metrics.velocity, format: (n: number) => n.toFixed(3) },
    { label: "SNR", a: opA.current_metrics.snr, b: opB.current_metrics.snr, format: (n: number) => n.toFixed(3) },
    { label: "Compression", a: opA.current_metrics.compression_ratio, b: opB.current_metrics.compression_ratio, format: (n: number) => `${(n * 100).toFixed(1)}%` },
    { label: "Session Depth", a: opA.current_metrics.session_depth, b: opB.current_metrics.session_depth, format: (n: number) => n.toString() },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Head-to-head</h1>
        <p className="mt-2 text-muted-foreground">Who&apos;s the better AI user?</p>
      </div>

      {/* Operator selectors */}
      <div className="grid grid-cols-2 gap-4">
        {[opA, opB].map((op, i) => (
          <div key={op.codename} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums text-muted-foreground">
                #{op.current_rank.global}
              </span>
              <div className="min-w-0">
                <div className="truncate font-semibold">
                  {operatorDisplayName(op.display_name, op.codename)}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`rounded border px-1.5 py-0.5 text-xs font-medium ${platformColor(op.platform)}`}>
                    {op.platform}
                  </span>
                  <span className={`rounded border px-1.5 py-0.5 text-xs font-medium ${classTierColor(op.class_tier)}`}>
                    {op.class_tier}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Winner banner */}
      <div className="flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 py-3 text-center">
        <Crown className="h-5 w-5 text-amber-600" />
        <span className="font-semibold text-amber-900">
          {operatorDisplayName((winner === "a" ? opA : opB).display_name, (winner === "a" ? opA : opB).codename)}{" "}
          wins with higher Υ Yield
        </span>
      </div>

      {/* Comparison table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Metric</th>
              <th className="px-4 py-3 text-right font-medium">
                {operatorDisplayName(opA.display_name, opA.codename)}
              </th>
              <th className="px-4 py-3 text-right font-medium">
                {operatorDisplayName(opB.display_name, opB.codename)}
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => {
              const aWins = m.a >= m.b;
              return (
                <tr key={m.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{m.label}</td>
                  <td className={`px-4 py-3 text-right tabular-nums font-semibold ${aWins ? "text-primary" : ""}`}>
                    {m.format(m.a)}
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums font-semibold ${!aWins ? "text-primary" : ""}`}>
                    {m.format(m.b)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-lg font-semibold">Think you can beat them?</p>
        <a
          href="https://signalaf.com/score"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Check my rank
        </a>
      </div>
    </div>
  );
}
