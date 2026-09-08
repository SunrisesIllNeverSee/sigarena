/**
 * Deterministic CBOR encoding (RFC 8949).
 *
 * C2PA mandates the Deterministic Encoding profile of CBOR. cbor-x does not
 * enforce this by default — it uses Tag 259 for Maps and record-structure tags
 * for plain objects, both of which are invalid for C2PA.
 *
 * This module provides a single configured encoder plus a helper that builds
 * Maps with keys sorted by the byte-wise comparison of their deterministic
 * CBOR encodings (RFC 8949 §4.2.1).
 */

import { Encoder } from "cbor-x";

/**
 * Deterministic CBOR encoder.
 *
 * - `useRecords: false` — disables cbor-x record-structure tags (Tag 258 family)
 *   that would make plain-object encoding non-deterministic across runs.
 * - `useTag259ForMaps: false` — disables Tag 259 wrapping of Map values,
 *   which is invalid in COSE structures (RFC 9052 requires bare maps).
 * - `tagUint8Array: false` — disables cbor-x's non-standard Tag 64 wrapping
 *   of Uint8Array values. COSE/C2PA require plain bstr encoding for byte
 *   strings. Without this, Uint8Arrays encode as Tag 64 + bstr while Buffers
 *   encode as plain bstr, causing signature verification mismatches when
 *   a decoder returns Uint8Arrays and the verifier re-encodes them.
 */
export const deterministicEncoder = new Encoder({
  useRecords: false,
  useTag259ForMaps: false,
  tagUint8Array: false,
} as Record<string, unknown>);

/** Encode a value using deterministic CBOR. */
export function encode(value: unknown): Uint8Array {
  return deterministicEncoder.encode(value) as Uint8Array;
}

/**
 * Build a Map with entries sorted by the byte-wise comparison of the
 * deterministic CBOR encoding of each key (RFC 8949 §4.2.1).
 *
 * This is required for C2PA claim maps and COSE header maps so that the
 * encoding is reproducible by a verifier.
 */
export function sortedMap(
  entries: Array<[unknown, unknown]>,
): Map<unknown, unknown> {
  const sorted = [...entries].sort((a, b) => {
    const aBytes = encode(a[0]);
    const bBytes = encode(b[0]);
    const len = Math.min(aBytes.length, bBytes.length);
    for (let i = 0; i < len; i++) {
      if (aBytes[i] !== bBytes[i]) return aBytes[i] - bBytes[i];
    }
    return aBytes.length - bBytes.length;
  });
  return new Map(sorted);
}

/**
 * Recursively convert plain JS objects to sorted Maps for deterministic
 * CBOR encoding (RFC 8949 §4.2.1).
 *
 * cbor-x encodes plain objects as CBOR maps with keys in insertion order.
 * C2PA mandates sorted keys. This helper deep-converts plain objects to
 * sortedMaps so the encoding is reproducible by any verifier.
 *
 * - Primitives (string, number, boolean, null, undefined) pass through.
 * - Uint8Array passes through (CBOR bstr).
 * - Arrays are mapped element-wise (order preserved — arrays are ordered).
 * - Maps are re-sorted via sortedMap.
 * - Plain objects are converted to sortedMap with values recursively converted.
 */
export function toDeterministic(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Uint8Array) return value;
  if (Array.isArray(value)) return value.map(toDeterministic);
  if (value instanceof Map) {
    const entries = [...value.entries()].map(
      ([k, v]) => [toDeterministic(k), toDeterministic(v)] as [unknown, unknown],
    );
    return sortedMap(entries);
  }
  // Plain object — convert to sortedMap with recursively deterministic values
  const entries = Object.entries(value).map(
    ([k, v]) => [k, toDeterministic(v)] as [unknown, unknown],
  );
  return sortedMap(entries);
}
