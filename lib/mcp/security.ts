/**
 * lib/mcp/security.ts — Origin validation and security helpers for the
 * SigEconomy MCP route.
 *
 * Extracted from app/api/mcp/route.ts as Phase 7 of the MCP structural
 * renovation. Preserves the exact origin-validation logic from the
 * pre-migration implementation.
 */

import type { NextRequest } from "next/server";

/**
 * Validate the request origin. Allows:
 *   - sigeconomy.com (this site)
 *   - signalaf.com (sister site)
 *   - localhost / 127.0.0.1 (local dev)
 *   - requests with a remote-resource-meta header (server-to-server)
 *   - requests with no origin header (non-browser clients)
 */
export function allowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin") || "";
  const rm = req.headers.get("remote-resource-meta");
  if (rm) return true;
  if (!origin) return true;
  try {
    const u = new URL(origin);
    // Use exact match or dot-delimited subdomain check to prevent
    // lookalike suffix attacks (e.g. evil-sigeconomy.com).
    return u.hostname === "sigeconomy.com" ||
      u.hostname.endsWith(".sigeconomy.com") ||
      u.hostname === "signalaf.com" ||
      u.hostname.endsWith(".signalaf.com") ||
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
