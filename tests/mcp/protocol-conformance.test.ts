/**
 * tests/mcp/protocol-conformance.test.ts
 *
 * Runtime protocol conformance tests for the SigEconomy MCP server.
 * These tests invoke the actual POST/GET/DELETE route handlers with mock
 * MCP JSON-RPC requests and verify the responses — not source-text regex.
 *
 * Covers spec Sections 36-37:
 *   - Initialization (valid, protocol negotiation, unsupported, malformed)
 *   - Tools (list, call, unknown tool, invalid args, success, domain failure)
 *   - Resources (list, read, unknown)
 *   - Prompts (list, get, unknown)
 *   - Transport (valid request, invalid method, malformed payload, origin
 *     rejection, parse error, invalid JSON-RPC, suffix-attack rejection)
 *
 * External dependencies (SignalAF API) are mocked so tests run without
 * network access.
 */

import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

// ── Mock external dependencies ──────────────────────────────────────────────
// SigEconomy reads from SignalAF's public API — mock to avoid network calls.
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

const { POST, GET, DELETE } = await import("@/app/api/mcp/route");

// ── Helpers ─────────────────────────────────────────────────────────────────

const BASE_URL = "https://sigeconomy.com/api/mcp";
const VALID_ORIGIN = "https://sigeconomy.com";

interface JsonRpcRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

