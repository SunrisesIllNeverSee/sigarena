import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

test("x402 Base Sepolia defaults to the current public testnet facilitator", () => {
  const source = read("lib/x402.ts");
  assert.match(source, /https:\/\/x402\.org\/facilitator/);
  assert.match(source, /eip155:84532/);
  assert.doesNotMatch(source, /https:\/\/facilitator\.x402\.org/);
});

test("production smoke uses the canonical Agent Skills discovery file", () => {
  const source = read("scripts/verify-agent-readiness.mjs");
  assert.match(source, /\/\.well-known\/agent-skills\/index\.json/);
  assert.doesNotMatch(source, /"\/\.well-known\/agent-skills",/);
});
