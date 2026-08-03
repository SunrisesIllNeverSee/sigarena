/**
 * app/api/indexnow/route.ts — IndexNow protocol endpoint.
 *
 * IndexNow is the open protocol (used by Bing, Yandex, Seznam, Naver) for
 * instant URL submission. When a page changes, POST the URL here and this
 * route forwards to the IndexNow API. Google doesn't use IndexNow (it has
 * its own Indexing API), but Bing + Yandex do — and Bing feeds ChatGPT
 * search results.
 *
 * The key is a static file served at /indexnow-key.txt — IndexNow verifies
 * ownership by fetching the key file from the site root.
 *
 * Usage:
 *   POST /api/indexnow { urls: ["https://sigeconomy.com/", "https://sigeconomy.com/best-ai-user"] }
 *   POST /api/indexnow { urls: [...] , key: "override-key" }
 */

import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const SITE_ORIGIN = "https://sigeconomy.com";

// The IndexNow key — must match the file served at /indexnow-key.txt
const INDEXNOW_KEY = "ded24467378e292f4206b5fbf258551c";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const urls = Array.isArray(body.urls)
    ? body.urls.filter((u) => typeof u === "string")
    : [];
  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  const key = typeof body.key === "string" ? body.key : INDEXNOW_KEY;

  // Submit to IndexNow (Bing's endpoint forwards to all participating engines)
  try {
    const payload = {
      host: new URL(SITE_ORIGIN).host,
      key,
      keyLocation: `${SITE_ORIGIN}/indexnow-key.txt`,
      urlList: urls.slice(0, 10000), // IndexNow limit
    };

    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json(
      {
        status: res.status,
        ok: res.ok || res.status === 200 || res.status === 202,
        submitted: urls.length,
        key: key.slice(0, 8) + "…",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return NextResponse.json(
      { error: "IndexNow submission failed", detail: (e as Error).message },
      { status: 502 },
    );
  }
}
