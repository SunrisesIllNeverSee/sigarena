/**
 * app/.well-known/mcp/server-card.json/route.ts
 *
 * Redirects to the canonical MCP server card at /.well-known/mcp.
 * The previous card here advertised a stale identity ("sigrank-sigarena"),
 * a Supabase Edge Function endpoint, and signalaf.com/api/v1 (a REST API,
 * not an MCP server). Those are all superseded by the SigEconomy MCP
 * endpoint at https://sigeconomy.com/api/mcp.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.redirect(
    new URL("/.well-known/mcp", "https://sigeconomy.com"),
    308,
  );
}