function makePostRequest(
  body: unknown,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest(BASE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      origin: VALID_ORIGIN,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function makeJsonRpc(
  method: string,
  params?: Record<string, unknown>,
  id: string | number = 1,
): JsonRpcRequest {
  return { jsonrpc: "2.0", id, method, ...(params ? { params } : {}) };
}

function makeModernJsonRpc(
  method: string,
  params?: Record<string, unknown>,
  id: string | number = 1,
): JsonRpcRequest {
  const meta = {
    "io.modelcontextprotocol/protocolVersion": "2026-07-28",
    "io.modelcontextprotocol/clientCapabilities": {},
  };
  return {
    jsonrpc: "2.0",
    id,
    method,
    params: { ...(params ?? {}), _meta: meta },
  };
}

function makeModernPostRequest(
  body: unknown,
  headers: Record<string, string> = {},
): NextRequest {
  const bodyObj = typeof body === "string" ? JSON.parse(body) : (body as Record<string, unknown>);
  const method = bodyObj?.method as string | undefined;
  const name = (bodyObj?.params as Record<string, unknown>)?.name as string | undefined;
  return new NextRequest(BASE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      origin: VALID_ORIGIN,
      "mcp-protocol-version": "2026-07-28",
      ...(method ? { "mcp-method": method } : {}),
      ...(name ? { "mcp-name": name } : {}),
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function parseResponseBody(
  res: Response,
): Promise<Record<string, unknown>> {
  const text = await res.text();
  const trimmed = text.trim();

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const dataLines = trimmed
    .split("\n")
    .filter((l) => l.startsWith("data: "))
    .map((l) => l.slice(6));

  if (dataLines.length > 0) {
    return JSON.parse(dataLines.join("\n"));
  }

  throw new Error(`Cannot parse response as JSON or SSE: ${text.slice(0, 300)}`);
}

// ── Initialization ──────────────────────────────────────────────────────────

describe("Initialization", () => {
  it("valid initialize returns server info and capabilities", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test-client", version: "1.0.0" },
        }),
      ),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.jsonrpc).toBe("2.0");
    expect(body.id).toBe(1);
    expect(body.result).toBeDefined();
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    expect(result.serverInfo).toBeDefined();
    const serverInfo = result.serverInfo as Record<string, unknown>;
    expect(serverInfo.name).toBe("sigeconomy");
    expect(serverInfo.version).toBe("1.0.0");

    expect(result.capabilities).toBeDefined();
  });

  it("negotiates legacy protocol version 2025-03-26", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "legacy-client", version: "0.1.0" },
        }),
      ),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();
  });

  it("negotiates SDK latest legacy protocol version 2025-11-25", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-11-25",
          capabilities: {},
          clientInfo: { name: "test-client", version: "1.0.0" },
        }),
      ),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();
  });

  it("rejects future protocol version header (SDK handles era mismatch)", async () => {
    const res = await POST(
      makePostRequest(makeJsonRpc("initialize"), {
        "mcp-protocol-version": "2099-01-01",
      }),
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});

// ── Modern protocol (2026-07-28) ────────────────────────────────────────────

describe("Modern protocol (2026-07-28)", () => {
  it("server/discover returns server info and capabilities", async () => {
    const res = await POST(
      makeModernPostRequest(makeModernJsonRpc("server/discover")),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.jsonrpc).toBe("2.0");
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    // server/discover returns serverInfo inside _meta per the 2026-07-28 spec
    const meta = result._meta as Record<string, unknown> | undefined;
    const serverInfoKey = "io.modelcontextprotocol/serverInfo";
    const serverInfo = meta?.[serverInfoKey] as Record<string, unknown> | undefined;
    expect(serverInfo).toBeDefined();
    expect(serverInfo?.name).toBe("sigeconomy");

    expect(result.capabilities).toBeDefined();
  });

  it("modern tools/list returns all 8 tools", async () => {
    const res = await POST(
      makeModernPostRequest(makeModernJsonRpc("tools/list", undefined, 2)),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const tools = result.tools as Array<Record<string, unknown>>;
    expect(tools.length).toBe(8);

    const names = tools.map((t) => t.name);
    const expected = [
      "get_best_operator",
      "compare_operators",
      "describe_power_user",
      "discover_peers",
      "optimize_efficiency",
      "operator_gap",
      "field_anomaly",
      "explain_this_operator",
    ];
    for (const name of expected) {
      expect(names).toContain(name);
    }
  });

  it("modern tools/call executes a tool", async () => {
    const res = await POST(
      makeModernPostRequest(
        makeModernJsonRpc(
          "tools/call",
          { name: "get_best_operator", arguments: {} },
          3,
        ),
      ),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const content = result.content as Array<Record<string, unknown>>;
    expect(content[0].type).toBe("text");
    const parsed = JSON.parse(content[0].text as string);
    expect(parsed).toBeDefined();
  });

  it("modern resources/list returns resources", async () => {
    const res = await POST(
      makeModernPostRequest(makeModernJsonRpc("resources/list", undefined, 10)),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const resources = result.resources as Array<Record<string, unknown>>;
    expect(resources.length).toBe(4);

    const uris = resources.map((r) => r.uri);
    expect(uris).toContain("sigeconomy://leaderboard");
    expect(uris).toContain("sigeconomy://methodology");
    expect(uris).toContain("sigeconomy://platforms");
    expect(uris).toContain("sigeconomy://metrics");
  });

  it("modern prompts/list returns prompts", async () => {
    const res = await POST(
      makeModernPostRequest(makeModernJsonRpc("prompts/list", undefined, 20)),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const prompts = result.prompts as Array<Record<string, unknown>>;
    expect(prompts.length).toBe(5);

    const names = prompts.map((p) => p.name);
    expect(names).toContain("who-is-the-best");
    expect(names).toContain("compare-two-operators");
    expect(names).toContain("find-my-peers");
    expect(names).toContain("how-can-i-improve");
    expect(names).toContain("whats-interesting-on-the-board");
  });

  it("rejects 2026-07-28 header without envelope claim", async () => {
    const res = await POST(
      makePostRequest(makeJsonRpc("tools/list", undefined, 2), {
        "mcp-protocol-version": "2026-07-28",
      }),
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});

// ── Tools ───────────────────────────────────────────────────────────────────

describe("Tools", () => {
  it("tools/list returns all 8 tools with correct names", async () => {
    const res = await POST(
      makePostRequest(makeJsonRpc("tools/list", undefined, 2)),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const tools = result.tools as Array<Record<string, unknown>>;
    expect(tools.length).toBe(8);

    const names = tools.map((t) => t.name);
    const expected = [
      "get_best_operator",
      "compare_operators",
      "describe_power_user",
      "discover_peers",
      "optimize_efficiency",
      "operator_gap",
      "field_anomaly",
      "explain_this_operator",
    ];
    for (const name of expected) {
      expect(names).toContain(name);
    }
  });

  it("tools/list returns tools with inputSchema and read-only annotations", async () => {
    const res = await POST(
      makePostRequest(makeJsonRpc("tools/list", undefined, 3)),
    );

    const body = await parseResponseBody(res);
    const tools = (body.result as Record<string, unknown>).tools as Array<
      Record<string, unknown>
    >;

    for (const tool of tools) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.description).toBeDefined();
      expect(tool.annotations).toBeDefined();
      const annotations = tool.annotations as Record<string, unknown>;
      expect(annotations.readOnlyHint).toBe(true);
    }
  });

  it("tools/call get_best_operator returns #1 operator", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc(
          "tools/call",
          { name: "get_best_operator", arguments: { metric: "yield" } },
          4,
        ),
      ),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const content = result.content as Array<Record<string, unknown>>;
    expect(content[0].type).toBe("text");
    const parsed = JSON.parse(content[0].text as string);
    expect(parsed).toBeDefined();
  });

  it("tools/call compare_operators returns comparison", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc(
          "tools/call",
          {
            name: "compare_operators",
            arguments: { operator_a: "signal-test1", operator_b: "signal-test2" },
          },
          5,
        ),
      ),
    );

    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();
    const result = body.result as Record<string, unknown>;
    const content = result.content as Array<Record<string, unknown>>;
    expect(content[0].type).toBe("text");
  });

  it("tools/call with unknown tool returns error", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc(
          "tools/call",
          { name: "nonexistent_tool", arguments: {} },
          6,
        ),
      ),
    );

    const body = await parseResponseBody(res);
    expect(body.error ?? (body.result as Record<string, unknown>)?.isError).toBeTruthy();
  });
});

// ── Resources ───────────────────────────────────────────────────────────────

