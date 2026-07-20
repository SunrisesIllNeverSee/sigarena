import { getSortedLeaderboard } from "@/lib/api";
import { PromptPage } from "@/components/prompt-page";
import { getPromptBySlug, getActivePrompts, PLATFORMS, type Platform, type View, type Category, type Window } from "@/lib/prompts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Force static rendering — all prompt pages are pre-built at deploy time and
// served as static assets from Cloudflare's ASSETS binding. This is critical
// for SEO/GEO: Google indexes static pages faster and higher than dynamic
// (no-cache) pages. The previous ISR approach (searchParams + dynamicParams)
// made all pages fully dynamic because:
//   1. searchParams access forces Next.js to opt out of static rendering
//   2. OpenNext's incrementalCache: "dummy" ignores revalidate entirely
// dynamicParams = false means only the slugs from generateStaticParams are
// served (as static assets). Unknown slugs 404 instead of rendering dynamically.
// Filter buttons remain as visual navigation but the server-rendered content
// always shows the canonical default view (all platforms, peak, human, all_time).
export const dynamicParams = false;
export const dynamic = "force-static";

interface RouteProps {
  params: Promise<{ slug: string }>;
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

export default async function PromptRoutePage({ params }: RouteProps) {
  const { slug } = await params;
  // Default filter values — the page is force-static, so these are baked in
  // at build time. Filter buttons remain as navigation but the server-rendered
  // content always shows the canonical default view.
  const platform = "all" as Platform;
  const view = "peak" as View;
  const category = "human" as Category;
  const win = "all_time" as Window;

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
