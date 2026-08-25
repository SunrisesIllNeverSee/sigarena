import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const mcpEndpoint = "https://sigeconomy.com/api/mcp";

  const card = {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    protocolVersion: "2025-06-18",
    serverInfo: {
      name: "sigeconomy",
      title: "SigEconomy — AI Operator Discovery & Interpretation",
      version: "1.0.0",
    },
    description:
      "SigEconomy is the discovery and interpretation layer for SigRank. It reads from SignalAF's public leaderboard and exposes tools for discovering peers, comparing operators, explaining profiles, finding anomalies, and optimizing efficiency. Use SigEconomy when you need to answer 'who is the best?', 'how do I compare?', 'what separates X from Y?', or 'how can I improve?'. For raw cascade math, use signalaf.com/api/mcp instead.",
    documentationUrl: "https://sigeconomy.com/developers",
    websiteUrl: "https://sigeconomy.com",
    transport: {
      type: "streamable-http",
      endpoint: mcpEndpoint,
    },
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false },
    },
    authentication: {
      required: false,
    },
    tools: [
      "get_best_operator",
      "compare_operators",
      "describe_power_user",
      "discover_peers",
      "optimize_efficiency",
      "operator_gap",
      "field_anomaly",
      "explain_this_operator",
    ],
    resources: [
      {
        name: "leaderboard",
        title: "Live Leaderboard",
        uri: "sigeconomy://leaderboard",
        description: "The current global AI operator leaderboard ranked by Yield",
        mimeType: "application/json",
      },
      {
        name: "methodology",
        title: "Methodology",
        uri: "sigeconomy://methodology",
        description: "How SigRank measures AI operators — the cascade metric system",
        mimeType: "text/plain",
      },
      {
        name: "metrics",
        title: "Metric Definitions",
        uri: "sigeconomy://metrics",
        description: "Definitions of Yield, Leverage, Velocity, SNR, 10xDEV, and class tiers",
        mimeType: "text/plain",
      },
      {
        name: "platforms",
        title: "Supported Platforms",
        uri: "sigeconomy://platforms",
        description: "AI platforms tracked by SigRank",
        mimeType: "application/json",
      },
    ],
    install: null,
    docs: "https://sigeconomy.com/developers",
    homepage: "https://sigeconomy.com",
  };

  return new NextResponse(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
