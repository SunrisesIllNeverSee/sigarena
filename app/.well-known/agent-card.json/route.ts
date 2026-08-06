import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  // A2A Protocol Agent Card — https://a2a-protocol.org/latest/specification/
  const card = {
    name: "SigArena — AI User Leaderboard",
    version: "1.0.0",
    description:
      "The AI User Leaderboard ranks AI operators by Yield (Υ) — token-cascade efficiency, not raw spend. Read-only leaderboard data from SigRank's public API.",
    url: "https://sigeconomy.com",
    protocolVersion: "0.3.0",
    supportedInterfaces: [
      {
        url: "https://signalaf.com/api/v1",
        protocolBinding: "HTTP+JSON",
        protocolVersion: "0.3.0",
      },
    ],
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    skills: [
      {
        id: "leaderboard",
        name: "AI User Leaderboard",
        description: "Get the current top-N AI operator rankings by Yield (Υ)",
      },
      {
        id: "compare",
        name: "Operator Comparison",
        description: "Compare two AI operators head-to-head",
      },
      {
        id: "metrics",
        name: "Metric Rankings",
        description: "Get rankings by specific metrics (velocity, leverage, SNR, etc.)",
      },
    ],
    provider: {
      organization: "SigRank",
      url: "https://signalaf.com",
    },
    authentication: {
      schemes: [],
      credentials: [],
    },
  };

  return new NextResponse(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
