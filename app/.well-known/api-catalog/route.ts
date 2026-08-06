import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  // RFC 9727 API Catalog — linkset+json format
  const catalog = {
    linkset: [
      {
        anchor: "https://signalaf.com/api/v1",
        "service-desc": [
          {
            href: "https://signalaf.com/api/v1/openapi.json",
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: "https://sigeconomy.com/how-it-works",
            type: "text/html",
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
            href: "https://sigeconomy.com/llms.txt",
            type: "text/plain",
          },
        ],
        "service-doc": [
          {
            href: "https://sigeconomy.com/llms-full.txt",
            type: "text/plain",
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
