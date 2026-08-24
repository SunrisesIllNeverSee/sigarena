/**
 * Best-effort per-IP fixed-window rate limiter for public API endpoints.
 *
 * sigeconomy.com is a read-only satellite — the canonical REST API lives on
 * signalaf.com. These headers let agents self-throttle when probing the
 * satellite's own routes (/api, /api/indexnow).
 *
 * Policy: 60 requests per 60 seconds per IP.
 */

interface RateState {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000;
const LIMIT = 60;

const buckets = new Map<string, RateState>();

interface RateResult {
  ok: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
}

export function rateLimit(ip: string): RateResult {
  const now = Date.now();
  const state = buckets.get(ip);

  if (!state || now - state.windowStart >= WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return {
      ok: true,
      limit: LIMIT,
      remaining: LIMIT - 1,
      reset: Math.ceil(WINDOW_MS / 1000),
      retryAfter: 0,
    };
  }

  state.count += 1;
  const remaining = Math.max(0, LIMIT - state.count);
  const resetSec = Math.ceil((state.windowStart + WINDOW_MS - now) / 1000);

  if (state.count > LIMIT) {
    return {
      ok: false,
      limit: LIMIT,
      remaining: 0,
      reset: resetSec,
      retryAfter: resetSec,
    };
  }

  return {
    ok: true,
    limit: LIMIT,
    remaining,
    reset: resetSec,
    retryAfter: 0,
  };
}

export function rateLimitHeaders(rl: RateResult): Record<string, string> {
  return {
    "RateLimit-Policy": "60;w=60",
    "RateLimit": `limit=${rl.limit}, remaining=${rl.remaining}, reset=${rl.reset}`,
    "RateLimit-Limit": String(rl.limit),
    "RateLimit-Remaining": String(rl.remaining),
    "RateLimit-Reset": String(rl.reset),
  };
}

export function getClientIp(request: { headers: Headers }): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
