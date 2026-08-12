import type { MetadataRoute } from "next";
import { getActivePrompts } from "@/lib/prompts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://sigeconomy.com";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/operator-evals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/public-operator-evals`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/best-ai-user`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/ai-user-leaderboard`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/ai-power-users`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/weekly`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/ai-user-ranking`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
    { url: `${base}/articles/why-operator-evals-matter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/articles/operator-evals-vs-model-evals`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/vals-ai`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/topaiusers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccusage`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/langfuse`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/braintrust`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/langchain`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/lmsys-arena`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/wakatime`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokscale`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/mytokentracker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/clawdboard`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokenrank`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokentracker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/costhawk`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // New metric-specific prompt routes (8 routes, excluding best-ai-user which is already listed)
  const promptRoutes: MetadataRoute.Sitemap = getActivePrompts()
    .filter((p) => !p.is_existing_route)
    .map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  // Operator profile pages live on signalaf.com (sigrank-app), not sigeconomy.com.
  // No operator routes in this sitemap.
  return [...staticRoutes, ...promptRoutes];
}
