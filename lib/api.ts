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
 *
 * Caching: OpenNext's incrementalCache is "dummy" on Cloudflare free tier, so
 * Next.js fetch-level revalidate is a no-op. We use the Cloudflare Cache API
 * (caches.default) directly to cache API responses at the edge for 5 minutes.
 * This prevents request spikes from amplifying into API spikes — a 3.5k
 * req/5min burst on /best-ai-user results in ~2 API calls, not 7k.
 */

import type { CanonicalMetric, Platform, View, Category } from "./prompts";
import { operatorSlug } from "./utils";
import { isOutlierEntry } from "./outlier-classify";

const API_BASE = "https://signalaf.com/api/v1";
const CACHE_TTL = 300; // 5 minutes — matches the API's Cache-Control

/**
 * Edge-cached fetch using the Cloudflare Cache API (caches.default).
 * Falls back to a plain fetch when the Cache API is unavailable (build-time,
 * local dev, non-Cloudflare runtimes). The cache key is the full URL.
 *
 * Uses a Request object as the cache key (required by the Cache API for
 * cross-origin responses — a bare URL string doesn't carry the method/body
 * context the cache needs).
 */
async function cachedFetch(url: string): Promise<Response> {
  // Cloudflare Workers expose `caches` as a global. During Next.js build
  // (static generation) or local dev, it's undefined — fall back to plain fetch.
  if (typeof caches !== "undefined" && caches.default) {
    const cache = caches.default;
    const cacheKey = new Request(url, { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }
    const res = await fetch(url);
    if (res.ok) {
      // Clone the response — one copy goes to the caller, one to the cache.
      // The cached copy needs explicit cache headers since the upstream
      // response may have private/no-cache directives.
      const bodyClone = res.clone();
      const cachedRes = new Response(bodyClone.body, {
        status: res.status,
        statusText: res.statusText,
        headers: new Headers(res.headers),
      });
      cachedRes.headers.set("Cache-Control", `public, max-age=${CACHE_TTL}`);
      // Use the same Request as the key for put() — must match what match() used.
      await cache.put(cacheKey, cachedRes);
    }
    return res;
  }
  return fetch(url);
}

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
 * Fetch the full leaderboard. Cached for 5 minutes via Next.js fetch-level
 * revalidate (matches the API's Cache-Control: max-age=300). This prevents
 * every page request from triggering an API call — the first request fetches,
 * subsequent requests within 300s use the cached response.
 */
export async function getLeaderboard(
  window: string = "all_time",
  limit: number = 100,
  metric: string = "yield",
  category: Category = "human"
): Promise<LeaderboardResponse | null> {
  try {
    const res = await cachedFetch(
      `${API_BASE}/leaderboard?window=${window}&limit=${limit}&metric=${metric}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as LeaderboardResponse;
    // Category filter: "human" excludes outliers (Human Center of Mass only).
    if (category === "human") {
      const filtered = data.entries.filter((e) => !isOutlierEntry(e));
      return { ...data, entries: filtered, total_operators: filtered.length };
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetch ALL operators (up to 2000, the public cap) for client-side sorting.
 * Used when the API can't sort by the requested canonical metric (everything
 * except yield). One fetch, then sort/slice locally. Cached for 5 minutes.
 */
export async function getFullLeaderboard(
  window: string = "all_time"
): Promise<LeaderboardResponse | null> {
  try {
    const res = await cachedFetch(
      `${API_BASE}/leaderboard?window=${window}&limit=2000&metric=yield`,
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
      // Non-compounding operators (null yield, e.g. MO§ES™) are excluded — their $0/M
      // is an artifact of having no compounding session data, not a real cost-efficiency
      // achievement. They sort last, same as yield/leverage/dev10x.
      return c.non_compounding || typeof c.cost_per_million !== "number"
        ? -Infinity
        : -c.cost_per_million;
    case "op_ratio":
      // Op Ratio = leverage:1:velocity → sort on leverage (the lead term).
      return c.non_compounding ? -1 : c.leverage;
    default:
      return c.yield_;
  }
}

/**
 * Sort, filter, and slice an already-fetched leaderboard by a canonical metric.
 * Pure function — no API calls. Use this when the caller has already fetched
 * the full board (e.g. the homepage fetches once and reuses the data for
 * multiple sections) to avoid redundant 1640-row network fetches.
 *
 * - data: the full leaderboard response (from getFullLeaderboard)
 * - metric: canonical metric to sort by (yield, velocity, leverage, snr, dev10x,
 *   scale_v, efficiency, cost_per_million, op_ratio)
 * - platform: filter to a single platform (all = no filter)
 * - view: "peak" (top N, outliers included) or "center" (outliers >100x median trimmed)
 * - category: "human" (Human Center of Mass only, outliers excluded — default)
 *   or "all" (include outliers & bots). Mirrors signalaf.com's board filter.
 * - limit: how many entries to return (default 100)
 */
export function sortLeaderboard(
  data: LeaderboardResponse,
  metric: CanonicalMetric,
  platform: Platform = "all",
  view: View = "peak",
  limit: number = 100,
  category: Category = "human",
): LeaderboardResponse {
  // Platform filter
  let entries = data.entries;
  if (platform !== "all") {
    entries = entries.filter((e) => e.platform === platform);
  }

  // Category filter: "human" excludes outliers (Human Center of Mass only).
  // Applied BEFORE sort so the median + Center trim use the human-only board.
  if (category === "human") {
    entries = entries.filter((e) => !isOutlierEntry(e));
  }

  // Sort by the canonical metric (client-side)
  const sorted = [...entries].sort(
    (a, b) => metricSortValue(b, metric) - metricSortValue(a, metric)
  );

  // View: Center trims outliers >100x the median of the FULL board (pre-filter),
  // computed on the SAME metric being sorted. The previous implementation used the
  // yield median for every metric, which made the Center toggle a no-op for
  // bounded metrics (snr 0–1, dev10x ~0–5, scale_v ~0–16) and applied an
  // arbitrary yield-derived cutoff to velocity/leverage/efficiency/op_ratio.
  let viewEntries = sorted;
  if (view === "center") {
    if (metric === "cost_per_million") {
      // cost_per_million is inverted (lower = better). Non-compounding operators
      // are already sorted last by metricSortValue. The Center view trims the
      // cheapest compounding outliers (the cache-heavy operators near $0.35/M)
      // to show the dense middle of what people actually pay.
      viewEntries = sorted.filter(
        (e) => !e.non_compounding && typeof e.cost_per_million === "number" && e.cost_per_million > 0
      );
    } else {
      // Collect the metric's own values across the full (pre-filter) board,
      // excluding sentinel values that metricSortValue emits for non-compounding
      // or missing-data operators (-1 for non-compounding yield/leverage/op_ratio,
      // -999 for non-compounding dev10x). These are not real measurements and
      // would corrupt the median.
      const allValues = data.entries
        .map((e) => metricSortValue(e, metric))
        .filter((v) => typeof v === "number" && v > 0 && isFinite(v))
        .sort((a, b) => a - b);
      const n = allValues.length;
      if (n > 0) {
        const median = n % 2 ? allValues[(n - 1) / 2] : (allValues[n / 2 - 1] + allValues[n / 2]) / 2;
        const threshold = median * 100;
        // Trim operators whose metric value exceeds 100x the metric's own median.
        // For yield-family metrics this removes the extreme cache-reuse outliers
        // (Richard Fu, younhomaeng-svg, etc.). For bounded metrics (snr, dev10x,
        // scale_v) the 100x threshold is mathematically unreachable, so the
        // Center view shows the full sorted board — which is correct: there are
        // no outliers to trim when the metric is already log-scaled or bounded.
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
 * Get the leaderboard sorted by a canonical metric, with optional platform
 * filter and view (Peak vs Center). Fetches all 1640 once, sorts client-side,
 * slices to the requested limit. Callers that already have the full board
 * should call `sortLeaderboard` directly to avoid a redundant fetch.
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
  window: string = "all_time",
  category: Category = "human",
): Promise<LeaderboardResponse | null> {
  const data = await getFullLeaderboard(window);
  if (!data) return null;
  return sortLeaderboard(data, metric, platform, view, limit, category);
}

/**
 * Fetch a single operator's profile. Cached for 5 minutes.
 */
export async function getOperator(codename: string): Promise<OperatorResponse | null> {
  try {
    const res = await cachedFetch(`${API_BASE}/operators/${codename}`);
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
