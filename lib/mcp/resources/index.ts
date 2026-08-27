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
    description: "How SigRank measures AI operators — the cascade metric system",
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
    description: "Definitions of Yield, Leverage, Velocity, SNR, 10xDEV, and class tiers",
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
        text: `SigRank Methodology

SigRank measures AI operator efficiency from privacy-preserving token telemetry.
No prompts, no code, no content — only token counts.

Core metric: Yield (Υ)
  Υ = (cache_read / input) × (output / input) = (cache_read × output) / input²

Yield captures how efficiently an operator converts input tokens into output
through context reuse. Higher Yield = more efficient operator.

Supporting metrics:
  Leverage = cache_read / input (how much context is reused)
  Velocity = output / input (how much output per input)
  SNR = output / (input + output) (signal-to-noise ratio)
  10xDEV = log10(cache_read / input) (log-scale leverage)
  Scale V = log10(total_tokens) (total volume scale)

Class taxonomy (24 stages, RS05):
  IGNITER III → IGNITER II → IGNITER I
  BEARER III → BEARER II → BEARER I
  REFINER III → REFINER II → REFINER I
  SEEKER III → SEEKER II → SEEKER I
  BASE III → BASE II → BASE I
  POWER III → POWER II → POWER I
  ARCH III → ARCH II → ARCH I
  ARCH+ III → ARCH+ II → ARCH+ I

Class is determined by total token volume. Rank is determined by Yield
position within the field. Archetype is determined by operating shape
(leverage/velocity/SNR ratios).

SigRank evaluates AI operators, not models. The harness measures authority
but cannot manufacture authority.`,
      }],
    };
  }

  if (uri === "sigeconomy://metrics") {
    return {
      contents: [{
        uri,
        mimeType: "text/plain",
        text: `SigRank Metric Definitions

Yield (Υ): (cache_read × output) / input²
  The canonical efficiency metric. Captures how well an operator reuses
  context (leverage) and converts it to output (velocity).

Leverage: cache_read / input
  How many cache-read tokens per input token. High leverage = heavy
  context reuse. Low leverage = fresh input dominates.

Velocity: output / input
  How many output tokens per input token. High velocity = productive
  generation. Low velocity = input-heavy consumption.

SNR (Signal-to-Noise Ratio): output / (input + output)
  What fraction of total flow is output. High SNR = mostly generating.
  Low SNR = mostly consuming.

10xDEV: log10(cache_read / input)
  Log-scale leverage. Compresses the wide range of leverage values
  into a 0-5 scale. Requires all four pillars > 0.

Scale V: log10(total_tokens)
  Total volume on a log scale. Used for class tier assignment.

Class Tier: 24-stage taxonomy from IGNITER III to ARCH+ I
  Determined by total token volume thresholds (RS05).

Archetype: Operating shape
  CONTEXTUAL: high leverage, low velocity (context reuser)
  GENERATOR: low leverage, high velocity (fast generator)
  BALANCED_ELITE: high leverage AND high velocity
  READER: very low velocity (input-heavy)
  COMMITTER: high cache creation
  STANDARD: moderate all-around`,
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
          description: "SigRank tracks AI operators across these platforms. Platform is determined by the session log source.",
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
