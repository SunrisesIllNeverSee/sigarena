#!/usr/bin/env node

const BASE_URL = (process.env.BASE_URL || "https://sigeconomy.com").replace(/\/$/, "");
const STRICT_MCP = process.env.STRICT_MCP_HANDSHAKE === "1";
const failures = [];
const warnings = [];

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`WARN ${message}`);
}

async function fetchWithRetry(url, init = {}, attempts = 6) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
        ...init,
      });
      if (response.status >= 500 && attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }
  }
  throw lastError;
}

async function expectStatus(path, expected = [200]) {
  const response = await fetchWithRetry(`${BASE_URL}${path}`);
  if (!expected.includes(response.status)) {
    fail(`${path} returned ${response.status}; expected ${expected.join(" or ")}`);
    return null;
  }
  pass(`${path} -> ${response.status}`);
  return response;
}

function stripHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function verifyHomepage() {
  const response = await fetchWithRetry(`${BASE_URL}/`, {
    headers: { Accept: "text/html" },
  });
  const html = await response.text();
  if (response.status !== 200) fail(`/ HTML returned ${response.status}`);
  else pass(`/ HTML -> 200`);

  if (!/<h1\b/i.test(html)) fail("homepage raw HTML has no H1");
  else pass("homepage raw HTML contains H1");

  const textLength = stripHtml(html).length;
  if (textLength < 500) fail(`homepage readable raw-HTML text is ${textLength} chars (<500)`);
  else pass(`homepage readable raw-HTML text is ${textLength} chars`);

  const h2Count = (html.match(/<h2\b/gi) || []).length;
  const h3Count = (html.match(/<h3\b/gi) || []).length;
  if (h2Count < 2 || h3Count < 1) fail(`homepage heading hierarchy is too flat (H2=${h2Count}, H3=${h3Count})`);
  else pass(`homepage heading hierarchy H2=${h2Count}, H3=${h3Count}`);

  if (!html.includes("/developers")) fail("homepage HTML does not link /developers");
  else pass("homepage links developer portal");

  if (!html.includes("contactPoint") || !html.includes("addressCountry")) {
    fail("homepage Organization JSON-LD lacks contactPoint/address");
  } else {
    pass("homepage Organization JSON-LD has contactPoint/address");
  }
}

async function verifyNegotiation() {
  const markdownResponse = await fetchWithRetry(`${BASE_URL}/`, {
    headers: { Accept: "text/markdown, text/html;q=0.8" },
  });
  const markdown = await markdownResponse.text();
  const contentType = markdownResponse.headers.get("content-type") || "";
  const vary = markdownResponse.headers.get("vary") || "";

  if (markdownResponse.status !== 200) fail(`markdown negotiation returned ${markdownResponse.status}`);
  else pass("markdown negotiation -> 200");
  if (!contentType.toLowerCase().includes("text/markdown")) fail(`markdown Content-Type is ${contentType}`);
  else pass(`markdown Content-Type ${contentType}`);
  if (!vary.toLowerCase().split(",").map((part) => part.trim()).includes("accept")) fail(`Vary does not include Accept: ${vary || "none"}`);
  else pass(`Vary includes Accept (${vary})`);
  if (!markdown.startsWith("# AI User Leaderboard")) fail("markdown representation body is not the expected document");
  else pass("markdown representation has expected document body");

  const htmlResponse = await fetchWithRetry(`${BASE_URL}/`, {
    headers: { Accept: "text/html, text/markdown;q=0.5" },
  });
  const htmlVary = htmlResponse.headers.get("vary") || "";
  if (!htmlVary.toLowerCase().split(",").map((part) => part.trim()).includes("accept")) {
    fail(`HTML Vary does not include Accept: ${htmlVary || "none"}`);
  } else {
    pass("HTML representation also varies on Accept");
  }

  const unacceptable = await fetchWithRetry(`${BASE_URL}/`, {
    headers: { Accept: "application/xml, text/html;q=0, text/markdown;q=0" },
  });
  if (unacceptable.status !== 406) fail(`unsupported representation returned ${unacceptable.status}, expected 406`);
  else pass("unsupported representation -> 406");
}

async function verify404() {
  const path = `/__agent_readiness_probe_${Date.now()}__`;
  const response = await fetchWithRetry(`${BASE_URL}${path}`);
  const body = await response.text();
  if (response.status !== 404) fail(`unknown path returned ${response.status}, expected 404`);
  else pass("unknown path -> real HTTP 404");
  for (const recovery of ["sitemap.xml", "llms.txt", "developers", "openapi.json"]) {
    if (!body.includes(recovery)) fail(`404 body missing recovery link ${recovery}`);
  }
  if (response.status === 404 && ["sitemap.xml", "llms.txt", "developers", "openapi.json"].every((value) => body.includes(value))) {
    pass("404 body contains agent recovery links");
  }
}

