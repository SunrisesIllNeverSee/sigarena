import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# auth.md — SigArena Agent Authentication

## Authentication

SigArena (sigeconomy.com) is a **read-only** site. No authentication is required
to access any page or data endpoint.

## API access

The underlying data API is hosted at signalaf.com:

- **Public leaderboard:** https://signalaf.com/api/v1/leaderboard
- **Methodology:** https://signalaf.com/methodology
- **Score calculator:** https://signalaf.com/score

No API key, OAuth token, or bearer token is needed for read-only access.

## Rate limiting

Requests are served via Cloudflare Workers with ISR caching (300s revalidate).
High-frequency scraping is not necessary — data refreshes every 5 minutes.

## Content signals

- search: yes (search engines may index and return results)
- ai-input: yes (AI agents may use content for real-time answers)
- ai-train: no (training on this content is not permitted)
- use: reference (index, excerpt, and link back)

## Contact

- GitHub: https://github.com/SunrisesIllNeverSee
- X/Twitter: https://x.com/burnmydays
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
