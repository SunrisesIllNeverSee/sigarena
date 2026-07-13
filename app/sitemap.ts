import type { MetadataRoute } from "next";
import { getLeaderboard } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://sigarena.signalaf.com";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/weekly`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
  ];

  const data = await getLeaderboard("all_time", 100, "yield");
  if (!data) return staticRoutes;

  const operatorRoutes: MetadataRoute.Sitemap = data.entries.map((e) => ({
    url: `${base}/operator/${e.codename}`,
    lastModified: new Date(data.generated_at),
    changeFrequency: "daily" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...operatorRoutes];
}