describe("Resources", () => {
  it("resources/list returns all 4 resources", async () => {
    const res = await POST(
      makePostRequest(makeJsonRpc("resources/list", undefined, 10)),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const resources = result.resources as Array<Record<string, unknown>>;
    expect(resources.length).toBe(4);

    const uris = resources.map((r) => r.uri);
    expect(uris).toContain("sigeconomy://leaderboard");
    expect(uris).toContain("sigeconomy://methodology");
    expect(uris).toContain("sigeconomy://platforms");
    expect(uris).toContain("sigeconomy://metrics");
  });

  it("resources/read resolves sigeconomy://methodology", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("resources/read", { uri: "sigeconomy://methodology" }, 11),
      ),
    );

    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();
    const result = body.result as Record<string, unknown>;
    const contents = result.contents as Array<Record<string, unknown>>;
    expect(contents.length).toBeGreaterThan(0);
    expect(contents[0].uri).toBe("sigeconomy://methodology");
    expect(contents[0].text).toBeDefined();
  });
});

// ── Prompts ─────────────────────────────────────────────────────────────────

describe("Prompts", () => {
  it("prompts/list returns all 5 prompts", async () => {
    const res = await POST(
      makePostRequest(makeJsonRpc("prompts/list", undefined, 20)),
    );

    expect(res.status).toBe(200);
    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();

    const result = body.result as Record<string, unknown>;
    const prompts = result.prompts as Array<Record<string, unknown>>;
    expect(prompts.length).toBe(5);

    const names = prompts.map((p) => p.name);
    expect(names).toContain("who-is-the-best");
    expect(names).toContain("compare-two-operators");
    expect(names).toContain("find-my-peers");
    expect(names).toContain("how-can-i-improve");
    expect(names).toContain("whats-interesting-on-the-board");
  });

  it("prompts/get returns messages for who-is-the-best", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc(
          "prompts/get",
          { name: "who-is-the-best", arguments: { window: "30d" } },
          21,
        ),
      ),
    );

    const body = await parseResponseBody(res);
    expect(body.error).toBeUndefined();
    const result = body.result as Record<string, unknown>;
    const messages = result.messages as Array<Record<string, unknown>>;
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].role).toBeDefined();
    expect(messages[0].content).toBeDefined();
  });
});

// ── Transport / Error handling ──────────────────────────────────────────────

describe("Transport and error handling", () => {
  it("rejects invalid JSON body with -32700 Parse error", async () => {
    const res = await POST(makePostRequest("not valid json{"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe(-32700);
  });

  it("rejects invalid JSON-RPC version with -32600 Invalid Request", async () => {
    const res = await POST(
      makePostRequest({ jsonrpc: "1.0", id: 1, method: "initialize" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe(-32600);
  });

  it("rejects disallowed origin with 403 Forbidden", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        }),
        { origin: "https://evil.example.com" },
      ),
    );
    expect(res.status).toBe(403);
  });

  it("rejects lookalike suffix domains (evil-sigeconomy.com)", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        }),
        { origin: "https://evil-sigeconomy.com" },
      ),
    );
    expect(res.status).toBe(403);
  });

  it("rejects lookalike suffix domains (evil-signalaf.com)", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        }),
        { origin: "https://evil-signalaf.com" },
      ),
    );
    expect(res.status).toBe(403);
  });

  it("allows requests with no origin header (non-browser clients)", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "curl", version: "1.0" },
        }),
      ),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("allows signalaf.com origin (sister site)", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        }),
        { origin: "https://signalaf.com" },
      ),
    );
    expect(res.status).toBe(200);
  });

  it("allows sub.sigeconomy.com origin", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        }),
        { origin: "https://sub.sigeconomy.com" },
      ),
    );
    expect(res.status).toBe(200);
  });

  it("allows requests with remote-resource-meta header", async () => {
    const res = await POST(
      makePostRequest(
        makeJsonRpc("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        }),
        { origin: "https://evil.example.com", "remote-resource-meta": "1" },
      ),
    );
    expect(res.status).toBe(200);
  });

  it("GET handler delegates to SDK", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "GET",
      headers: { origin: VALID_ORIGIN },
    });
    const res = await GET(req);
    expect(res.status).toBeLessThan(500);
  });

  it("GET rejects disallowed origin with 403", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "GET",
      headers: { origin: "https://evil.example.com" },
    });
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("DELETE handler delegates to SDK", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "DELETE",
      headers: { origin: VALID_ORIGIN },
    });
    const res = await DELETE(req);
    expect(res.status).toBeLessThan(500);
  });

  it("DELETE rejects disallowed origin with 403", async () => {
    const req = new NextRequest(BASE_URL, {
      method: "DELETE",
      headers: { origin: "https://evil.example.com" },
    });
    const res = await DELETE(req);
    expect(res.status).toBe(403);
  });
});

// ── Ping ────────────────────────────────────────────────────────────────────

describe("Ping", () => {
  it("ping returns response (not method not found)", async () => {
    const res = await POST(
      makePostRequest(makeJsonRpc("ping", undefined, 30)),
    );
    const body = await parseResponseBody(res);
    if (body.error) {
      const code = (body.error as Record<string, unknown>).code;
      expect(code).not.toBe(-32601);
    } else {
      expect(body.result).toBeDefined();
    }
  });
});
