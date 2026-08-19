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
    // AP2 (Agent Payments Protocol) extension — declares SigRank's role in
    // agentic commerce so AI agents can securely transact payments using
    // cryptographically-signed mandates.
    // Spec: https://ap2-protocol.org/
    extensions: [
      {
        uri: "https://github.com/google-agentic-commerce/AP2/tree/v0.1.0",
        description:
          "Agent Payments Protocol — SigRank acts as a merchant, accepting payments for premium API access and operator scoring services.",
        required: true,
        params: {
          roles: ["merchant"],
          payment_endpoint: "https://signalaf.com/api/v1/billing",
          supported_methods: ["stripe"],
        },
      },
    ],
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
