import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXPLOIT_RE = /\.(php|asp|aspx|cgi|pl|py|rb|jsp|env|git|sql|bak|ini)$/i;
const WP_RE = /\/wp-(content|admin|includes)\//i;

const PUBLIC_PATHS = new Set([
  "/",
  "/about",
  "/ai-power-users",
  "/ai-user-leaderboard",
  "/ai-user-ranking",
  "/agent-instructions.txt",
  "/best-ai-user",
  "/best-op-ratio",
  "/cheapest-tokens",
  "/cleanest-signal",
  "/compare",
  "/contact",
  "/developers",
  "/docs",
  "/how-it-works",
  "/largest-scale",
  "/most-context-reuse",
  "/most-efficient-overall",
  "/most-normalized",
  "/most-output-per-token",
  "/mcp",
  "/openapi.json",
  "/operator-evals",
  "/privacy",
  "/public-operator-evals",
  "/weekly",
]);

const ARTICLE_PATHS = new Set([
  "/articles/operator-evals-vs-model-evals",
  "/articles/why-operator-evals-matter",
]);

const COMPARISON_PATHS = new Set([
  "/vs/aiusage",
  "/vs/braintrust",
  "/vs/ccburn",
  "/vs/ccflare",
  "/vs/ccgather",
  "/vs/ccstatusline",
  "/vs/ccusage",
  "/vs/claudecount",
  "/vs/clauderank",
  "/vs/clawdboard",
  "/vs/codeburn",
  "/vs/copilot",
  "/vs/costhawk",
  "/vs/cursor",
  "/vs/langchain",
  "/vs/langfuse",
  "/vs/lineman",
  "/vs/lmsys-arena",
  "/vs/mytokentracker",
  "/vs/notch-pilot",
  "/vs/omnara",
  "/vs/opcode",
  "/vs/sculptor",
  "/vs/sessionwatcher",
  "/vs/token-forest",
  "/vs/tokenmaxxer",
  "/vs/tokenrank",
  "/vs/tokentracker",
  "/vs/tokscale",
  "/vs/topaiusers",
  "/vs/vals-ai",
  "/vs/vibe-island",
  "/vs/viberank",
  "/vs/wakatime",
  "/vs/whoburnedmore",
]);

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

interface AcceptPreference {
  q: number;
  specificity: number;
  index: number;
}

function qualityFor(accept: string, candidate: string): AcceptPreference {
  const [candidateType, candidateSubtype] = candidate.split("/");
  let best: AcceptPreference = { q: 0, specificity: -1, index: Number.MAX_SAFE_INTEGER };

  accept.split(",").forEach((entry, index) => {
    const [rawMediaType, ...params] = entry.trim().split(";");
    const [type, subtype] = rawMediaType.trim().toLowerCase().split("/");
    if (!type || !subtype) return;

    const matches =
      (type === "*" && subtype === "*") ||
      (type === candidateType && (subtype === "*" || subtype === candidateSubtype));
    if (!matches) return;

    const qParam = params.find((param) => param.trim().toLowerCase().startsWith("q="));
    const parsedQ = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
    const q = Number.isFinite(parsedQ) ? Math.min(1, Math.max(0, parsedQ)) : 0;
    const specificity = type === "*" ? 0 : subtype === "*" ? 1 : 2;

    if (specificity > best.specificity || (specificity === best.specificity && index < best.index)) {
      best = { q, specificity, index };
    }
  });

  return best;
}

function preferredRepresentation(accept: string): "markdown" | "html" | "none" {
  if (!accept.trim()) return "html";

  const markdown = qualityFor(accept, "text/markdown");
  const html = qualityFor(accept, "text/html");

  if (markdown.q <= 0 && html.q <= 0) return "none";
  if (markdown.q > html.q) return "markdown";
  if (html.q > markdown.q) return "html";
  if (markdown.q > 0 && markdown.index < html.index) return "markdown";
  return "html";
}

function isKnownPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname) || ARTICLE_PATHS.has(pathname) || COMPARISON_PATHS.has(pathname)) {
    return true;
  }

  if (pathname === "/api" || pathname === "/api/indexnow" || pathname === "/api/mcp") return true;
  if (pathname.startsWith("/.well-known/")) return true;
  if (pathname.startsWith("/share/")) return true;

  return false;
}

