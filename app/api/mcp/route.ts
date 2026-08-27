/**
 * app/api/mcp/route.ts — SigEconomy MCP Streamable HTTP endpoint.
 *
 * Uses the official MCP SDK v2 (createMcpHandler) for protocol negotiation,
 * capability declaration, and Streamable HTTP transport. The SDK handles
 * initialize, ping, tools/list, tools/call, resources/list, resources/read,
 * prompts/list, prompts/get, server/discover, and JSON-RPC error framing.
 *
 * Transport-level concerns retained in this route:
 *   - Origin validation (allowedOrigin)
 *
 * Protocol negotiation (modern 2026-07-28 + legacy 2025-era) is delegated
 * entirely to createMcpHandler / classifyInboundRequest in the SDK. The route
 * does NOT apply a protocol version ceiling or parse the body — the SDK
 * handles era routing, version validation, parse errors, and error framing.
 *
 * Domain logic lives in:
 *   - lib/mcp/server.ts (McpServer factory + tool/resource/prompt registration)
 *   - lib/mcp/tools/index.ts (8 tool definitions + callTool dispatcher)
 *   - lib/mcp/resources/index.ts (4 resource definitions + readResource)
 *   - lib/mcp/prompts/index.ts (5 prompt definitions + getPrompt)
 */

import type { NextRequest } from "next/server";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { allowedOrigin } from "@/lib/mcp/security";
import { createSigeconomyServer, setRequestContext } from "@/lib/mcp/server";

// ── SDK handler ─────────────────────────────────────────────────────────────
// createMcpHandler returns an object with a .fetch(request) method that
// handles both modern (2026-07-28) and legacy (2025-era) protocol traffic.
// The factory receives { era, requestInfo } — we use requestInfo to pass
// the request context to callTool for shareable URL generation.
const mcpHandler = createMcpHandler(({ requestInfo }) => {
  setRequestContext(requestInfo as NextRequest);
  return createSigeconomyServer();
});

// ── POST handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!allowedOrigin(req)) {
    return new Response("Forbidden", { status: 403 });
  }
  return mcpHandler.fetch(req as unknown as Request);
}

// ── GET handler ─────────────────────────────────────────────────────────────
// GET is used for SSE streams in legacy (2025-era) protocol mode
export async function GET(req: NextRequest) {
  if (!allowedOrigin(req)) {
    return new Response("Forbidden", { status: 403 });
  }
  return mcpHandler.fetch(req as unknown as Request);
}

// ── DELETE handler ──────────────────────────────────────────────────────────
// DELETE is used for session cleanup in legacy (2025-era) protocol mode
export async function DELETE(req: NextRequest) {
  if (!allowedOrigin(req)) {
    return new Response("Forbidden", { status: 403 });
  }
  return mcpHandler.fetch(new Request(req.url, { method: "DELETE", headers: req.headers }));
}
