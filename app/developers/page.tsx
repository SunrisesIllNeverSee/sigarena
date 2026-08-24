import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "sigeconomy.com Developer Portal — SigRank SignalAF API, CLI, MCP",
  description:
    "Developer resources for sigeconomy.com and SigRank SignalAF: OpenAPI spec, public REST API, npx sigrank CLI, MCP server, authentication, rate limits, versioning, error handling, and agent integration guidance.",
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">sigeconomy.com Developers</p>
        <h1 className="text-4xl font-bold tracking-tight">sigeconomy.com developer portal</h1>
        <p className="text-lg text-muted-foreground">
          Build against the public AI operator leaderboard, call SigRank from an
          agent, or inspect the machine-readable contracts behind sigeconomy.com.
          sigeconomy.com is the public evaluation surface for SigRank SignalAF —
          the AI operator leaderboard that ranks humans using AI tools by Yield
          (Υ) token-cascade efficiency.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Quickstart</h2>
        <p className="text-muted-foreground">
          Public leaderboard reads do not require an API key. The canonical data
          API is versioned at <code>https://signalaf.com/api/v1</code>. Start with
          the leaderboard endpoint, then use the OpenAPI document for typed
          operations and error models. Write operations such as submitting
          telemetry live on SignalAF and require the authentication described in{" "}
          <Link className="text-primary hover:underline" href="/auth.md">auth.md</Link>.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm"><code>{`# Get the public leaderboard
curl https://signalaf.com/api/v1/leaderboard

# Get a specific operator profile
curl https://signalaf.com/api/v1/operators/{codename}

# Install and run the SigRank CLI
npx sigrank`}</code></pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">CLI tool — npx sigrank</h2>
        <p className="text-muted-foreground">
          The official SigRank CLI is published on npm and can be run without a
          global install using <code>npx sigrank</code>. It reads token telemetry
          locally — four counts: cache_read, cache_write, input, output — and
          submits a signed, server-verifiable snapshot to the leaderboard. No
          prompt content, code, or conversation text leaves the machine. The CLI
          also runs as a stdio MCP server for agent-native workflows. Public read
          tools do not require an API key. For setup instructions and the current
          tool list, use the{" "}
          <a className="text-primary hover:underline" href="https://signalaf.com/mcp">
            SigRank MCP documentation
          </a>.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm"><code>{`# Scan your AI usage and submit to the leaderboard
npx sigrank

# Run as an MCP server (stdio transport)
npx sigrank --mcp

# Dry-run without submitting
npx sigrank --dry-run`}</code></pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Machine-readable resources</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li><Link className="text-primary hover:underline" href="/openapi.json">OpenAPI 3.0 specification</Link> — typed REST operations, RFC 9457 problem responses, authentication, rate limits, and versioning metadata.</li>
          <li><Link className="text-primary hover:underline" href="/.well-known/api-catalog">API catalog</Link> — RFC 9727 service discovery links for API descriptions and documentation.</li>
          <li><Link className="text-primary hover:underline" href="/.well-known/mcp">MCP server manifest</Link> — Streamable HTTP discovery for the SigRank MCP server.</li>
          <li><Link className="text-primary hover:underline" href="/agent-instructions.txt">Agent instructions</Link> — when an agent should use SigRank and which surface to call.</li>
          <li><Link className="text-primary hover:underline" href="/llms.txt">llms.txt</Link> and <Link className="text-primary hover:underline" href="/llms-full.txt">llms-full.txt</Link> — compact and expanded agent-readable indexes.</li>
          <li><Link className="text-primary hover:underline" href="/auth.md">auth.md</Link> — authentication methods for agentic access.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">MCP server</h2>
        <p className="text-muted-foreground">
          The SigRank MCP server exposes leaderboard, operator profile, and
          rank-paste tools to AI agents via the Model Context Protocol. The
          Streamable HTTP endpoint is discovered through the{" "}
          <Link className="text-primary hover:underline" href="/.well-known/mcp">
            MCP manifest
          </Link>{" "}
          at <code>/.well-known/mcp</code>. The CLI also provides a stdio MCP
          server via <code>npx sigrank --mcp</code>. Tools include
          get_leaderboard, get_operator, discover_peers, get_best_operator,
          compare_operators, describe_power_user, and optimize_efficiency.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Authentication and sandbox</h2>
        <p className="text-muted-foreground">
          sigeconomy.com is a read-only public surface, so reads need no
          credentials. Authenticated submissions and profile management are
          handled by signalaf.com via OAuth 2.0 (GitHub, Twitter, email magic
          link). There is no separate public sandbox environment today;
          integration development should use the public read endpoints and the
          CLI&apos;s <code>--dry-run</code> flag. We do not publish placeholder API
          keys or a fake sandbox because those would give agents a contract that
          does not exist.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Rate limits</h2>
        <p className="text-muted-foreground">
          Public API endpoints use a 60-request, 60-second best-effort per-IP
          window. Responses expose <code>RateLimit-Policy</code> and{" "}
          <code>RateLimit</code> structured fields, with compatibility{" "}
          <code>RateLimit-Limit</code>, <code>RateLimit-Remaining</code>, and{" "}
          <code>RateLimit-Reset</code> fields. A 429 also includes{" "}
          <code>Retry-After</code>.
        </p>
      </section>

      <section id="versioning" className="space-y-3 scroll-mt-24">
        <h2 className="text-2xl font-bold">Versioning and deprecation</h2>
        <p className="text-muted-foreground">
          REST APIs use URL versioning, beginning with <code>/api/v1</code>.
          Additive fields may appear within a version. Breaking changes require a
          new major API path. When an endpoint is scheduled for retirement,
          SigRank will document the replacement and sunset date before removal.
          Deprecated operations return a <code>Deprecation</code> header (RFC
          8594) and an HTTP-date <code>Sunset</code> header on that operation,
          while the OpenAPI document and this page identify its replacement.
          Current v1 public read endpoints are not deprecated.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Errors and request behavior</h2>
        <p className="text-muted-foreground">
          The OpenAPI contract uses RFC 9457 <code>application/problem+json</code>{" "}
          for documented REST failures. Each error response includes a stable
          machine-readable <code>code</code>, human-readable{" "}
          <code>detail</code>, and, when recovery is possible, a{" "}
          <code>hint</code>. Unknown website paths return a real HTTP 404 with
          agent recovery links to the sitemap, llms.txt, this developer portal,
          and the OpenAPI spec. The homepage supports HTTP content negotiation
          for <code>text/html</code> and <code>text/markdown</code>, including{" "}
          <code>Vary: Accept</code> so shared caches do not mix representations.
        </p>
      </section>
    </article>
  );
}
