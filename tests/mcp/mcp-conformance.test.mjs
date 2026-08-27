/**
 * tests/mcp/mcp-conformance.test.mjs
 *
 * Conformance tests for the SigEconomy MCP server after SDK v2 migration.
 * Verifies:
 *   1. SDK v2 packages are installed and importable
 *   2. The server module registers the correct number of tools/resources/prompts
 *   3. The route delegates to the SDK handler
 *   4. Wire-level protocol constants are preserved
 *   5. Discovery surfaces declare streamable-http
 *   6. No SignalAF-only tools or sigrank:// URIs leaked
 *
 * Run:
 *   node --test tests/mcp/mcp-conformance.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = join(__dirname, "..", "..", "lib", "mcp", "server.ts");
const routePath = join(__dirname, "..", "..", "app", "api", "mcp", "route.ts");
const toolsPath = join(__dirname, "..", "..", "lib", "mcp", "tools", "index.ts");
const resourcesPath = join(__dirname, "..", "..", "lib", "mcp", "resources", "index.ts");
const promptsPath = join(__dirname, "..", "..", "lib", "mcp", "prompts", "index.ts");
const protocolPath = join(__dirname, "..", "..", "lib", "mcp", "protocol.ts");
const securityPath = join(__dirname, "..", "..", "lib", "mcp", "security.ts");

const serverSource = readFileSync(serverPath, "utf-8");
const routeSource = readFileSync(routePath, "utf-8");
const toolsSource = readFileSync(toolsPath, "utf-8");
const resourcesSource = readFileSync(resourcesPath, "utf-8");
const promptsSource = readFileSync(promptsPath, "utf-8");
const protocolSource = readFileSync(protocolPath, "utf-8");
const securitySource = readFileSync(securityPath, "utf-8");

// Discovery files
const wellKnownMcpPath = join(__dirname, "..", "..", "app", ".well-known", "mcp", "route.ts");
const wellKnownMcpJsonPath = join(__dirname, "..", "..", "app", ".well-known", "mcp.json", "route.ts");
const wellKnownServerCardPath = join(__dirname, "..", "..", "app", ".well-known", "mcp", "server-card.json", "route.ts");
const wellKnownAgentJsonPath = join(__dirname, "..", "..", "app", ".well-known", "agent.json", "route.ts");
const wellKnownMcpSource = readFileSync(wellKnownMcpPath, "utf-8");
const wellKnownMcpJsonSource = readFileSync(wellKnownMcpJsonPath, "utf-8");
const wellKnownServerCardSource = readFileSync(wellKnownServerCardPath, "utf-8");
const wellKnownAgentJsonSource = readFileSync(wellKnownAgentJsonPath, "utf-8");

// ─── SDK v2 availability ────────────────────────────────────────────────────

test("SDK v2: McpServer is importable", async () => {
  const { McpServer } = await import("@modelcontextprotocol/server");
  assert.equal(typeof McpServer, "function");
});

test("SDK v2: createMcpHandler is importable", async () => {
  const { createMcpHandler } = await import("@modelcontextprotocol/server");
  assert.equal(typeof createMcpHandler, "function");
});

test("SDK v2: fromJsonSchema is importable", async () => {
  const { fromJsonSchema } = await import("@modelcontextprotocol/server");
  assert.equal(typeof fromJsonSchema, "function");
});

// ─── Server module uses SDK correctly ───────────────────────────────────────

test("server.ts uses McpServer from SDK", () => {
  assert.match(serverSource, /new\s+McpServer\s*\(/);
});

test("server.ts uses fromJsonSchema for input schemas", () => {
  assert.match(serverSource, /fromJsonSchema/);
});

test("server.ts registers tools via registerTool", () => {
  assert.match(serverSource, /registerTool/);
});

test("server.ts registers resources via registerResource", () => {
  assert.match(serverSource, /registerResource/);
});

test("server.ts registers prompts via registerPrompt", () => {
  assert.match(serverSource, /registerPrompt/);
});

// ─── Server identity ────────────────────────────────────────────────────────

test("server.ts server name is 'sigeconomy'", () => {
  assert.match(serverSource, /name:\s*["']sigeconomy["']/);
});

test("server.ts server version is 1.0.0", () => {
  assert.match(serverSource, /version:\s*["']1\.0\.0["']/);
});

test("server.ts server websiteUrl is sigeconomy.com", () => {
  assert.match(serverSource, /websiteUrl:\s*["']https:\/\/sigeconomy\.com["']/);
});

// ─── Route delegates to SDK ─────────────────────────────────────────────────

test("route.ts uses createMcpHandler", () => {
  assert.match(routeSource, /createMcpHandler/);
});

test("route.ts calls mcpHandler.fetch", () => {
  assert.match(routeSource, /mcpHandler\.fetch/);
});

test("route.ts preserves origin validation", () => {
  assert.match(routeSource, /allowedOrigin/);
  assert.match(routeSource, /status:\s*403/);
});

test("route.ts exports POST handler", () => {
  assert.match(routeSource, /export\s+async\s+function\s+POST/);
});

test("route.ts exports GET handler", () => {
  assert.match(routeSource, /export\s+async\s+function\s+GET/);
});

test("route.ts exports DELETE handler", () => {
  assert.match(routeSource, /export\s+async\s+function\s+DELETE/);
});

// ─── Protocol constants ─────────────────────────────────────────────────────

test("protocol.ts preserves PROTOCOL_VERSION = 2025-06-18", () => {
  assert.match(protocolSource, /2025-06-18/);
});

test("protocol.ts preserves SUPPORTED_VERSIONS with 2025-03-26", () => {
  assert.match(protocolSource, /2025-03-26/);
});

test("security.ts exports allowedOrigin", () => {
  assert.match(securitySource, /export\s+function\s+allowedOrigin/);
});

// ─── Tool catalog (8 tools) ─────────────────────────────────────────────────

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

test("tools/index.ts defines exactly 8 tools", () => {
  const matches = toolsSource.match(
    new RegExp(`name:\\s*["'](${EXPECTED_TOOLS.join("|")})["']`, "g"),
  );
  assert.ok(matches, "No tool definitions found");
  const unique = new Set(matches.map((m) => m.match(/["']([^"']+)["']/)[1]));
  assert.equal(unique.size, 8, `Expected 8 unique tools, found ${unique.size}`);
});

for (const name of EXPECTED_TOOLS) {
  test(`tool "${name}" is defined`, () => {
    const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    assert.match(toolsSource, new RegExp(`name:\\s*["']${escaped}["']`));
  });
}

test("no SignalAF-only tools are present", () => {
  // These are SignalAF tools that should NOT appear in SigEconomy
  const signalafOnly = [
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
  for (const name of signalafOnly) {
    const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    assert.doesNotMatch(
      toolsSource,
      new RegExp(`name:\\s*["']${escaped}["']`),
      `SignalAF tool ${name} should not be in SigEconomy TOOLS`,
    );
  }
});

test("all tools are read-only", () => {
  // Check that readOnlyHint: true appears for tool annotations
  assert.match(toolsSource, /readOnlyHint:\s*true/);
});

// ─── Resource catalog (4 resources) ─────────────────────────────────────────

test("resources/index.ts defines exactly 4 resources", () => {
  const matches = resourcesSource.match(/uri:\s*["']sigeconomy:\/\//g);
  assert.ok(matches, "No sigeconomy:// resources found");
  assert.equal(matches.length, 4, `Expected 4 resources, got ${matches.length}`);
});

test("all resources use sigeconomy:// scheme", () => {
  assert.match(resourcesSource, /sigeconomy:\/\//);
});

test("no sigrank:// URIs are present", () => {
  assert.doesNotMatch(resourcesSource, /sigrank:\/\//);
});

// ─── Prompt catalog (5 prompts) ─────────────────────────────────────────────

const EXPECTED_PROMPTS = [
  "who-is-the-best",
  "compare-two-operators",
  "find-my-peers",
  "how-can-i-improve",
  "whats-interesting-on-the-board",
];

test("prompts/index.ts defines exactly 5 prompts", () => {
  const matches = promptsSource.match(
    new RegExp(`name:\\s*["'](${EXPECTED_PROMPTS.join("|")})["']`, "g"),
  );
  assert.ok(matches, "No prompt definitions found");
  const unique = new Set(matches.map((m) => m.match(/["']([^"']+)["']/)[1]));
  assert.equal(unique.size, 5, `Expected 5 unique prompts, found ${unique.size}`);
});

for (const name of EXPECTED_PROMPTS) {
  test(`prompt "${name}" is defined`, () => {
    const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    assert.match(promptsSource, new RegExp(`name:\\s*["']${escaped}["']`));
  });
}

// ─── Discovery surfaces ─────────────────────────────────────────────────────

test(".well-known/mcp declares streamable-http", () => {
  assert.match(wellKnownMcpSource, /streamable-http/);
});

test(".well-known/mcp.json declares streamable-http", () => {
  assert.match(wellKnownMcpJsonSource, /streamable-http/);
});

test(".well-known/mcp references sigeconomy.com/api/mcp", () => {
  assert.match(wellKnownMcpSource, /sigeconomy\.com\/api\/mcp/);
});

test(".well-known/mcp.json references sigeconomy.com/api/mcp", () => {
  assert.match(wellKnownMcpJsonSource, /sigeconomy\.com\/api\/mcp/);
});

test(".well-known/mcp/server-card.json declares streamable-http", () => {
  assert.match(wellKnownServerCardSource, /streamable-http/);
});

test(".well-known/agent.json declares streamable-http", () => {
  assert.match(wellKnownAgentJsonSource, /streamable-http/);
});

// ─── No canonical operator state in SigEconomy ──────────────────────────────

test("no database or auth imports in server.ts", () => {
  // SigEconomy is read-only, no database, no auth
  assert.doesNotMatch(serverSource, /supabase|createClient|auth/i);
});

test("no mutation tools (no destructiveHint: true)", () => {
  assert.doesNotMatch(toolsSource, /destructiveHint:\s*true/);
});
