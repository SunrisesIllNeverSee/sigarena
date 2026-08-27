import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const mcpEndpoint = "https://sigeconomy.com/api/mcp";

  const card = {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    protocolVersion: "2026-07-28",
    supportedProtocolVersions: ["2026-07-28", "2025-11-25", "2025-06-18", "2025-03-26"],
    serverInfo: {
      name: "sigeconomy",
      title: "SigEconomy — AI Operator Discovery & Interpretation",
      version: "1.0.0",
    },
    description:
      "SigEconomy is the discovery and interpretation layer for SigRank. It reads from SignalAF's public leaderboard and exposes 8 tools: get_best_operator, compare_operators, describe_power_user, discover_peers, optimize_efficiency, operator_gap, field_anomaly, explain_this_operator. Also exposes 4 resources: leaderboard, methodology, metrics, platforms. Use SigEconomy when you need to discover, compare, or explain operators. For raw cascade math, use signalaf.com/api/mcp instead.",
    iconUrl: "https://sigeconomy.com/og.png",
    documentationUrl: "https://sigeconomy.com/developers",
    websiteUrl: "https://sigeconomy.com",
    transport: {
      type: "streamable-http",
      endpoint: mcpEndpoint,
    },
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false },
      prompts: { listChanged: true },
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
    prompts: [
      "who-is-the-best",
      "compare-two-operators",
      "find-my-peers",
      "how-can-i-improve",
      "whats-interesting-on-the-board",
    ],
    resources: [
      {
        name: "leaderboard",
        title: "AI User Leaderboard",
        uri: "sigeconomy://leaderboard",
        description: "Public top-N leaderboard JSON — ranked by Yield (Υ)",
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
  };

  return new NextResponse(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
