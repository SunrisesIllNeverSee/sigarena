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
    iconUrl: "https://sigeconomy.com/og.png",
    documentationUrl: "https://sigeconomy.com/how-it-works",
    websiteUrl: "https://sigeconomy.com",
    transport: {
      type: "streamable-http",
      endpoint: "https://signalaf.com/api/v1",
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
