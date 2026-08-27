/**
 * app/.well-known/mcp/server-cards.json/route.ts
 *
 * Redirects to the canonical MCP server card at /.well-known/mcp.
 * The previous array here advertised a stale identity ("sigrank-sigarena")
 * and pointed to signalaf.com/api/v1 (a REST API, not an MCP server).
 * SigEconomy has a single MCP server card at /.well-known/mcp.
 */

import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.redirect(
    new URL("/.well-known/mcp", "https://sigeconomy.com"),
    308,
  );
}
