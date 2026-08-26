import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const read = (path) => readFileSync(path, "utf8");

function pageDirectories(root) {
  return readdirSync(root)
    .map((name) => ({ name, path: join(root, name) }))
    .filter(({ path }) => statSync(path).isDirectory())
    .filter(({ path }) => {
      try {
        return statSync(join(path, "page.tsx")).isFile();
      } catch {
        return false;
      }
    })
    .map(({ name }) => name);
}

test("middleware returns a real agent-friendly 404 and negotiates markdown safely", () => {
  const source = read("middleware.ts");
  assert.match(source, /status:\s*404/);
  assert.match(source, /# 404 — Resource not found/);
  assert.match(source, /sitemap\.xml/);
  assert.match(source, /llms\.txt/);
  assert.match(source, /developers/);
  assert.match(source, /openapi\.json/);
  assert.match(source, /Vary:\s*"Accept, Accept-Encoding"/);
  assert.match(source, /preferredRepresentation/);
  assert.match(source, /qualityFor/);
  assert.match(source, /status:\s*406/);
  assert.doesNotMatch(source, /accept\.includes\("text\/markdown"\)/);
});

test("404 allowlist covers every concrete page route", () => {
  const middleware = read("middleware.ts");

  for (const name of pageDirectories("app")) {
    if (name.startsWith("[")) continue;
    assert.ok(
      middleware.includes(`"/${name}"`),
      `middleware allowlist is missing /${name}`,
    );
  }

  for (const name of pageDirectories("app/vs")) {
    assert.ok(
      middleware.includes(`"/vs/${name}"`),
      `middleware allowlist is missing /vs/${name}`,
    );
  }

  for (const name of pageDirectories("app/articles")) {
    assert.ok(
      middleware.includes(`"/articles/${name}"`),
      `middleware allowlist is missing /articles/${name}`,
    );
  }

  const prompts = read("lib/prompts.ts");
  const slugs = [...prompts.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  for (const slug of slugs) {
    assert.ok(
      middleware.includes(`"/${slug}"`),
      `middleware allowlist is missing prompt route /${slug}`,
    );
  }
});

test("homepage has server-rendered semantic hierarchy and developer link", () => {
  const source = read("app/page.tsx");
  assert.match(source, /<h1/);
  assert.ok((source.match(/<h2/g) ?? []).length >= 4, "expected multiple H2 sections");
  assert.ok((source.match(/<h3/g) ?? []).length >= 3, "expected explanatory H3 sections");
  assert.match(source, /How to read a SigRank operator eval/);
  assert.match(source, /href="\/developers"/);
  assert.match(source, /npx sigrank/);
});

test("developer and trust pages are substantive", () => {
  for (const name of ["developers", "about", "contact", "privacy"]) {
    const source = read(`app/${name}/page.tsx`);
    assert.match(source, /<h1/);
    assert.ok(source.length > 1200, `${name} page should contain substantive source content`);
  }

  const developers = read("app/developers/page.tsx");
  for (const required of ["OpenAPI", "MCP", "npx sigrank", "Versioning and deprecation", "RFC 9457"]) {
    assert.ok(developers.includes(required), `developer portal missing ${required}`);
  }
});

test("llms and dedicated agent instructions say when to use SigRank", () => {
  const llms = read("app/llms.txt/route.ts");
  const instructions = read("app/agent-instructions.txt/route.ts");

  assert.match(llms, /## When to use SigRank/);
  assert.match(llms, /SigRank SignalAF Developer Portal/);
  assert.match(llms, /npx sigrank/);
  assert.match(instructions, /## When to use SigRank/);
  assert.match(instructions, /## When not to use SigRank/);
  assert.match(instructions, /OpenAPI/);
  assert.match(instructions, /MCP/);
});

test("OpenAPI exposes unique function-call operation IDs and RFC 9457 errors", () => {
  const source = read("app/openapi.json/route.ts");
  const expectedOperationIds = [
    "getLeaderboard",
    "getOperator",
    "submitSnapshot",
    "createSubscription",
    "getPremiumApiAccess",
  ];

  const operationIds = [...source.matchAll(/operationId:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(operationIds.sort(), [...expectedOperationIds].sort());
  assert.equal(new Set(operationIds).size, operationIds.length, "operationIds must be unique");

  for (const field of ["window", "limit", "codename"]) {
    assert.match(source, new RegExp(`name:\\s*"${field}"`));
  }
  assert.match(source, /ProblemDetails/);
  assert.match(source, /application\/problem\+json/);
  assert.match(source, /Retry-After/);
  assert.match(source, /x-versioning-policy/);
  assert.match(source, /breaking_changes/);
  assert.match(source, /deprecation/);
});

test("MCP discovery files agree on the Streamable HTTP transport", () => {
  for (const path of [
    "app/.well-known/mcp/route.ts",
    "app/.well-known/mcp.json/route.ts",
    "app/.well-known/agent.json/route.ts",
  ]) {
    const source = read(path);
    assert.match(source, /type:\s*"streamable-http"/);
    assert.match(source, /(sigeconomy\.com\/api\/mcp|functions\/v1\/sigrank-mcp)/);
    assert.doesNotMatch(source, /endpoint:\s*"https:\/\/signalaf\.com\/api\/v1"/);
  }
});

test("developer discovery is linked from global navigation surfaces", () => {
  const footer = read("components/site-footer.tsx");
  const sitemap = read("app/sitemap.ts");
  const catalog = read("app/.well-known/api-catalog/route.ts");

  for (const path of ["/developers", "/openapi.json", "/about", "/privacy"]) {
    assert.ok(footer.includes(path), `footer missing ${path}`);
  }
  for (const path of ["/developers", "/about", "/contact", "/privacy"]) {
    assert.ok(sitemap.includes(path), `sitemap missing ${path}`);
  }
  assert.match(catalog, /SigRank SignalAF Developer Portal/);
  assert.match(catalog, /openapi\.json/);
  assert.match(catalog, /\.well-known\/mcp/);
});

test("organization schema includes truthful contact and address fields", () => {
  const source = read("lib/jsonld.tsx");
  assert.match(source, /contactPoint/);
  assert.match(source, /hello@signalaf\.com/);
  assert.match(source, /contactType:\s*"customer support"/);
  assert.match(source, /address:\s*\{/);
  assert.match(source, /addressCountry:\s*"US"/);
});

test("auth guidance points public reads to the authoritative REST API", () => {
  const source = read("app/auth.md/route.ts");
  assert.match(source, /https:\/\/signalaf\.com\/api\/v1\/leaderboard/);
  assert.match(source, /https:\/\/signalaf\.com\/api\/v1\/operators\/\{codename\}/);
  assert.doesNotMatch(source, /https:\/\/sigeconomy\.com\/api\/leaderboard/);
});
