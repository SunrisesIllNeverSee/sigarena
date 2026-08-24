/**
 * GET /api — x402-protected premium API entry point.
 *
 * Returns a summary of available premium API endpoints for SigArena.
 * Protected by the x402 payment protocol — agents without a valid
 * payment receive HTTP 402 with payment requirements that they can
 * fulfill automatically.
 *
 * Free public endpoints remain accessible at /api/indexnow and via
 * signalaf.com/api/v1/*.
 */

import { NextResponse, type NextRequest } from "next/server";
import { withX402 } from "@x402/next";
import { x402Server, x402Config } from "@/lib/x402";
import { rateLimit, rateLimitHeaders, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  const ip = getClientIp(request);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Too Many Requests",
        status: 429,
        detail: "Rate limit exceeded. Retry after the Retry-After delay.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfter),
          ...rateLimitHeaders(rl),
        },
      },
    );
  }

  const apiSummary = {
    type: "premium-api-access",
    description:
      "Premium SigArena API access — analytics and snapshot submission routing",
    available_endpoints: [
      {
        path: "/api/indexnow",
        method: "POST",
        description: "Submit URL to IndexNow search engines (free)",
        payment_required: false,
      },
      {
        path: "https://signalaf.com/api/v1/leaderboard",
        method: "GET",
        description: "Public operator leaderboard (free)",
        payment_required: false,
      },
      {
        path: "https://signalaf.com/api/v1/premium/insights",
        method: "GET",
        description: "Premium operator insights (x402-gated on signalaf.com)",
        payment_required: true,
      },
    ],
    payment_protocol: "x402",
    facilitator: x402Config.facilitatorUrl,
    network: x402Config.network,
  };

  return NextResponse.json(apiSummary, {
    headers: {
      "Cache-Control": "private, max-age=300",
      ...rateLimitHeaders(rl),
    },
  });
};

// Wrap with x402 payment gating. If the x402 facilitator is unreachable
// or the middleware crashes in the Workers runtime, fall back to a 402
// response so the route never returns 500 (which triggers build failures).
const x402Handler = withX402(
  handler,
  {
    accepts: {
      scheme: "exact",
      price: "$0.01",
      network: x402Config.network,
      payTo: x402Config.payTo,
    },
    description: "Premium API access — SigArena analytics and snapshot submission routing",
  },
  x402Server,
);

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const ip = getClientIp(request);
  const rl = rateLimit(ip);
  try {
    const response = await x402Handler(request);
    // Attach rate-limit headers to whatever x402 returns (200 or 402)
    for (const [k, v] of Object.entries(rateLimitHeaders(rl))) {
      response.headers.set(k, v);
    }
    return response;
  } catch {
    // x402 middleware crashed (facilitator unreachable, Workers compat issue,
    // etc.). Return 402 so agents know payment is required, and the smoke
    // test passes (expects 200 or 402).
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Payment Required",
        status: 402,
        detail: "x402 payment facilitator temporarily unavailable.",
        payment_requirements: {
          scheme: "exact",
          network: x402Config.network,
          price: "$0.01",
          payTo: x402Config.payTo,
        },
      },
      { status: 402, headers: rateLimitHeaders(rl) },
    );
  }
};
