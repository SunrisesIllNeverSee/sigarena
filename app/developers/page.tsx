import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SigRank SignalAF Developer Portal | sigeconomy.com",
  description:
    "Developer resources for sigeconomy.com and SigRank SignalAF: OpenAPI, public API, CLI, MCP, authentication, versioning, error handling, and agent integration guidance.",
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Developers</p>
        <h1 className="text-4xl font-bold tracking-tight">SigRank SignalAF developer portal</h1>
        <p className="text-lg text-muted-foreground">
          Build against the public AI operator leaderboard, call SigRank from an agent, or inspect the machine-readable contracts behind sigeconomy.com.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Quickstart</h2>
        <p className="text-muted-foreground">
          Public leaderboard reads do not require an API key. The canonical data API is versioned at <code>https://signalaf.com/api/v1</code>. Start with the leaderboard endpoint, then use the OpenAPI document for typed operations and error models. Write operations such as submitting telemetry live on SignalAF and require the authentication described in <Link className="text-primary hover:underline" href="/auth.md">auth.md</Link>.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm"><code>{`curl https://signalaf.com/api/v1/leaderboard\n\nnpx sigrank`}</code></pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Machine-readable resources</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li><Link className="text-primary hover:underline" href="/openapi.json">OpenAPI 3.0</Link> — typed REST operations, RFC 9457 problem responses, authentication, and versioning metadata.</li>
          <li><Link className="text-primary hover:underline" href="/.well-known/api-catalog">API catalog</Link> — service discovery links for API descriptions and documentation.</li>
          <li><Link className="text-primary hover:underline" href="/.well-known/mcp">MCP server manifest</Link> — Streamable HTTP discovery for the SigRank MCP server.</li>
          <li><Link className="text-primary hover:underline" href="/agent-instructions.txt">Agent instructions</Link> — when an agent should use SigRank and which surface to call.</li>
          <li><Link className="text-primary hover:underline" href="/llms.txt">llms.txt</Link> and <Link className="text-primary hover:underline" href="/llms-full.txt">llms-full.txt</Link> — compact and expanded agent-readable indexes.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">CLI and MCP</h2>
        <p className="text-muted-foreground">
          The official SigRank CLI is published for Node.js and can be run without a global install using <code>npx sigrank</code>. In a terminal it provides the SigRank interface; in MCP-compatible clients it can run as the stdio MCP server. Public read tools do not require an API key. For setup instructions and the current tool list, use the <a className="text-primary hover:underline" href="https://signalaf.com/mcp">SigRank MCP documentation</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Authentication and sandbox</h2>
        <p className="text-muted-foreground">
          sigeconomy.com is a read-only public surface, so reads need no credentials. Authenticated submissions and profile management are handled by signalaf.com. There is no separate public sandbox environment today; integration development should use the public read endpoints and the CLI&apos;s dry-run paths where available. We do not publish placeholder API keys or a fake sandbox because those would give agents a contract that does not exist.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Versioning and deprecation</h2>
        <p className="text-muted-foreground">
          REST APIs use URL versioning, beginning with <code>/api/v1</code>. Additive fields may appear within a version. Breaking changes require a new major API path. When an endpoint is scheduled for retirement, SigRank will document the replacement and sunset date before removal and will use standard deprecation/sunset response metadata where the serving API supports it. Current v1 public read endpoints are not deprecated.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Errors and request behavior</h2>
        <p className="text-muted-foreground">
          The OpenAPI contract uses RFC 9457 <code>application/problem+json</code> for documented REST failures. Unknown website paths return a real HTTP 404 with agent recovery links. The homepage supports HTTP content negotiation for <code>text/html</code> and <code>text/markdown</code>, including <code>Vary: Accept</code> so shared caches do not mix representations.
        </p>
      </section>
    </article>
  );
}
