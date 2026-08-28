/**
 * lib/mcp/resources/index.ts — SigEconomy MCP resource definitions and reader.
 *
 * Extracted from app/api/mcp/route.ts as Phase 7 of the MCP structural
 * renovation. Contains the 4 static resource definitions and the readResource
 * handler that returns resource content by URI.
 *
 * All resource URIs use the sigeconomy:// scheme.
 */

import { getFullLeaderboard } from "@/lib/api";
import {
  SIGRANK_CORE_METRICS,
  PRODUCT_ARCHITECTURE,
  SIGRANK_REFERENCE_EXTENSIONS,
  SIGRANK_STANDARD_VERSION,
} from "@/lib/sigrank-standard";

const CORE_METRIC_LINES = SIGRANK_CORE_METRICS
  .map((metric) => `  ${metric.name} = ${metric.formula}`)
  .join("\n");

const REFERENCE_EXTENSION_LINES = SIGRANK_REFERENCE_EXTENSIONS
  .map((extension) => `  ${extension.name} — ${extension.description}`)
  .join("\n");

export const RESOURCES = [
  {
    uri: "sigeconomy://leaderboard",
    name: "Live Leaderboard",
    description: "The current global AI operator leaderboard ranked by Yield",
    mimeType: "application/json",
  },
  {
    uri: "sigeconomy://methodology",
    name: "Methodology",
    description: "How SigEconomy interprets the SigRank portable core and optional SignalAF reference extensions",
    mimeType: "text/plain",
  },
  {
    uri: "sigeconomy://platforms",
    name: "Supported Platforms",
    description: "AI platforms tracked by SigRank",
    mimeType: "application/json",
  },
  {
    uri: "sigeconomy://metrics",
    name: "Metric Definitions",
    description: "Definitions of the five-metric portable core and its boundary from leaderboard/reference extensions",
    mimeType: "text/plain",
  },
];

/**
 * Read a resource by URI. Returns the contents array for a valid URI, or null
 * if the URI is unknown (the caller should return an appropriate JSON-RPC error).
 */
export async function readResource(
  uri: string,
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> } | null> {
  if (uri === "sigeconomy://methodology") {
    return {
      contents: [{
        uri,
        mimeType: "text/plain",
        text: `Upsilon Measurement Methodology

Upsilon is ${PRODUCT_ARCHITECTURE.brand}'s measurement engine. It measures AI
operator token-cascade relationships from privacy-preserving numeric telemetry.
${PRODUCT_ARCHITECTURE.leaderboard} is the public leaderboard and proof surface.
Upsilon evaluates operators, not models, and does not establish
correctness, work quality, employee productivity, or business value.

${SIGRANK_STANDARD_VERSION} portable core
Required for compatibility with the existing wire record:
${CORE_METRIC_LINES}

Optional SignalAF reference extensions
Not required for base SigRank compatibility:
${REFERENCE_EXTENSION_LINES}

Archetype = operating shape. Class = scale or qualification. Rank = field
position. SigEconomy's local explanatory signature labels are not the 10-type
Build Archetypes reference extension and do not affect base compatibility.`,
      }],
    };
  }

  if (uri === "sigeconomy://metrics") {
    return {
      contents: [{
        uri,
        mimeType: "text/plain",
        text: `Upsilon Metric Definitions

${SIGRANK_STANDARD_VERSION} portable core
Required for compatibility with the existing wire record:
${CORE_METRIC_LINES}

Missing cache telemetry remains null. It must not be fabricated as observed zero.

Optional SignalAF reference extensions
Not required for base SigRank compatibility:
${REFERENCE_EXTENSION_LINES}

SigEconomy also presents product-specific leaderboard views such as Efficiency,
cost per million tokens, and Op Ratio. Those views are not portable-core metrics.
Its local five-label explanatory shapes are not the 10-type Build Archetypes
reference extension.`,
      }],
    };
  }

  if (uri === "sigeconomy://platforms") {
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify({
          platforms: ["claude", "cursor", "cline", "windsurf", "codex", "gemini", "chatgpt", "other"],
          description: "Upsilon measures operators across these platforms; SigRank presents the public proof surface. Platform is determined by the session log source.",
        }, null, 2),
      }],
    };
  }

  if (uri === "sigeconomy://leaderboard") {
    const data = await getFullLeaderboard("30d");
    return {
      contents: [{
        uri,
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      }],
    };
  }

  return null;
}
