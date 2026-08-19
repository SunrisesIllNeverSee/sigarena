import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Exploit scanner paths that should get a real 404 before hitting the Next.js handler.
// OpenNext on Cloudflare returns 200 for notFound() — middleware lets us set the
// correct status code without any API fetch or SSR.
const EXPLOIT_RE = /\.(php|asp|aspx|cgi|pl|py|rb|jsp|env|git|sql|bak|ini)$/i;
const WP_RE = /\/wp-(content|admin|includes)\//i;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

async function captureHttpLog(request: NextRequest) {
  if (!POSTHOG_KEY) return;
  const ua = request.headers.get("user-agent") ?? "";
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "";
  const host = request.headers.get("host") ?? "sigeconomy.com";
  const scheme = request.headers.get("x-forwarded-proto") ?? "https";
  const path = request.nextUrl.pathname + request.nextUrl.search;

  const idSource = `${ip}:${ua}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(idSource));
  const hash = btoa(String.fromCharCode(...new Uint8Array(buf))).slice(0, 22);
  const distinctId = `http_log_${hash}`;

  await fetch(`${POSTHOG_HOST}/capture/`, {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: "$http_log",
      distinct_id: distinctId,
      properties: {
        $raw_user_agent: ua,
        $ip: ip,
        $pathname: request.nextUrl.pathname,
        $host: host,
        $current_url: `${scheme}://${host}${path}`,
        $process_person_profile: false,
      },
    }),
  }).catch(() => {});
}

// Markdown content negotiation — when Accept: text/markdown is sent,
// serve a markdown representation instead of HTML.
// This passes the isitagentready.com "Markdown for Agents" check.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Reject exploit scanner paths with a real 404 status code.
  if (EXPLOIT_RE.test(pathname) || WP_RE.test(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Fire-and-forget $http_log capture for PostHog (AI crawler + bot detection)
  captureHttpLog(request);

  const accept = request.headers.get("accept") || "";

  // Only intercept markdown negotiation requests
  if (!accept.includes("text/markdown")) {
    return NextResponse.next();
  }

  // Only serve markdown for the homepage (the scanner checks /)
  if (pathname !== "/") {
    return NextResponse.next();
  }

  const markdown = `# AI User Leaderboard — Ranked by Yield (Υ)

> Who's the best AI user? The competitive leaderboard for AI operators — ranked by Yield (Υ), not raw token count.

The AI User Leaderboard (sigarena) is the competitive arena for AI operators.
It reads from SigRank's public API (signalaf.com) and ranks operators on
canonical token-telemetry metrics — the "yield cascade." Unlike model
leaderboards (LMSYS, LiveBench), this ranks the HUMANS using AI — not the
models themselves. Powered by SigRank.

## The metric: Yield (Υ)

Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency, not raw spend.

Volume is noise. Yield is signal. The operator who burns 10M tokens to produce 1K output
has lower Yield than the operator who uses 100K tokens to produce the same 1K output.

## Current Top Operators

| Rank | Operator | Client | Yield (Υ) |
|------|----------|--------|-----------|
| 1 | Richard Fu | claude | 2,462,656 |
| 2 | limp | chatgpt | — |

## Core Pages

- [Full Leaderboard](https://sigeconomy.com/): live operator rankings
- [Weekly Drop](https://sigeconomy.com/weekly): this week's biggest movers
- [How It Works](https://sigeconomy.com/how-it-works): 60-second Yield explainer
- [Compare](https://sigeconomy.com/compare): head-to-head operator comparison

## Metric-Specific Rankings

- [Best AI User](https://sigeconomy.com/best-ai-user): Yield (Υ)
- [Most Output Per Token](https://sigeconomy.com/most-output-per-token): Velocity
- [Most Context Reuse](https://sigeconomy.com/most-context-reuse): Leverage
- [Cleanest Signal](https://sigeconomy.com/cleanest-signal): SNR
- [Most Normalized](https://sigeconomy.com/most-normalized): 10xDEV
- [Most Efficient Overall](https://sigeconomy.com/most-efficient-overall): Efficiency
- [Largest Scale](https://sigeconomy.com/largest-scale): Scale V
- [Cheapest Tokens](https://sigeconomy.com/cheapest-tokens): $/1M
- [Best Op Ratio](https://sigeconomy.com/best-op-ratio): Op Ratio

## Data

- [SigRank API](https://signalaf.com/api/v1/leaderboard): public JSON endpoint
- [LLMs.txt](https://sigeconomy.com/llms.txt): machine-readable site summary
- [LLMs-full.txt](https://sigeconomy.com/llms-full.txt): full content in markdown
- [Methodology](https://signalaf.com/methodology): full scoring methodology
- [Score Calculator](https://signalaf.com/score): calculate your Yield

## About

SigRank ranks AI users by token-cascade efficiency (Yield). The AI User Leaderboard — who's the best AI user?

- GitHub: https://github.com/SunrisesIllNeverSee
- X/Twitter: https://x.com/burnmydays
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|llms.txt|llms-full.txt|og.png|indexnow-key.txt|auth.md|prompts.json|api/indexnow).*)"],
};
