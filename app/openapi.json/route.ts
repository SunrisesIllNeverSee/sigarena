/**
 * Public OpenAPI document for SigRank SignalAF integration discovery.
 * The canonical REST service is hosted at signalaf.com/api/v1; sigeconomy.com
 * publishes this copy so agents can discover the contract by product name.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const doc = {
    openapi: "3.0.3",
    info: {
      title: "SigRank SignalAF API",
      version: "1.0.0",
      description:
        "Public AI-operator leaderboard and token-telemetry API. Public reads are unauthenticated. Authenticated write operations live on SignalAF and may require a paid plan.",
      contact: {
        name: "SigRank SignalAF",
        email: "hello@signalaf.com",
        url: "https://sigeconomy.com/contact",
      },
      "x-service-info": {
        categories: ["ai-benchmarking", "token-telemetry", "operator-scoring"],
        provider: "SigRank SignalAF",
        website: "https://sigeconomy.com",
      },
      "x-versioning-policy": {
        strategy: "URL major versioning",
        current: "/api/v1",
        breaking_changes: "Breaking changes require a new major API path.",
        deprecation:
          "When an endpoint is scheduled for retirement, the replacement and sunset date are published before removal. Serving APIs use deprecation/sunset response metadata where supported.",
      },
    },
    externalDocs: {
      description: "SigRank SignalAF developer portal",
      url: "https://sigeconomy.com/developers",
    },
    servers: [
      {
        url: "https://signalaf.com/api/v1",
        description: "Production REST API",
      },
    ],
    tags: [
      { name: "leaderboard", description: "Public operator rankings and profiles" },
      { name: "telemetry", description: "Authenticated operator telemetry submission" },
      { name: "billing", description: "Paid-plan operations" },
      { name: "premium", description: "Premium API discovery" },
    ],
    paths: {
      "/leaderboard": {
        get: {
          operationId: "getLeaderboard",
          tags: ["leaderboard"],
          summary: "Get public AI operator leaderboard",
          description:
            "Returns AI operators ranked by Yield (Υ). Use this for current field position and top-N ranking questions.",
          parameters: [
            {
              name: "window",
              in: "query",
              required: false,
              description: "Ranking window. Defaults to all_time when omitted.",
              schema: {
                type: "string",
                enum: ["all_time", "7d", "30d", "90d"],
                default: "all_time",
              },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              description: "Maximum number of leaderboard entries to return.",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
            },
          ],
          responses: {
            "200": {
              description: "Leaderboard response",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LeaderboardResponse" },
                },
              },
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "429": { $ref: "#/components/responses/TooManyRequests" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/operators/{codename}": {
        get: {
          operationId: "getOperator",
          tags: ["leaderboard"],
          summary: "Get an AI operator profile",
          description:
            "Returns current rank, percentile, class, Yield, Leverage, Velocity, and movement fields for one public operator.",
          parameters: [
            {
              name: "codename",
              in: "path",
              required: true,
              description: "Stable public operator codename.",
              schema: { type: "string", minLength: 1 },
            },
          ],
          responses: {
            "200": {
              description: "Operator profile",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/OperatorProfile" },
                },
              },
            },
            "404": { $ref: "#/components/responses/NotFound" },
            "429": { $ref: "#/components/responses/TooManyRequests" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/snapshots": {
        post: {
          operationId: "submitSnapshot",
          tags: ["telemetry"],
          summary: "Submit a signed token telemetry snapshot",
          description:
            "Submit a client-generated, signed token telemetry snapshot for an authenticated operator. Use the official SigRank CLI for payload construction and signing rather than synthesizing a request body.",
          security: [{ oauth2: ["openid", "profile", "email"] }],
          "x-cli": "npx sigrank",
          "x-payment-info": {
            intent: "charge",
            method: "stripe",
            amount: "5.00",
            currency: "USD",
            description: "Paid plan subscription — $5.00/month for snapshot submission",
          },
          responses: {
            "200": {
              description: "Snapshot accepted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SubmissionResult" },
                },
              },
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "402": { $ref: "#/components/responses/PaymentRequired" },
            "429": { $ref: "#/components/responses/TooManyRequests" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/billing/subscribe": {
        post: {
          operationId: "createSubscription",
          tags: ["billing"],
          summary: "Start a SigRank paid subscription",
          description:
            "Creates the authenticated subscription flow for paid SigRank features.",
          security: [{ oauth2: ["openid", "profile", "email"] }],
          "x-payment-info": {
            intent: "charge",
            method: "stripe",
            amount: "5.00",
            currency: "USD",
            description: "Monthly subscription — $5.00/month",
          },
          responses: {
            "200": {
              description: "Subscription flow created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SubscriptionResult" },
                },
              },
            },
            "400": { $ref: "#/components/responses/BadRequest" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "429": { $ref: "#/components/responses/TooManyRequests" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/api": {
        get: {
          operationId: "getPremiumApiAccess",
          tags: ["premium"],
          summary: "Discover premium API access",
          description:
            "Returns premium SigArena API discovery information. The sigeconomy.com /api route is protected by x402.",
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
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PremiumApiSummary" },
                },
              },
            },
            "402": { $ref: "#/components/responses/PaymentRequired" },
            "429": { $ref: "#/components/responses/TooManyRequests" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
    },
    components: {
      schemas: {
        ProblemDetails: {
          type: "object",
          description:
            "RFC 9457 problem details. Extension member code is a stable machine-readable application code when available.",
          required: ["type", "title", "status"],
          properties: {
            type: {
              type: "string",
              format: "uri-reference",
              description: "Problem type URI reference.",
            },
            title: {
              type: "string",
              description: "Short human-readable summary of the problem type.",
            },
            status: {
              type: "integer",
              minimum: 400,
              maximum: 599,
              description: "HTTP status code generated for this occurrence.",
            },
            detail: {
              type: "string",
              description: "Human-readable explanation specific to this occurrence.",
            },
            instance: {
              type: "string",
              format: "uri-reference",
              description: "URI reference identifying the specific occurrence.",
            },
            code: {
              type: "string",
              description: "Stable machine-readable SigRank error code when available.",
            },
          },
        },
        LeaderboardEntry: {
          type: "object",
          required: ["codename", "rank", "platform", "yield_"],
          properties: {
            codename: { type: "string" },
            display_name: { type: "string", nullable: true },
            rank: { type: "integer", minimum: 1 },
            percentile: { type: "number", nullable: true },
            platform: { type: "string" },
            class_tier: { type: "string", nullable: true },
            yield_: { type: "number", format: "double" },
            leverage: { type: "number", format: "double" },
            velocity: { type: "number", format: "double" },
            movement_24h: { type: "number", nullable: true },
            movement_7d: { type: "number", nullable: true },
          },
          additionalProperties: true,
        },
        LeaderboardResponse: {
          type: "object",
          properties: {
            generated_at: { type: "string", format: "date-time" },
            total_operators: { type: "integer", minimum: 0 },
            entries: {
              type: "array",
              items: { $ref: "#/components/schemas/LeaderboardEntry" },
            },
          },
          additionalProperties: true,
        },
        OperatorProfile: {
          type: "object",
          required: ["codename"],
          properties: {
            codename: { type: "string" },
            display_name: { type: "string", nullable: true },
            platform: { type: "string" },
            class_tier: { type: "string", nullable: true },
            rank: { type: "integer", nullable: true },
            percentile: { type: "number", nullable: true },
            yield_: { type: "number", format: "double", nullable: true },
            leverage: { type: "number", format: "double", nullable: true },
            velocity: { type: "number", format: "double", nullable: true },
            cascade_str: { type: "string", nullable: true },
            movement_24h: { type: "number", nullable: true },
            movement_7d: { type: "number", nullable: true },
          },
          additionalProperties: true,
        },
        SubmissionResult: {
          type: "object",
          properties: {
            accepted: { type: "boolean" },
            codename: { type: "string" },
            rank: { type: "integer", nullable: true },
          },
          additionalProperties: true,
        },
        SubscriptionResult: {
          type: "object",
          additionalProperties: true,
        },
        PremiumApiSummary: {
          type: "object",
          properties: {
            type: { type: "string" },
            description: { type: "string" },
            available_endpoints: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  method: { type: "string" },
                  description: { type: "string" },
                  payment_required: { type: "boolean" },
                },
                required: ["path", "method", "payment_required"],
              },
            },
          },
          additionalProperties: true,
        },
      },
      responses: {
        BadRequest: {
          description: "The request is invalid.",
          content: {
            "application/problem+json": {
              schema: { $ref: "#/components/schemas/ProblemDetails" },
            },
          },
        },
        Unauthorized: {
          description: "Authentication is required or invalid.",
          content: {
            "application/problem+json": {
              schema: { $ref: "#/components/schemas/ProblemDetails" },
            },
          },
        },
        PaymentRequired: {
          description: "Payment or an eligible plan is required.",
          content: {
            "application/problem+json": {
              schema: { $ref: "#/components/schemas/ProblemDetails" },
            },
          },
        },
        NotFound: {
          description: "The requested resource does not exist.",
          content: {
            "application/problem+json": {
              schema: { $ref: "#/components/schemas/ProblemDetails" },
            },
          },
        },
        TooManyRequests: {
          description: "The client should reduce request frequency and retry later.",
          headers: {
            "Retry-After": {
              description: "Seconds or HTTP date after which the client may retry.",
              schema: { type: "string" },
            },
          },
          content: {
            "application/problem+json": {
              schema: { $ref: "#/components/schemas/ProblemDetails" },
            },
          },
        },
        InternalError: {
          description: "Unexpected service error.",
          content: {
            "application/problem+json": {
              schema: { $ref: "#/components/schemas/ProblemDetails" },
            },
          },
        },
      },
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
