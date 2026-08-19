/**
 * app/.well-known/ucp/route.ts
 *
 * Universal Commerce Protocol (UCP) discovery document.
 * https://ucp.dev/specification/overview/
 *
 * Publishes a UCP business profile at /.well-known/ucp so AI agents
 * can discover commerce capabilities. sigeconomy.com is the read-only
 * satellite; signalaf.com handles billing and subscriptions via Stripe.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const doc = {
    ucp: {
      version: "2026-04-08",
      services: {
        "dev.ucp.shopping": [
          {
            version: "2026-04-08",
            spec: "https://ucp.dev/2026-04-08/specification/overview",
            transport: "rest",
            endpoint: "https://signalaf.com/api/v1",
            schema: "https://ucp.dev/2026-04-08/services/shopping/rest.openapi.json",
          },
          {
            version: "2026-04-08",
            spec: "https://ucp.dev/2026-04-08/specification/overview",
            transport: "a2a",
            endpoint: "https://sigeconomy.com/.well-known/agent-card.json",
          },
        ],
      },
      capabilities: {
        "dev.ucp.shopping.checkout": [
          {
            version: "2026-04-08",
            spec: "https://ucp.dev/2026-04-08/specification/checkout",
            schema: "https://ucp.dev/2026-04-08/schemas/shopping/checkout.json",
          },
        ],
        "dev.ucp.shopping.fulfillment": [
          {
            version: "2026-04-08",
            spec: "https://ucp.dev/2026-04-08/specification/fulfillment",
            schema: "https://ucp.dev/2026-04-08/schemas/shopping/fulfillment.json",
            extends: "dev.ucp.shopping.checkout",
          },
        ],
      },
      payment_handlers: {
        "com.sigrank.stripe": [
          {
            id: "stripe",
            version: "2026-04-08",
            spec: "https://docs.stripe.com/agentic-commerce",
            available_instruments: [
              {
                type: "card",
                constraints: {
                  currencies: ["USD"],
                  min_amount: "0",
                  max_amount: "100000",
                },
              },
            ],
          },
        ],
      },
      endpoints: {
        discovery: "https://sigeconomy.com/.well-known/ucp",
        api_base: "https://signalaf.com/api/v1",
        billing: "https://signalaf.com/api/v1/billing",
        authentication: "https://signalaf.com/auth",
        terms: "https://signalaf.com/terms",
        privacy: "https://signalaf.com/privacy",
      },
    },
  };

  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
