/**
 * C2PA claim construction and CBOR encoding.
 *
 * The claim is the central signed object in a C2PA manifest. It aggregates
 * hashes of all assertions, the asset binding hash, and metadata about the
 * claim generator. The claim is CBOR-encoded, then wrapped in a COSE_Sign1
 * structure for signing.
 *
 * C2PA mandates the Deterministic Encoding profile of CBOR (RFC 8949).
 * We use a Map with keys sorted by byte-wise comparison of their CBOR
 * encodings, encoded with the deterministic encoder from ./cbor.
 *
 * This module implements the v1 claim schema (`c2pa.claim`, `claim-map`)
 * per C2PA spec 2.4 §5.2.1. The v1 schema is the most widely supported by
 * verifiers (contentcredentials.org, c2pa-rs, etc.).
 */

import { encode, sortedMap, toDeterministic } from "./cbor";

/** C2PA assertion label constants. */
export const ASSERTION_LABELS = {
  ACTIONS: "c2pa.actions",
  HASH_DATA: "c2pa.hash.data",
  HASH_BOXES: "c2pa.hash.boxes",
  CREATIVE_WORK: "stds.schemaorg.CreativeWork",
} as const;

/** C2PA claim label (v1 spec). */
export const CLAIM_LABEL = "c2pa.claim";

/**
 * Build a hashed-uri reference to an assertion.
 *
 * Per C2PA spec 2.4 §3.4.2, a hashed_uri is:
 *   { url: tstr, ? alg: tstr, hash: bstr }
 *
 * `hash` is REQUIRED. `alg` is optional — if absent, the verifier uses the
 * enclosing claim's `alg` field.
 */
export function hashedUri(
  uri: string,
  hash: Uint8Array,
  alg?: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = { url: uri, hash };
  if (alg !== undefined) {
    result.alg = alg;
  }
  return result;
}

/** Compute SHA-256 hash of data, returning a Uint8Array. */
export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return new Uint8Array(hashBuffer);
}

/**
 * Build a c2pa.actions assertion.
 *
 * The assertion data is the CBOR-encoded content of the assertion's JUMBF
 * cbor box. The label lives in the JUMBF description box, NOT in the CBOR
 * data itself.
 */
export function buildActionsAssertion(
  actions: Array<Record<string, unknown>>,
): Record<string, unknown> {
  return {
    actions,
  };
}

/**
 * Build a c2pa.hash.data assertion (hard binding to the asset).
 *
 * Per C2PA spec 2.4 §18.5 and the c2pa-rs DataHash structure, the fields are:
 *   - hash: bstr (required) — the cryptographic hash of the asset
 *   - alg: tstr (optional) — hash algorithm; if absent, claim's alg is used
 *   - name: tstr (optional) — name of the hashed data
 *   - pad: bstr (required by c2pa-rs) — padding bytes (may be empty)
 *   - exclusions: [HashRange] (optional) — ranges excluded from the hash
 *
 * The `format` field is NOT part of the spec — the asset format is declared
 * in the claim's `dc:format` field, not in the hash assertion.
 */
export function buildHashDataAssertion(
  hash: Uint8Array,
  name: string,
): Record<string, unknown> {
  return {
    hash,
    name,
    pad: new Uint8Array(0),
  };
}

/** Build a creative.work assertion describing the creator. */
export function buildCreativeWorkAssertion(
  creator: { name: string; identifier?: string },
  tool: { name: string; version: string },
): Record<string, unknown> {
  const author: Record<string, unknown> = {
    "@type": "Person",
    name: creator.name,
  };
  if (creator.identifier) {
    author.identifier = creator.identifier;
  }
  return {
    author: [author],
    tool: [
      {
        "@type": "Software",
        name: tool.name,
        version: tool.version,
      },
    ],
  };
}

/**
 * Build the C2PA claim object (CBOR-encoded) per v1 claim-map schema.
 *
 * The v1 claim-map (C2PA spec 2.4 §5.2.1) requires:
 *   - claim_generator: tstr (User-Agent string)
 *   - claim_generator_info: [1* generator-info-map] (array)
 *   - signature: jumbf-uri-type (URI string, NOT a hashed-uri object)
 *   - assertions: [1* $hashed-uri-map] (array of hashed-uri references)
 *   - dc:format: tstr (IANA media type of the asset)
 *   - instanceID: tstr (unique ID for this version of the asset)
 *   - alg: tstr (optional, hash algorithm — "sha256")
 *
 * The claim is encoded as a CBOR map with keys sorted per RFC 8949
 * deterministic encoding, using the deterministic encoder (no record
 * tags, no Tag 259).
 *
 * @param claimGenerator - User-Agent string (e.g., "SigRank/1.0.0")
 * @param claimGeneratorInfo - Array of {name, version} generator info
 * @param assertionRefs - Array of hashed-uri references to assertions
 * @param signatureUri - JUMBF URI to the signature box (e.g., "self#jumbf=c2pa.signature")
 * @param dcFormat - IANA media type of the asset (e.g., "image/png")
 * @param instanceId - Unique identifier for this version of the asset
 * @param alg - Hash algorithm (e.g., "sha256")
 */
export function buildClaim(
  claimGenerator: string,
  claimGeneratorInfo: Array<{ name: string; version: string }>,
  assertionRefs: Array<Record<string, unknown>>,
  signatureUri: string,
  dcFormat: string,
  instanceId: string,
  alg: string,
): Uint8Array {
  const claimMap = sortedMap([
    ["claim_generator", claimGenerator],
    ["claim_generator_info", claimGeneratorInfo.map((g) => ({
      name: g.name,
      version: g.version,
    }))],
    ["signature", signatureUri],
    ["assertions", assertionRefs],
    ["dc:format", dcFormat],
    ["instanceID", instanceId],
    ["alg", alg],
  ]);

  // Apply toDeterministic to recursively sort all nested plain objects
  // (hashedUri refs, claim_generator_info items) so the entire claim
  // encoding complies with RFC 8949 §4.2.1.
  return encode(toDeterministic(claimMap));
}
