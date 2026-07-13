/**
 * SignalAF API client — reads from signalaf.com's public API.
 * The satellite is read-only. No write paths.
 */

const API_BASE = "https://signalaf.com/api/v1";

import { operatorSlug } from "./utils";

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
  const data = await getLeaderboard("all_time", 100, "yield");
  if (!data) return null;
  const slugMap = buildSlugMap(data.entries);
  return slugMap.get(slug) ?? null;
}
