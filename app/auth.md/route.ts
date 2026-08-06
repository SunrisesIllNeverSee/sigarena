import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# auth.md — SigArena Agent Authentication

This service supports agentic access. SigArena (sigeconomy.com) is a read-only
leaderboard site. Agent registration is not required — all content is public.

## Agent Registration

No agent registration is needed. This service has no authentication, no
authorization servers, and no protected resources. All endpoints are public.

- **Resource server:** https://sigeconomy.com (read-only)
- **Data API:** https://signalaf.com/api/v1 (read-only, no auth)
- **Authorization servers:** none (no auth required)
- **Scopes supported:** none (all public)
- **Bearer methods supported:** none (no auth)

## Agent Authentication

Agents do not need credentials to access this service. No API key, OAuth token,
or bearer token is required. Simply fetch any URL directly.

## API Access

The underlying data API is hosted at signalaf.com:

- **Public leaderboard:** https://signalaf.com/api/v1/leaderboard
- **Methodology:** https://signalaf.com/methodology
- **Score calculator:** https://signalaf.com/score

## Rate Limiting

Requests are served via Cloudflare Workers with ISR caching (300s revalidate).
High-frequency scraping is not necessary — data refreshes every 5 minutes.

## Content Signals

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
