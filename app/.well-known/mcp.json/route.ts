import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const card = {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    protocolVersion: "2025-06-18",
    serverInfo: {
      name: "sigrank-sigarena",
      title: "SigArena — AI User Leaderboard",
      version: "1.0.0",
    },
    description:
      "The AI User Leaderboard ranks AI operators by Yield (Υ) — token-cascade efficiency, not raw spend. Read-only leaderboard data from SigRank's public API.",
    transport: {
      type: "streamable-http",
      endpoint: "https://signalaf.com/api/v1",
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
