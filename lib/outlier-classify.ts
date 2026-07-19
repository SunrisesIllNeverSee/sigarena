/**
 * lib/outlier-classify.ts — shared outlier classification.
 *
 * Ported from sigrank-app/lib/data/outlier-classify.ts so signaaf.com applies
 * the same Human Center of Mass / Outlier classification as signalaf.com.
 *
 * Human Center of Mass:
 *   - input/total 1%–80% (normal range), OR
 *   - input/total < 1% BUT passes the MOSES-like filter:
 *     velocity ≤ 2x, yield ≤ 1000, output > 1M, cache_write > 1M, OR
 *   - in the HUMAN_WHITELIST (hand-picked, bypasses all checks)
 *
 * Outliers & Bots:
 *   - input/total > 80% (input dump bots), OR
 *   - input/total < 1% AND fails the MOSES-like filter:
 *     velocity > 2x, yield > 1000, output < 1M, or cache_write < 1M
 */

/** Hand-picked humans — verified operators that bypass the input/total ratio filter.
 * These are real humans whose input/total falls below 1% but are confirmed not bots/outliers. */
export const HUMAN_WHITELIST = new Set([
  "signal-92b4f9f485", // MOSES — canonical anchor, verified human
  "transvaultorigin", // MOSES mock codename (fallback path)
]);

/** Classify an operator as an outlier or a human. */
export function isOutlier(params: {
  codename: string;
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  velocity: number;
  yield_: number;
}): boolean {
  const code = params.codename.toLowerCase();
  if (HUMAN_WHITELIST.has(code)) return false;

  const total = params.input + params.output + params.cacheRead + params.cacheWrite;
  if (total <= 0) return false;

  const inputPct = params.input / total;
  if (inputPct > 0.8) return true; // input dump bots
  if (inputPct >= 0.01) return false; // normal human range

  // Gray zone (input < 1%): MOSES-like filter
  if (
    params.velocity > 2.0 ||
    params.yield_ > 1000 ||
    params.output < 1_000_000 ||
    params.cacheWrite < 1_000_000
  ) {
    return true; // extreme outlier
  }
  return false; // MOSES-like — stays human
}

/** Convenience: classify a LeaderboardEntry (the sigarena API row type). */
export function isOutlierEntry(e: {
  codename: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_creation_tokens: number;
  velocity: number;
  yield_: number;
}): boolean {
  return isOutlier({
    codename: e.codename,
    input: e.input_tokens,
    output: e.output_tokens,
    cacheRead: e.cache_read_tokens,
    cacheWrite: e.cache_creation_tokens,
    velocity: e.velocity,
    yield_: e.yield_,
  });
}
