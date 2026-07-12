import Link from "next/link";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/api";
import {
  cn,
  formatYield,
  operatorDisplayName,
  classTierColor,
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
  const rankColors = {
    1: "text-amber-600",
    2: "text-gray-400",
    3: "text-orange-700",
  };

  return (
    <Link
      href={`/operator/${entry.codename}`}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm",
        isTop3 && "border-primary/20"
      )}
    >
      {/* Rank number */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold",
          entry.rank <= 3
            ? cn("bg-primary/5", rankColors[entry.rank as 1 | 2 | 3])
            : "text-muted-foreground"
        )}
      >
        {entry.rank}
      </div>

      {/* Operator info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-foreground">
            {operatorDisplayName(entry.display_name, entry.codename)}
          </span>
          {entry.claimed && (
            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              ✓
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn(
              "shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium",
              platformColor(entry.platform)
            )}
          >
            {entry.platform}
          </span>
          <span
            className={cn(
              "shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium",
              classTierColor(entry.class_tier)
            )}
          >
            {entry.class_tier}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {entry.cascade_str}
          </span>
        </div>
      </div>

      {/* Yield — the headline metric */}
      <div className="shrink-0 text-right">
        <div className="text-lg font-bold tabular-nums text-foreground">
          {formatYield(entry.yield_)}
        </div>
        <div className="text-xs text-muted-foreground">Υ Yield</div>
        {deltaFromAverage !== undefined && (
          <div className="text-xs tabular-nums text-muted-foreground">
            {deltaFromAverage >= 0 ? "+" : ""}
            {formatYield(deltaFromAverage)} vs avg
          </div>
        )}
      </div>

      {/* Rank change 24h */}
      <div className="hidden shrink-0 w-20 text-right sm:block">
        <div
          className={cn(
            "inline-flex items-center gap-0.5 text-sm font-medium tabular-nums",
            movement.direction === "up" && "text-green-600",
            movement.direction === "down" && "text-red-500",
            movement.direction === "none" && "text-muted-foreground"
          )}
        >
          {movement.direction === "up" && <ArrowUp className="h-3 w-3" />}
          {movement.direction === "down" && <ArrowDown className="h-3 w-3" />}
          {movement.direction === "none" && <Minus className="h-3 w-3" />}
          {movement.text}
        </div>
        <div className="text-xs text-muted-foreground">24h</div>
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
