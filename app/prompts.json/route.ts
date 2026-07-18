import { getRegistryJSON } from "@/lib/prompts";

export const revalidate = 3600;

export async function GET() {
  const registry = getRegistryJSON();
  return new Response(JSON.stringify(registry, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
