/**
 * SignalAF API client — reads from signalaf.com's public API.
 * The satellite is read-only. No write paths.
 *
 * Canonical metric sorting: the signalaf.com API only maps `metric=yield` to
 * a real sort; velocity/leverage/snr/dev10x/scale_v/efficiency/cost_per_million/
 * op_ratio fall back to yield sort (API bug, tracked for separate fix). To get
 * correct per-metric ranking, we fetch all 1640 operators once (limit=2000) and
 * sort client-side. The API's `platform=` filter IS used server-side when
 * available; for op_ratio (a string) we sort by leverage (the lead term).
 */

import type { CanonicalMetric, Platform, View } from "./prompts";
import { operatorSlug } from "./utils";

const API_BASE = "https://signalaf.com/api/v1";

export interface LeaderboardEntry {
  rank: number;
  operator_id: string;
  codename: string;
  display_name: string | null;
  claimed: boolean;
  class_tier: string;
  platform: string;
  yield_: number;
  leverage: number;
  velocity: number;
  snr: number;
  dev10x: number;
  signa_rate: number;
  compression_ratio: number;
  session_depth: number;
  token_throughput: number;
  prompt_complexity: number;
  cross_thread: number;
  signal_force: number;
  input_tokens: number;
  output_tokens: number;
  cache_creation_tokens: number;
  cache_read_tokens: number;
  total_tokens: number;
  scale_v: number;
  efficiency: number;
  cost_per_million: number;
  op_ratio: string;
  cascade_str: string;
  non_compounding: boolean;
  percentile: number;
  last_seen: string;
  movement_24h: number;
  movement_7d: number;
  is_placeholder: boolean;
}

export interface LeaderboardResponse {
  metric: string;
  window: string;
  generated_at: string;
  ruleset_version: string;
  total_operators: number;
  entries: LeaderboardEntry[];
}

export interface OperatorRank {
  global: number;
  percentile: number;
}

export interface OperatorMetrics {
  signa_rate: number;
  yield_: number;
  leverage: number;
  velocity: number;
  snr: number;
  dev10x: number;
  compression_ratio: number;
  session_depth: number;
  prompt_complexity: number;
  prompt_complexity_confidence: string;
  cross_thread: number;
  token_throughput: number;
  signal_force: number;
  drift_ratio: number;
  sdot_score: number;
  sdrm_score: number;
}

export interface OperatorResponse {
  operator_id: string;
  codename: string;
  display_name: string | null;
  claimed: boolean;
  class_tier: string;
  platform: string;
  supporter_tier: string;
  verification_status: string;
  account_age_days: number;
  total_messages: number;
  current_rank: OperatorRank;
  current_metrics: OperatorMetrics;
  movement_24h: number;
  movement_7d: number;
  last_seen: string;
  ruleset_version: string;
  is_placeholder: boolean;
  input_tokens: number;
  output_tokens: number;
  cache_creation_tokens: number;
  cache_read_tokens: number;
  total_tokens: number;
  scale_v: number;
  efficiency: number;
  cost_per_million: number;
  op_ratio: string;
  cascade_str: string;
  non_compounding: boolean;
}

/**
 * Fetch the full leaderboard. ISR caches for 5 minutes.
 * NOTE: on Cloudflare Workers with OpenNext `incrementalCache: "dummy"`,
 * ISR does not actually cache — every request live-fetches. Phase 2 switches
 * to Static Generation for true daily snapshots.
 */
export async function getLeaderboard(
  window: string = "all_time",
  limit: number = 100,
  metric: string = "yield"
): Promise<LeaderboardResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/leaderboard?window=${window}&limit=${limit}&metric=${metric}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as LeaderboardResponse;
  } catch {
    return null;
  }
}

/**
 * Fetch ALL operators (up to 2000, the public cap) for client-side sorting.
 * Used when the API can't sort by the requested canonical metric (everything
 * except yield). One fetch, then sort/slice locally.
 */
