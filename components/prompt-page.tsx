import Link from "next/link";
import { Trophy, Crown } from "lucide-react";
import type { LeaderboardEntry, LeaderboardResponse } from "@/lib/api";
import type { Prompt, Platform, View } from "@/lib/prompts";
import { PLATFORMS } from "@/lib/prompts";
import { RankCard } from "@/components/rank-card";
import { JsonLd, leaderboardSchema, breadcrumbSchema, articleSchema } from "@/lib/jsonld";
import { operatorDisplayName } from "@/lib/utils";

interface PromptPageProps {
  prompt: Prompt;
  data: LeaderboardResponse;
  platform: Platform;
  view: View;
  allPrompts: Prompt[];
}

/** Build the URL for this prompt with given platform/view params. */
function promptUrl(slug: string, platform: Platform, view: View): string {
  const params = new URLSearchParams();
  if (platform !== "all") params.set("platform", platform);
  if (view !== "peak") params.set("view", view);
  const qs = params.toString();
  return qs ? `/${slug}?${qs}` : `/${slug}`;
}

/** Format a metric value for display. */
function formatMetricValue(metric: string, value: number): string {
  if (metric === "cost_per_million") return `$${value.toFixed(4)}/M`;
  if (metric === "snr") return value.toFixed(4);
  if (metric === "dev10x" || metric === "scale_v") return value.toFixed(2);
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
}

export function PromptPage({ prompt, data, platform, view, allPrompts }: PromptPageProps) {
  const top = data.entries[0];
  const topName = top ? operatorDisplayName(top.display_name, top.codename) : "Unknown";
  const topValue = top ? formatMetricValue(prompt.metric, metricValue(top, prompt.metric)) : "—";
  const canonicalSlug = prompt.slug;

  return (
    <div className="space-y-6">
      <JsonLd
        data={[
          leaderboardSchema(
            data.entries,
            `${prompt.question} — Top 100`,
            `https://signaaf.com/${canonicalSlug}`,
          ),
          articleSchema(
            prompt.og_title,
            `${prompt.question} ${topName} leads with ${prompt.metric_label} ${topValue}. ${prompt.story}.`,
            `/${canonicalSlug}`,
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI User Leaderboard", path: "/ai-user-leaderboard" },
            { name: prompt.question, path: `/${canonicalSlug}` },
          ]),
        ]}
      />

      {/* Hero — the question + the citable answer */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">{prompt.question}</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {top ? (
            <>
              <span className="font-semibold text-foreground">{topName}</span> is #1 with{" "}
              <span className="font-semibold text-foreground">
                {prompt.metric_label} {topValue}
              </span>
              . {data.total_operators} operators ranked.
            </>
          ) : (
            "Leaderboard refreshing."
          )}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ranked by{" "}
          <span className="font-semibold text-foreground">{prompt.metric_label}</span> —{" "}
          <span className="font-mono">{prompt.metric_formula}</span>.{" "}
          <Link href="/how-it-works" className="text-primary font-medium hover:underline">
            What&apos;s {prompt.metric_label}?
          </Link>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{prompt.story}</p>
      </div>

      {/* Platform filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform:
        </span>
        {PLATFORMS.map((p) => (
          <Link
            key={p}
            href={promptUrl(canonicalSlug, p, view)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              platform === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {/* Peak / Center view toggle */}
      <div className="flex items-center justify-center gap-2">
        <Link
          href={promptUrl(canonicalSlug, platform, "peak")}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${
            view === "peak"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          The Peak
        </Link>
        <Link
          href={promptUrl(canonicalSlug, platform, "center")}
          className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${
            view === "center"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          The Center
        </Link>
        <span className="ml-2 text-xs text-muted-foreground">
          {view === "peak"
            ? "Full board, outliers included"
            : "Outliers trimmed, dense middle visible"}
        </span>
      </div>

      {/* The #1 citable answer block (AEO/GEO) */}
      {top && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">
              #{top.rank} — {topName}
            </span>
            <span className="rounded-md border border-amber-300 bg-white px-2 py-0.5 text-xs font-semibold text-amber-800">
              {top.platform}
            </span>
            <span className="rounded-md border border-amber-300 bg-white px-2 py-0.5 text-xs font-semibold text-amber-800">
              {top.class_tier}
            </span>
          </div>
          <p className="mt-2 text-sm text-amber-900">
            <strong>{prompt.metric_label} {topValue}</strong> —{" "}
            <span className="font-mono text-xs">{prompt.metric_formula}</span>
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Token breakdown: {top.input_tokens.toLocaleString()} input ·{" "}
            {top.output_tokens.toLocaleString()} output ·{" "}
            {top.cache_read_tokens.toLocaleString()} cache_read ·{" "}
            {top.cache_creation_tokens.toLocaleString()} cache_create
          </p>
        </div>
      )}

      {/* Leaderboard list */}
      <h2 className="text-lg font-semibold pt-2">
        Top {data.entries.length} by {prompt.metric_label}
        {platform !== "all" && ` on ${platform}`}
        {view === "center" && " (Center)"}
      </h2>
      {data.entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No operators match this filter. Try a different platform or view.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.entries.map((entry) => (
            <RankCard key={entry.codename} entry={entry} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="rounded-2xl border border-primary/20 gradient-primary p-8 text-center text-white glow-primary">
        <p className="text-xl font-bold">Think you can beat them?</p>
        <p className="mt-2 text-white/80">
          Measure your AI usage and get your rank on SigRank.
        </p>
        <a
          href="https://signalaf.com/score"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Check my rank
        </a>
      </div>

      {/* Cross-links to other prompts + existing SEO routes */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Other AI user rankings</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {allPrompts
            .filter((p) => p.slug !== prompt.slug)
            .map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <div className="font-medium text-foreground group-hover:text-primary">
                  {p.question}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.metric_label} — {p.current_leader.name} leads
                </div>
              </Link>
            ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
          <Link href="/best-ai-user" className="text-primary font-medium hover:underline">
            Best AI user →
          </Link>
          <Link href="/ai-user-leaderboard" className="text-primary font-medium hover:underline">
            AI user leaderboard →
          </Link>
          <Link href="/how-it-works" className="text-primary font-medium hover:underline">
            How it works →
          </Link>
          <Link href="/weekly" className="text-primary font-medium hover:underline">
            Weekly drop →
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Extract the metric value from an entry for display. */
function metricValue(entry: LeaderboardEntry, metric: string): number {
  switch (metric) {
    case "yield":
      return entry.yield_;
    case "velocity":
      return entry.velocity;
    case "leverage":
      return entry.leverage;
    case "snr":
      return entry.snr;
    case "dev10x":
      return entry.dev10x ?? 0;
    case "scale_v":
      return entry.scale_v;
    case "efficiency":
      return entry.efficiency;
    case "cost_per_million":
      return entry.cost_per_million ?? 0;
    case "op_ratio":
      return entry.leverage;
    default:
      return entry.yield_;
  }
}
