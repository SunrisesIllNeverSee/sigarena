import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "SigRank vs TopAIUsers — Measured vs Curated AI User Rankings",
  description:
    "SigRank ranks AI users by measured token-cascade efficiency (Yield). TopAIUsers is a curated list of 100 seats. Measured vs curated — which approach wins?",
  alternates: { canonical: "/vs/topaiusers" },
  openGraph: {
    title: "SigRank vs TopAIUsers — Measured vs Curated",
    description: "Measured Yield (Υ) vs a hand-picked list of 100 seats.",
    url: "https://signaaf.com/vs/topaiusers",
    type: "website",
  },
};

export default function VsTopAIUsersPage() {
  return (
    <div className="space-y-6">
      <JsonLd data={[
        articleSchema("SigRank vs TopAIUsers \u2014 Measured vs Curated AI User Rankings", "SigRank ranks AI users by measured token-cascade efficiency. TopAIUsers curates a list. Measured vs curated.", "/vs/topaiusers"),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/vs/topaiusers" },
        ]),
      ]} />

      <div className="text-center py-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SigRank vs TopAIUsers</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Measured Yield (Υ) vs a curated list of 100 seats
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium">Feature</th>
              <th className="px-4 py-3 text-left font-medium">SigRank</th>
              <th className="px-4 py-3 text-left font-medium">TopAIUsers</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Ranking method</td>
              <td className="px-4 py-3 text-muted-foreground">Measured — Yield (Υ) from token telemetry</td>
              <td className="px-4 py-3 text-muted-foreground">Curated — hand-picked by the site owner</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Who can join</td>
              <td className="px-4 py-3 text-muted-foreground">Anyone — run the scanner, submit your stats</td>
              <td className="px-4 py-3 text-muted-foreground">Apply via Bluesky, owner selects 100 seats</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Metrics</td>
              <td className="px-4 py-3 text-muted-foreground">Yield, Leverage, Velocity, SNR, 10xDEV, class tiers</td>
              <td className="px-4 py-3 text-muted-foreground">None — just a list of names</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Transparency</td>
              <td className="px-4 py-3 text-muted-foreground">Full methodology published. API is public.</td>
              <td className="px-4 py-3 text-muted-foreground">Selection criteria are the owner&apos;s judgment</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Scale</td>
              <td className="px-4 py-3 text-muted-foreground">Unlimited — grows as operators submit</td>
              <td className="px-4 py-3 text-muted-foreground">100 seats, 10 per category</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Categories</td>
              <td className="px-4 py-3 text-muted-foreground">By class tier (APEX, S, A, B, BASE) + platform</td>
              <td className="px-4 py-3 text-muted-foreground">By AI tool (Claude, ChatGPT, Cursor, etc.)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-semibold">Privacy</td>
              <td className="px-4 py-3 text-muted-foreground">Token counts only — never prompt content</td>
              <td className="px-4 py-3 text-muted-foreground">Submit your work (visible content)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold">API</td>
              <td className="px-4 py-3 text-muted-foreground">Public REST API + MCP tools</td>
              <td className="px-4 py-3 text-muted-foreground">None</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">
          The core difference
        </h2>
        <p>
          TopAIUsers is a <strong className="text-foreground">curated community</strong> —
          100 hand-picked seats, 10 per AI tool category. It&apos;s exclusive,
          vibe-driven, and the selection is the owner&apos;s judgment. That&apos;s
          a legitimate approach for building a community.
        </p>
        <p>
          SigRank is a <strong className="text-foreground">measurement system</strong>.
          Anyone can join. Your rank is determined by your actual token-cascade
          efficiency (Yield), not by someone&apos;s opinion. The methodology is
          public. The API is public. The data is verifiable.
        </p>
        <p>
          If you want to be in an exclusive club, apply to TopAIUsers. If you
          want to know how good you actually are at using AI — measured, not
          opinionated — run SigRank.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Want to be ranked by measurement?</p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/best-ai-user" className="text-primary font-medium hover:underline">
          Who is #1? →
        </Link>
        <Link href="/ai-user-leaderboard" className="text-primary font-medium hover:underline">
          Full leaderboard →
        </Link>
      </div>
    </div>
  );
}
