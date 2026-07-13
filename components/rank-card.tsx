import Link from "next/link";
import { ArrowUp, ArrowDown, Minus, Crown } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/api";
import {
  cn,
  formatYield,
  operatorDisplayName,
  operatorSlug,
  platformColor,
  formatMovement,
} from "@/lib/utils";

interface RankCardProps {
  entry: LeaderboardEntry;
  deltaFromAverage?: number;
}

export function RankCard({ entry, deltaFromAverage }: RankCardProps) {
  const movement = formatMovement(entry.movement_24h);
  const isTop3 = entry.rank <= 3;

  const rankStyles = {
    1: "gradient-primary text-white glow-primary",
    2: "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
    3: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
  };

  return (
    <Link
      href={`/operator/${operatorSlug(entry.display_name, entry.codename)}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md",
        isTop3 && "border-primary/20",
        entry.rank === 1 && "glow-gold"
      )}
    >
      {/* Rank number */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold",
          isTop3 ? rankStyles[entry.rank as 1 | 2 | 3] : "bg-muted text-muted-foreground"
        )}
      >
        {entry.rank === 1 ? (
          <Crown className="h-5 w-5" />
        ) : (
          entry.rank
        )}
      </div>

      {/* Operator info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-foreground">
            {operatorDisplayName(entry.display_name, entry.codename)}
          </span>
          {entry.claimed && (
            <span className="shrink-0 rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
              ✓
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn(
              "shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold",
              platformColor(entry.platform)
            )}
          >
            {entry.platform}
          </span>
          <span className="truncate text-xs text-muted-foreground font-mono">
            {entry.cascade_str}
          </span>
        </div>
      </div>

      {/* Yield — the headline metric */}
      <div className="shrink-0 text-right">
        <div className="text-xl font-bold tabular-nums gradient-text">
          {formatYield(entry.yield_)}
        </div>
        <div className="text-xs text-muted-foreground">Υ Yield</div>
        {deltaFromAverage !== undefined && (
          <div className={cn(
            "text-xs tabular-nums font-medium",
            deltaFromAverage >= 0 ? "text-green-600" : "text-red-500"
          )}>
            {deltaFromAverage >= 0 ? "+" : ""}
            {formatYield(deltaFromAverage)} vs avg
          </div>
        )}
      </div>

      {/* Rank change 24h */}
      <div className="hidden shrink-0 w-20 text-right sm:block">
        <div
          className={cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-sm font-medium tabular-nums",
            movement.direction === "up" && "bg-green-100 text-green-700",
            movement.direction === "down" && "bg-red-100 text-red-600",
            movement.direction === "none" && "bg-muted text-muted-foreground"
          )}
        >
          {movement.direction === "up" && <ArrowUp className="h-3 w-3" />}
          {movement.direction === "down" && <ArrowDown className="h-3 w-3" />}
          {movement.direction === "none" && <Minus className="h-3 w-3" />}
          {movement.text}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">24h</div>
      </div>

      {/* Percentile */}
      <div className="hidden shrink-0 w-16 text-right md:block">
        <div className="text-sm font-semibold tabular-nums text-foreground">
          {entry.percentile.toFixed(0)}
        </div>
        <div className="text-xs text-muted-foreground">%ile</div>
      </div>
    </Link>
  );
}
