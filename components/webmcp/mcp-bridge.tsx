/**
 * components/webmcp/mcp-bridge.tsx
 *
 * WebMCP bridge — discovers tools from the server-side MCP endpoint
 * (POST /api/mcp) and registers them with the browser's
 * navigator.modelContext API. Replaces the manual tool-by-tool
 * registration in register-tools.tsx with automatic discovery from
 * the server.
 *
 * Protocol: MCP Streamable HTTP (JSON-RPC 2.0 over POST)
 *   1. initialize → get Mcp-Session-Id
 *   2. notifications/initialized
 *   3. tools/list → discover available tools
 *   4. For each tool, navigator.modelContext.registerTool()
 *   5. On call, forward tools/call to /api/mcp
 *
 * Per https://webmachinelearning.github.io/webmcp/
 */

"use client";

import { useEffect } from "react";

declare global {
  interface Navigator {
    modelContext?: {
      registerTool: (
        tool: {
          name: string;
          description: string;
          inputSchema: Record<string, unknown>;
          execute: (input: Record<string, unknown>) => Promise<unknown>;
        },
        options?: { signal?: AbortSignal },
      ) => Promise<unknown>;
    };
  }
}

const MCP_ENDPOINT = "/api/mcp";
const PROTOCOL_VERSION = "2025-06-18";

type JsonRpcId = string | number;

let idCounter = 0;
function nextId(): JsonRpcId {
  return ++idCounter;
}

function rpcRequest(method: string, params?: Record<string, unknown>, id?: JsonRpcId) {
  return {
    jsonrpc: "2.0",
    ...(id !== undefined ? { id } : {}),
    method,
    ...(params ? { params } : {}),
  };
}

export function McpBridge() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.modelContext) return;

    const controller = new AbortController();
    let sessionId: string | null = null;

    async function mcpFetch(body: object): Promise<Response> {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      };
      if (sessionId) headers["Mcp-Session-Id"] = sessionId;
      return fetch(MCP_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    }

    async function mpcCall(method: string, params?: Record<string, unknown>): Promise<any> {
      const id = nextId();
      const res = await mcpFetch(rpcRequest(method, params, id));
      if (!res.ok) throw new Error(`MCP ${method} failed: ${res.status}`);

      // Capture session ID from initialize response
      const sid = res.headers.get("Mcp-Session-Id");
      if (sid) sessionId = sid;

      // Response may be JSON or SSE (text/event-stream)
      const ct = res.headers.get("Content-Type") || "";
      if (ct.includes("text/event-stream")) {
        // Parse SSE — find the JSON-RPC response with matching id
        const text = await res.text();
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.id === id) return data;
            } catch {
              // skip non-JSON SSE data lines
            }
          }
        }
        throw new Error(`MCP ${method}: no matching response in SSE stream`);
      }

      return res.json();
    }

    async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
      const result = await mpcCall("tools/call", { name, arguments: args });
      if (result.error) throw new Error(result.error.message || "Tool call failed");

      // Extract text content from the CallToolResult
      const content = result.result?.content;
      if (Array.isArray(content) && content.length > 0) {
        // If all content items are text, join and try to parse as JSON
        const texts = content
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text);
        if (texts.length === 1) {
          try {
            return JSON.parse(texts[0]);
          } catch {
            return texts[0];
          }
        }
        if (texts.length > 1) {
          return texts.join("\n");
        }
      }
      return result.result;
    }

    async function init() {
      // 1. Initialize MCP session (response captures session ID via header)
      await mpcCall("initialize", {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: "sigeconomy-webmcp-bridge", version: "1.0.0" },
      });

      // 2. Send initialized notification (no response expected)
      await mcpFetch(rpcRequest("notifications/initialized")).catch(() => {});

      // 3. Discover available tools
      const toolsResult = await mpcCall("tools/list");
      const tools = toolsResult.result?.tools || [];

      // 4. Register each tool with navigator.modelContext
      for (const tool of tools) {
        navigator.modelContext!
          .registerTool(
            {
              name: tool.name,
              description: tool.description || "",
              inputSchema: tool.inputSchema || { type: "object", properties: {} },
              execute: async (input) => callTool(tool.name, input),
            },
            { signal: controller.signal },
          )
          .catch(() => {});
      }
    }

    init().catch(() => {
      // Silently fail — the site works without WebMCP
    });

    return () => controller.abort();
  }, []);

  return null;
}
