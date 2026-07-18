/**
 * Prompt registry — the 9 canonical token-metric prompts for signaaf.com.
 *
 * Each prompt is a canonical token metric (per CANON_QUICKREF §1) phrased as an
 * SEO/AEO/GEO question. 4 of 8 metrics have a different #1 (verified against the
 * live signalaf.com API, 1640 operators, 2026-07-18):
 *   - yield, leverage, dev10x, efficiency → Richard Fu (claude)
 *   - velocity, snr → limp (chatgpt)
 *   - scale_v → grenadeoftacoss (other/IGNITER)
 *   - cost_per_million → takuma.saito (claude, $0.35/M — cheapest compounding operator)
 *
 * This is the shared registry between sigarena (site) and bestuser-router-mcp (MCP).
 * The JSON form is served at /prompts.json for the MCP to fetch.
 */

export type CanonicalMetric =
  | "yield"
  | "velocity"
  | "leverage"
  | "snr"
  | "dev10x"
  | "scale_v"
  | "efficiency"
  | "cost_per_million"
  | "op_ratio";

export type Platform = "all" | "claude" | "chatgpt" | "other" | "anthropic" | "gemini";

export type View = "peak" | "center";

export interface PromptLeader {
  name: string;
  platform: string;
  class: string;
  value: number;
}

export interface Prompt {
  id: string;
  question: string;
  metric: CanonicalMetric;
  metric_label: string;
  metric_formula: string;
  metric_unit: string;
  current_leader: PromptLeader;
  story: string;
  slug: string;
  is_existing_route: boolean;
  seo_keywords: string[];
  aeo_question: string;
  og_title: string;
  tweet_template: string;
  active: boolean;
  sort_order: number;
}

export const PLATFORMS: Platform[] = ["all", "claude", "chatgpt", "other", "anthropic", "gemini"];

