/**
 * app/.well-known/oauth-authorization-server/route.ts
 *
 * OAuth Authorization Server Metadata (RFC 8414) for sigeconomy.com.
 *
 * Bridges Supabase's OIDC discovery to the OAuth standard path so scanners
 * can verify the issuer chain. sigeconomy.com itself has no auth — this
 * metadata points agents to signalaf.com for registration.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const metadata = {
    issuer: "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1",
    authorization_endpoint:
      "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/authorize",
    token_endpoint:
      "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/token",
    jwks_uri:
      "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/.well-known/jwks.json",
    userinfo_endpoint:
      "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/userinfo",
    scopes_supported: ["openid", "profile", "email", "phone", "offline_access"],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256", "HS256", "ES256"],
    code_challenge_methods_supported: ["S256", "plain"],
    require_pushed_authorization_requests: false,
    auth_md: "https://sigeconomy.com/auth.md",
    registration_endpoint: "https://signalaf.com/login",
    agent_auth: {
      skill:
        "Read public leaderboard, operator profiles, and metrics from sigeconomy.com without auth. Submit token telemetry snapshots or manage operator profiles via signalaf.com OAuth.",
      register_uri: "https://signalaf.com/login",
      methods: [
        {
          type: "oauth_2.0",
          flow: "authorization_code",
          authorization_endpoint:
            "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/authorize",
          token_endpoint:
            "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/token",
          callback: "https://signalaf.com/auth/callback",
          providers: ["github", "twitter", "email_magic_link"],
          scopes: ["openid", "profile", "email", "offline_access"],
          session_check: "GET https://signalaf.com/api/auth/session",
        },
      ],
    },
  };

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
