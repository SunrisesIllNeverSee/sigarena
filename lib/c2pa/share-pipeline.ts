/**
 * C2PA share-card pipeline helpers.
 *
 * This module provides helpers for computing deterministic cache keys for
 * share-card images. The actual signing and upload is performed directly
 * in the OG image route (app/share/mcp/opengraph-image.tsx).
 *
 * This module is server-only. It must never be imported in client code.
 */

import { sha256 } from "./claim";

/**
 * Compute a short hash of the share params for use as a cache key.
 */
export async function computeParamsHash(params: Record<string, unknown>): Promise<string> {
  const json = JSON.stringify(params, Object.keys(params).sort());
  const hash = await sha256(new TextEncoder().encode(json));
  // Use first 16 bytes as hex (32 chars)
  return Array.from(hash.slice(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
