/**
 * lib/mcp/tools/index.ts — SigEconomy MCP tool definitions and dispatcher.
 *
 * Extracted from app/api/mcp/route.ts as Phase 7 of the MCP structural
 * renovation. Contains the 8 read-only SigEconomy tool definitions, helper
 * functions, and the callTool dispatcher. Transport-level concerns (protocol
 * dispatch, origin validation) remain in the route.
 *
 * SigEconomy is the interpretation layer — it reads from SignalAF's public
 * API (signalaf.com/api/v1) and interprets the results. It does not
 * duplicate the cascade math.
 */

import type { NextRequest } from "next/server";
import {
  getFullLeaderboard,
  getOperator,
  metricSortValue,
} from "@/lib/api";
import type { CanonicalMetric } from "@/lib/prompts";
import { textResult } from "@/lib/mcp/protocol";

export const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

interface ToolDef {
  name: string;
  title: string;
  description: string;
  annotations?: typeof READ_ONLY_ANNOTATIONS;
  inputSchema: Record<string, unknown>;
}

export const TOOLS: ToolDef[] = [
  {
    name: "get_best_operator",
    title: "Get Best Operator — Who Is #1 Right Now?",
    description:
      "Returns the current #1 AI operator by Yield (Υ) on the live leaderboard. Includes their full metrics, class tier, platform, and a one-line description of why they're on top. Use this when someone asks 'who is the best AI user?' or 'what's the top operator?'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d", description: "Time window (default 30d)" },
        metric: { type: "string", enum: ["yield", "leverage", "velocity", "snr", "dev10x", "scale_v"], default: "yield", description: "Ranking metric (default yield)" },
        platform: { type: "string", description: "Filter by platform (e.g. 'claude', 'cursor', 'cline'). Omit for all platforms." },
      },
    },
  },
  {
    name: "compare_operators",
    title: "Compare Operators — Head-to-Head",
    description:
      "Compares two operators by codename, returning their metrics side by side, the yield gap, the primary differentiating factor, and a natural-language summary. Use this when someone asks 'how does X compare to Y?' or 'who is better, X or Y?'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["operator_a", "operator_b"],
      properties: {
        operator_a: { type: "string", description: "Codename for operator A" },
        operator_b: { type: "string", description: "Codename for operator B" },
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d" },
      },
    },
  },
  {
    name: "describe_power_user",
    title: "Describe Power User — What Does Elite Look Like?",
    description:
      "Returns the statistical profile of the top 10% of AI operators: median yield, leverage, velocity, SNR, common class tiers, dominant platforms, and shared characteristics. Use this when someone asks 'what does a power user look like?' or 'what makes someone elite?'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d" },
      },
    },
  },
  {
    name: "discover_peers",
    title: "Discover Peers — Find Operators Like Me",
    description:
      "Finds operators whose metrics most closely match yours. Provide your token pillars or codename, and get the 5 nearest peers by metric distance, with similarity % and where they outperform you. Use this when someone asks 'who operates like me?' or 'find my peers.'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codename: { type: "string", description: "Your codename (alternative to pillars)" },
        input: { type: "number", minimum: 0 },
        output: { type: "number", minimum: 0 },
        cache_read: { type: "number", minimum: 0 },
        cache_write: { type: "number", minimum: 0 },
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d" },
        limit: { type: "number", minimum: 1, maximum: 20, default: 5 },
      },
    },
  },
  {
    name: "optimize_efficiency",
    title: "Optimize Efficiency — Actionable Recommendations",
    description:
      "Analyzes an operator's metrics and returns specific, actionable recommendations to improve yield. Identifies the weakest metric, estimates the yield impact of fixing it, and suggests concrete changes (e.g. 'increase cache reuse by 50%'). Use this when someone asks 'how can I improve?' or 'what should I work on?'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codename: { type: "string", description: "Operator codename (alternative to pillars)" },
        input: { type: "number", minimum: 0 },
        output: { type: "number", minimum: 0 },
        cache_read: { type: "number", minimum: 0 },
        cache_write: { type: "number", minimum: 0 },
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d" },
      },
    },
  },
  {
    name: "operator_gap",
    title: "Operator Gap — What Separates Two Operators",
    description:
      "Decomposes the yield gap between two operators into leverage, velocity, and SNR contributions. Returns the primary cause, secondary cause, and any offsetting weakness. Use this when someone asks 'why is X better than Y?' or 'what's the difference between X and Y?'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["operator_a", "operator_b"],
      properties: {
        operator_a: { type: "string", description: "Codename for operator A" },
        operator_b: { type: "string", description: "Codename for operator B" },
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d" },
      },
    },
  },
  {
    name: "field_anomaly",
    title: "Field Anomaly — Unusual Patterns",
    description:
      "Scans the live leaderboard for unusual patterns: high velocity with low leverage, top operators with near-zero cache write, largest 7-day movements, and extreme yield divergence. Returns findings without requiring user input. Use this for automated insights or when someone asks 'what's interesting on the board?'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d" },
      },
    },
  },
  {
    name: "explain_this_operator",
    title: "Explain This Operator — Natural-Language Profile",
    description:
      "Returns a natural-language explanation of an operator's profile: their class, archetype, dominant trait, strengths, weaknesses, field position, and what makes them unusual. Use this when someone asks 'who is X?' or 'explain this operator' or 'what kind of operator is X?'",
    annotations: READ_ONLY_ANNOTATIONS,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["codename"],
      properties: {
        codename: { type: "string", description: "Operator codename" },
        window: { type: "string", enum: ["7d", "30d", "90d", "all_time"], default: "30d" },
      },
    },
  },
];

