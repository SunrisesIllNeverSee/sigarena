/**
 * lib/mcp/server.ts — SigEconomy MCP server built on the official MCP SDK v2.
 *
 * Creates an McpServer instance with all 8 SigEconomy tools, 4 resources, and
 * 5 prompts registered. Uses the SDK's native protocol negotiation, capability
 * declaration, and Streamable HTTP transport.
 *
 * The server factory is called per-request by createMcpHandler (stateless mode).
 *
 * Server identity:
 *   name:        "sigeconomy"
 *   version:     "1.0.0"
 *   websiteUrl:  "https://sigeconomy.com"
 *
 * SigEconomy is the interpretation layer — it reads from SignalAF's public
 * API (signalaf.com/api/v1) and interprets the results. For raw cascade math,
 * clients should use signalaf.com/api/mcp instead.
 */

import { McpServer, fromJsonSchema } from "@modelcontextprotocol/server";
import { TOOLS, callTool } from "@/lib/mcp/tools";
import { RESOURCES, readResource } from "@/lib/mcp/resources";
import { PROMPTS, getPrompt } from "@/lib/mcp/prompts";
import type { NextRequest } from "next/server";

/**
 * Create a SigEconomy MCP server with all tools, resources, and prompts registered.
 *
 * This factory is called per-request by the Streamable HTTP transport handler.
 * Each request gets a fresh server instance (stateless mode).
 *
 * The optional `req` parameter is passed to callTool for tools that need
 * request context (e.g., for shareable URL generation).
 */
export function createSigeconomyServer(req?: NextRequest): McpServer {
  const server = new McpServer(
    {
      name: "sigeconomy",
      version: "1.0.0",
      title: "SigEconomy",
      description:
        "SigEconomy — AI operator discovery, comparison, and interpretation. Reads from SignalAF's public leaderboard.",
      websiteUrl: "https://sigeconomy.com",
    },
    {
      capabilities: {
        tools: {},
        resources: { subscribe: false },
        prompts: {},
      },
    },
  );

  // ── Register all 8 SigEconomy tools ───────────────────────────────────
  // Each tool's handler delegates to the existing callTool dispatcher,
  // preserving the exact behavior from the pre-migration implementation.
  // fromJsonSchema wraps raw JSON Schema into StandardSchema for the SDK.
  // The SDK's type system is strict — we cast the registerTool call to
  // bridge between our domain types and the SDK's expected types.
  for (const tool of TOOLS) {
    const toolName = tool.name;
    const inputSchema = fromJsonSchema(tool.inputSchema as Record<string, unknown>);

    const toolConfig: Record<string, unknown> = {
      title: tool.title,
      description: tool.description,
      annotations: tool.annotations,
      inputSchema,
    };

    const toolHandler = async (args: unknown) => {
      const toolArgs = (args && typeof args === "object" && !Array.isArray(args)
        ? (args as Record<string, unknown>)
        : {}) as Record<string, unknown>;
      const result = await callTool(toolName, toolArgs, req!);
      // callTool returns { content: [{ type: "text", text: "..." }], isError?: boolean }
      // which matches the SDK's expected CallToolResult shape.
      return result;
    };

    // Cast to any to satisfy the SDK's strict overload resolution
    (server.registerTool as unknown as (name: string, config: Record<string, unknown>, handler: (args: unknown) => Promise<unknown>) => void)(toolName, toolConfig, toolHandler);
  }

  // ── Register all 4 resources ──────────────────────────────────────────
  for (const resource of RESOURCES) {
    const resourceConfig = {
      description: resource.description,
      mimeType: resource.mimeType,
    };

    const resourceHandler = async (uri: { href: string }) => {
      const result = await readResource(uri.href);
      if (!result) {
        return { contents: [] };
      }
      return result;
    };

    (server.registerResource as unknown as (name: string, uri: string, config: Record<string, unknown>, handler: (uri: { href: string }) => Promise<unknown>) => void)(resource.name, resource.uri, resourceConfig, resourceHandler);
  }

  // ── Register all 5 prompts ────────────────────────────────────────────
  for (const prompt of PROMPTS) {
    const promptName = prompt.name;
    const promptConfig = {
      title: prompt.title,
      description: prompt.description,
    };

    const promptHandler = (args: unknown) => {
      const promptArgs = (args && typeof args === "object"
        ? (args as Record<string, string | number>)
        : {}) as Record<string, string | number>;
      const result = getPrompt(promptName, promptArgs);
      if (!result) {
        return { messages: [] };
      }
      return result;
    };

    (server.registerPrompt as unknown as (name: string, config: Record<string, unknown>, handler: (args: unknown) => unknown) => void)(promptName, promptConfig, promptHandler);
  }

  return server;
}

/**
 * Server metadata for discovery and identification.
 */
export const SERVER_INFO = {
  name: "sigeconomy",
  title: "SigEconomy",
  version: "1.0.0",
  description:
    "SigEconomy — AI operator discovery, comparison, and interpretation. Reads from SignalAF's public leaderboard.",
  websiteUrl: "https://sigeconomy.com",
} as const;

/**
 * Instructions sent to clients during initialization.
 */
export const SERVER_INSTRUCTIONS =
  "Use SigEconomy to discover, compare, and explain AI operators. Tools: get_best_operator (who is #1), compare_operators (head-to-head), describe_power_user (what elite looks like), discover_peers (find operators like you), optimize_efficiency (actionable recommendations), operator_gap (what separates two operators), field_anomaly (unusual patterns), explain_this_operator (natural-language profile). SigEconomy reads from SignalAF's public API — for raw cascade math use signalaf.com/api/mcp instead.";
