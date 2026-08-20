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

    // Tool: discover peers — finds mentors, peers, and complementary operators
    // for any operator on the leaderboard. Runs peer-matching logic in the browser.
    navigator.modelContext
      .registerTool({
        name: "discover_peers",
        description:
          "Finds mentors, peers, and complementary operators for any operator on the SigRank leaderboard. Pass a codename to find operators they should learn from: mentors (1-2 class tiers above with similar cascade shapes + pillar deltas), peers (same class tier), and complementary (operators whose strength is their weakness). Use this when users ask 'who should I learn from?' or 'find me a mentor' or 'who are my peers?'.",
        inputSchema: {
          type: "object",
          properties: {
            codename: {
              type: "string",
              description: "The operator's codename on the SigRank leaderboard.",
            },
            n: {
              type: "number",
              description: "Number of operators per category (default: 5, max: 20).",
            },
          },
          required: ["codename"],
        },
        execute: async (input) => {
          const codename = String(input.codename || "").trim();
          if (!codename) return { error: "codename is required" };
          const n = Math.min(20, Math.max(1, Number(input.n) || 5));

          // Fetch operator profile + full leaderboard in parallel
          const [profileRes, boardRes] = await Promise.all([
            fetch(`https://signalaf.com/api/v1/operators/${encodeURIComponent(codename)}`),
            fetch("https://signalaf.com/api/v1/leaderboard?metric=yield_&limit=2000"),
          ]);
          const profile = await profileRes.json();
          const board = await boardRes.json();
          const entries = board.entries || board.operators || [];

          // Find the operator's board entry (has raw token pillars)
          const boardEntry = entries.find(
            (op: { codename?: string }) =>
              op.codename?.toLowerCase() === codename.toLowerCase(),
          );
          if (!boardEntry) {
            return {
              status: "not_on_board",
              codename,
              detail: `${codename} is not on the leaderboard.`,
              profile,
            };
          }

          // Inline peer-matching (browser — no imports)
          const CLASS_TIERS = ["ARCH+", "ARCH", "POWER", "BASE", "SEEKER", "REFINER", "BEARER", "IGNITER"];
          const tierOf = (cls: string | undefined): string => {
            if (!cls || cls === "UNCLASSED") return cls || "UNCLASSED";
            const parts = String(cls).split(" ");
            if (parts.length >= 2 && ["I", "II", "III"].includes(parts[parts.length - 1]))
              return parts.slice(0, -1).join(" ");
            return cls;
          };
          const tierRank = (cls: string | undefined): number => {
            const base = tierOf(cls);
            if (!base || base === "UNCLASSED") return -1;
            return CLASS_TIERS.indexOf(base);
          };

          const operator = {
            ...boardEntry,
            class_tier: boardEntry.class_tier || boardEntry.class,
          };
          const myTier = tierRank(operator.class_tier);
          const myPlatform = operator.platform;
          const myYield = Number(operator.yield_) || 0;

          // Cascade shape similarity (log-scaled, normalized)
          const norm = (val: number, max: number) =>
            Math.min(1, Math.log1p(Math.max(0, val)) / Math.log1p(max));
          const shape = (op: { leverage?: number; velocity?: number; snr?: number }) => [
            norm(Number(op.leverage) || 0, 1000),
            norm(Number(op.velocity) || 0, 10),
            norm(Number(op.snr) || 0, 1),
          ];
          const dist = (a: number[], b: number[]) =>
            Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0) / a.length);
          const similarity = (opA: typeof operator, opB: typeof entries[0]) =>
            1 - dist(shape(opA), shape(opB));

          // Pillar delta
          const safeMult = (mt: number, op: number) =>
            op > 0 ? mt / op : mt > 0 ? Infinity : 1;
          const fmtMult = (m: number) => (m === Infinity ? "∞" : `${m.toFixed(1)}×`);
          const pillarDelta = (op: typeof operator, mt: typeof entries[0]) => {
            const fields = [
              { key: "cache_read_tokens", label: "cache_read" },
              { key: "input_tokens", label: "input" },
              { key: "output_tokens", label: "output" },
              { key: "cache_creation_tokens", label: "cache_create" },
            ];
            return fields.map((f) => {
              const mtVal = Number(mt[f.key]) || 0;
              const opVal = Number(op[f.key]) || 0;
              return {
                pillar: f.label,
                mentor_value: mtVal,
                operator_value: opVal,
                multiplier: safeMult(mtVal, opVal),
                absolute_delta: mtVal - opVal,
              };
            });
          };

          const samePlatform = (op: { platform?: string }) =>
            !myPlatform || op.platform === myPlatform;
          const notMe = (op: { codename?: string }) =>
            op.codename?.toLowerCase() !== codename.toLowerCase();

          // Mentors: 1-2 tiers above, ranked by similarity
          const mentors = myTier < 0 ? [] : entries
            .filter(notMe)
            .filter(samePlatform)
            .filter((op: { class_tier?: string; class?: string }) => {
              const t = tierRank(op.class_tier || op.class);
              return t >= 0 && t < myTier && t >= myTier - 2;
            })
            .map((op: typeof entries[0]) => ({
              codename: op.codename,
              class_tier: op.class_tier || op.class,
              yield_: op.yield_,
              leverage: op.leverage,
              velocity: op.velocity,
              platform: op.platform,
              rank: op.rank,
              similarity_score: Math.round(similarity(operator, op) * 100) / 100,
              pillar_delta: pillarDelta(operator, op),
              shareable_url: `https://signalaf.com/operator/${encodeURIComponent(op.codename)}`,
            }))
            .sort((a: { similarity_score: number }, b: { similarity_score: number }) =>
              b.similarity_score - a.similarity_score)
            .slice(0, n);

          // Peers: same tier, ranked by yield proximity
          const peers = myTier < 0 ? [] : entries
            .filter(notMe)
            .filter(samePlatform)
            .filter((op: { class_tier?: string; class?: string }) =>
              tierOf(op.class_tier || op.class) === tierOf(operator.class_tier))
            .map((op: typeof entries[0]) => ({
              codename: op.codename,
              class_tier: op.class_tier || op.class,
              yield_: op.yield_,
              leverage: op.leverage,
              velocity: op.velocity,
              platform: op.platform,
              rank: op.rank,
              yield_delta_from_you: Math.round((Number(op.yield_) || 0) - myYield),
              shareable_url: `https://signalaf.com/operator/${encodeURIComponent(op.codename)}`,
            }))
            .sort((a: { yield_delta_from_you: number }, b: { yield_delta_from_you: number }) =>
              Math.abs(a.yield_delta_from_you) - Math.abs(b.yield_delta_from_you))
            .slice(0, n);

          // Complementary: strongest in the operator's weakest dimension
          const filtered = entries.filter(notMe).filter(samePlatform);
          const avg = (key: string) =>
            filtered.reduce((s: number, op: Record<string, unknown>) =>
              s + (Number(op[key]) || 0), 0) / (filtered.length || 1);
          const dims = ["leverage", "velocity", "snr"];
          const weaknesses = dims
            .map((d) => ({
              dimension: d,
              gap: avg(d) - (Number(operator[d]) || 0),
              avg: avg(d),
            }))
            .sort((a, b) => b.gap - a.gap);
          const weakest = weaknesses[0]?.dimension || "leverage";
          const complementary = filtered
            .map((op: typeof entries[0]) => ({
              codename: op.codename,
              class_tier: op.class_tier || op.class,
              yield_: op.yield_,
              platform: op.platform,
              rank: op.rank,
              strength_dimension: weakest,
              strength_value: Number(op[weakest]) || 0,
              your_weakness: {
                dimension: weakest,
                your_value: Number(operator[weakest]) || 0,
                board_average: Math.round(weaknesses[0]?.avg * 100) / 100,
              },
              shareable_url: `https://signalaf.com/operator/${encodeURIComponent(op.codename)}`,
            }))
            .sort((a: { strength_value: number }, b: { strength_value: number }) =>
              b.strength_value - a.strength_value)
            .slice(0, n);

          return {
            your_profile: {
              codename: operator.codename,
              class_tier: operator.class_tier,
              platform: operator.platform,
              yield_: operator.yield_,
              leverage: operator.leverage,
              velocity: operator.velocity,
              rank: operator.rank,
            },
            mentors,
            peers,
            complementary,
            cta: "Study their cascade",
          };
        },
      }, { signal: controller.signal })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return null;
}
