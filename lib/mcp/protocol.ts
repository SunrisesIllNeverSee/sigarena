/**
 * lib/mcp/protocol.ts — Shared MCP protocol helpers for the SigEconomy MCP
 * route.
 *
 * Extracted from app/api/mcp/route.ts as Phase 7 of the MCP structural
 * renovation. Contains protocol version constants, JSON-RPC helpers, and
 * the textResult helper used by the callTool dispatcher.
 */

import { allowedOrigin } from "@/lib/mcp/security";
export { allowedOrigin };

export const PROTOCOL_VERSION = "2025-06-18";
export const SUPPORTED_VERSIONS = new Set(["2025-06-18", "2025-03-26"]);

export type RpcId = string | number | null;

export type RpcRequest = {
  jsonrpc?: string;
  id?: RpcId;
  method?: string;
  params?: Record<string, unknown>;
};

export function jsonRpc(id: RpcId, result: unknown, status = 200) {
  return Response.json(
    { jsonrpc: "2.0", id, result },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "MCP-Protocol-Version": PROTOCOL_VERSION,
      },
    },
  );
}

export function rpcError(
  id: RpcId,
  code: number,
  message: string,
  data?: unknown,
  status = 200,
) {
  return Response.json(
    {
      jsonrpc: "2.0",
      id,
      error: { code, message, ...(data === undefined ? {} : { data }) },
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "MCP-Protocol-Version": PROTOCOL_VERSION,
      },
    },
  );
}

/**
 * Build a CallToolResult-shaped object from arbitrary data.
 * Used by the callTool dispatcher — returns { content, isError? } which
 * matches the SDK's expected CallToolResult shape.
 */
export function textResult(value: unknown, isError = false) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    ...(isError ? { isError: true } : {}),
  };
}