async function verifySitemapPages() {
  const sitemapResponse = await expectStatus("/sitemap.xml");
  if (!sitemapResponse) return;
  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0) {
    fail("sitemap.xml contains no URLs");
    return;
  }

  for (const url of urls) {
    const response = await fetchWithRetry(url);
    if (response.status < 200 || response.status >= 400) {
      fail(`sitemap URL ${url} returned ${response.status}`);
    }
  }
  if (!failures.some((message) => message.startsWith("sitemap URL"))) {
    pass(`all ${urls.length} sitemap URLs returned <400`);
  }
}

async function verifyMachineFiles() {
  const machinePaths = [
    "/llms.txt",
    "/llms-full.txt",
    "/agent-instructions.txt",
    "/auth.md",
    "/openapi.json",
    "/prompts.json",
    "/.well-known/mcp",
    "/.well-known/mcp.json",
    "/.well-known/agent.json",
    "/.well-known/agent-card.json",
    "/.well-known/agent-skills",
    "/.well-known/api-catalog",
    "/.well-known/acp.json",
    "/.well-known/http-message-signatures-directory",
    "/.well-known/oauth-authorization-server",
    "/.well-known/oauth-protected-resource",
    "/.well-known/ucp",
    "/robots.txt",
  ];

  for (const path of machinePaths) {
    await expectStatus(path);
  }

  const api = await expectStatus("/api", [200, 402]);
  if (api?.status === 402) pass("/api x402 payment gate is active");
}

async function verifyOpenApi() {
  const response = await fetchWithRetry(`${BASE_URL}/openapi.json`);
  if (response.status !== 200) return;
  const doc = await response.json();
  const operations = [];
  for (const pathItem of Object.values(doc.paths || {})) {
    for (const method of ["get", "post", "put", "patch", "delete"]) {
      if (pathItem?.[method]) operations.push(pathItem[method]);
    }
  }
  const operationIds = operations.map((operation) => operation.operationId).filter(Boolean);
  if (operationIds.length !== operations.length) fail(`OpenAPI operationIds ${operationIds.length}/${operations.length}`);
  else pass(`OpenAPI operationIds ${operationIds.length}/${operations.length}`);
  if (new Set(operationIds).size !== operationIds.length) fail("OpenAPI operationIds are not unique");
  else pass("OpenAPI operationIds are unique");

  const problem = doc.components?.schemas?.ProblemDetails;
  if (!problem) fail("OpenAPI ProblemDetails schema missing");
  else pass("OpenAPI ProblemDetails schema present");

  const serialized = JSON.stringify(doc);
  if (!serialized.includes("application/problem+json")) fail("OpenAPI typed problem media type missing");
  else pass("OpenAPI uses application/problem+json");
  if (!serialized.includes("Retry-After")) fail("OpenAPI Retry-After guidance missing");
  else pass("OpenAPI documents Retry-After on 429");
}

async function verifyMcp() {
  const response = await fetchWithRetry(`${BASE_URL}/.well-known/mcp`);
  if (response.status !== 200) return;
  const card = await response.json();
  const endpoint = card?.transport?.endpoint;
  if (!endpoint || card?.transport?.type !== "streamable-http") {
    fail("MCP card does not advertise a Streamable HTTP endpoint");
    return;
  }
  pass(`MCP discovery advertises Streamable HTTP: ${endpoint}`);

  try {
    const handshake = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: card.protocolVersion || "2025-06-18",
          capabilities: {},
          clientInfo: { name: "sigeconomy-agent-readiness-smoke", version: "1.0.0" },
        },
      }),
    }, 2);
    const body = await handshake.text();
    const ok = handshake.status >= 200 && handshake.status < 300 && (body.includes("jsonrpc") || body.includes("event:"));
    if (ok) pass(`MCP initialize handshake -> ${handshake.status}`);
    else if (STRICT_MCP) fail(`MCP initialize handshake returned ${handshake.status}: ${body.slice(0, 240)}`);
    else warn(`MCP initialize handshake returned ${handshake.status}: ${body.slice(0, 240)}`);
  } catch (error) {
    if (STRICT_MCP) fail(`MCP initialize handshake failed: ${error}`);
    else warn(`MCP initialize handshake failed: ${error}`);
  }
}

console.log(`Verifying agent-readiness surfaces at ${BASE_URL}`);
await verifyHomepage();
await verifyNegotiation();
await verify404();
await verifySitemapPages();
await verifyMachineFiles();
await verifyOpenApi();
await verifyMcp();

console.log(`\nVerification complete: ${failures.length} failure(s), ${warnings.length} warning(s).`);
if (warnings.length) {
  for (const warning of warnings) console.log(`WARNING: ${warning}`);
}
if (failures.length) {
  for (const failure of failures) console.log(`FAILURE: ${failure}`);
  process.exit(1);
}