export const PROMPTS: Prompt[] = [
  {
    id: "best-ai-user",
    question: "Who is the best AI user?",
    metric: "yield",
    metric_label: "Yield (Υ)",
    metric_formula: "(cache_read × output) / input²",
    metric_unit: "Υ",
    current_leader: { name: "Richard Fu", platform: "claude", class: "TRANSMITTER", value: 2462656 },
    story: "Token-cascade efficiency — how well you compound signal, not how much you burn",
    slug: "best-ai-user",
    is_existing_route: true,
    seo_keywords: ["best ai user", "ai user leaderboard", "who is the best at using ai"],
    aeo_question: "Who is the best AI user?",
    og_title: "The Best AI User — Ranked by Yield (Υ)",
    tweet_template: "Who is the best AI user?\n\nTop 100 ranked by Yield (Υ) — (cache_read × output) / input².\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 0,
  },
  {
    id: "most-output-per-token",
    question: "Who gets the most output per token?",
    metric: "velocity",
    metric_label: "Velocity",
    metric_formula: "output / input",
    metric_unit: "O/I",
    current_leader: { name: "limp", platform: "chatgpt", class: "TRANSMITTER", value: 218.3 },
    story: "Output productivity — who produces the most per token spent",
    slug: "most-output-per-token",
    is_existing_route: false,
    seo_keywords: ["output per token", "ai productivity", "token productivity"],
    aeo_question: "Who gets the most output per token?",
    og_title: "Most Output Per Token — Ranked by Velocity",
    tweet_template: "Who gets the most output per token?\n\nTop 100 ranked by Velocity (output / input).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 1,
  },
  {
    id: "most-context-reuse",
    question: "Who reuses context the most?",
    metric: "leverage",
    metric_label: "Leverage",
    metric_formula: "cache_read / input",
    metric_unit: "Cr/I",
    current_leader: { name: "Richard Fu", platform: "claude", class: "TRANSMITTER", value: 30345 },
    story: "Cache reuse — how much you build on prior context vs starting fresh",
    slug: "most-context-reuse",
    is_existing_route: false,
    seo_keywords: ["ai context reuse", "cache reuse ai", "context management"],
    aeo_question: "Who reuses context the most?",
    og_title: "Most Context Reuse — Ranked by Leverage",
    tweet_template: "Who reuses context the most?\n\nTop 100 ranked by Leverage (cache_read / input).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 2,
  },
  {
    id: "cleanest-signal",
    question: "Who has the cleanest signal?",
    metric: "snr",
    metric_label: "SNR",
    metric_formula: "output / (input + output)",
    metric_unit: "O/(I+O)",
    current_leader: { name: "limp", platform: "chatgpt", class: "TRANSMITTER", value: 0.9954 },
    story: "Signal quality — the fresh-signal ratio. Higher = more output per total token",
    slug: "cleanest-signal",
    is_existing_route: false,
    seo_keywords: ["signal to noise ai", "ai signal quality", "clean signal"],
    aeo_question: "Who has the cleanest signal?",
    og_title: "Cleanest Signal — Ranked by SNR",
    tweet_template: "Who has the cleanest signal?\n\nTop 100 ranked by SNR (output / (input + output)).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 3,
  },
  {
    id: "most-normalized",
    question: "Who's the most normalized?",
    metric: "dev10x",
    metric_label: "10xDEV",
    metric_formula: "log₁₀(leverage)",
    metric_unit: "log₁₀(Cr/I)",
    current_leader: { name: "Richard Fu", platform: "claude", class: "TRANSMITTER", value: 4.48 },
    story: "Normalized leverage — the log-scaled cache reuse axis that doesn't squash the field",
    slug: "most-normalized",
    is_existing_route: false,
    seo_keywords: ["ai leverage", "cache leverage", "normalized leverage"],
    aeo_question: "Who's the most normalized AI user?",
    og_title: "Most Normalized — Ranked by 10xDEV",
    tweet_template: "Who's the most normalized AI user?\n\nTop 100 ranked by 10xDEV (log₁₀(leverage)).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 4,
  },
  {
    id: "most-efficient-overall",
    question: "Who's the most efficient overall?",
    metric: "efficiency",
    metric_label: "Efficiency",
    metric_formula: "((cache_read + cache_create + output) / input) / 4.0",
    metric_unit: "((Cr+Cw+O)/I)/4",
    current_leader: { name: "Richard Fu", platform: "claude", class: "TRANSMITTER", value: 7835 },
    story: "Overall efficiency — the blended cascade score vs the AA baseline",
    slug: "most-efficient-overall",
    is_existing_route: false,
    seo_keywords: ["ai efficiency", "most efficient ai user", "token efficiency"],
    aeo_question: "Who's the most efficient AI user overall?",
    og_title: "Most Efficient Overall — Ranked by Efficiency",
    tweet_template: "Who's the most efficient AI user overall?\n\nTop 100 ranked by Efficiency ((cache + output) / input / 4).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 5,
  },
  {
    id: "largest-scale",
    question: "Who operates at the largest scale?",
    metric: "scale_v",
    metric_label: "Scale V",
    metric_formula: "log₁₀(total_tokens)",
    metric_unit: "log₁₀(total)",
    current_leader: { name: "grenadeoftacoss", platform: "other", class: "IGNITER", value: 15.96 },
    story: "Volume scale — log-scaled total tokens. The raw-size axis (not efficiency)",
    slug: "largest-scale",
    is_existing_route: false,
    seo_keywords: ["ai scale", "largest ai user", "token volume"],
    aeo_question: "Who operates at the largest scale?",
    og_title: "Largest Scale — Ranked by Scale V",
    tweet_template: "Who operates at the largest scale?\n\nTop 100 ranked by Scale V (log₁₀(total tokens)).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 6,
  },
  {
    id: "cheapest-tokens",
    question: "Who gets the cheapest tokens?",
    metric: "cost_per_million",
    metric_label: "$/1M",
    metric_formula: "blended cost per million tokens (lower = better)",
    metric_unit: "$/1M",
    current_leader: { name: "takuma.saito", platform: "claude", class: "TRANSMITTER", value: 0.3519 },
    story: "Cost efficiency — blended $ per million tokens. Cheapest compounding operators win (cache_read is cheap)",
    slug: "cheapest-tokens",
    is_existing_route: false,
    seo_keywords: ["cheapest ai tokens", "token cost", "ai cost efficiency"],
    aeo_question: "Who gets the cheapest AI tokens?",
    og_title: "Cheapest Tokens — Ranked by $/1M",
    tweet_template: "Who gets the cheapest AI tokens?\n\nTop 100 ranked by $/1M (blended cost per million tokens).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 7,
  },
  {
    id: "best-op-ratio",
    question: "Who has the best operating ratio?",
    metric: "op_ratio",
    metric_label: "Op Ratio",
    metric_formula: "cache_read : 1 : output/input",
    metric_unit: "Cr:1:O/I",
    current_leader: { name: "Richard Fu", platform: "claude", class: "TRANSMITTER", value: 30345 },
    story: "Operating ratio — the cache:input:output shorthand for cascade shape",
    slug: "best-op-ratio",
    is_existing_route: false,
    seo_keywords: ["operating ratio ai", "cache input output ratio"],
    aeo_question: "Who has the best AI operating ratio?",
    og_title: "Best Operating Ratio — Ranked by Op Ratio",
    tweet_template: "Who has the best AI operating ratio?\n\nTop 100 ranked by Op Ratio (cache:input:output).\n\nWhere do you rank? {url}",
    active: true,
    sort_order: 8,
  },
];

