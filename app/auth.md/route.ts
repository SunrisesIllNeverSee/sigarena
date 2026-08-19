import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# auth.md — SigArena Agent Authentication

This service supports agentic access. SigArena (sigeconomy.com) is a read-only
leaderboard site. All content is public — no credentials needed to read.

Agents that want to submit token telemetry or manage an operator profile must
register at signalaf.com (the data source).

## Agent Registration

### Registration Methods

- **Method:** OAuth 2.0 Authorization Code flow (via signalaf.com)
- **register_uri:** https://signalaf.com/login
- **callback_uri:** https://signalaf.com/auth/callback
- **session_endpoint:** GET https://signalaf.com/api/auth/session
- **Provisioning:** automatic — first OAuth login mints a free operator account

### agent_auth

\`\`\`json
{
  "skill": "Read public leaderboard, operator profiles, and metrics from sigeconomy.com without auth. Submit token telemetry snapshots or manage operator profiles via signalaf.com OAuth.",
  "register_uri": "https://signalaf.com/login",
  "methods": [
    {
      "type": "oauth_2.0",
      "flow": "authorization_code",
      "authorization_endpoint": "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/authorize",
      "token_endpoint": "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/token",
      "callback": "https://signalaf.com/auth/callback",
      "providers": ["github", "twitter", "email_magic_link"],
      "scopes": ["openid", "profile", "email", "offline_access"],
      "session_check": "GET https://signalaf.com/api/auth/session"
    }
  ]
}
\`\`\`

### Agent Audience

- **Audience:** all AI agents and crawlers
- **Resource server:** https://sigeconomy.com (read-only, no auth)
- **Write server:** https://signalaf.com (OAuth required for writes)
- **Authorization server:** https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1
- **Scopes supported:** openid, profile, email, offline_access
- **Bearer methods supported:** header (Authorization: Bearer <token>)

### Credential Use

**Reading sigeconomy.com:** No credentials needed. Fetch any URL directly with
HTTP GET.

**Submitting data via signalaf.com:** Agents must redirect the user to
https://signalaf.com/login to authenticate via GitHub, X/Twitter, or email
magic link. The OAuth callback at /auth/callback exchanges the code for a
session cookie. Include the session cookie in all subsequent requests to
protected endpoints. Check session state via GET /api/auth/session.

## OAuth Metadata (signalaf.com)

- **Protected Resource Metadata:** https://signalaf.com/.well-known/oauth-protected-resource
- **Authorization Server Metadata:** https://signalaf.com/.well-known/oauth-authorization-server
- **Supabase OIDC Discovery:** https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/.well-known/openid-configuration
- **JWKS:** https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/.well-known/jwks.json
- **Auth.md:** https://signalaf.com/auth.md

## Public Endpoints (No Auth)

- **Leaderboard:** GET https://sigeconomy.com/api/leaderboard
- **Best AI user:** GET https://sigeconomy.com/best-ai-user
- **Underlying API:** GET https://signalaf.com/api/v1/leaderboard
- **Methodology:** GET https://signalaf.com/methodology
- **llms.txt:** GET https://sigeconomy.com/llms.txt

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
