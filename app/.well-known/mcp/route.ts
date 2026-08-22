import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const mcpEndpoint = supabaseUrl
    ? `${supabaseUrl}/functions/v1/sigrank-mcp`
    : "https://copqtaqzsdvpdbhpwjmt.supabase.co/functions/v1/sigrank-mcp";

  const card = {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    protocolVersion: "2025-06-18",
    serverInfo: {
      name: "sigrank-sigarena",
      title: "SigRank SignalAF — AI User Leaderboard",
      version: "1.0.0",
    },
    description:
      "SigRank SignalAF ranks AI operators by Yield (Υ) — token-cascade efficiency, not raw spend. Use the MCP server for current leaderboard reads, operator comparison, peer discovery, and efficiency analysis. Tools include get_leaderboard, get_operator, discover_peers, get_best_operator, compare_operators, describe_power_user, and optimize_efficiency.",
    iconUrl: "https://sigeconomy.com/og.png",
    documentationUrl: "https://sigeconomy.com/developers",
    websiteUrl: "https://sigeconomy.com",
    transport: {
      type: "streamable-http",
      endpoint: mcpEndpoint,
    },
    capabilities: {
      resources: {
        listChanged: false,
      },
    },
    authentication: {
      required: false,
    },
    resources: [
      {
        name: "leaderboard",
        title: "AI User Leaderboard",
        uri: "https://signalaf.com/api/v1/leaderboard",
        description: "Public top-N leaderboard JSON — ranked by Yield (Υ)",
        mimeType: "application/json",
      },
      {
        name: "llms-txt",
        title: "LLMs.txt",
        uri: "https://sigeconomy.com/llms.txt",
        description: "Machine-readable site summary for AI agents",
        mimeType: "text/plain",
      },
      {
        name: "agent-instructions",
        title: "Agent Instructions",
        uri: "https://sigeconomy.com/agent-instructions.txt",
        description: "When to use SigRank and which interface to call",
        mimeType: "text/plain",
      },
      {
        name: "prompts",
        title: "Prompt Registry",
        uri: "https://sigeconomy.com/prompts.json",
        description: "Machine-readable prompt registry (JSON)",
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
