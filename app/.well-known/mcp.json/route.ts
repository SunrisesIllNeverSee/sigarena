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
      "SigRank SignalAF ranks AI operators by Yield (Υ) and other token-telemetry metrics. The MCP server exposes read-oriented leaderboard, operator comparison, peer discovery, and efficiency tools.",
    documentationUrl: "https://sigeconomy.com/developers",
    websiteUrl: "https://sigeconomy.com",
    transport: {
      type: "streamable-http",
      endpoint: mcpEndpoint,
    },
    authentication: {
      required: false,
    },
  };

  return new NextResponse(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
