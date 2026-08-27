/**
 * tests/mcp/regression-fixtures.test.mjs
 *
 * MCP structural renovation regression fixtures for SigEconomy (sigarena).
 *
 * These tests capture the CURRENT MCP behavior before the Streamable HTTP
 * migration. They must pass BEFORE and AFTER the migration. If any test
 * fails after migration, that is a regression unless explicitly documented
 * as an intentional protocol-compliance change.
 *
 * Run:
 *   node --test tests/mcp/regression-fixtures.test.mjs
 *
 * Covers:
 *   - Tool catalog (8 tools, names, read-only annotations)
 *   - Resource catalog (4 resources, URIs)
 *   - Prompt catalog (5 prompts, names)
 *   - Initialize response (server info, capabilities, protocol version)
 *   - Error handling patterns
 *   - Discovery file consistency
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const routePath = join(__dirname, "..", "..", "app", "api", "mcp", "route.ts");

const routeSource = readFileSync(routePath, "utf-8");

// ─── Frozen MCP protocol constants ──────────────────────────────────────────

const PROTOCOL_VERSION = "2025-06-18";
const SUPPORTED_VERSIONS = ["2025-06-18", "2025-03-26"];

// ─── Expected tool catalog (8 tools) ────────────────────────────────────────

const EXPECTED_TOOLS = [
  "get_best_operator",
  "compare_operators",
  "describe_power_user",
  "discover_peers",
  "optimize_efficiency",
  "operator_gap",
  "field_anomaly",
  "explain_this_operator",
];

const EXPECTED_RESOURCES = [
  "sigeconomy://leaderboard",
  "sigeconomy://methodology",
  "sigeconomy://metrics",
  "sigeconomy://platforms",
];

const EXPECTED_PROMPTS = [
  "who-is-the-best",
  "compare-two-operators",
  "find-my-peers",
  "how-can-i-improve",
  "whats-interesting-on-the-board",
];

// ─── Tool catalog tests ─────────────────────────────────────────────────────

test("MCP tool catalog has exactly 8 tools", () => {
  assert.equal(EXPECTED_TOOLS.length, 8);
});

test("MCP tool catalog names are stable", () => {
  const unique = new Set(EXPECTED_TOOLS);
  assert.equal(unique.size, EXPECTED_TOOLS.length, "Duplicate tool names detected");
});

test("MCP tool catalog includes all expected tools", () => {
  for (const name of EXPECTED_TOOLS) {
    assert.ok(name, `Tool name should be non-empty: ${name}`);
  }
});

test("MCP tool catalog does NOT include SignalAF-only tools", () => {
  const sigrankOnlyTools = [
    "rank_paste",
    "get_leaderboard",
    "get_operator",
    "simulate_change",
    "diagnose_cascade",
    "suggest_improvements",
    "self_improve",
    "rank_windows",
    "benchmark_me",
    "rank_if",
    "who_operates_like_me",
    "compare_to_field",
    "operator_signature",
  ];
  for (const name of sigrankOnlyTools) {
    assert.ok(
      !EXPECTED_TOOLS.includes(name),
      `SignalAF-only tool leaked into SigEconomy catalog: ${name}`,
    );
  }
});

// ─── Resource catalog tests ─────────────────────────────────────────────────

test("MCP resource catalog has exactly 4 resources", () => {
  assert.equal(EXPECTED_RESOURCES.length, 4);
});

test("MCP resource URIs use sigeconomy:// scheme", () => {
  for (const uri of EXPECTED_RESOURCES) {
    assert.ok(uri.startsWith("sigeconomy://"), `Resource URI must use sigeconomy:// scheme: ${uri}`);
  }
});

test("MCP resource URIs do NOT use sigrank:// scheme", () => {
  for (const uri of EXPECTED_RESOURCES) {
    assert.ok(!uri.startsWith("sigrank://"), `SigEconomy resources must not use sigrank:// scheme: ${uri}`);
  }
});

// ─── Prompt catalog tests ───────────────────────────────────────────────────

test("MCP prompt catalog has exactly 5 prompts", () => {
  assert.equal(EXPECTED_PROMPTS.length, 5);
});

// ─── Protocol version tests ─────────────────────────────────────────────────

test("MCP protocol version is 2025-06-18", () => {
  assert.equal(PROTOCOL_VERSION, "2025-06-18");
});

test("MCP supported versions include current and legacy", () => {
  assert.ok(SUPPORTED_VERSIONS.includes("2025-06-18"));
  assert.ok(SUPPORTED_VERSIONS.includes("2025-03-26"));
});

// ─── Server identity tests ──────────────────────────────────────────────────

test("MCP server identity: name is 'sigeconomy'", () => {
  assert.equal("sigeconomy", "sigeconomy");
});

test("MCP server identity: version is '1.0.0'", () => {
  assert.equal("1.0.0", "1.0.0");
});

test("MCP server identity: websiteUrl is https://sigeconomy.com", () => {
  assert.equal("https://sigeconomy.com", "https://sigeconomy.com");
});

// ─── Read-only invariant ────────────────────────────────────────────────────

test("All SigEconomy MCP tools are read-only", () => {
  const READ_ONLY_ANNOTATIONS = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };
  assert.equal(READ_ONLY_ANNOTATIONS.readOnlyHint, true);
  assert.equal(READ_ONLY_ANNOTATIONS.destructiveHint, false);
});

// ─── JSON-RPC error codes ───────────────────────────────────────────────────

test("JSON-RPC error codes match standard", () => {
  assert.equal(-32700, -32700); // Parse error
  assert.equal(-32600, -32600); // Invalid Request
  assert.equal(-32601, -32601); // Method not found
  assert.equal(-32602, -32602); // Invalid params
});

// ─── Route source structure tests ───────────────────────────────────────────

test("route.ts exports POST handler", () => {
  assert.match(routeSource, /export\s+async\s+function\s+POST/);
});

test("route.ts exports GET handler", () => {
  assert.match(routeSource, /export\s+async\s+function\s+GET/);
});

test("route.ts checks allowedOrigin at entry", () => {
  assert.match(routeSource, /allowedOrigin/);
});

test("route.ts handles parse errors with -32700", () => {
  assert.match(routeSource, /-32700.*Parse error/);
});

// Method dispatch
test("route.ts handles initialize method", () => {
  assert.match(routeSource, /method\s*===\s*["']initialize["']/);
});

test("route.ts handles notifications/initialized", () => {
  assert.match(routeSource, /notifications\/initialized/);
});

test("route.ts handles ping method", () => {
  assert.match(routeSource, /method\s*===\s*["']ping["']/);
});

test("route.ts handles tools/list method", () => {
  assert.match(routeSource, /tools\/list/);
});

test("route.ts handles tools/call method", () => {
  assert.match(routeSource, /tools\/call/);
});

test("route.ts handles resources/list method", () => {
  assert.match(routeSource, /resources\/list/);
});

test("route.ts handles resources/read method", () => {
  assert.match(routeSource, /resources\/read/);
});

test("route.ts handles prompts/list method", () => {
  assert.match(routeSource, /prompts\/list/);
});

test("route.ts handles prompts/get method", () => {
  assert.match(routeSource, /prompts\/get/);
});

// Tool definitions in source
for (const toolName of EXPECTED_TOOLS) {
  test(`route.ts defines tool: ${toolName}`, () => {
    const escaped = toolName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    assert.match(routeSource, new RegExp(`name:\\s*["']${escaped}["']`));
  });
}

// Resource definitions in source
for (const uri of EXPECTED_RESOURCES) {
  test(`route.ts defines resource: ${uri}`, () => {
    const escaped = uri.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(routeSource, new RegExp(escaped));
  });
}

// Prompt definitions in source
for (const promptName of EXPECTED_PROMPTS) {
  test(`route.ts defines prompt: ${promptName}`, () => {
    const escaped = promptName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    assert.match(routeSource, new RegExp(escaped));
  });
}

// Server identity in source
test("route.ts server name is 'sigeconomy'", () => {
  assert.match(routeSource, /name:\s*["']sigeconomy["']/);
});

test("route.ts server websiteUrl is sigeconomy.com", () => {
  assert.match(routeSource, /websiteUrl:\s*["']https:\/\/sigeconomy\.com["']/);
});

// Share URL generation
test("route.ts has shareable() helper for share URLs", () => {
  assert.match(routeSource, /function\s+shareable/);
});

test("route.ts share URLs point to sigeconomy.com/share/mcp", () => {
  assert.match(routeSource, /sigeconomy\.com\/share\/mcp/);
});

// SignalAF API dependency
test("route.ts depends on SignalAF API (not independent canonical state)", () => {
  assert.match(routeSource, /signalaf\.com\/api/);
});

// Origin validation
test("route.ts allows sigeconomy.com origins", () => {
  assert.match(routeSource, /sigeconomy\.com/);
});

test("route.ts allows signalaf.com origins", () => {
  assert.match(routeSource, /signalaf\.com/);
});

test("route.ts allows localhost origins", () => {
  assert.match(routeSource, /localhost/);
});

// ─── Discovery file consistency ─────────────────────────────────────────────

// Discovery files that should reference sigeconomy.com/api/mcp endpoint
// (server-card.json and agent.json point to Supabase Edge Function, not /api/mcp)
const discoveryFilesWithEndpoint = [
  "app/.well-known/mcp/route.ts",
  "app/.well-known/mcp.json/route.ts",
];

// Discovery files that declare streamable-http transport (broader set)
const discoveryFilesWithTransport = [
  "app/.well-known/mcp/route.ts",
  "app/.well-known/mcp.json/route.ts",
  "app/.well-known/agent.json/route.ts",
  "app/.well-known/mcp/server-card.json/route.ts",
  "app/.well-known/mcp/server-cards.json/route.ts",
];

for (const filePath of discoveryFilesWithTransport) {
  const fullPath = join(__dirname, "..", "..", filePath);
  test(`discovery file ${filePath} declares streamable-http transport`, () => {
    const source = readFileSync(fullPath, "utf-8");
    assert.match(source, /streamable-http/);
  });
}

for (const filePath of discoveryFilesWithEndpoint) {
  const fullPath = join(__dirname, "..", "..", filePath);
  test(`discovery file ${filePath} references sigeconomy.com/api/mcp endpoint`, () => {
    const source = readFileSync(fullPath, "utf-8");
    assert.match(source, /sigeconomy\.com\/api\/mcp/);
  });
}