/** All active prompts, sorted by sort_order. */
export function getActivePrompts(): Prompt[] {
  return PROMPTS.filter((p) => p.active).sort((a, b) => a.sort_order - b.sort_order);
}

/** Find a prompt by slug. Returns null if not found. */
export function getPromptBySlug(slug: string): Prompt | null {
  return PROMPTS.find((p) => p.slug === slug && p.active) ?? null;
}

/** Find a prompt by metric. Returns null if not found. */
export function getPromptByMetric(metric: CanonicalMetric): Prompt | null {
  return PROMPTS.find((p) => p.metric === metric && p.active) ?? null;
}

/**
 * Prompt of the day — rotates through all active prompts daily.
 * Deterministic based on the day index (days since epoch).
 */
export function getPromptOfTheDay(date: Date = new Date()): Prompt {
  const prompts = getActivePrompts();
  const dayIndex = Math.floor(date.getTime() / 86_400_000) % prompts.length;
  return prompts[dayIndex];
}

/**
 * Platform of the day — rotates through platforms (excluding 'all') daily.
 * Deterministic based on the day index, offset by 1 from the prompt rotation
 * so the platform-of-the-day doesn't always match the prompt-of-the-day's leader.
 */
export function getPlatformOfTheDay(date: Date = new Date()): Platform {
  const platforms: Platform[] = ["claude", "chatgpt", "other", "anthropic", "gemini"];
  const dayIndex = (Math.floor(date.getTime() / 86_400_000) + 1) % platforms.length;
  return platforms[dayIndex];
}

/** The prompt registry as a JSON-serializable object (for /prompts.json). */
export function getRegistryJSON() {
  return {
    version: "2.0",
    last_updated: new Date().toISOString().slice(0, 10),
    canon_version: "CANON_QUICKREF 2026-06-18",
    operator_count: 1640,
    metrics: PROMPTS.map((p) => p.metric),
    platforms: PLATFORMS,
    prompts: PROMPTS.filter((p) => p.active).map((p) => ({
      id: p.id,
      question: p.question,
      metric: p.metric,
      metric_label: p.metric_label,
      metric_formula: p.metric_formula,
      metric_unit: p.metric_unit,
      current_leader: p.current_leader,
      story: p.story,
      slug: p.slug,
      is_existing_route: p.is_existing_route,
      seo_keywords: p.seo_keywords,
      aeo_question: p.aeo_question,
      og_title: p.og_title,
      tweet_template: p.tweet_template,
      active: p.active,
      sort_order: p.sort_order,
    })),
  };
}
