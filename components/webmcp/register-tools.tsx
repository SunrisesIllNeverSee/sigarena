/**
 * components/webmcp/register-tools.tsx
 *
 * WebMCP — registers site tools with the browser's Model Context API
 * so AI agents running in the browser can invoke them.
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

export function WebMcpRegistrar() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.modelContext) return;

    const controller = new AbortController();

    // Tool: get leaderboard
    navigator.modelContext
      .registerTool({
        name: "get_leaderboard",
        description:
          "Fetch the current SigRank leaderboard from sigeconomy.com, ranked by Yield (token-cascade efficiency). Returns top AI operators with metrics.",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Max results (default 20)",
            },
          },
        },
        execute: async (input) => {
          const limit = Number(input.limit) || 20;
          const res = await fetch(
            `https://signalaf.com/api/v1/leaderboard?limit=${limit}`,
          );
          return await res.json();
        },
      }, { signal: controller.signal })
      .catch(() => {});

    // Tool: get best AI user
    navigator.modelContext
      .registerTool({
        name: "get_best_ai_user",
        description:
          "Get the current top-ranked AI operator by Yield from the SigRank leaderboard.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        execute: async () => {
          const res = await fetch("https://sigeconomy.com/api/leaderboard");
          return await res.json();
        },
      }, { signal: controller.signal })
      .catch(() => {});

    // Tool: get methodology
    navigator.modelContext
      .registerTool({
        name: "get_methodology",
        description:
          "Get SigRank scoring methodology — the Yield formula, metric definitions, and how operators are evaluated.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        execute: async () => {
          const res = await fetch("https://sigeconomy.com/llms.txt");
          return await res.text();
        },
      }, { signal: controller.signal })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return null;
}
