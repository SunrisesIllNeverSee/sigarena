/**
 * Public OpenAPI document for SigRank SignalAF integration discovery.
 * The canonical REST service is hosted at signalaf.com/api/v1; sigeconomy.com
 * publishes this copy so agents can discover the contract by product name.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

const RATE_LIMIT_HEADERS = {
  "RateLimit-Policy": "60;w=60",
  "RateLimit-Limit": "60",
  "RateLimit-Remaining": "59",
  "RateLimit-Reset": "60",
};

export async function GET() {
  const doc = {
    openapi: "3.0.3",
    info: {
      title: "SigRank SignalAF API",
      version: "1.0.0",
      description:
        "Public AI-operator leaderboard and token-telemetry API. Public reads are unauthenticated. Authenticated write operations live on SignalAF and may require a paid plan. API versioning uses URL path segments (/api/v1, /api/v2). Breaking changes ship under a new major version. Deprecated operations return a Deprecation header (RFC 8594) and a Sunset header with the retirement date. See the versioning and deprecation policy at /developers#versioning.",
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
      "x-deprecation-policy": "https://sigeconomy.com/developers#versioning",
      "x-sunset-policy": "https://sigeconomy.com/developers#versioning",
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
          requestBody: {
            required: true,
            description: "Signed token telemetry snapshot payload.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SnapshotSubmission" },
              },
            },
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
          requestBody: {
            required: false,
            description: "Optional plan selection. Defaults to the standard monthly plan.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SubscriptionRequest" },
              },
            },
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
            codename: { type: "string", description: "Operator's unique public codename." },
            display_name: { type: "string", nullable: true, description: "Optional display name." },
            rank: { type: "integer", minimum: 1, description: "Global rank position." },
            percentile: { type: "number", nullable: true, description: "Percentile rank (0-100)." },
            platform: { type: "string", description: "AI platform (claude, chatgpt, cursor, etc.)." },
            class_tier: { type: "string", nullable: true, description: "Operator class tier (IGNITER through ARCH+)." },
            yield_: { type: "number", format: "double", description: "Yield (Υ) = cache_read × output / input²." },
            leverage: { type: "number", format: "double", description: "Leverage = cache_read / input." },
            velocity: { type: "number", format: "double", description: "Velocity = output / input." },
            movement_24h: { type: "number", nullable: true, description: "Rank change in last 24 hours." },
            movement_7d: { type: "number", nullable: true, description: "Rank change in last 7 days." },
          },
          additionalProperties: true,
        },
        LeaderboardResponse: {
          type: "object",
          properties: {
            generated_at: { type: "string", format: "date-time", description: "When the response was generated." },
            total_operators: { type: "integer", minimum: 0, description: "Total operators in the dataset." },
            entries: {
              type: "array",
              description: "Ranked operator entries.",
              items: { $ref: "#/components/schemas/LeaderboardEntry" },
            },
          },
          additionalProperties: true,
        },
        OperatorProfile: {
          type: "object",
          required: ["codename"],
          properties: {
            codename: { type: "string", description: "Operator's unique public codename." },
            display_name: { type: "string", nullable: true, description: "Optional display name." },
            platform: { type: "string", description: "AI platform (claude, chatgpt, cursor, etc.)." },
            class_tier: { type: "string", nullable: true, description: "Operator class tier." },
            rank: { type: "integer", nullable: true, description: "Global rank position." },
            percentile: { type: "number", nullable: true, description: "Percentile rank." },
            yield_: { type: "number", format: "double", nullable: true, description: "Yield (Υ) score." },
            leverage: { type: "number", format: "double", nullable: true, description: "Leverage score." },
            velocity: { type: "number", format: "double", nullable: true, description: "Velocity score." },
            cascade_str: { type: "string", nullable: true, description: "Cascade ratio string (cache:input:output)." },
            movement_24h: { type: "number", nullable: true, description: "Rank change in 24h." },
            movement_7d: { type: "number", nullable: true, description: "Rank change in 7d." },
          },
          additionalProperties: true,
        },
        SnapshotSubmission: {
          type: "object",
          required: ["codename", "input", "output", "cache_read", "cache_write", "signature"],
          properties: {
            codename: { type: "string", description: "Operator's unique codename." },
            input: { type: "number", minimum: 0, description: "Total input tokens consumed." },
            output: { type: "number", minimum: 0, description: "Total output tokens generated." },
            cache_read: { type: "number", minimum: 0, description: "Tokens read from prompt cache." },
            cache_write: { type: "number", minimum: 0, description: "Tokens written to prompt cache." },
            signature: { type: "string", description: "Cryptographic signature proving the snapshot was generated by the CLI." },
            platform: { type: "string", description: "AI platform identifier." },
          },
          additionalProperties: true,
        },
        SubmissionResult: {
          type: "object",
          properties: {
            accepted: { type: "boolean", description: "Whether the snapshot was accepted." },
            codename: { type: "string", description: "Operator codename." },
            rank: { type: "integer", nullable: true, description: "New rank after submission." },
          },
          additionalProperties: true,
        },
        SubscriptionRequest: {
          type: "object",
          properties: {
            plan: { type: "string", enum: ["monthly", "annual"], default: "monthly", description: "Subscription plan." },
          },
          additionalProperties: false,
        },
        SubscriptionResult: {
          type: "object",
          properties: {
            checkout_url: { type: "string", format: "uri", description: "Stripe checkout URL." },
            plan: { type: "string", description: "Selected plan." },
          },
          additionalProperties: true,
        },
        PremiumApiSummary: {
          type: "object",
          properties: {
            type: { type: "string", description: "Resource type identifier." },
            description: { type: "string", description: "Human-readable description of the premium API." },
            available_endpoints: {
              type: "array",
              description: "List of available API endpoints.",
              items: {
                type: "object",
                properties: {
                  path: { type: "string", description: "Endpoint URL or path." },
                  method: { type: "string", description: "HTTP method (GET, POST, etc.)." },
                  description: { type: "string", description: "What the endpoint does." },
                  payment_required: { type: "boolean", description: "Whether payment is required." },
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
            "RateLimit-Policy": {
              description: "Rate limit policy description.",
              schema: { type: "string" },
            },
            "RateLimit-Limit": {
              description: "Maximum requests per window.",
              schema: { type: "integer" },
            },
            "RateLimit-Remaining": {
              description: "Remaining requests in current window.",
              schema: { type: "integer" },
            },
            "RateLimit-Reset": {
              description: "Seconds until the window resets.",
              schema: { type: "integer" },
            },
          },
          content: {
            "application/problem+json": {
              schema: { $ref: "#/components/schemas/ProblemDetails" },
            },
          },
        },
        Deprecated: {
          description: "This operation is deprecated and will be retired. See the Deprecation and Sunset headers for details.",
          headers: {
            Deprecation: {
              schema: { type: "boolean" },
              description: "Present and true when the operation is deprecated (RFC 8594).",
            },
            Sunset: {
              schema: { type: "string", format: "http-date" },
              description: "HTTP-date after which the deprecated operation will no longer be available (RFC 8594).",
            },
            Link: {
              schema: { type: "string" },
              description: "Link to the replacement operation or deprecation policy.",
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
      ...RATE_LIMIT_HEADERS,
    },
  });
}
