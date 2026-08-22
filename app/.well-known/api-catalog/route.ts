import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: "https://signalaf.com/api/v1",
        "service-desc": [
          {
            href: "https://sigeconomy.com/openapi.json",
            type: "application/json",
            title: "SigRank SignalAF OpenAPI",
          },
        ],
        "service-doc": [
          {
            href: "https://sigeconomy.com/developers",
            type: "text/html",
            title: "SigRank SignalAF Developer Portal",
          },
          {
            href: "https://sigeconomy.com/auth.md",
            type: "text/markdown",
            title: "SigRank SignalAF Authentication",
          },
        ],
        status: [
          {
            href: "https://signalaf.com/api/v1/leaderboard",
            type: "application/json",
          },
        ],
      },
      {
        anchor: "https://sigeconomy.com",
        "service-desc": [
          {
            href: "https://sigeconomy.com/openapi.json",
            type: "application/json",
            title: "SigRank SignalAF OpenAPI",
          },
          {
            href: "https://sigeconomy.com/.well-known/mcp",
            type: "application/json",
            title: "SigRank SignalAF MCP Server Card",
          },
        ],
        "service-doc": [
          {
            href: "https://sigeconomy.com/developers",
            type: "text/html",
            title: "SigRank SignalAF Developer Portal",
          },
          {
            href: "https://sigeconomy.com/agent-instructions.txt",
            type: "text/plain",
            title: "SigRank SignalAF Agent Instructions",
          },
          {
            href: "https://sigeconomy.com/llms.txt",
            type: "text/plain",
            title: "SigRank SignalAF llms.txt",
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(catalog, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
