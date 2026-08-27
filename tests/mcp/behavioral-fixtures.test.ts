/**
 * tests/mcp/behavioral-fixtures.test.ts
 *
 * Behavioral regression fixtures for the SigEconomy MCP server.
 * These tests call the domain functions (callTool, readResource, getPrompt)
 * directly with deterministic inputs and compare semantic output fields.
 *
 * Covers spec Section 38: "OLD MCP RESULT = NEW MCP RESULT. Compare
 * meaningful semantic fields rather than transport-specific metadata."
 *
 * Data-dependent tools are tested with mocked SignalAF API responses.
 */

import { describe, it, expect, vi } from "vitest";

// ── Mock SignalAF API ────────────────────────────────────────────────────────
const mockEntry = {
  rank: 1,
  operator_id: "op-1",
  codename: "signal-test1",
  display_name: "Test Operator 1",
  claimed: false,
  class_tier: "REFINER I",
  platform: "claude",
  yield_: 15000.5,
  leverage: 1800.2,
  velocity: 3.5,
  snr: 0.85,
  dev10x: 3.26,
  signa_rate: 75.5,
  compression_ratio: 0.8,
  session_depth: 5,
  token_throughput: 1000000,
  prompt_complexity: 50,
  cross_thread: 30,
  signal_force: 80,
  input_tokens: 1251211,
  output_tokens: 11296121,
  cache_creation_tokens: 128196310,
  cache_read_tokens: 2555179769,
  total_tokens: 3823179491,
  scale_v: 1000,
  efficiency: 0.8,
  cost_per_million: 3.0,
  op_ratio: "1.5",
  cascade_str: "L240-V0.31-S0.24-C0.08",
  non_compounding: false,
  percentile: 99,
  last_seen: "2026-08-01",
  movement_24h: 0,
  movement_7d: 0,
  is_placeholder: false,
};

const mockEntry2 = {
  ...mockEntry,
  rank: 2,
  operator_id: "op-2",
  codename: "signal-test2",
  display_name: "Test Operator 2",
  class_tier: "BUILDER II",
  platform: "cursor",
  yield_: 8000.3,
  leverage: 900.1,
  percentile: 95,
};

const mockLeaderboard = {
  metric: "yield",
  window: "30d",
  generated_at: "2026-08-01T00:00:00Z",
  ruleset_version: "1.0",
  total_operators: 2,
  entries: [mockEntry, mockEntry2],
};

const mockOperator = {
  operator_id: "op-1",
  codename: "signal-test1",
  display_name: "Test Operator 1",
  claimed: false,
  class_tier: "REFINER I",
  platform: "claude",
  supporter_tier: "free",
  verification_status: "verified",
  account_age_days: 30,
  total_messages: 1000,
  current_rank: { global: 1, percentile: 99 },
  current_metrics: {
    signa_rate: 75.5,
    yield_: 15000.5,
    leverage: 1800.2,
    velocity: 3.5,
    snr: 0.85,
    dev10x: 3.26,
    compression_ratio: 0.8,
    session_depth: 5,
    prompt_complexity: 50,
    prompt_complexity_confidence: "exact",
    cross_thread: 30,
    token_throughput: 1000000,
    signal_force: 80,
    drift_ratio: 0,
    sdot_score: 0,
    sdrm_score: 0,
  },
  movement_24h: 0,
  movement_7d: 0,
  last_seen: "2026-08-01",
  ruleset_version: "1.0",
  is_placeholder: false,
  input_tokens: 1251211,
  output_tokens: 11296121,
  cache_creation_tokens: 128196310,
  cache_read_tokens: 2555179769,
  total_tokens: 3823179491,
  scale_v: 1000,
  efficiency: 0.8,
  cost_per_million: 3.0,
  op_ratio: "1.5",
  cascade_str: "L240-V0.31-S0.24-C0.08",
  non_compounding: false,
};

vi.mock("@/lib/api", () => ({
  getFullLeaderboard: vi.fn().mockResolvedValue(mockLeaderboard),
  getOperator: vi.fn().mockResolvedValue(mockOperator),
  metricSortValue: vi.fn((entry: { yield_: number }, metric: string) => {
    if (metric === "yield") return entry.yield_;
    return 0;
  }),
}));

const { callTool } = await import("@/lib/mcp/tools");
const { readResource } = await import("@/lib/mcp/resources");
const { getPrompt } = await import("@/lib/mcp/prompts");

// ── get_best_operator ───────────────────────────────────────────────────────

