/**
 * Shared logic for the /share/mcp route.
 *
 * Decodes the `d` search param (URL decode + JSON parse), calls the local
 * /api/mcp endpoint via fetch to re-execute the tool, and extracts key
 * metrics from the result into a ShareCardMetrics object.
 */

export interface ShareCardMetric {
  label: string;
  value: string;
}

export interface ShareCardMetrics {
  toolName: string;
  params: Record<string, unknown>;
  /** Human-readable headline (operator name, winner, etc.) */
  headline: string;
  /** Sub-headline (class, platform, rank, etc.) */
  subheadline: string;
  /** Key metric tiles to display */
  metrics: ShareCardMetric[];
  /** The interpretation / explanation / recommendation string */
  interpretation: string;
  /** The raw tool result (parsed JSON from the MCP text content) */
  raw: Record<string, unknown>;
  /** Optional share text from the tool result */
  shareText?: string;
  /** Optional share URL from the tool result */
  shareUrl?: string;
}

export interface ShareCardError {
  error: string;
  toolName?: string;
}

/**
 * Decode the `d` search param into a params object.
 * Returns null if the param is missing or invalid JSON.
 */
export function decodeShareParams(d: string | null): Record<string, unknown> | null {
  if (!d) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(d));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Parse the MCP JSON-RPC response to extract the tool result data.
 * The /api/mcp endpoint returns { jsonrpc, id, result: { content: [{ type: "text", text: "..." }] } }
 * The text field contains the JSON-stringified tool result.
 */
