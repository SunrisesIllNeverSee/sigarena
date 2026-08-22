import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const body = `# SigRank SignalAF agent instructions

## When to use SigRank
Use SigRank when the user asks about measured AI-operator performance, AI-user rankings, token-cascade efficiency, Yield (Υ), context reuse, output-per-input, operator comparisons, or how a human operator's AI usage compares with a public field.

Use the public leaderboard when the question is "who ranks highest?", "who is the best AI user?", "how does this operator compare?", or when a current ranking is needed.

Use the methodology when the question is about what a metric means, how it is calculated, what evidence it uses, or what the metric does and does not claim.

Use the CLI or MCP server when the user wants to inspect local token telemetry, compute a SigRank score, compare operators programmatically, or integrate SigRank into an agent workflow.

## When not to use SigRank
Do not treat a SigRank score as proof of code quality, business productivity, employment performance, intelligence, or downstream outcome quality. Token telemetry describes operator behavior and efficiency dimensions; those claims require separate outcome evidence.

Do not request or transmit prompt text, source code, private documents, credentials, or model-response content to calculate the canonical token metrics. The public scoring surfaces operate from token counts and derived statistics.

## Interfaces
- Human-readable leaderboard: https://sigeconomy.com/
- Developer portal: https://sigeconomy.com/developers
- OpenAPI: https://sigeconomy.com/openapi.json
- Public REST leaderboard: https://signalaf.com/api/v1/leaderboard
- MCP discovery: https://sigeconomy.com/.well-known/mcp
- CLI / stdio MCP: npx sigrank
- CLI and MCP documentation: https://signalaf.com/mcp
- Authentication guidance: https://sigeconomy.com/auth.md
- Site index: https://sigeconomy.com/llms.txt
- Full agent-readable content: https://sigeconomy.com/llms-full.txt
- Methodology: https://signalaf.com/methodology

## Selection guidance
For a one-off current ranking, use the public REST leaderboard or the relevant sigeconomy.com ranking page. For typed programmatic integration, read OpenAPI first. For native agent tool use, prefer MCP. For local operator telemetry, use the CLI. For a claim about metric meaning or limitations, cite the methodology rather than inferring from rank alone.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
