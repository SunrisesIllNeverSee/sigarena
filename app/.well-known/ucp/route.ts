/**
 * app/.well-known/ucp/route.ts
 *
 * Universal Commerce Protocol (UCP) discovery document.
 * https://ucp.dev/specification/overview/
 *
 * Publishes a UCP discovery document at /.well-known/ucp so AI agents
 * can discover commerce capabilities. sigeconomy.com is the read-only
 * satellite; signalaf.com handles billing and subscriptions via Stripe.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const doc = {
    protocol_version: "0.1.0",
    spec: "https://ucp.dev/specification/overview/",
    services: [
      {
        id: "leaderboard",
        name: "AI User Leaderboard",
        type: "data",
        description:
          "Get the current top-N AI operator rankings by Yield (Υ) — token-cascade efficiency. Read-only data from SigRank's public API.",
        endpoint: "https://signalaf.com/api/v1/leaderboard",
        method: "GET",
        pricing: {
          model: "free",
        },
      },
      {
        id: "operator-profile",
        name: "Operator Profile",
        type: "data",
        description:
          "Get a single operator's full profile, metrics, and rank",
        endpoint: "https://signalaf.com/api/v1/operators/{codename}",
        method: "GET",
        pricing: {
          model: "free",
        },
      },
      {
        id: "premium-api-access",
        name: "Premium API Access",
        type: "data",
        description:
          "Premium SigArena API access — analytics and snapshot submission routing. Requires payment via x402 protocol.",
        endpoint: "https://sigeconomy.com/api",
        method: "GET",
        pricing: {
          model: "per-request",
          amount: "0.01",
          currency: "USDC",
          payment_protocol: "x402",
        },
      },
      {
        id: "billing-subscription",
        name: "Billing Subscription",
        type: "action",
        description:
          "Subscribe to a SigRank paid plan for snapshot submission and premium features. Handled by signalaf.com via Stripe.",
        endpoint: "https://signalaf.com/api/v1/billing/subscribe",
        method: "POST",
        pricing: {
          model: "subscription",
          amount: "5.00",
          currency: "USD",
          payment_protocol: "stripe",
        },
      },
    ],
    capabilities: {
      payment_protocols: ["x402", "stripe"],
      currencies: ["USDC", "USD"],
      authentication: ["oauth2", "bearer"],
      streaming: false,
      rate_limiting: true,
      privacy: "Token counts only. Never prompts. No personal data collected.",
    },
    endpoints: {
      discovery: {
        acp: "https://sigeconomy.com/.well-known/acp.json",
        openapi: "https://sigeconomy.com/openapi.json",
        agent_card: "https://sigeconomy.com/.well-known/agent-card.json",
        ucp: "https://sigeconomy.com/.well-known/ucp",
      },
      api: {
        base: "https://signalaf.com/api/v1",
        openapi_spec: "https://sigeconomy.com/openapi.json",
      },
      payment: {
        x402_facilitator: "https://facilitator.x402.org",
        stripe_checkout: "https://signalaf.com/api/v1/billing/create-checkout-session",
        stripe_portal: "https://signalaf.com/api/v1/billing/portal",
      },
      documentation: {
        how_it_works: "https://sigeconomy.com/how-it-works",
        methodology: "https://signalaf.com/methodology",
        api_catalog: "https://signalaf.com/api/v1",
      },
    },
    provider: {
      name: "SigArena — AI User Leaderboard",
      url: "https://sigeconomy.com",
      contact: "https://signalaf.com/contact",
    },
  };

  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
