/**
 * app/.well-known/oauth-protected-resource/route.ts
 *
 * OAuth Protected Resource Metadata (RFC 9728) for sigeconomy.com.
 *
 * sigeconomy.com is read-only with no auth of its own. It declares
 * signalaf.com's Supabase as the authorization server so agents have
 * a consistent discovery chain across both properties.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const metadata = {
    resource: "https://sigeconomy.com",
    authorization_servers: [
      "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1",
    ],
    scopes_supported: ["openid", "profile", "email", "offline_access"],
    bearer_methods_supported: ["header"],
    auth_md: "https://sigeconomy.com/auth.md",
    public_endpoints: [
      "https://sigeconomy.com/",
      "https://sigeconomy.com/api/leaderboard",
      "https://sigeconomy.com/best-ai-user",
      "https://sigeconomy.com/llms.txt",
      "https://sigeconomy.com/llms-full.txt",
    ],
    protected_endpoints: [],
    notes:
      "All sigeconomy.com endpoints are public and read-only. OAuth is required only for write operations on signalaf.com.",
  };

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
