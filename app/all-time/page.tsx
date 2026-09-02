import type { Metadata } from "next";
import Link from "next/link";
import { getFullLeaderboard, computeDeltaFromAverage } from "@/lib/api";
import { isOutlierEntry } from "@/lib/outlier-classify";
import { RankCard } from "@/components/rank-card";
import { Trophy, Users, Crown, TrendingUp } from "lucide-react";
import {
  JsonLd,
  leaderboardSchema,
  breadcrumbSchema,
  articleSchema,
  faqSchema,
} from "@/lib/jsonld";
import { formatYield, operatorDisplayName } from "@/lib/utils";

// Force-dynamic: render at request time so the HTML always contains real
// leaderboard data. The API response is edge-cached for 5 minutes via
// cachedFetch() in lib/api.ts.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "All-Time AI User Leaderboard — Full Archive | SigRank SignalAF",
  description:
    "The complete all-time leaderboard of AI operators ranked by Yield (Υ). Every operator, every snapshot, full history. The definitive archive of AI user performance.",
  alternates: { canonical: "/all-time" },
  openGraph: {
    title: "All-Time AI User Leaderboard — Full Archive | SigRank SignalAF",
    description:
      "The complete all-time ranking of AI operators by Yield. Full archive, not just the top 50.",
    url: "https://sigeconomy.com/all-time",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All-Time AI User Leaderboard — Full Archive",
    description:
      "The complete all-time ranking of AI operators by Yield (Υ).",
  },
};

const PAGE_SIZE = 50;

export default async function AllTimePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const category = params.cat === "all" ? "all" : "human";

  const data = await getFullLeaderboard("all_time");

  if (!data || data.entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Leaderboard refreshing</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;re pulling the latest rankings. Check back in a moment.
        </p>
      </div>
    );
  }

  // Apply category filter (human = HCM, all = include outliers)
  const filtered =
    category === "human"
      ? data.entries.filter((e) => !isOutlierEntry(e))
      : data.entries;

  const totalOperators = filtered.length;
  const totalPages = Math.ceil(totalOperators / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageEntries = filtered.slice(start, start + PAGE_SIZE);
  const { deltas } = computeDeltaFromAverage(pageEntries);

  const topOperator = filtered[0];
  const topName = operatorDisplayName(
    topOperator.display_name,
    topOperator.codename,
  );

  const faqs = [
    {
      question: "What is the all-time AI user leaderboard?",
      answer: "The complete historical ranking of every AI operator who has submitted telemetry to SigRank. Operators are ranked by Yield (Υ) — token-cascade efficiency — not raw token volume. The all-time board includes every snapshot ever submitted, providing the full archive of AI user performance.",
    },
    {
      question: "How is Yield (Υ) calculated?",
      answer: "Yield = (cache_read × output) / input². It measures how efficiently an operator converts input tokens into useful output, rewarding context reuse and output generation while penalizing wasteful input consumption. Higher Yield means better AI usage efficiency.",
    },
    {
      question: "What is the difference between Operators and Extreme Outliers?",
      answer: "The Operators category applies the Human Center of Mass filter, which excludes statistical outliers (bots, input-dump scripts, and operators with extreme input-to-total ratios). The Extreme Outliers category includes every operator, including outliers and automated systems.",
    },
    {
      question: "How often is this leaderboard updated?",
      answer: "The leaderboard fetches from SignalAF's live API with a 5-minute edge cache. New submissions appear within minutes. Rank movement (biggest movers, challengers) is computed nightly by the daily recompute pipeline.",
    },
  ];

  return (
    <div className="space-y-8">
      <JsonLd
        data={[
          leaderboardSchema(
            pageEntries,
            "All-Time AI User Leaderboard",
            "https://sigeconomy.com/all-time",
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            {
              name: "All-Time Leaderboard",
              path: "/all-time",
            },
          ]),
          articleSchema(
            "All-Time AI User Leaderboard — Full Archive",
            `The complete all-time ranking of ${totalOperators} AI operators by Yield (Υ). ${topName} is #1 with Υ ${formatYield(topOperator.yield_)}.`,
            "/all-time",
          ),
          faqSchema(faqs),
        ]}
      />

      {/* Header */}
      <section className="pt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">All-Time Leaderboard</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          The complete archive of every AI operator ranked by Yield (Υ).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 border border-amber-200">
            <Crown className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span className="font-semibold text-amber-900">{topName}</span>
            <span className="text-amber-700">
              is #1 with Υ {formatYield(topOperator.yield_)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 border border-blue-200">
            <Users className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span className="text-blue-900">
              {totalOperators}{" "}
              {category === "human" ? "operators" : "operators + extreme outliers"}
            </span>
          </div>
          <div className="text-muted-foreground">
            Updated {new Date(data.generated_at).toLocaleDateString()}
          </div>
        </div>
      </section>

      {/* Category toggle */}
      <div className="flex items-center gap-3">
        <Link
          href="/all-time"
          className={`rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide transition-all ${
            category === "human"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 scale-105"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-102"
          }`}
        >
          Operators
        </Link>
        <Link
          href="/all-time?cat=all"
          className={`rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide transition-all ${
            category === "all"
              ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/25 scale-105"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-102"
          }`}
        >
          Extreme Outliers
        </Link>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-3">
        {pageEntries.map((entry) => {
          const delta = deltas.get(entry.codename);
          return (
            <RankCard
              key={entry.codename}
              entry={entry}
              deltaFromAverage={delta}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-4">
          {currentPage > 1 && (
            <Link
              href={`/all-time?page=${currentPage - 1}${category === "all" ? "&cat=all" : ""}`}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              ← Prev
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/all-time?page=${currentPage + 1}${category === "all" ? "&cat=all" : ""}`}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Next →
            </Link>
          )}
        </nav>
      )}

      {/* FAQ section */}
      <section className="pt-8 border-t">
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="mt-1 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-link to signalaf.com */}
      <section className="pt-8 border-t text-center">
        <p className="text-muted-foreground">
          Submit your own telemetry at{" "}
          <Link
            href="https://signalaf.com/score"
            className="text-primary font-medium hover:underline"
          >
            signalaf.com/score
          </Link>{" "}
          to get ranked.
        </p>
      </section>
    </div>
  );
}
