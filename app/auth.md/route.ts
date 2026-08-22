import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# auth.md — SigRank SignalAF Agent Authentication

This service supports agentic access. sigeconomy.com is a read-only leaderboard
surface for SigRank SignalAF. Public website content and public leaderboard reads
do not require credentials.

Agents that want to submit token telemetry or manage an operator profile must
register at signalaf.com, the authoritative data service.

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
  "skill": "Read public leaderboard, operator profiles, and metrics without auth. Submit token telemetry snapshots or manage operator profiles via signalaf.com OAuth.",
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

- **Audience:** AI agents, developers, and crawlers
- **Read surface:** https://sigeconomy.com (public, no auth)
- **Public REST API:** https://signalaf.com/api/v1 (public reads, no auth)
- **Write server:** https://signalaf.com (OAuth required for protected writes)
- **Authorization server:** https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1
- **Scopes supported:** openid, profile, email, offline_access
- **Bearer methods supported:** header (Authorization: Bearer <token>)

### Credential Use

**Reading public data:** No credentials are needed for sigeconomy.com pages or
GET https://signalaf.com/api/v1/leaderboard and public operator lookups.

**Submitting data via signalaf.com:** Agents must redirect the user to
https://signalaf.com/login to authenticate. Include the resulting authenticated
session on protected requests and check session state via GET /api/auth/session.
Use the official SigRank CLI (\`npx sigrank\`) for signed snapshot construction.

## OAuth Metadata (signalaf.com)

- **Protected Resource Metadata:** https://signalaf.com/.well-known/oauth-protected-resource
- **Authorization Server Metadata:** https://signalaf.com/.well-known/oauth-authorization-server
- **Supabase OIDC Discovery:** https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/.well-known/openid-configuration
- **JWKS:** https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/.well-known/jwks.json
- **Auth.md:** https://signalaf.com/auth.md

## Public Endpoints (No Auth)

- **Leaderboard:** GET https://signalaf.com/api/v1/leaderboard?window=all_time&limit=10
- **Operator profile:** GET https://signalaf.com/api/v1/operators/{codename}
- **Developer portal:** GET https://sigeconomy.com/developers
- **OpenAPI:** GET https://sigeconomy.com/openapi.json
- **Methodology:** GET https://signalaf.com/methodology
- **llms.txt:** GET https://sigeconomy.com/llms.txt
- **Agent instructions:** GET https://sigeconomy.com/agent-instructions.txt

## Request Frequency

sigeconomy.com uses edge caching and the public ranking data is not intended to
require high-frequency polling. Clients must honor HTTP 429 responses and
Retry-After when a serving API supplies them. A numeric public quota is not
declared here because the product does not currently publish one.

## Content Signals

- search: yes (search engines may index and return results)
- ai-input: yes (AI agents may use content for real-time answers)
- ai-train: no (training on this content is not permitted)
- use: reference (index, excerpt, and link back)

## Contact

- Email: hello@signalaf.com
- Developer portal: https://sigeconomy.com/developers
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
