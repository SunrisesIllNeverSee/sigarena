/**
 * app/api/mcp/route.ts — SigEconomy MCP Streamable HTTP endpoint.
 *
 * Uses the official MCP SDK v2 (createMcpHandler) for protocol negotiation,
 * capability declaration, and Streamable HTTP transport. The SDK handles
 * initialize, ping, tools/list, tools/call, resources/list, resources/read,
 * prompts/list, prompts/get, and JSON-RPC error framing.
 *
 * Transport-level concerns retained in this route:
 *   - Origin validation (allowedOrigin)
 *   - Protocol version header validation
 *
 * Domain logic lives in:
 *   - lib/mcp/server.ts (McpServer factory + tool/resource/prompt registration)
 *   - lib/mcp/tools/index.ts (8 tool definitions + callTool dispatcher)
 *   - lib/mcp/resources/index.ts (4 resource definitions + readResource)
 *   - lib/mcp/prompts/index.ts (5 prompt definitions + getPrompt)
 */

import type { NextRequest } from "next/server";
import { createMcpHandler } from "@modelcontextprotocol/server";
import {
  SUPPORTED_VERSIONS,
  rpcError,
  type RpcRequest,
} from "@/lib/mcp/protocol";
import { allowedOrigin } from "@/lib/mcp/security";
import { createSigeconomyServer } from "@/lib/mcp/server";

// ── SDK handler ─────────────────────────────────────────────────────────────
// createMcpHandler returns an object with a .fetch(request) method that
// handles both modern and legacy protocol traffic. The factory receives
// { requestInfo } — we use requestInfo to pass the request context to
// callTool for shareable URL generation.
const mcpHandler = createMcpHandler(({ requestInfo }) => {
  // requestInfo is the standard Request object; cast to NextRequest for
  // callTool which may use req.nextUrl or headers.
  return createSigeconomyServer(requestInfo as NextRequest);
});

// ── POST handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Origin validation
  if (!allowedOrigin(req)) {
    return new Response("Forbidden", { status: 403 });
  }

  // 2. Parse the request body to validate JSON-RPC structure and check
  //    protocol version header before delegating to the SDK.
  let message: RpcRequest;
  let rawBody: string;
  try {
    rawBody = await req.text();
    message = JSON.parse(rawBody) as RpcRequest;
  } catch {
    return rpcError(null, -32700, "Parse error", undefined, 400);
  }

  if (message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return rpcError(message.id ?? null, -32600, "Invalid Request", undefined, 400);
  }

  const id = message.id ?? null;

  // 3. Protocol version header check
  const version = req.headers.get("mcp-protocol-version");
  if (version && !SUPPORTED_VERSIONS.has(version)) {
    return rpcError(id, -32602, "Unsupported protocol version", {
      supported: [...SUPPORTED_VERSIONS],
      requested: version,
    }, 400);
  }

  // 4. Delegate to the SDK handler for standard MCP protocol methods
  //    (initialize, ping, notifications/initialized, tools/list, tools/call,
  //    resources/list, resources/read, prompts/list, prompts/get).
  //    Reconstruct the request with the original body (we consumed it above).
  const sdkRequest = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: rawBody,
  });

  return mcpHandler.fetch(sdkRequest);
}

// ── GET handler ─────────────────────────────────────────────────────────────
// GET is used for SSE streams in legacy protocol mode
export async function GET(req: NextRequest) {
  if (!allowedOrigin(req)) {
    return new Response("Forbidden", { status: 403 });
  }
  return mcpHandler.fetch(req as unknown as Request);
}

// ── DELETE handler ──────────────────────────────────────────────────────────
// DELETE is used for session cleanup in legacy protocol mode
export async function DELETE(req: NextRequest) {
  if (!allowedOrigin(req)) {
    return new Response("Forbidden", { status: 403 });
  }
  return mcpHandler.fetch(new Request(req.url, { method: "DELETE", headers: req.headers }));
}