function agentFriendly404(pathname: string) {
  const body = `# 404 — Resource not found\n\nNo resource exists at \`${pathname}\`.\n\n- [Site map](https://sigeconomy.com/sitemap.xml)\n- [Agent index](https://sigeconomy.com/llms.txt)\n- [Developer portal](https://sigeconomy.com/developers)\n- [OpenAPI](https://sigeconomy.com/openapi.json)\n`;

  return new NextResponse(body, {
    status: 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-store",
      Vary: "Accept, Accept-Encoding",
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (EXPLOIT_RE.test(pathname) || WP_RE.test(pathname)) {
    return agentFriendly404(pathname);
  }

  if (!isKnownPath(pathname)) {
    return agentFriendly404(pathname);
  }

  captureHttpLog(request);

  if (pathname !== "/") {
    return NextResponse.next();
  }

  const accept = request.headers.get("accept") || "";
  const representation = preferredRepresentation(accept);

  if (representation === "none") {
    return new NextResponse("# 406 — Not Acceptable\n\nThis URL is available as text/html or text/markdown.\n", {
      status: 406,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "no-store",
        Vary: "Accept, Accept-Encoding",
      },
    });
  }

  if (representation === "html") {
    const response = NextResponse.next();
    response.headers.set("Vary", "Accept, Accept-Encoding");
    response.headers.set("Link", "</llms-full.txt>; rel=\"alternate\"; type=\"text/markdown\"");
    return response;
  }

  const markdown = `# AI User Leaderboard — Ranked by Yield (Υ)

> Who's the best AI user? The competitive leaderboard for AI operators — ranked by Yield (Υ), not raw token count.

The AI User Leaderboard at sigeconomy.com is the public evaluation surface for SigRank SignalAF.
It reads from SigRank's public API and ranks AI operators on canonical token-telemetry metrics.
Unlike model leaderboards, it evaluates the humans operating AI systems rather than the models themselves.

## The metric: Yield (Υ)

Yield (Υ) = (cache_read × output) / input² — token-cascade efficiency, not raw spend.

Volume is noise. Yield is signal. The operator who burns 10M tokens to produce 1K output
has lower Yield than an operator who produces the same output with less fresh-input burn and more reusable context.

## Core pages

- [Full leaderboard](https://sigeconomy.com/): live operator rankings
- [Weekly drop](https://sigeconomy.com/weekly): this week's biggest movers
- [How it works](https://sigeconomy.com/how-it-works): 60-second Yield explainer
- [Compare](https://sigeconomy.com/compare): head-to-head operator comparison

## Metric-specific rankings

- [Best AI User](https://sigeconomy.com/best-ai-user): Yield (Υ)
- [Most Output Per Token](https://sigeconomy.com/most-output-per-token): Velocity
- [Most Context Reuse](https://sigeconomy.com/most-context-reuse): Leverage
- [Cleanest Signal](https://sigeconomy.com/cleanest-signal): SNR
- [Most Normalized](https://sigeconomy.com/most-normalized): 10xDEV
- [Most Efficient Overall](https://sigeconomy.com/most-efficient-overall): Efficiency
- [Largest Scale](https://sigeconomy.com/largest-scale): Scale V
- [Cheapest Tokens](https://sigeconomy.com/cheapest-tokens): $/1M
- [Best Op Ratio](https://sigeconomy.com/best-op-ratio): Op Ratio

## Developer and agent resources

- [Developer portal](https://sigeconomy.com/developers): API, CLI, MCP, authentication, versioning, and examples
- [OpenAPI](https://sigeconomy.com/openapi.json): machine-readable API description
- [Agent instructions](https://sigeconomy.com/agent-instructions.txt): when to use SigRank and how to call it
- [MCP manifest](https://sigeconomy.com/.well-known/mcp): Streamable HTTP discovery
- [API catalog](https://sigeconomy.com/.well-known/api-catalog): RFC 9727 API catalog
- [LLMs.txt](https://sigeconomy.com/llms.txt): compact agent index
- [LLMs-full.txt](https://sigeconomy.com/llms-full.txt): full agent-readable content
- [SigRank API](https://signalaf.com/api/v1/leaderboard): public JSON leaderboard
- [Methodology](https://signalaf.com/methodology): scoring methodology
- [CLI and MCP setup](https://signalaf.com/mcp): install with npx sigrank

## Trust

- [About](https://sigeconomy.com/about)
- [Contact](https://sigeconomy.com/contact)
- [Privacy](https://sigeconomy.com/privacy)
`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      Vary: "Accept, Accept-Encoding",
      Link: "</llms-full.txt>; rel=\"alternate\"; type=\"text/markdown\"",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|llms.txt|llms-full.txt|og.png|indexnow-key.txt|auth.md|prompts.json|api/indexnow).*)"],
};