function parseMcpResponse(json: unknown): Record<string, unknown> | null {
  try {
    const resp = json as Record<string, unknown>;
    const result = resp.result as Record<string, unknown> | undefined;
    if (!result) return null;
    const content = result.content as Array<Record<string, unknown>> | undefined;
    if (!content || !Array.isArray(content) || content.length === 0) return null;
    const text = content[0].text as string | undefined;
    if (!text) return null;
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Extract a numeric metric from the tool result, formatting it for display.
 */
function fmt(n: unknown, digits = 1): string {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return n.toFixed(digits);
}

/**
 * Extract key metrics from a tool result based on the tool name.
 * Each tool has a different shape, so we handle them individually.
 */
function extractMetrics(
  toolName: string,
  data: Record<string, unknown>,
): { headline: string; subheadline: string; metrics: ShareCardMetric[]; interpretation: string } {
  switch (toolName) {
    case "get_best_operator": {
      const metrics = data.metrics as Record<string, unknown> | undefined;
      const display = (data.display_name as string) || (data.codename as string) || "Unknown";
      const headline = `#${data.rank ?? 1}: ${display}`;
      const subheadline = `${data.class_tier ?? "—"} · ${data.platform ?? "—"} · ${data.window ?? "30d"}`;
      return {
        headline,
        subheadline,
        metrics: [
          { label: "Yield (Υ)", value: fmt(metrics?.yield, 1) },
          { label: "Leverage", value: fmt(metrics?.leverage, 1) + "×" },
          { label: "Velocity", value: fmt(metrics?.velocity, 2) + "×" },
          { label: "SNR", value: fmt(metrics?.snr, 3) },
        ],
        interpretation: (data.interpretation as string) || "",
      };
    }

    case "compare_operators": {
      const opA = data.operator_a as Record<string, unknown> | undefined;
      const opB = data.operator_b as Record<string, unknown> | undefined;
      const headline = `${data.winner ?? "—"} wins`;
      const subheadline = `Yield gap: ${fmt(data.yield_gap, 1)} Υ`;
      return {
        headline,
        subheadline,
        metrics: [
          { label: "A Yield", value: fmt(opA?.yield, 1) },
          { label: "B Yield", value: fmt(opB?.yield, 1) },
          { label: "A Leverage", value: fmt(opA?.leverage, 1) + "×" },
          { label: "B Leverage", value: fmt(opB?.leverage, 1) + "×" },
        ],
        interpretation: (data.interpretation as string) || "",
      };
    }

    case "explain_this_operator": {
      const metrics = data.metrics as Record<string, unknown> | undefined;
      const display = (data.display_name as string) || (data.codename as string) || "Unknown";
      const headline = display;
      const subheadline = `${data.class ?? "—"}-class · ${data.platform ?? "—"} · #${data.rank ?? "—"} globally`;
      return {
        headline,
        subheadline,
        metrics: [
          { label: "Yield (Υ)", value: fmt(metrics?.yield, 1) },
          { label: "Leverage", value: fmt(metrics?.leverage, 1) + "×" },
          { label: "Velocity", value: fmt(metrics?.velocity, 2) + "×" },
          { label: "SNR", value: fmt(metrics?.snr, 3) },
        ],
        interpretation: (data.explanation as string) || "",
      };
    }

    case "discover_peers": {
      const you = data.you as Record<string, unknown> | undefined;
      const peers = data.peers as Array<Record<string, unknown>> | undefined;
      const name = (you?.display_name as string) || (you?.codename as string) || "your metrics";
      const headline = `Nearest peers for ${name}`;
      const topPeer = peers?.[0];
      const subheadline = topPeer
        ? `Closest: ${topPeer.display_name ?? topPeer.codename} (${fmt(topPeer.similarity_pct, 0)}% similar)`
        : `${data.total_compared ?? 0} operators compared`;
      return {
        headline,
        subheadline,
        metrics: [
          { label: "Your Yield", value: fmt(you?.yield, 1) },
          { label: "Your Leverage", value: fmt(you?.leverage, 1) + "×" },
          { label: "Your Velocity", value: fmt(you?.velocity, 2) + "×" },
          { label: "Peers Found", value: String(peers?.length ?? 0) },
        ],
        interpretation: `${peers?.length ?? 0} nearest peers out of ${data.total_compared ?? 0} operators compared on the ${data.window ?? "30d"} board.`,
      };
    }

    case "optimize_efficiency": {
      const current = data.current_metrics as Record<string, unknown> | undefined;
      const weakest = data.weakest_metric as Record<string, unknown> | undefined;
      const op = data.operator as Record<string, unknown> | undefined;
      const headline = op ? `Optimize: ${op.display_name ?? op.codename}` : "Optimize your efficiency";
      const subheadline = `Weakest: ${weakest?.metric ?? "—"} (${fmt(weakest?.ratio_to_median, 2)}× field median)`;
      return {
        headline,
        subheadline,
        metrics: [
          { label: "Yield (Υ)", value: fmt(current?.yield, 1) },
          { label: "Projected", value: fmt(data.projected_yield_if_fixed, 1) },
          { label: "Yield Uplift", value: "+" + fmt(data.yield_uplift, 1) },
          { label: "Weakest", value: String(weakest?.metric ?? "—") },
        ],
        interpretation: (data.recommendation as string) || "",
      };
    }

    default: {
      return {
        headline: toolName,
        subheadline: "",
        metrics: [],
        interpretation: (data.interpretation as string) || (data.explanation as string) || (data.recommendation as string) || "",
      };
    }
  }
}

/**
 * Build a ShareCardMetrics object by re-executing the MCP tool via the
 * local /api/mcp endpoint. Returns an error object if anything fails.
 *
 * @param toolName - the MCP tool name (the `t` search param)
 * @param params - the decoded tool arguments (the `d` search param)
 * @param baseUrl - the base URL for the local API (defaults to the request origin)
 */
export async function buildShareCard(
  toolName: string,
  params: Record<string, unknown>,
  baseUrl?: string,
): Promise<ShareCardMetrics | ShareCardError> {
  const base = baseUrl || "http://localhost:3001";
  const endpoint = `${base}/api/mcp`;

  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: toolName, arguments: params },
      }),
    });

    if (!resp.ok) {
      return { error: `MCP endpoint returned ${resp.status}`, toolName };
    }

    const json = await resp.json();
    const data = parseMcpResponse(json);
    if (!data) {
      return { error: "Failed to parse MCP response", toolName };
    }

    // Check for error results
    if (data.code && data.message) {
      return { error: data.message as string, toolName };
    }

    const extracted = extractMetrics(toolName, data);
    const share = data.share as Record<string, unknown> | undefined;

    return {
      toolName,
      params,
      headline: extracted.headline,
      subheadline: extracted.subheadline,
      metrics: extracted.metrics,
      interpretation: extracted.interpretation,
      raw: data,
      shareText: share?.share_text as string | undefined,
      shareUrl: share?.share_url as string | undefined,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unknown error fetching MCP result",
      toolName,
    };
  }
}