export async function getFullLeaderboard(
  window: string = "all_time"
): Promise<LeaderboardResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/leaderboard?window=${window}&limit=2000&metric=yield`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as LeaderboardResponse;
  } catch {
    return null;
  }
}

/**
 * Sort value for a canonical metric. Pure function — no API calls.
 * Matches sigrank-app/lib/data/sort-value.ts logic:
 *   - non-compounding operators sort below compounding (yield/leverage/dev10x → -1/-999)
 *   - cost_per_million: lower is better → negate so desc sort puts cheapest first
 *   - op_ratio: sort on leverage (the lead term)
 */
export function metricSortValue(entry: LeaderboardEntry, metric: CanonicalMetric): number {
  const c = entry;
  switch (metric) {
    case "yield":
      return c.non_compounding ? -1 : c.yield_;
    case "velocity":
      return c.velocity;
    case "leverage":
      return c.non_compounding ? -1 : c.leverage;
    case "snr":
      return c.snr;
    case "dev10x":
      return c.non_compounding || c.dev10x == null ? -999 : c.dev10x;
    case "scale_v":
      return c.scale_v;
    case "efficiency":
      return c.efficiency;
    case "cost_per_million":
      // Lower $/1M is better → negate so the cheapest sorts to the TOP (desc order).
      // $0/M is a real, valid value (cache-heavy operators like MO§ES — cache_read is
      // nearly free). Only null/undefined (no cost data) sorts last.
      return typeof c.cost_per_million === "number"
        ? -c.cost_per_million
        : -Infinity;
    case "op_ratio":
      // Op Ratio = leverage:1:velocity → sort on leverage (the lead term).
      return c.non_compounding ? -1 : c.leverage;
    default:
      return c.yield_;
  }
}

/**
 * Get the leaderboard sorted by a canonical metric, with optional platform
 * filter and view (Peak vs Center). Fetches all 1640 once, sorts client-side,
 * slices to the requested limit.
 *
 * - metric: canonical metric to sort by (yield, velocity, leverage, snr, dev10x,
 *   scale_v, efficiency, cost_per_million, op_ratio)
 * - platform: filter to a single platform (all = no filter)
 * - view: "peak" (top N, outliers included) or "center" (outliers >100x median trimmed)
 * - limit: how many entries to return (default 100)
 */
export async function getSortedLeaderboard(
  metric: CanonicalMetric,
  platform: Platform = "all",
  view: View = "peak",
  limit: number = 100,
  window: string = "all_time"
): Promise<LeaderboardResponse | null> {
  const data = await getFullLeaderboard(window);
  if (!data) return null;

  // Platform filter
  let entries = data.entries;
  if (platform !== "all") {
    entries = entries.filter((e) => e.platform === platform);
  }

  // Sort by the canonical metric (client-side)
  const sorted = [...entries].sort(
    (a, b) => metricSortValue(b, metric) - metricSortValue(a, metric)
  );

  // View: Center trims outliers >100x the median of the FULL board (pre-filter)
  let viewEntries = sorted;
  if (view === "center") {
    if (metric === "cost_per_million") {
      // cost_per_million is inverted (lower = better). The "peak" is the ~$0/M
      // cache-heavy operators (MO§ES). The "center" is operators with a real
      // positive cost — the dense middle of what people actually pay.
      viewEntries = sorted.filter(
        (e) => typeof e.cost_per_million === "number" && e.cost_per_million > 0
      );
    } else {
      const allYields = data.entries
        .map((e) => e.yield_)
        .filter((y) => typeof y === "number" && y > 0)
        .sort((a, b) => a - b);
      const n = allYields.length;
      if (n > 0) {
        const median = n % 2 ? allYields[(n - 1) / 2] : (allYields[n / 2 - 1] + allYields[n / 2]) / 2;
        const threshold = median * 100;
        // Trim operators whose metric value exceeds 100x the yield median.
        // For yield-family metrics this removes the extreme cache-reuse outliers
        // (Richard Fu, younhomaeng-svg, etc.). For log-scaled metrics (scale_v,
        // dev10x) the 100x threshold rarely trims anything — log scale already
        // compresses the distribution.
        viewEntries = sorted.filter((e) => metricSortValue(e, metric) < threshold);
      }
    }
  }

  // Slice to limit + re-rank
  const sliced = viewEntries.slice(0, limit).map((e, i) => ({
    ...e,
    rank: i + 1,
  }));

  return {
    metric,
    window: data.window,
    generated_at: data.generated_at,
    ruleset_version: data.ruleset_version,
    total_operators: entries.length,
    entries: sliced,
  };
}

/**
 * Fetch a single operator's profile. ISR caches for 5 minutes.
 */
export async function getOperator(codename: string): Promise<OperatorResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/operators/${codename}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as OperatorResponse;
  } catch {
    return null;
  }
}

/**
 * Compute delta from the average yield across all operators.
 */
export function computeDeltaFromAverage(entries: LeaderboardEntry[]): {
  average: number;
  deltas: Map<string, number>;
} {
  if (entries.length === 0) return { average: 0, deltas: new Map() };
  const average = entries.reduce((sum, e) => sum + e.yield_, 0) / entries.length;
  const deltas = new Map<string, number>();
  for (const e of entries) {
    deltas.set(e.codename, e.yield_ - average);
  }
  return { average, deltas };
}

/**
 * Build a slug → codename lookup map from leaderboard entries.
 * Used to resolve SEO-friendly URL slugs back to API codenames.
 */
export function buildSlugMap(entries: LeaderboardEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const e of entries) {
    const slug = operatorSlug(e.display_name, e.codename);
    map.set(slug, e.codename);
    // Also map codename → codename so old links still work
    map.set(e.codename, e.codename);
  }
  return map;
}

/**
 * Resolve a slug (or legacy codename) to a codename via the leaderboard.
 * Returns null if not found.
 */
export async function resolveCodename(slug: string): Promise<string | null> {
  const data = await getFullLeaderboard("all_time");
  if (!data) return null;
  const slugMap = buildSlugMap(data.entries);
  return slugMap.get(slug) ?? null;
}
