import type { MetadataRoute } from "next";
import { getActivePrompts } from "@/lib/prompts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://sigeconomy.com";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/developers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
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
    { url: `${base}/vs/copilot`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/cursor`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/viberank`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokenmaxxer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/whoburnedmore`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/aiusage`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccburn`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccflare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccstatusline`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/token-forest`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/sessionwatcher`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/omnara`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/sculptor`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/vibe-island`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/notch-pilot`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/opcode`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/lineman`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/codeburn`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/claudecount`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccgather`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/clauderank`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const promptRoutes: MetadataRoute.Sitemap = getActivePrompts()
    .filter((p) => !p.is_existing_route)
    .map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...promptRoutes];
}
