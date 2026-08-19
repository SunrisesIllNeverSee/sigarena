/**
 * app/openapi.json/route.ts
 *
 * OpenAPI 3.0 document with MPP (Machine Payment Protocol) payment
 * discovery metadata. https://mpp.dev
 *
 * Public endpoints are free; the snapshot submission endpoint requires
 * payment (Stripe) for authenticated operators on paid plans.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const doc = {
    openapi: "3.0.3",
    info: {
      title: "SigRank API",
      version: "1.0.0",
      description:
        "AI operator leaderboard and token-telemetry API. Public reads are free; snapshot submission requires authentication and a paid plan.",
      "x-service-info": {
        categories: ["ai-benchmarking", "token-telemetry", "operator-scoring"],
        provider: "SigRank",
        website: "https://signalaf.com",
      },
    },
    servers: [
      {
        url: "https://signalaf.com/api/v1",
        description: "Production API",
      },
    ],
    paths: {
      "/leaderboard": {
        get: {
          summary: "Get public leaderboard",
          description:
            "Returns top AI operators ranked by Yield (Υ) — token-cascade efficiency",
          responses: {
            "200": {
              description: "Leaderboard JSON",
              "content": {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
      "/operators/{codename}": {
        get: {
          summary: "Get operator profile",
          description: "Detailed statistics for a specific AI operator",
          parameters: [
            {
              name: "codename",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Operator profile JSON",
              "content": {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
      "/snapshots": {
        post: {
          summary: "Submit token telemetry snapshot",
          description:
            "Submit a token telemetry snapshot for an authenticated operator. Requires OAuth and a paid plan.",
          "x-payment-info": {
            intent: "charge",
            method: "stripe",
            amount: "5.00",
            currency: "USD",
            description: "Paid plan subscription — $5.00/month for snapshot submission",
          },
          security: [{ oauth2: ["openid", "profile", "email"] }],
          responses: {
            "200": {
              description: "Snapshot accepted",
              "content": {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            "402": {
              description: "Payment required — upgrade to a paid plan",
              "content": {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
      "/billing/subscribe": {
        post: {
          summary: "Subscribe to a paid plan",
          description: "Start a Stripe subscription for SigRank paid features",
          "x-payment-info": {
            intent: "charge",
            method: "stripe",
            amount: "5.00",
            currency: "USD",
            description: "Monthly subscription — $5.00/month",
          },
          security: [{ oauth2: ["openid", "profile", "email"] }],
          responses: {
            "200": {
              description: "Subscription created",
              "content": {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
      "/api": {
        get: {
          summary: "Premium API access (payable via x402)",
          description:
            "Premium SigArena API access — returns a summary of available premium endpoints. Requires payment via x402 protocol.",
          operationId: "getPremiumApiAccess",
          tags: ["premium"],
          "x-payment-info": {
            intent: "charge",
            method: "tempo",
            amount: "0.01",
            currency: "USDC",
            description: "Premium API access — SigArena analytics and snapshot submission routing",
          },
          responses: {
            "200": {
              description: "Premium API summary",
              "content": {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
            "402": {
              description: "Payment required — x402 payment requirements in response",
              "content": {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        oauth2: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl:
                "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/authorize",
              tokenUrl:
                "https://copqtaqzsdvpdbhpwjmt.supabase.co/auth/v1/oauth/token",
              scopes: {
                openid: "OpenID Connect",
                profile: "User profile",
                email: "Email address",
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
