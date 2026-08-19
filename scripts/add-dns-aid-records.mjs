#!/usr/bin/env node
/**
 * scripts/add-dns-aid-records.mjs
 *
 * Publishes DNS for AI Discovery (DNS-AID) records for sigeconomy.com
 * under the _agents namespace, per the DNS-AID spec.
 *
 * Records created:
 *   _index._agents.sigeconomy.com  SVCB  1 sigeconomy.com. alpn="h2" port=443 mandatory=alpn,port
 *   _a2a._agents.sigeconomy.com    SVCB  1 sigeconomy.com. alpn="a2a" port=443 mandatory=alpn,port
 *   _mcp._agents.sigeconomy.com    SVCB  1 sigeconomy.com. alpn="mcp" port=443 mandatory=alpn,port
 *
 * Also checks/enables DNSSEC on the zone (required for authenticated data).
 *
 * Usage:
 *   CF_API_TOKEN=<token-with-DNS-edit> node scripts/add-dns-aid-records.mjs
 *
 * The token needs:
 *   - Zone:DNS:Edit on sigeconomy.com
 *   - Zone:DNSSEC:Edit on sigeconomy.com (to enable DNSSEC if not already)
 *
 * Get a token at: https://dash.cloudflare.com/profile/api-tokens
 * Template: "Edit zone DNS" → restrict to sigeconomy.com.
 */

const ZONE_NAME = "sigeconomy.com";
const API_BASE = "https://api.cloudflare.com/client/v4";

const TOKEN = process.env.CF_API_TOKEN;
if (!TOKEN) {
  console.error("ERROR: Set CF_API_TOKEN env var with a Cloudflare API token that has DNS edit on sigeconomy.com.");
  console.error("  CF_API_TOKEN=xxxxx node scripts/add-dns-aid-records.mjs");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

async function cf(path, method = "GET", body = null) {
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const json = await res.json();
  if (!json.success) {
    const err = json.errors?.[0];
    throw new Error(`CF API ${method} ${path} failed: ${err?.code} ${err?.message}`);
  }
  return json;
}

// DNS-AID SVCB records to publish.
// alpn identifies the agent protocol; port=443 for HTTPS endpoints.
// mandatory=alpn,port ensures resolvers don't strip these params.
// Numeric keyNNNNN SvcParamKeys are used for experimental DNS-AID custom params.
const DNS_AID_RECORDS = [
  {
    name: "_index._agents",
    type: "SVCB",
    data: { priority: 1, target: "sigeconomy.com", value: 'alpn="h2" port=443 mandatory=alpn,port key60000="sigeconomy.com"' },
    comment: "DNS-AID index entrypoint — points agents to the site root for discovery",
  },
  {
    name: "_a2a._agents",
    type: "SVCB",
    data: { priority: 1, target: "sigeconomy.com", value: 'alpn="a2a" port=443 mandatory=alpn,port key60001="/.well-known/agent.json"' },
    comment: "DNS-AID A2A entrypoint — Agent Card at /.well-known/agent.json",
  },
  {
    name: "_mcp._agents",
    type: "SVCB",
    data: { priority: 1, target: "sigeconomy.com", value: 'alpn="mcp" port=443 mandatory=alpn,port key60002="/.well-known/mcp/server-card.json"' },
    comment: "DNS-AID MCP entrypoint — MCP Server Card at /.well-known/mcp/server-card.json",
  },
];

async function main() {
  // 1. Verify token
  console.log("Verifying Cloudflare API token...");
  const verify = await cf("/user/tokens/verify");
  console.log(`  Token valid. Status: ${verify.result.status}`);

  // 2. Find zone ID
  console.log(`Finding zone for ${ZONE_NAME}...`);
  const zones = await cf(`/zones?name=${ZONE_NAME}`);
  const zone = zones.result[0];
  if (!zone) throw new Error(`Zone ${ZONE_NAME} not found. Ensure token has access to this zone.`);
  const zoneId = zone.id;
  console.log(`  Zone ID: ${zoneId} (${zone.status})`);

  // 3. Check DNSSEC status
  console.log("Checking DNSSEC status...");
  const dnssec = await cf(`/zones/${zoneId}/dnssec`);
  if (dnssec.result.status === "active") {
    console.log("  DNSSEC: active (good)");
  } else {
    console.log(`  DNSSEC: ${dnssec.result.status} — enabling...`);
    try {
      await cf(`/zones/${zoneId}/dnssec`, "POST", {});
      console.log("  DNSSEC enable requested. DS record will appear in dashboard — add it at your registrar (Porkbun/Cloudflare).");
      console.log("  NOTE: If nameservers are Cloudflare, DNSSEC is managed automatically.");
    } catch (e) {
      console.warn(`  Could not enable DNSSEC: ${e.message}`);
      console.warn("  Enable manually: Cloudflare Dashboard → sigeconomy.com → DNS → DNSSEC → Enable.");
    }
  }

  // 4. Get existing DNS records to avoid duplicates
  console.log("Fetching existing DNS records...");
  const existing = await cf(`/zones/${zoneId}/dns_records?per_page=100`);
  const existingNames = new Set(existing.result.map((r) => `${r.type}:${r.name}`));
  console.log(`  ${existing.result.length} records found.`);

  // 5. Create DNS-AID records
  for (const rec of DNS_AID_RECORDS) {
    const fullName = `${rec.name}.${ZONE_NAME}`;
    const key = `${rec.type}:${fullName}`;
    if (existingNames.has(key)) {
      console.log(`  SKIP (exists): ${key}`);
      continue;
    }
    console.log(`  Creating: ${key}`);
    const result = await cf(`/zones/${zoneId}/dns_records`, "POST", {
      type: rec.type,
      name: fullName,
      data: rec.data,
      ttl: 3600,
      comment: rec.comment,
    });
    console.log(`    Created: ${result.result.id}`);
  }

  // 6. Verify records resolve
  console.log("\nVerifying records via DoH (Cloudflare)...");
  for (const rec of DNS_AID_RECORDS) {
    const fullName = `${rec.name}.${ZONE_NAME}`;
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${fullName}&type=${rec.type}`;
    const dohRes = await fetch(dohUrl, { headers: { Accept: "application/dns-json" } });
    const dohJson = await dohRes.json();
    const answers = dohJson.Answer || [];
    if (answers.length > 0) {
      console.log(`  OK: ${fullName} ${rec.type} → ${answers[0].data}`);
    } else {
      console.log(`  PENDING: ${fullName} ${rec.type} — may take a few minutes to propagate`);
    }
  }

  console.log("\nDone. Re-run the isitagentready.com scan to verify:");
  console.log('  curl -s -X POST https://isitagentready.com/api/scan -H "Content-Type: application/json" -d \'{"url":"https://sigeconomy.com"}\' | python3 -m json.tool');
}

main().catch((e) => {
  console.error(`\nFATAL: ${e.message}`);
  process.exit(1);
});
