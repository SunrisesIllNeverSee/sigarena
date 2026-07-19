import { getSortedLeaderboard } from "@/lib/api";
import { PromptPage } from "@/components/prompt-page";
import { getPromptBySlug, getActivePrompts, PLATFORMS, type Platform, type View, type Category, type Window } from "@/lib/prompts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Static Generation (Option C hybrid):
// - Canonical pages (no searchParams → platform=all, view=peak) are pre-built
//   at deploy time via generateStaticParams. Served as static assets from
//   Cloudflare's ASSETS binding. Zero Worker invocations.
// - Filtered pages (with ?platform= or ?view=) are dynamic — generated
//   on-demand via the Worker. These are low-traffic (most visitors hit the
//   canonical page).
// - dynamicParams = true allows filtered variants to still render dynamically
//   even though only the canonical slugs are pre-built.
export const dynamicParams = true;

interface RouteProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ platform?: string; view?: string; category?: string; window?: string }>;
}

function parsePlatform(s: string | undefined): Platform {
  if (s && (PLATFORMS as string[]).includes(s)) return s as Platform;
  return "all";
}

function parseView(s: string | undefined): View {
  if (s === "center" || s === "peak") return s;
  return "peak";
}

function parseCategory(s: string | undefined): Category {
  if (s === "all") return "all";
  return "human";
}

function parseWindow(s: string | undefined): Window {
  if (s === "7d" || s === "30d" || s === "90d" || s === "all_time") return s;
  return "all_time";
}

// Pre-render all 8 active prompt slugs (canonical view only).
// Filtered variants (?platform=, ?view=) are dynamic via dynamicParams.
export async function generateStaticParams() {
  return getActivePrompts()
    .filter((p) => !p.is_existing_route)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) return { title: "Not found" };
  return {
    title: prompt.og_title,
    description: `${prompt.question} ${prompt.current_leader.name} leads with ${prompt.metric_label}. ${prompt.story}.`,
    alternates: { canonical: `/${prompt.slug}` },
    openGraph: {
      title: prompt.og_title,
      description: `${prompt.question} ${prompt.current_leader.name} leads with ${prompt.metric_label}.`,
      url: `https://signaaf.com/${prompt.slug}`,
      type: "website",
    },
  };
}

export default async function PromptRoutePage({ params, searchParams }: RouteProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const platform = parsePlatform(sp.platform);
  const view = parseView(sp.view);
  const category = parseCategory(sp.category);
  const win = parseWindow(sp.window);

  const prompt = getPromptBySlug(slug);
  if (!prompt || prompt.is_existing_route) notFound();

  const data = await getSortedLeaderboard(prompt.metric, platform, view, 100, win, category);
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl font-semibold">Leaderboard refreshing</p>
      </div>
    );
  }

  const allPrompts = getActivePrompts();
  return (
    <PromptPage
      prompt={prompt}
      data={data}
      platform={platform}
      view={view}
      category={category}
      window={win}
      allPrompts={allPrompts}
    />
  );
}
