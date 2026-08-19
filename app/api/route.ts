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

export const revalidate = 300;

const handler = async (_request: NextRequest): Promise<NextResponse> => {
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
    headers: { "Cache-Control": "private, max-age=300" },
  });
};

export const GET = withX402(
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
