/**
 * app/.well-known/acp.json/route.ts
 *
 * Agentic Commerce Protocol (ACP) discovery document.
 * https://agenticcommerce.dev
 *
 * Tells AI agents how to discover and interact with our commerce-enabled
 * API. sigeconomy.com itself is read-only; billing/transactions happen
 * on signalaf.com (Stripe). This document bridges agents to that flow.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const doc = {
    protocol: {
      name: "acp",
      version: "1.0.0",
    },
    api_base_url: "https://signalaf.com/api/v1",
    transports: ["https", "http"],
    capabilities: {
      services: [
        "checkout",
      ],
    },
    authentication: {
      type: "oauth2",
      authorization_url:
        "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/authorize",
      token_url:
        "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/token",
      scopes: ["openid", "profile", "email", "offline_access"],
    },
    documentation_url: "https://sigeconomy.com/how-it-works",
  };

  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
