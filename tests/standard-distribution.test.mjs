import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const CATEGORY_ROUTES = [
  "/ai-operator-metrics",
  "/ai-operator-standard",
  "/model-vs-agent-vs-operator-evals",
  "/privacy-preserving-ai-telemetry",
];

test("Standard category pages are present on global distribution surfaces", () => {
  const surfaces = [
    ["sitemap", read("app/sitemap.ts")],
    ["llms.txt", read("app/llms.txt/route.ts")],
    ["llms-full.txt", read("app/llms-full.txt/route.ts")],
    ["footer", read("components/site-footer.tsx")],
  ];

  for (const route of CATEGORY_ROUTES) {
    for (const [name, source] of surfaces) {
      assert.ok(source.includes(route), `${name} missing ${route}`);
    }
  }
});

test("category pages consume the shared portable-core definitions", () => {
  const metricsPage = read("app/ai-operator-metrics/page.tsx");
  const standardPage = read("app/ai-operator-standard/page.tsx");

  assert.match(metricsPage, /SIGRANK_CORE_METRICS/);
  assert.match(metricsPage, /SIGRANK_CORE_TELEMETRY/);
  assert.match(standardPage, /SIGRANK_CORE_METRICS/);
  assert.doesNotMatch(metricsPage, /const CORE\s*=/);
  assert.doesNotMatch(standardPage, /const METRICS\s*=/);
});

test("MCP resources distinguish portable core from optional extensions", () => {
  const resources = read("lib/mcp/resources/index.ts");
  const standard = read("lib/sigrank-standard.ts");
  const combined = `${resources}\n${standard}`;

  assert.match(combined, /portable core/i);
  assert.match(combined, /not required for base (SigRank )?compatibility/i);
  assert.match(combined, /Scale V/);
  assert.match(combined, /RS05/);
  assert.match(combined, /Build Archetypes/);
  assert.match(combined, /10-type/);
  assert.match(combined, /24-stage/);
  assert.match(resources, /local five-label explanatory shapes/);
});

test("LLM surfaces do not call all leaderboard dimensions canonical metrics", () => {
  const compact = read("app/llms.txt/route.ts");
  const full = read("app/llms-full.txt/route.ts");

  assert.doesNotMatch(compact, /9 canonical metrics/i);
  assert.doesNotMatch(full, /all 9 canonical metrics/i);
  assert.match(compact, /5 portable-core metrics/i);
  assert.match(full, /five portable-core metrics/i);
});
