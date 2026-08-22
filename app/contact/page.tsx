import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SigRank SignalAF | sigeconomy.com",
  description: "Contact and support information for sigeconomy.com and SigRank SignalAF.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 py-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</p>
        <h1 className="text-4xl font-bold tracking-tight">Contact SigRank SignalAF</h1>
      </header>
      <section className="space-y-4 text-muted-foreground">
        <p>
          For questions about sigeconomy.com, the public operator leaderboard, SigRank metrics, API discovery, or agent integrations, email <a className="text-primary hover:underline" href="mailto:hello@signalaf.com">hello@signalaf.com</a>. This is the canonical public contact address exposed by the site. Please include the URL or operator surface you are asking about when the issue is specific to a page, API response, machine-readable file, or ranking.
        </p>
        <p>
          For developer integrations, start with the <a className="text-primary hover:underline" href="/developers">developer portal</a> and the <a className="text-primary hover:underline" href="/openapi.json">OpenAPI document</a>. For scoring methodology or questions about the four token pillars and derived metrics, use the methodology published at signalaf.com. For CLI and MCP setup, the current installation path is <code>npx sigrank</code>, with full setup guidance on the SignalAF MCP page.
        </p>
        <p>
          sigeconomy.com does not operate user accounts or store prompt content. Account, enrollment, authenticated submission, and profile-management questions belong to SignalAF, the authoritative data service. Security or data-integrity reports should include enough technical detail to reproduce the issue without sending private prompt content, source code, credentials, private keys, or session tokens. Public repository information is also available through the SunrisesIllNeverSee GitHub account linked throughout the site.
        </p>
      </section>
    </article>
  );
}
