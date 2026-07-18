import { getSortedLeaderboard } from "@/lib/api";
import { PromptPage } from "@/components/prompt-page";
import { getPromptBySlug, getActivePrompts, PLATFORMS, type Platform, type View } from "@/lib/prompts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface RouteProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ platform?: string; view?: string }>;
}

function parsePlatform(s: string | undefined): Platform {
  if (s && (PLATFORMS as string[]).includes(s)) return s as Platform;
  return "all";
}

function parseView(s: string | undefined): View {
  if (s === "center" || s === "peak") return s;
  return "peak";
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

  const prompt = getPromptBySlug(slug);
  if (!prompt || prompt.is_existing_route) notFound();

  const data = await getSortedLeaderboard(prompt.metric, platform, view, 100, "all_time");
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
      allPrompts={allPrompts}
    />
  );
}
