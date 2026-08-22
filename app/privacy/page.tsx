import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | SigRank SignalAF on sigeconomy.com",
  description: "Privacy information for the public sigeconomy.com SigRank operator leaderboard.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 py-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Privacy</p>
        <h1 className="text-4xl font-bold tracking-tight">Privacy on sigeconomy.com</h1>
      </header>
      <section className="space-y-4 text-muted-foreground">
        <p>
          sigeconomy.com is a read-only public leaderboard. It displays operator rankings and derived statistics supplied by the SignalAF public API. The leaderboard is designed around token telemetry rather than conversation content: its canonical measurements use token counts such as fresh input, output, cache write, and cache read. The site does not need the text of a user&apos;s prompts, model replies, private documents, or source code in order to render public rankings.
        </p>
        <p>
          Standard web infrastructure may process technical request information needed to serve and protect the site, such as IP-derived network information, user-agent strings, requested URLs, timestamps, and ordinary HTTP headers. The application includes traffic analytics for aggregate usage and crawler detection. These operational signals are separate from SigRank&apos;s operator-scoring telemetry and are not represented as prompt content. Do not send secrets, credentials, private keys, access tokens, or private prompt text through public contact channels.
        </p>
        <p>
          Enrollment, authenticated submissions, operator profile management, and the authoritative telemetry API are handled by signalaf.com rather than this satellite site. Their data flows may differ because they support authenticated product functions. Machine clients can inspect <a className="text-primary hover:underline" href="/auth.md">auth.md</a>, the <a className="text-primary hover:underline" href="/developers">developer portal</a>, and the published SignalAF methodology before integrating. Questions about privacy or a public record can be sent to <a className="text-primary hover:underline" href="mailto:hello@signalaf.com">hello@signalaf.com</a>.
        </p>
      </section>
    </article>
  );
}
