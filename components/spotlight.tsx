import { Crown, TrendingUp, Swords, Zap } from "lucide-react";
import type { Spotlight, DethroneAlert } from "@/lib/campaign";
import { formatYield } from "@/lib/utils";

export function SpotlightSection({
  spotlight,
  dethrone,
}: {
  spotlight: Spotlight;
  dethrone: DethroneAlert;
}) {
  const cards: {
    icon: typeof Crown;
    label: string;
    name: string;
    value: string;
    sub: string;
    href: string;
    color: string;
  }[] = [];

    if (spotlight.topOperator) {
    cards.push({
      icon: Crown,
      label: "The King",
      name: spotlight.topOperator.display_name ?? spotlight.topOperator.codename,
      value: `#${spotlight.topOperator.rank}`,
      sub: `Υ ${formatYield(spotlight.topOperator.yield_)}`,
      href: `https://signalaf.com/user/${spotlight.topOperator.codename}`,
      color: "text-amber-600",
    });
  }

  if (spotlight.closestChallenger) {
    cards.push({
      icon: Swords,
      label: "Challenger",
      name:
        spotlight.closestChallenger.display_name ??
        spotlight.closestChallenger.codename,
      value: `#${spotlight.closestChallenger.rank}`,
      sub: `Υ ${formatYield(spotlight.closestChallenger.yield_)}`,
      href: `https://signalaf.com/user/${spotlight.closestChallenger.codename}`,
      color: "text-red-500",
    });
  }

  if (spotlight.biggestMover) {
    cards.push({
      icon: TrendingUp,
      label: "Biggest Mover",
      name:
        spotlight.biggestMover.display_name ?? spotlight.biggestMover.codename,
      value: `+${spotlight.biggestMover.movement_24h}`,
      sub: `#${spotlight.biggestMover.rank} · Υ ${formatYield(spotlight.biggestMover.yield_)}`,
      href: `https://signalaf.com/user/${spotlight.biggestMover.codename}`,
      color: "text-green-600",
    });
  }

  if (cards.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Dethrone alert */}
      {dethrone.active && dethrone.gap > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-600" />
            <p className="text-sm font-semibold text-red-900">
              Dethrone watch: {dethrone.challengerName} is closing the gap
            </p>
          </div>
          <p className="mt-1 text-xs text-red-700">
            {dethrone.kingName} (Υ {formatYield(dethrone.kingYield)}) leads by{" "}
            {dethrone.gap.toFixed(1)} points. {dethrone.challengerName} (Υ{" "}
            {formatYield(dethrone.challengerYield)}) is rising.
          </p>
        </div>
      )}

      {/* Spotlight cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {card.label}
              </span>
            </div>
            <div className="mt-2 truncate text-lg font-bold">{card.name}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-2xl font-bold tabular-nums ${card.color}`}>
                {card.value}
              </span>
              <span className="text-xs text-muted-foreground">{card.sub}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