// ─── Helper functions ───────────────────────────────────────────────────────

/**
 * Build a lightweight OperatorEvaluation object from operator metrics.
 * SigEconomy doesn't have the cascade module — it reads from SignalAF's API.
 * This produces a normalized evaluation shape consistent with SignalAF's.
 */
function evaluation(
  metrics: { yield: number; leverage: number; velocity: number; snr: number; dev10x?: number },
  context?: { codename?: string; display_name?: string; class?: string; platform?: string; rank?: number; percentile?: number; window?: string },
) {
  const { yield: y, leverage: l, velocity: v, snr: s } = metrics;
  let archetype: string, dominant_trait: string;
  if (l > 100 && v < 5) { archetype = "CONTEXTUAL"; dominant_trait = "high-context reuse"; }
  else if (l < 10 && v > 5) { archetype = "GENERATOR"; dominant_trait = "high-throughput generation"; }
  else if (l > 50 && v > 5) { archetype = "BALANCED_ELITE"; dominant_trait = "combined reuse + throughput"; }
  else if (v < 0.5) { archetype = "READER"; dominant_trait = "input-heavy consumption"; }
  else { archetype = "STANDARD"; dominant_trait = "moderate all-around"; }
  return {
    codename: context?.codename ?? null,
    display_name: context?.display_name ?? null,
    class: context?.class ?? null,
    platform: context?.platform ?? null,
    rank: context?.rank ?? null,
    percentile: context?.percentile ?? null,
    window: context?.window ?? "30d",
    metrics: { yield: y, leverage: l, velocity: v, snr: s, dev10x: metrics.dev10x ?? null },
    archetype,
    dominant_trait,
    signature: `L${l.toFixed(1)}-V${v.toFixed(2)}-S${s.toFixed(2)}`,
  };
}

/**
 * Build a shareable URL + summary for an MCP tool result.
 * The share URL encodes the tool name and params so the /share/mcp route
 * can re-execute the tool and render a visual card.
 */
function shareable(
  toolName: string,
  params: Record<string, unknown>,
  summary: string,
): { share_url: string; share_text: string } {
  const encoded = encodeURIComponent(JSON.stringify(params));
  const url = `https://sigeconomy.com/share/mcp?t=${toolName}&d=${encoded}`;
  return { share_url: url, share_text: summary };
}

// ─── Tool dispatcher ────────────────────────────────────────────────────────

/**
 * Dispatch a tool call by name. Returns a CallToolResult-shaped object
 * ({ content, isError? }) that the SDK's registerTool handler expects.
 *
 * The optional `req` parameter is passed for request context (unused by
 * SigEconomy tools currently, but kept for consistency with the SDK pattern).
 */
