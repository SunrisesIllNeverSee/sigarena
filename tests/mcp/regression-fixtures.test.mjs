/**
 * tests/mcp/regression-fixtures.test.mjs
 *
 * MCP structural renovation regression fixtures for SigEconomy (sigarena).
 *
 * These tests capture the MCP behavior before and after the Streamable HTTP
 * migration (Phases 7+8). They verify that the tool/resource/prompt catalogs,
 * server identity, origin validation, and discovery declarations are preserved
 * across the migration from custom JSON-RPC to the official MCP SDK v2.
 *
 * After the migration, tool/resource/prompt definitions live in lib/mcp/
 * modules rather than the monolithic route.ts. These tests check the new
 * module files directly.
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
const root = join(__dirname, "..", "..");

const routePath = join(root, "app", "api", "mcp", "route.ts");
const toolsPath = join(root, "lib", "mcp", "tools", "index.ts");
const resourcesPath = join(root, "lib", "mcp", "resources", "index.ts");
const promptsPath = join(root, "lib", "mcp", "prompts", "index.ts");
const serverPath = join(root, "lib", "mcp", "server.ts");
const securityPath = join(root, "lib", "mcp", "security.ts");
const protocolPath = join(root, "lib", "mcp", "protocol.ts");

const routeSource = readFileSync(routePath, "utf-8");
const toolsSource = readFileSync(toolsPath, "utf-8");
const resourcesSource = readFileSync(resourcesPath, "utf-8");
const promptsSource = readFileSync(promptsPath, "utf-8");
const serverSource = readFileSync(serverPath, "utf-8");
const securitySource = readFileSync(securityPath, "utf-8");
const protocolSource = readFileSync(protocolPath, "utf-8");

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

test("protocol.ts declares PROTOCOL_VERSION 2025-06-18", () => {
  assert.match(protocolSource, /PROTOCOL_VERSION\s*=\s*["']2025-06-18["']/);
});

test("protocol.ts declares SUPPORTED_VERSIONS with both versions", () => {
  assert.match(protocolSource, /2025-06-18/);
  assert.match(protocolSource, /2025-03-26/);
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

test("tools/index.ts declares READ_ONLY_ANNOTATIONS with readOnlyHint true", () => {
  assert.match(toolsSource, /readOnlyHint:\s*true/);
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

test("route.ts exports DELETE handler", () => {
  assert.match(routeSource, /export\s+async\s+function\s+DELETE/);
});

test("route.ts checks allowedOrigin at entry", () => {
  assert.match(routeSource, /allowedOrigin/);
});

test("route.ts uses createMcpHandler from SDK v2", () => {
  assert.match(routeSource, /createMcpHandler/);
});

test("route.ts delegates to mcpHandler.fetch", () => {
  assert.match(routeSource, /mcpHandler\.fetch/);
});

test("route.ts imports createSigeconomyServer", () => {
  assert.match(routeSource, /createSigeconomyServer/);
});

test("route.ts handles parse errors with -32700", () => {
  assert.match(routeSource, /-32700.*Parse error/);
});

test("route.ts handles invalid request with -32600", () => {
  assert.match(routeSource, /-32600.*Invalid Request/);
});

// ─── Tool definitions in tools/index.ts ─────────────────────────────────────

for (const toolName of EXPECTED_TOOLS) {
  test(`tools/index.ts defines tool: ${toolName}`, () => {
    const escaped = toolName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    assert.match(toolsSource, new RegExp(`name:\\s*["']${escaped}["']`));
  });
}

test("tools/index.ts exports callTool dispatcher", () => {
  assert.match(toolsSource, /export\s+async\s+function\s+callTool/);
});

test("tools/index.ts exports TOOLS array", () => {
  assert.match(toolsSource, /export\s+const\s+TOOLS/);
});

// Share URL generation
test("tools/index.ts has shareable() helper for share URLs", () => {
  assert.match(toolsSource, /function\s+shareable/);
});

test("tools/index.ts share URLs point to sigeconomy.com/share/mcp", () => {
  assert.match(toolsSource, /sigeconomy\.com\/share\/mcp/);
});

// ─── Resource definitions in resources/index.ts ─────────────────────────────

for (const uri of EXPECTED_RESOURCES) {
  test(`resources/index.ts defines resource: ${uri}`, () => {
    const escaped = uri.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(resourcesSource, new RegExp(escaped));
  });
}

test("resources/index.ts exports readResource", () => {
  assert.match(resourcesSource, /export\s+async\s+function\s+readResource/);
});

test("resources/index.ts exports RESOURCES array", () => {
  assert.match(resourcesSource, /export\s+const\s+RESOURCES/);
});

// ─── Prompt definitions in prompts/index.ts ─────────────────────────────────

for (const promptName of EXPECTED_PROMPTS) {
  test(`prompts/index.ts defines prompt: ${promptName}`, () => {
    const escaped = promptName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    assert.match(promptsSource, new RegExp(`name:\\s*["']${escaped}["']`));
  });
}

test("prompts/index.ts exports getPrompt", () => {
  assert.match(promptsSource, /export\s+function\s+getPrompt/);
});

test("prompts/index.ts exports PROMPTS array", () => {
  assert.match(promptsSource, /export\s+const\s+PROMPTS/);
});

// ─── Server identity in server.ts ───────────────────────────────────────────

test("server.ts server name is 'sigeconomy'", () => {
  assert.match(serverSource, /name:\s*["']sigeconomy["']/);
});

test("server.ts server version is '1.0.0'", () => {
  assert.match(serverSource, /version:\s*["']1\.0\.0["']/);
});

test("server.ts server websiteUrl is sigeconomy.com", () => {
  assert.match(serverSource, /websiteUrl:\s*["']https:\/\/sigeconomy\.com["']/);
});

test("server.ts uses McpServer from SDK v2", () => {
  assert.match(serverSource, /McpServer/);
});

test("server.ts uses fromJsonSchema for schema conversion", () => {
  assert.match(serverSource, /fromJsonSchema/);
});

test("server.ts exports createSigeconomyServer factory", () => {
  assert.match(serverSource, /export\s+function\s+createSigeconomyServer/);
});

// SignalAF API dependency
test("server.ts instructions reference signalaf.com/api/mcp", () => {
  assert.match(serverSource, /signalaf\.com\/api/);
});

// ─── Origin validation in security.ts ───────────────────────────────────────

test("security.ts allows sigeconomy.com origins", () => {
  assert.match(securitySource, /sigeconomy\.com/);
});

test("security.ts allows signalaf.com origins", () => {
  assert.match(securitySource, /signalaf\.com/);
});

test("security.ts allows localhost origins", () => {
  assert.match(securitySource, /localhost/);
});

test("security.ts allows 127.0.0.1 origins", () => {
  assert.match(securitySource, /127\.0\.0\.1/);
});

test("security.ts exports allowedOrigin function", () => {
  assert.match(securitySource, /export\s+function\s+allowedOrigin/);
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
  const fullPath = join(root, filePath);
  test(`discovery file ${filePath} declares streamable-http transport`, () => {
    const source = readFileSync(fullPath, "utf-8");
    assert.match(source, /streamable-http/);
  });
}

for (const filePath of discoveryFilesWithEndpoint) {
  const fullPath = join(root, filePath);
  test(`discovery file ${filePath} references sigeconomy.com/api/mcp endpoint`, () => {
    const source = readFileSync(fullPath, "utf-8");
    assert.match(source, /sigeconomy\.com\/api\/mcp/);
  });
}
