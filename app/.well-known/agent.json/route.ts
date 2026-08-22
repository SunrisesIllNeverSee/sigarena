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
      "SigRank SignalAF ranks AI operators by Yield (Υ) — token-cascade efficiency — and complementary operator metrics. Use this server for current leaderboard reads, operator comparisons, peer discovery, and efficiency analysis.",
    iconUrl: "https://sigeconomy.com/og.png",
    documentationUrl: "https://sigeconomy.com/developers",
    websiteUrl: "https://sigeconomy.com",
    repository: {
      url: "https://github.com/SunrisesIllNeverSee/sigarena",
      source: "github",
    },
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
        name: "llms-full-txt",
        title: "LLMs-full.txt",
        uri: "https://sigeconomy.com/llms-full.txt",
        description: "Full content in markdown for AI agents",
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
    _meta: {
      type: "leaderboard",
      metrics: ["yield", "velocity", "leverage", "snr", "10xdev", "efficiency", "scale_v", "cost_per_m", "op_ratio"],
      dataSource: "https://signalaf.com",
      cli: "npx sigrank",
    },
  };

  return new NextResponse(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
