import type { MetadataRoute } from "next";
import { getActivePrompts } from "@/lib/prompts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://sigeconomy.com";
  // lastmod dates reflect the last genuine significant change to each page,
  // sourced from git history of the page file. Do not use new Date() here —
  // that would report the current request time and mislead crawlers.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date("2026-09-04"), changeFrequency: "daily", priority: 1 },
    { url: `${base}/developers`, lastModified: new Date("2026-08-24"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date("2026-08-21"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date("2026-08-21"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date("2026-08-21"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/operator-evals`, lastModified: new Date("2026-08-17"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/public-operator-evals`, lastModified: new Date("2026-08-14"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-operator-metrics`, lastModified: new Date("2026-08-29"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-operator-standard`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/model-vs-agent-vs-operator-evals`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy-preserving-ai-telemetry`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/best-ai-user`, lastModified: new Date("2026-08-16"), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/ai-user-leaderboard`, lastModified: new Date("2026-09-04"), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/all-time`, lastModified: new Date("2026-09-02"), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/ai-power-users`, lastModified: new Date("2026-08-14"), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/weekly`, lastModified: new Date("2026-09-02"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/ai-user-ranking`, lastModified: new Date("2026-08-28"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/how-it-works`, lastModified: new Date("2026-08-14"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/compare`, lastModified: new Date("2026-08-14"), changeFrequency: "daily", priority: 0.5 },
    { url: `${base}/articles/why-operator-evals-matter`, lastModified: new Date("2026-08-14"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/articles/operator-evals-vs-model-evals`, lastModified: new Date("2026-08-14"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/articles/why-search-results-for-ai-user-leaderboard-still-show-ai-models`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/articles/what-should-an-ai-user-leaderboard-measure`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/vs/vals-ai`, lastModified: new Date("2026-08-12"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/topaiusers`, lastModified: new Date("2026-08-12"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccusage`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/langfuse`, lastModified: new Date("2026-08-12"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/braintrust`, lastModified: new Date("2026-08-12"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/langchain`, lastModified: new Date("2026-08-12"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/lmsys-arena`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/wakatime`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokscale`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/mytokentracker`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/clawdboard`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokenrank`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokentracker`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/costhawk`, lastModified: new Date("2026-08-16"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/copilot`, lastModified: new Date("2026-08-17"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/cursor`, lastModified: new Date("2026-08-17"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/viberank`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/tokenmaxxer`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/whoburnedmore`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/aiusage`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccburn`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccflare`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccstatusline`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/token-forest`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/sessionwatcher`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/omnara`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/sculptor`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/vibe-island`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/notch-pilot`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/opcode`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/lineman`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/codeburn`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/claudecount`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/ccgather`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/clauderank`, lastModified: new Date("2026-08-27"), changeFrequency: "monthly", priority: 0.6 },
    // AI evaluation topic pages — from content brief (2026-09-15)
    { url: `${base}/ai-evaluation`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-evaluation-tools`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/best-ai-evaluation-tools-for-production`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-evaluation-frameworks`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ai-agent-evaluation`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-evaluator`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ai-evaluation-platform`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/evaluating-ai`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/ai-evaluation-news`, lastModified: new Date("2026-08-30"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/ai-compliance-standards`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ai-model-evaluation`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/confirmation-hacking-ai-evaluation`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-model-safety-evaluation-benchmark-continuous-testing`, lastModified: new Date("2026-08-30"), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Prompt routes are served by the dynamic [slug] route. Use the last
  // significant change to that route plus the prompts definition.
  const promptRouteLastmod = new Date("2026-08-28");
  const promptRoutes: MetadataRoute.Sitemap = getActivePrompts()
    .filter((p) => !p.is_existing_route)
    .map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: promptRouteLastmod,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...promptRoutes];
}
