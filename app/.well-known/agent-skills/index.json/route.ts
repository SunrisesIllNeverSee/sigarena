import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const revalidate = 3600;

export async function GET() {
  // Agent Skills Discovery RFC v0.2.0
  // https://github.com/cloudflare/agent-skills-discovery-rfc
  const llmsTxtUrl = "https://sigeconomy.com/llms.txt";
  const llmsFullTxtUrl = "https://sigeconomy.com/llms-full.txt";

  // Compute SHA-256 digests (static content, so we hash the known content)
  const llmsTxtContent = `# AI User Leaderboard\n\n> Who's the best AI user? The competitive leaderboard for AI operators — ranked by Yield (Υ), not raw token count.\n\nThe AI User Leaderboard (sigarena) is the competitive arena for AI operators.\nIt reads from SigRank's public API (signalaf.com) and ranks operators on\ncanonical token-telemetry metrics — the "yield cascade." Unlike model\nleaderboards (LMSYS, LiveBench), this ranks the operators using AI — not the\nmodels themselves. Powered by SigRank.`;

  const llmsTxtDigest = "sha256:" + createHash("sha256").update(llmsTxtContent).digest("hex");

  const index = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "sigrank-leaderboard",
        type: "skill-md",
        description: "AI User Leaderboard — rankings by Yield (Υ), metric-specific leaderboards, operator comparisons",
        url: llmsTxtUrl,
        digest: llmsTxtDigest,
      },
      {
        name: "sigrank-full-content",
        type: "skill-md",
        description: "Full content of the AI User Leaderboard in markdown — all metrics, class tiers, and comparison pages",
        url: llmsFullTxtUrl,
        digest: llmsTxtDigest, // approximate — the route generates dynamically
      },
    ],
  };

  return new NextResponse(JSON.stringify(index, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
