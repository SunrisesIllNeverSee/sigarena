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

import {
  McpServer,
  type StandardSchemaWithJSON,
  type CallToolResult,
  type ReadResourceCallback,
  type PromptCallback,
} from "@modelcontextprotocol/server";
import { TOOLS, callTool } from "@/lib/mcp/tools";
import { RESOURCES, readResource } from "@/lib/mcp/resources";
import { PROMPTS, getPrompt } from "@/lib/mcp/prompts";
import type { NextRequest } from "next/server";

/**
 * Mutable per-request context.
 *
 * Cloudflare Workers blocks `new Function()` during request handling, which
 * AJV (used by fromJsonSchema) requires for schema compilation. We bypass
 * AJV with a passthrough StandardSchema (see passthroughSchema below) and
 * pass the per-request NextRequest through this mutable reference.
 */
let currentRequest: NextRequest | undefined;

export function setRequestContext(req: NextRequest | undefined): void {
  currentRequest = req;
}

/**
 * Passthrough StandardSchema that accepts any object without validation.
 *
 * Cloudflare Workers blocks `new Function()`, which AJV uses internally
 * for schema compilation (modelcontextprotocol/typescript-sdk#689). This
 * passthrough schema satisfies the SDK's StandardSchemaWithJSON type
 * without triggering AJV. Tool handlers perform their own validation.
 */
function makePassthroughSchema(
  schema: Record<string, unknown>,
): StandardSchemaWithJSON<Record<string, unknown>, Record<string, unknown>> {
  return {
    "~standard": {
      version: 1,
      vendor: "sigeconomy",
      validate: (data: unknown) => ({
        value: data as Record<string, unknown>,
      }),
      types: undefined,
      jsonSchema: {
        input: () => schema,
        output: () => schema,
      },
    },
  } as unknown as StandardSchemaWithJSON<Record<string, unknown>, Record<string, unknown>>;
}

/**
 * Create a SigEconomy MCP server with all tools, resources, and prompts registered.
 *
 * This factory is called per-request by the Streamable HTTP transport handler.
 * Each request gets a fresh server instance (stateless mode).
 *
 * Per-request context (the NextRequest) is provided via `setRequestContext()`.
 */
export function createSigeconomyServer(): McpServer {
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
  for (const tool of TOOLS) {
    const toolName = tool.name;
    const inputSchema = makePassthroughSchema(
      tool.inputSchema as Record<string, unknown>,
    );

    const toolConfig = {
      title: tool.title,
      description: tool.description,
      annotations: tool.annotations,
      inputSchema,
    };

    const toolHandler = async (
      args: Record<string, unknown>,
    ): Promise<CallToolResult> => {
      const toolArgs =
        args && typeof args === "object" && !Array.isArray(args)
          ? (args as Record<string, unknown>)
          : {};
      const result = (await callTool(
        toolName,
        toolArgs,
        currentRequest!,
      )) as CallToolResult;
      return result;
    };

    server.registerTool(toolName, toolConfig, toolHandler);
  }

  // ── Register all 4 resources ──────────────────────────────────────────
  for (const resource of RESOURCES) {
    const resourceConfig = {
      description: resource.description,
      mimeType: resource.mimeType,
    };

    const resourceHandler: ReadResourceCallback = async (uri) => {
      const result = await readResource(uri.href);
      if (!result) {
        return { contents: [] };
      }
      return result;
    };

    server.registerResource(
      resource.name,
      resource.uri,
      resourceConfig,
      resourceHandler,
    );
  }

  // ── Register all 5 prompts ────────────────────────────────────────────
  for (const prompt of PROMPTS) {
    const promptName = prompt.name;
    const promptConfig = {
      title: prompt.title,
      description: prompt.description,
    };

    const promptHandler: PromptCallback<StandardSchemaWithJSON> = (args) => {
      const promptArgs =
        args && typeof args === "object"
          ? (args as Record<string, string | number>)
          : {};
      const result = getPrompt(promptName, promptArgs);
      if (!result) {
        return { messages: [] };
      }
      // getPrompt returns role: string; the SDK expects role: "user" | "assistant".
      // All prompt messages use role: "user" — cast to satisfy the SDK's narrower type.
      return result as { messages: Array<{ role: "user" | "assistant"; content: { type: "text"; text: string } }> };
    };

    server.registerPrompt(promptName, promptConfig, promptHandler);
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