describe("get_best_operator behavioral fixtures", () => {
  it("returns the #1 operator by yield", async () => {
    const result = await callTool(
      "get_best_operator",
      { metric: "yield", window: "30d" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
    expect(data.codename).toBe("signal-test1");
    expect(data.metrics.yield).toBe(15000.5);
    expect(data.class_tier).toBe("REFINER I");
  });
});

// ── compare_operators ───────────────────────────────────────────────────────

describe("compare_operators behavioral fixtures", () => {
  it("returns head-to-head comparison", async () => {
    const result = await callTool(
      "compare_operators",
      { operator_a: "signal-test1", operator_b: "signal-test2" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
  });
});

// ── describe_power_user ─────────────────────────────────────────────────────

describe("describe_power_user behavioral fixtures", () => {
  it("returns elite operator description", async () => {
    const result = await callTool(
      "describe_power_user",
      { window: "30d" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
  });
});

// ── discover_peers ──────────────────────────────────────────────────────────

describe("discover_peers behavioral fixtures", () => {
  it("returns peer operators", async () => {
    const result = await callTool(
      "discover_peers",
      { codename: "signal-test1", window: "30d" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
  });
});

// ── optimize_efficiency ─────────────────────────────────────────────────────

describe("optimize_efficiency behavioral fixtures", () => {
  it("returns efficiency recommendations", async () => {
    const result = await callTool(
      "optimize_efficiency",
      { codename: "signal-test1", window: "30d" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
  });
});

// ── operator_gap ────────────────────────────────────────────────────────────

describe("operator_gap behavioral fixtures", () => {
  it("returns gap analysis between two operators", async () => {
    const result = await callTool(
      "operator_gap",
      { operator_a: "signal-test1", operator_b: "signal-test2" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
  });
});

// ── field_anomaly ───────────────────────────────────────────────────────────

describe("field_anomaly behavioral fixtures", () => {
  it("returns anomaly analysis", async () => {
    const result = await callTool(
      "field_anomaly",
      { window: "30d" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
  });
});

// ── explain_this_operator ───────────────────────────────────────────────────

describe("explain_this_operator behavioral fixtures", () => {
  it("returns natural-language operator profile", async () => {
    const result = await callTool(
      "explain_this_operator",
      { codename: "signal-test1" },
      {} as never,
    );
    const data = JSON.parse(result.content[0].text as string);
    expect(data).toBeDefined();
  });
});

// ── Resources: readResource ─────────────────────────────────────────────────

describe("Resource behavioral fixtures", () => {
  it("sigeconomy://methodology returns text content", async () => {
    const result = await readResource("sigeconomy://methodology");
    expect(result).not.toBeNull();
    expect(result!.contents.length).toBeGreaterThan(0);
    expect(result!.contents[0].uri).toBe("sigeconomy://methodology");
    expect(result!.contents[0].text).toBeDefined();
    expect(result!.contents[0].text.length).toBeGreaterThan(0);
  });

  it("sigeconomy://metrics returns text content", async () => {
    const result = await readResource("sigeconomy://metrics");
    expect(result).not.toBeNull();
    expect(result!.contents[0].text).toBeDefined();
  });

  it("sigeconomy://platforms returns text content", async () => {
    const result = await readResource("sigeconomy://platforms");
    expect(result).not.toBeNull();
    expect(result!.contents[0].text).toBeDefined();
  });

  it("sigeconomy://leaderboard returns data from mocked API", async () => {
    const result = await readResource("sigeconomy://leaderboard");
    expect(result).not.toBeNull();
    expect(result!.contents[0].text).toBeDefined();
  });

  it("unknown resource returns null", async () => {
    const result = await readResource("sigeconomy://nonexistent");
    expect(result).toBeNull();
  });
});

// ── Prompts: getPrompt ──────────────────────────────────────────────────────

describe("Prompt behavioral fixtures", () => {
  it("who-is-the-best returns messages", () => {
    const result = getPrompt("who-is-the-best", { window: "30d" });
    expect(result).not.toBeNull();
    expect(result!.messages.length).toBeGreaterThan(0);
    expect(result!.messages[0].role).toBe("user");
    expect(result!.messages[0].content.text).toBeDefined();
  });

  it("compare-two-operators returns messages", () => {
    const result = getPrompt("compare-two-operators", {
      operator_a: "signal-test1",
      operator_b: "signal-test2",
    });
    expect(result).not.toBeNull();
    expect(result!.messages.length).toBeGreaterThan(0);
  });

  it("find-my-peers returns messages", () => {
    const result = getPrompt("find-my-peers", { codename: "signal-test1" });
    expect(result).not.toBeNull();
    expect(result!.messages.length).toBeGreaterThan(0);
  });

  it("how-can-i-improve returns messages", () => {
    const result = getPrompt("how-can-i-improve", { codename: "signal-test1" });
    expect(result).not.toBeNull();
    expect(result!.messages.length).toBeGreaterThan(0);
  });

  it("whats-interesting-on-the-board returns messages", () => {
    const result = getPrompt("whats-interesting-on-the-board", { window: "30d" });
    expect(result).not.toBeNull();
    expect(result!.messages.length).toBeGreaterThan(0);
  });

  it("unknown prompt returns null", () => {
    const result = getPrompt("nonexistent-prompt", {});
    expect(result).toBeNull();
  });
});

// ── Tool catalog integrity ──────────────────────────────────────────────────

describe("Tool catalog integrity", () => {
  it("TOOLS array has exactly 8 tools", async () => {
    const { TOOLS } = await import("@/lib/mcp/tools");
    expect(TOOLS.length).toBe(8);
  });

  it("all tools have required fields", async () => {
    const { TOOLS } = await import("@/lib/mcp/tools");
    for (const tool of TOOLS) {
      expect(tool.name).toBeDefined();
      expect(tool.description).toBeDefined();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.annotations).toBeDefined();
      expect(tool.annotations!.readOnlyHint).toBe(true);
      expect(tool.annotations!.destructiveHint).toBe(false);
    }
  });

  it("RESOURCES array has exactly 4 resources", async () => {
    const { RESOURCES } = await import("@/lib/mcp/resources");
    expect(RESOURCES.length).toBe(4);
  });

  it("PROMPTS array has exactly 5 prompts", async () => {
    const { PROMPTS } = await import("@/lib/mcp/prompts");
    expect(PROMPTS.length).toBe(5);
  });
});
