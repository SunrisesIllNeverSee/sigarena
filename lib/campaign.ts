/**
 * Campaign engine — derives weekly drop content from leaderboard data.
 * No database, no auth. All derived from the public API.
 */

import type { LeaderboardEntry, LeaderboardResponse } from "./api";

export interface Spotlight {
  biggestMover: LeaderboardEntry | null;
  closestChallenger: LeaderboardEntry | null;
  highestYield: LeaderboardEntry | null;
  topOperator: LeaderboardEntry | null;
}

/**
 * Derive spotlight operators from the leaderboard.
 * - biggestMover: largest positive movement_24h
 * - closestChallenger: #2 operator (closest to dethroning #1)
 * - highestYield: highest yield (same as #1 if sorted by yield)
 * - topOperator: #1
 */
export function deriveSpotlight(data: LeaderboardResponse): Spotlight {
  const entries = data.entries;
  if (entries.length === 0) {
    return {
      biggestMover: null,
      closestChallenger: null,
      highestYield: null,
      topOperator: null,
    };
  }

  const sorted = [...entries].sort((a, b) => b.movement_24h - a.movement_24h);
  const biggestMover = sorted[0]?.movement_24h > 0 ? sorted[0] : null;

  return {
    biggestMover,
    closestChallenger: entries[1] ?? null,
    highestYield: entries[0] ?? null,
    topOperator: entries[0] ?? null,
  };
}

export interface DethroneAlert {
  active: boolean;
  kingName: string;
  kingYield: number;
  challengerName: string;
  challengerYield: number;
  gap: number;
}

/**
 * Check if #1 changed recently (movement_24h on #1 is negative,
 * or #2 has positive movement closing the gap).
 */
export function checkDethrone(data: LeaderboardResponse): DethroneAlert {
  const entries = data.entries;
  if (entries.length < 2) {
    return {
      active: false,
      kingName: "",
      kingYield: 0,
      challengerName: "",
      challengerYield: 0,
      gap: 0,
    };
  }

  const king = entries[0];
  const challenger = entries[1];
  const gap = king.yield_ - challenger.yield_;
  const kingDropping = king.movement_24h < 0;
  const challengerRising = challenger.movement_24h > 0;

  return {
    active: kingDropping || challengerRising,
    kingName: king.display_name ?? king.codename,
    kingYield: king.yield_,
    challengerName: challenger.display_name ?? challenger.codename,
    challengerYield: challenger.yield_,
    gap,
  };
}

export interface WeeklyDrop {
  weekLabel: string;
  generatedAt: string;
  totalOperators: number;
  topOperator: LeaderboardEntry | null;
  biggestMovers: LeaderboardEntry[];
  biggestLosers: LeaderboardEntry[];
  newChallengers: LeaderboardEntry[];
  classDistribution: Record<string, number>;
  platformDistribution: Record<string, number>;
  shareText: string;
  shareUrl: string;
}

/**
 * Build a weekly drop summary from leaderboard data.
 * This is the content for the /weekly page — a structured
 * "this week's rankings" summary that's shareable.
 */
export function buildWeeklyDrop(data: LeaderboardResponse): WeeklyDrop {
  const entries = data.entries;
  const now = new Date(data.generated_at);
  const weekLabel = `Week of ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const sorted = [...entries].sort((a, b) => b.movement_24h - a.movement_24h);
  const biggestMovers = sorted.filter((e) => e.movement_24h > 0).slice(0, 3);
  const biggestLosers = sorted
    .filter((e) => e.movement_24h < 0)
    .slice(-3)
    .reverse();

  // New challengers = operators with movement_7d > 0 who are in top 10
  const newChallengers = entries
    .filter((e) => e.movement_7d > 0 && e.rank <= 10)
    .slice(0, 3);

  const classDistribution: Record<string, number> = {};
  const platformDistribution: Record<string, number> = {};
  for (const e of entries) {
    classDistribution[e.class_tier] = (classDistribution[e.class_tier] ?? 0) + 1;
    platformDistribution[e.platform] = (platformDistribution[e.platform] ?? 0) + 1;
  }

  const topOp = entries[0] ?? null;
  const topName = topOp?.display_name ?? topOp?.codename ?? "Unknown";
  const topYield = topOp?.yield_?.toFixed(1) ?? "0";

  const shareText = `This week's #1 AI user: ${topName} with Υ ${topYield}. ${data.total_operators} operators ranked. Where do you stand?`;
  const shareUrl = "https://sigarena.signalaf.com/weekly";

  return {
    weekLabel,
    generatedAt: data.generated_at,
    totalOperators: data.total_operators,
    topOperator: topOp,
    biggestMovers,
    biggestLosers,
    newChallengers,
    classDistribution,
    platformDistribution,
    shareText,
    shareUrl,
  };
}