export async function callTool(
  name: string,
  args: Record<string, unknown>,
  _req?: NextRequest,
) {
  const window = typeof args.window === "string" ? args.window : "30d";

  // ── get_best_operator ──
  if (name === "get_best_operator") {
    const metric = typeof args.metric === "string" ? args.metric : "yield";
    const platform = typeof args.platform === "string" ? args.platform : undefined;

    const data = await getFullLeaderboard(window);
    if (!data || data.entries.length === 0) {
      return textResult({ code: "board_unavailable", message: "Live leaderboard data is unavailable." }, true);
    }

    let entries = data.entries;
    if (platform) {
      entries = entries.filter((e) => e.platform.toLowerCase() === platform.toLowerCase());
    }
    if (entries.length === 0) {
      return textResult({ code: "no_match", message: `No operators on platform "${platform}" for ${window}.` });
    }

    // Sort by requested metric
    const sorted = [...entries].sort((a, b) => metricSortValue(b, metric as CanonicalMetric) - metricSortValue(a, metric as CanonicalMetric));
    const best = sorted[0];

    return textResult({
      rank: 1,
      codename: best.codename,
      display_name: best.display_name || best.codename,
      platform: best.platform,
      class_tier: best.class_tier,
      metrics: {
        yield: best.yield_,
        leverage: best.leverage,
        velocity: best.velocity,
        snr: best.snr,
        dev10x: best.dev10x,
        scale_v: best.scale_v,
      },
      tokens: {
        input: best.input_tokens,
        output: best.output_tokens,
        cache_read: best.cache_read_tokens,
        cache_write: best.cache_creation_tokens,
        total: best.total_tokens,
      },
      percentile: best.percentile,
      window,
      metric,
      interpretation: `${best.display_name || best.codename} is the #1 operator by ${metric} (${best.yield_} Υ) on the ${window} board. Class: ${best.class_tier}. Platform: ${best.platform}.`,
      evaluation: evaluation(
        { yield: best.yield_, leverage: best.leverage, velocity: best.velocity, snr: best.snr, dev10x: best.dev10x },
        { codename: best.codename, display_name: best.display_name || best.codename, class: best.class_tier, platform: best.platform, rank: 1, percentile: best.percentile, window },
      ),
      share: shareable(
        "get_best_operator",
        { window, metric },
        `${best.display_name || best.codename} is the #1 operator by ${metric} (${best.yield_} Υ) on the ${window} board. Class: ${best.class_tier}. Platform: ${best.platform}.`,
      ),
    });
  }

  // ── compare_operators ──
  if (name === "compare_operators") {
    const codenameA = String(args.operator_a || "").trim();
    const codenameB = String(args.operator_b || "").trim();
    if (!codenameA || !codenameB) {
      return textResult({ code: "invalid_arguments", message: "operator_a and operator_b are required." }, true);
    }

    const [opA, opB] = await Promise.all([
      getOperator(codenameA),
      getOperator(codenameB),
    ]);

    if (!opA) return textResult({ code: "operator_not_found", message: `No operator "${codenameA}".` }, true);
    if (!opB) return textResult({ code: "operator_not_found", message: `No operator "${codenameB}".` }, true);

    const yieldGap = opA.current_metrics.yield_ - opB.current_metrics.yield_;
    const levGap = opA.current_metrics.leverage - opB.current_metrics.leverage;
    const velGap = opA.current_metrics.velocity - opB.current_metrics.velocity;
    const snrGap = opA.current_metrics.snr - opB.current_metrics.snr;

    const factors = [
      { factor: "leverage", gap: levGap, a: opA.current_metrics.leverage, b: opB.current_metrics.leverage },
      { factor: "velocity", gap: velGap, a: opA.current_metrics.velocity, b: opB.current_metrics.velocity },
      { factor: "snr", gap: snrGap, a: opA.current_metrics.snr, b: opB.current_metrics.snr },
    ].sort((x, y) => Math.abs(y.gap) - Math.abs(x.gap));

    const winner = yieldGap > 0 ? codenameA : codenameB;
    const winnerDisplay = yieldGap > 0 ? (opA.display_name || codenameA) : (opB.display_name || codenameB);

    return textResult({
      operator_a: {
        codename: codenameA,
        display_name: opA.display_name || codenameA,
        class: opA.class_tier,
        platform: opA.platform,
        yield: opA.current_metrics.yield_,
        leverage: opA.current_metrics.leverage,
        velocity: opA.current_metrics.velocity,
        snr: opA.current_metrics.snr,
        rank: opA.current_rank.global,
        percentile: opA.current_rank.percentile,
      },
      operator_b: {
        codename: codenameB,
        display_name: opB.display_name || codenameB,
        class: opB.class_tier,
        platform: opB.platform,
        yield: opB.current_metrics.yield_,
        leverage: opB.current_metrics.leverage,
        velocity: opB.current_metrics.velocity,
        snr: opB.current_metrics.snr,
        rank: opB.current_rank.global,
        percentile: opB.current_rank.percentile,
      },
      yield_gap: Number(yieldGap.toFixed(2)),
      winner: winnerDisplay,
      primary_differentiator: { factor: factors[0].factor, gap: Number(factors[0].gap.toFixed(4)) },
      secondary_differentiator: { factor: factors[1].factor, gap: Number(factors[1].gap.toFixed(4)) },
      interpretation: `${winnerDisplay} outranks by ${Math.abs(yieldGap).toFixed(1)} Υ. Primary differentiator: ${factors[0].factor} (gap ${factors[0].gap.toFixed(2)}). Secondary: ${factors[1].factor} (gap ${factors[1].gap.toFixed(2)}).`,
      share: shareable(
        "compare_operators",
        { operator_a: codenameA, operator_b: codenameB, window },
        `${winnerDisplay} outranks by ${Math.abs(yieldGap).toFixed(1)} Υ. Primary differentiator: ${factors[0].factor} (gap ${factors[0].gap.toFixed(2)}). Secondary: ${factors[1].factor} (gap ${factors[1].gap.toFixed(2)}).`,
      ),
    });
  }

  // ── describe_power_user ──
  if (name === "describe_power_user") {
    const data = await getFullLeaderboard(window);
    if (!data || data.entries.length === 0) {
      return textResult({ code: "board_unavailable", message: "Live leaderboard data is unavailable." }, true);
    }

    const sorted = [...data.entries].sort((a, b) => b.yield_ - a.yield_);
    const top10pct = sorted.slice(0, Math.max(5, Math.floor(sorted.length * 0.1)));

    const median = (arr: number[]) => {
      const s = [...arr].sort((a, b) => a - b);
      return s[Math.floor(s.length / 2)];
    };

    const platforms: Record<string, number> = {};
    const classes: Record<string, number> = {};
    for (const e of top10pct) {
      platforms[e.platform] = (platforms[e.platform] || 0) + 1;
      if (e.class_tier) classes[e.class_tier] = (classes[e.class_tier] || 0) + 1;
    }

    const topPlatforms = Object.entries(platforms).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topClasses = Object.entries(classes).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return textResult({
      window,
      sample_size: top10pct.length,
      profile: {
        median_yield: Number(median(top10pct.map((e) => e.yield_)).toFixed(2)),
        median_leverage: Number(median(top10pct.map((e) => e.leverage)).toFixed(1)),
        median_velocity: Number(median(top10pct.map((e) => e.velocity)).toFixed(3)),
        median_snr: Number(median(top10pct.map((e) => e.snr)).toFixed(4)),
        median_cache_read: median(top10pct.map((e) => e.cache_read_tokens)),
        median_total_tokens: median(top10pct.map((e) => e.total_tokens)),
      },
      dominant_platforms: topPlatforms.map(([p, c]) => ({ platform: p, count: c })),
      dominant_classes: topClasses.map(([c, n]) => ({ class: c, count: n })),
      interpretation: `The top 10% (${top10pct.length} operators) on the ${window} board have a median yield of ${median(top10pct.map((e) => e.yield_)).toFixed(1)} Υ, leverage of ${median(top10pct.map((e) => e.leverage)).toFixed(0)}×, and velocity of ${median(top10pct.map((e) => e.velocity)).toFixed(2)}×. They predominantly use ${topPlatforms[0]?.[0] || "mixed platforms"} and cluster in ${topClasses[0]?.[0] || "various"} class.`,
    });
  }

  // ── discover_peers ──
  if (name === "discover_peers") {
    const limit = typeof args.limit === "number" ? Math.min(20, Math.max(1, Math.trunc(args.limit))) : 5;
    const codename = typeof args.codename === "string" ? args.codename.trim() : null;

    let myMetrics: { yield: number; leverage: number; velocity: number; snr: number };
    let myName: string | null = null;

    if (codename) {
      const op = await getOperator(codename);
      if (!op) return textResult({ code: "operator_not_found", message: `No operator "${codename}".` }, true);
      myName = op.display_name || op.codename;
      myMetrics = {
        yield: op.current_metrics.yield_,
        leverage: op.current_metrics.leverage,
        velocity: op.current_metrics.velocity,
        snr: op.current_metrics.snr,
      };
    } else {
      // Compute from pillars
      const input = args.input, output = args.output, cr = args.cache_read, cw = args.cache_write;
      if (typeof input !== "number" || typeof output !== "number" || typeof cr !== "number" || typeof cw !== "number") {
        return textResult({ code: "invalid_arguments", message: "Provide codename or all 4 pillars (input, output, cache_read, cache_write)." }, true);
      }
      const safeInput = Math.max(input, 1);
      const leverage = cr / safeInput;
      const velocity = output / safeInput;
      const yield_ = leverage * velocity;
      const snr = input + output > 0 ? output / (input + output) : 0;
      myMetrics = { yield: yield_, leverage, velocity, snr };
    }

    const data = await getFullLeaderboard(window);
    if (!data || data.entries.length === 0) {
      return textResult({ code: "board_unavailable", message: "Live leaderboard data is unavailable." }, true);
    }

    const neighbors: Array<Record<string, unknown>> = [];
    for (const e of data.entries) {
      if (codename && e.codename.toLowerCase() === codename.toLowerCase()) continue;
      const dLev = (myMetrics.leverage - e.leverage) / 100;
      const dVel = (myMetrics.velocity - e.velocity) / 5;
      const dSnr = (myMetrics.snr - e.snr) / 1;
      const dist = Math.sqrt(dLev * dLev + dVel * dVel + dSnr * dSnr);
      const similarity = Math.max(0, Number((100 - dist * 10).toFixed(1)));

      neighbors.push({
        codename: e.codename,
        display_name: e.display_name || e.codename,
        rank: e.rank,
        yield: e.yield_,
        leverage: e.leverage,
        velocity: e.velocity,
        snr: e.snr,
        class: e.class_tier,
        platform: e.platform,
        similarity_pct: similarity,
        signature_distance: Number(dist.toFixed(3)),
        ...(e.yield_ > myMetrics.yield ? { they_outperform_you_by: Number((e.yield_ - myMetrics.yield).toFixed(1)) } : {}),
      });
    }

    neighbors.sort((a, b) => (a.signature_distance as number) - (b.signature_distance as number));

    const peerParams: Record<string, unknown> = codename
      ? { codename, window }
      : { input: args.input, output: args.output, cache_read: args.cache_read, cache_write: args.cache_write, window };
    const peerName = myName || "your metrics";

    return textResult({
      you: {
        codename,
        display_name: myName,
        yield: Number(myMetrics.yield.toFixed(2)),
        leverage: Number(myMetrics.leverage.toFixed(1)),
        velocity: Number(myMetrics.velocity.toFixed(3)),
        snr: Number(myMetrics.snr.toFixed(4)),
      },
      peers: neighbors.slice(0, limit),
      window,
      total_compared: neighbors.length,
      share: shareable("discover_peers", peerParams, `Nearest peers for ${peerName}`),
    });
  }

  // ── optimize_efficiency ──
  if (name === "optimize_efficiency") {
    const codename = typeof args.codename === "string" ? args.codename.trim() : null;

    let metrics: { yield: number; leverage: number; velocity: number; snr: number; input: number; output: number; cache_read: number; cache_write: number };
    let myName: string | null = null;

    if (codename) {
      const op = await getOperator(codename);
      if (!op) return textResult({ code: "operator_not_found", message: `No operator "${codename}".` }, true);
      myName = op.display_name || op.codename;
      metrics = {
        yield: op.current_metrics.yield_,
        leverage: op.current_metrics.leverage,
        velocity: op.current_metrics.velocity,
        snr: op.current_metrics.snr,
        input: op.input_tokens,
        output: op.output_tokens,
        cache_read: op.cache_read_tokens,
        cache_write: op.cache_creation_tokens,
      };
    } else {
      const input = args.input, output = args.output, cr = args.cache_read, cw = args.cache_write;
      if (typeof input !== "number" || typeof output !== "number" || typeof cr !== "number" || typeof cw !== "number") {
        return textResult({ code: "invalid_arguments", message: "Provide codename or all 4 pillars." }, true);
      }
      const safeInput = Math.max(input, 1);
      const leverage = cr / safeInput;
      const velocity = output / safeInput;
      metrics = {
        yield: leverage * velocity,
        leverage, velocity,
        snr: input + output > 0 ? output / (input + output) : 0,
        input, output, cache_read: cr, cache_write: cw,
      };
    }

    // Fetch field for comparison
    const data = await getFullLeaderboard(window);
    let fieldMedianLev = 0, fieldMedianVel = 0, fieldMedianSnr = 0;
    if (data && data.entries.length > 0) {
      const compounding = data.entries.filter((e) => !e.non_compounding);
      const median = (arr: number[]) => {
        const s = [...arr].sort((a, b) => a - b);
        return s[Math.floor(s.length / 2)];
      };
      if (compounding.length > 0) {
        fieldMedianLev = median(compounding.map((e) => e.leverage));
        fieldMedianVel = median(compounding.map((e) => e.velocity));
        fieldMedianSnr = median(compounding.map((e) => e.snr));
      }
    }

    // Identify weakest metric (lowest ratio to field median)
    const ratios = [
      { metric: "leverage", ratio: fieldMedianLev > 0 ? metrics.leverage / fieldMedianLev : 1, recommendation: "Increase context reuse — use longer conversations, reference prior context, enable prompt caching." },
      { metric: "velocity", ratio: fieldMedianVel > 0 ? metrics.velocity / fieldMedianVel : 1, recommendation: "Increase output relative to input — ask for more complete responses, use multi-step tasks." },
      { metric: "snr", ratio: fieldMedianSnr > 0 ? metrics.snr / fieldMedianSnr : 1, recommendation: "Improve signal-to-noise — reduce wasted input tokens, use more targeted prompts." },
    ].sort((a, b) => a.ratio - b.ratio);

    const weakest = ratios[0];
    const strongest = ratios[ratios.length - 1];

    // Simulate: what if weakest metric improved to field median?
    let projectedYield = metrics.yield;
    if (weakest.metric === "leverage" && fieldMedianLev > 0) {
      projectedYield = fieldMedianLev * metrics.velocity;
    } else if (weakest.metric === "velocity" && fieldMedianVel > 0) {
      projectedYield = metrics.leverage * fieldMedianVel;
    }

    const optParams: Record<string, unknown> = codename
      ? { codename, window }
      : { input: args.input, output: args.output, cache_read: args.cache_read, cache_write: args.cache_write, window };

    return textResult({
      operator: myName ? { codename, display_name: myName } : null,
      current_metrics: {
        yield: Number(metrics.yield.toFixed(2)),
        leverage: Number(metrics.leverage.toFixed(1)),
        velocity: Number(metrics.velocity.toFixed(3)),
        snr: Number(metrics.snr.toFixed(4)),
      },
      field_median: {
        leverage: Number(fieldMedianLev.toFixed(1)),
        velocity: Number(fieldMedianVel.toFixed(3)),
        snr: Number(fieldMedianSnr.toFixed(4)),
      },
      weakest_metric: {
        metric: weakest.metric,
        your_value: Number((weakest.metric === "leverage" ? metrics.leverage : weakest.metric === "velocity" ? metrics.velocity : metrics.snr).toFixed(4)),
        field_median: Number((weakest.metric === "leverage" ? fieldMedianLev : weakest.metric === "velocity" ? fieldMedianVel : fieldMedianSnr).toFixed(4)),
        ratio_to_median: Number(weakest.ratio.toFixed(2)),
      },
      strongest_metric: {
        metric: strongest.metric,
        ratio_to_median: Number(strongest.ratio.toFixed(2)),
      },
      recommendation: weakest.recommendation,
      projected_yield_if_fixed: Number(projectedYield.toFixed(2)),
      yield_uplift: Number((projectedYield - metrics.yield).toFixed(2)),
      window,
      share: shareable("optimize_efficiency", optParams, weakest.recommendation),
    });
  }

  // ── operator_gap ──
  if (name === "operator_gap") {
    const codenameA = String(args.operator_a || "").trim();
    const codenameB = String(args.operator_b || "").trim();
    if (!codenameA || !codenameB) {
      return textResult({ code: "invalid_arguments", message: "operator_a and operator_b are required." }, true);
    }

    const [opA, opB] = await Promise.all([getOperator(codenameA), getOperator(codenameB)]);
    if (!opA) return textResult({ code: "operator_not_found", message: `No operator "${codenameA}".` }, true);
    if (!opB) return textResult({ code: "operator_not_found", message: `No operator "${codenameB}".` }, true);

    const yieldGap = opA.current_metrics.yield_ - opB.current_metrics.yield_;
    const factors = [
      { factor: "leverage", gap: opA.current_metrics.leverage - opB.current_metrics.leverage, a: opA.current_metrics.leverage, b: opB.current_metrics.leverage },
      { factor: "velocity", gap: opA.current_metrics.velocity - opB.current_metrics.velocity, a: opA.current_metrics.velocity, b: opB.current_metrics.velocity },
      { factor: "snr", gap: opA.current_metrics.snr - opB.current_metrics.snr, a: opA.current_metrics.snr, b: opB.current_metrics.snr },
    ].sort((x, y) => Math.abs(y.gap) - Math.abs(x.gap));

    const offsetting = factors.find((f) => f.gap < 0);
    const winner = yieldGap > 0 ? (opA.display_name || codenameA) : (opB.display_name || codenameB);

    return textResult({
      operator_a: { codename: codenameA, display_name: opA.display_name || codenameA, yield: opA.current_metrics.yield_ },
      operator_b: { codename: codenameB, display_name: opB.display_name || codenameB, yield: opB.current_metrics.yield_ },
      yield_gap: Number(yieldGap.toFixed(2)),
      winner,
      primary_cause: { factor: factors[0].factor, gap: Number(factors[0].gap.toFixed(4)) },
      secondary_cause: { factor: factors[1].factor, gap: Number(factors[1].gap.toFixed(4)) },
      ...(offsetting ? { offsetting_weakness: { factor: offsetting.factor, gap: Number(offsetting.gap.toFixed(4)) } } : {}),
      most_explanatory_factor: factors[0].factor,
      interpretation: `${winner} outranks by ${Math.abs(yieldGap).toFixed(1)} Υ. Primary cause: ${factors[0].factor} (gap ${factors[0].gap.toFixed(2)}). Secondary: ${factors[1].factor} (gap ${factors[1].gap.toFixed(2)}).${offsetting ? ` Offsetting: ${offsetting.factor} (gap ${offsetting.gap.toFixed(2)}).` : ""}`,
    });
  }

  // ── field_anomaly ──
  if (name === "field_anomaly") {
    const data = await getFullLeaderboard(window);
    if (!data || data.entries.length === 0) {
      return textResult({ code: "board_unavailable", message: "Live leaderboard data is unavailable." }, true);
    }

    const entries = data.entries.filter((e) => !e.non_compounding);
    if (entries.length < 5) {
      return textResult({ code: "insufficient_field", message: `Only ${entries.length} compounding operators.` });
    }

    const medianLev = [...entries.map((e) => e.leverage)].sort((a, b) => a - b)[Math.floor(entries.length / 2)];
    const anomalies: Array<Record<string, unknown>> = [];

    // 1. Highest velocity among below-median leverage
    const belowMedian = entries.filter((e) => e.leverage < medianLev);
    if (belowMedian.length > 0) {
      const top = [...belowMedian].sort((a, b) => b.velocity - a.velocity)[0];
      anomalies.push({
        type: "high_velocity_low_leverage",
        operator: top.codename,
        display_name: top.display_name || top.codename,
        velocity: top.velocity,
        leverage: top.leverage,
        finding: `${top.display_name || top.codename} has velocity ${top.velocity.toFixed(2)}× with only ${top.leverage.toFixed(1)}× leverage — generating fast without much context reuse.`,
      });
    }

    // 2. Top-50 with near-zero cache write
    const top50 = entries.slice(0, Math.min(50, entries.length));
    const nearZeroCw = top50.filter((e) => e.cache_creation_tokens < e.yield_ * 0.01);
    for (const e of nearZeroCw.slice(0, 3)) {
      anomalies.push({
        type: "top_50_zero_cache_write",
        operator: e.codename,
        display_name: e.display_name || e.codename,
        rank: e.rank,
        finding: `${e.display_name || e.codename} is rank #${e.rank} with near-zero cache creation.`,
      });
    }

    // 3. Largest 7-day movement
    const movers = [...entries].filter((e) => e.movement_7d > 0).sort((a, b) => b.movement_7d - a.movement_7d);
    if (movers.length > 0) {
      const top = movers[0];
      anomalies.push({
        type: "largest_7d_improvement",
        operator: top.codename,
        display_name: top.display_name || top.codename,
        movement_7d: top.movement_7d,
        finding: `${top.display_name || top.codename} climbed ${top.movement_7d} positions in 7 days.`,
      });
    }

    // 4. Extreme yield divergence
    const sortedByYield = [...entries].sort((a, b) => b.yield_ - a.yield_);
    const top = sortedByYield[0];
    const bottom = sortedByYield[sortedByYield.length - 1];
    if (top && bottom && bottom.yield_ > 0 && top.yield_ / bottom.yield_ > 100) {
      anomalies.push({
        type: "extreme_yield_divergence",
        top: { operator: top.codename, yield: top.yield_ },
        bottom: { operator: bottom.codename, yield: bottom.yield_ },
        ratio: Number((top.yield_ / bottom.yield_).toFixed(1)),
        finding: `Top operator outperforms bottom by ${(top.yield_ / bottom.yield_).toFixed(0)}× in yield.`,
      });
    }

    return textResult({
      window,
      total_operators: entries.length,
      anomalies,
      summary: `${anomalies.length} anomalies detected across ${entries.length} operators.`,
    });
  }

  // ── explain_this_operator ──
  if (name === "explain_this_operator") {
    const codename = String(args.codename || "").trim();
    if (!codename) {
      return textResult({ code: "invalid_arguments", message: "codename is required." }, true);
    }

    const op = await getOperator(codename);
    if (!op) return textResult({ code: "operator_not_found", message: `No operator "${codename}".` }, true);

    const m = op.current_metrics;
    const lev = m.leverage, vel = m.velocity, snr = m.snr;

    // Determine archetype
    let archetype: string, dominant_trait: string;
    if (lev > 100 && vel < 5) {
      archetype = "CONTEXTUAL";
      dominant_trait = "high-context reuse";
    } else if (lev < 10 && vel > 5) {
      archetype = "GENERATOR";
      dominant_trait = "high-throughput generation";
    } else if (lev > 50 && vel > 5) {
      archetype = "BALANCED_ELITE";
      dominant_trait = "combined reuse + throughput";
    } else if (vel < 0.5) {
      archetype = "READER";
      dominant_trait = "input-heavy consumption";
    } else {
      archetype = "STANDARD";
      dominant_trait = "moderate all-around";
    }

    // Strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    if (lev > 50) strengths.push(`exceptional cache reuse (${lev.toFixed(0)}× leverage)`);
    if (vel > 5) strengths.push(`high output rate (${vel.toFixed(2)}× velocity)`);
    if (snr > 0.85) strengths.push(`excellent signal-to-noise (${snr.toFixed(3)})`);
    if (lev < 10) weaknesses.push(`low cache reuse (${lev.toFixed(1)}× leverage)`);
    if (vel < 1) weaknesses.push(`low output rate (${vel.toFixed(2)}× velocity)`);
    if (snr < 0.5) weaknesses.push(`poor signal-to-noise (${snr.toFixed(3)})`);

    const explanation = `${op.display_name || op.codename} is a ${op.class_tier}-class operator on ${op.platform}, ranked #${op.current_rank.global} globally (${op.current_rank.percentile}th percentile). Their operating archetype is ${archetype} — ${dominant_trait}. Yield: ${m.yield_} Υ. ${strengths.length > 0 ? `Strengths: ${strengths.join(", ")}.` : ""} ${weaknesses.length > 0 ? `Weaknesses: ${weaknesses.join(", ")}.` : ""}`;

    return textResult({
      codename: op.codename,
      display_name: op.display_name || op.codename,
      class: op.class_tier,
      platform: op.platform,
      rank: op.current_rank.global,
      percentile: op.current_rank.percentile,
      archetype,
      dominant_trait,
      metrics: {
        yield: m.yield_,
        leverage: lev,
        velocity: vel,
        snr: snr,
        dev10x: m.dev10x,
      },
      strengths,
      weaknesses,
      tokens: {
        input: op.input_tokens,
        output: op.output_tokens,
        cache_read: op.cache_read_tokens,
        cache_write: op.cache_creation_tokens,
        total: op.total_tokens,
      },
      explanation,
      evaluation: evaluation(
        { yield: m.yield_, leverage: lev, velocity: vel, snr: snr, dev10x: m.dev10x },
        { codename: op.codename, display_name: op.display_name || op.codename, class: op.class_tier, platform: op.platform, rank: op.current_rank.global, percentile: op.current_rank.percentile, window },
      ),
      share: shareable("explain_this_operator", { codename, window }, explanation),
    });
  }

  return textResult({ code: "tool_not_found", message: `Unknown tool: ${name}` }, true);
}
