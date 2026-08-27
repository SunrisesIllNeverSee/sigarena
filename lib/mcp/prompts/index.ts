/**
 * lib/mcp/prompts/index.ts — SigEconomy MCP prompt definitions and generator.
 *
 * Extracted from app/api/mcp/route.ts as Phase 7 of the MCP structural
 * renovation. Contains the 5 prompt definitions and the getPrompt handler
 * that returns prompt messages by name.
 */

export const PROMPTS = [
  {
    name: "who-is-the-best",
    title: "Who Is the Best AI Operator?",
    description: "Finds the #1 operator on the live leaderboard and explains why they're on top.",
    arguments: [
      { name: "window", description: "Time window (7d, 30d, 90d, all_time)", required: false },
      { name: "metric", description: "Ranking metric (yield, leverage, velocity, snr)", required: false },
    ],
  },
  {
    name: "compare-two-operators",
    title: "Compare Two Operators",
    description: "Head-to-head comparison with yield gap, primary differentiator, and natural-language summary.",
    arguments: [
      { name: "operator_a", description: "Codename for operator A", required: true },
      { name: "operator_b", description: "Codename for operator B", required: true },
    ],
  },
  {
    name: "find-my-peers",
    title: "Find Operators Like Me",
    description: "Discovers operators with similar metrics and identifies where they outperform you.",
    arguments: [
      { name: "codename", description: "Your codename (or provide pillars)", required: false },
      { name: "input", description: "Your input tokens", required: false },
      { name: "output", description: "Your output tokens", required: false },
      { name: "cache_read", description: "Your cache-read tokens", required: false },
      { name: "cache_write", description: "Your cache-write tokens", required: false },
    ],
  },
  {
    name: "how-can-i-improve",
    title: "How Can I Improve?",
    description: "Analyzes your metrics, finds your weakest area, and recommends specific actions with projected yield uplift.",
    arguments: [
      { name: "codename", description: "Your codename (or provide pillars)", required: false },
      { name: "input", description: "Your input tokens", required: false },
      { name: "output", description: "Your output tokens", required: false },
      { name: "cache_read", description: "Your cache-read tokens", required: false },
      { name: "cache_write", description: "Your cache-write tokens", required: false },
    ],
  },
  {
    name: "whats-interesting-on-the-board",
    title: "What's Interesting on the Board?",
    description: "Scans the live leaderboard for unusual patterns and anomalies. No input required.",
    arguments: [
      { name: "window", description: "Time window (7d, 30d, 90d, all_time)", required: false },
    ],
  },
];

/**
 * Get a prompt by name. Returns the prompt messages for a valid name, or null
 * if the name is unknown (the caller should return an appropriate JSON-RPC
 * error).
 */
export function getPrompt(
  name: string,
  promptArgs: Record<string, string | number>,
): { messages: Array<{ role: string; content: { type: string; text: string } }> } | null {
  const prompts: Record<string, { messages: Array<{ role: string; content: { type: string; text: string } }> }> = {
    "who-is-the-best": {
      messages: [{
        role: "user",
        content: { type: "text", text: `Use the get_best_operator tool to find the #1 AI operator on the ${promptArgs.window || "30d"} board. Then use explain_this_operator to get a full profile. Tell me:\n1. Who they are and their yield\n2. Their class and platform\n3. What makes them elite\n4. Their operating archetype` },
      }],
    },
    "compare-two-operators": {
      messages: [{
        role: "user",
        content: { type: "text", text: `Compare operators "${promptArgs.operator_a || "?"}" and "${promptArgs.operator_b || "?"}". Use the compare_operators tool for the head-to-head comparison, then use operator_gap to decompose the yield gap. Tell me:\n1. Who wins and by how much\n2. The primary differentiator\n3. The secondary differentiator\n4. Any offsetting weakness the winner has` },
      }],
    },
    "find-my-peers": {
      messages: [{
        role: "user",
        content: { type: "text", text: `${promptArgs.codename ? `I am operator "${promptArgs.codename}".` : `My token counts: input=${promptArgs.input || "?"}, output=${promptArgs.output || "?"}, cache_read=${promptArgs.cache_read || "?"}, cache_write=${promptArgs.cache_write || "?"}.`} Use the discover_peers tool to find operators with similar metrics. Tell me:\n1. My 5 nearest peers\n2. How similar they are to me\n3. Where they outperform me\n4. What I can learn from them` },
      }],
    },
    "how-can-i-improve": {
      messages: [{
        role: "user",
        content: { type: "text", text: `${promptArgs.codename ? `I am operator "${promptArgs.codename}".` : `My token counts: input=${promptArgs.input || "?"}, output=${promptArgs.output || "?"}, cache_read=${promptArgs.cache_read || "?"}, cache_write=${promptArgs.cache_write || "?"}.`} Use the optimize_efficiency tool to analyze my metrics and recommend improvements. Tell me:\n1. My weakest metric vs the field\n2. The specific recommendation\n3. My projected yield if I fix it\n4. The yield uplift` },
      }],
    },
    "whats-interesting-on-the-board": {
      messages: [{
        role: "user",
        content: { type: "text", text: `Use the field_anomaly tool to scan the ${promptArgs.window || "30d"} leaderboard for unusual patterns. Then summarize the most interesting findings in plain English — who is doing something unusual, what they're doing, and why it matters.` },
      }],
    },
  };

  return prompts[name] ?? null;
}
