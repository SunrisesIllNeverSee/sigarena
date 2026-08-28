export const SIGRANK_STANDARD_VERSION = "sigrank/0.1-draft" as const;
export const SIGRANK_STANDARD_URL = "https://signalaf.com/standard" as const;

export const SIGRANK_CORE_TELEMETRY = [
  { key: "input", name: "Input", symbol: "I", description: "Fresh input tokens." },
  { key: "output", name: "Output", symbol: "O", description: "Output tokens." },
  { key: "cache_write", name: "Cache Write", symbol: "W", description: "Tokens written to context cache." },
  { key: "cache_read", name: "Cache Read", symbol: "R", description: "Tokens reused from context cache." },
] as const;

export const SIGRANK_CORE_METRICS = [
  {
    key: "yield",
    name: "Yield (Υ)",
    formula: "(cache_read × output) / input²",
    description: "Compound token-flow relationship between context reuse and output relative to fresh input.",
  },
  {
    key: "leverage",
    name: "Leverage",
    formula: "cache_read / input",
    description: "Reusable context amplification relative to fresh input.",
  },
  {
    key: "velocity",
    name: "Velocity",
    formula: "output / input",
    description: "Output generated per unit of fresh input.",
  },
  {
    key: "snr",
    name: "SNR",
    formula: "output / (input + output)",
    description: "Output share of the direct input/output exchange.",
  },
  {
    key: "dev10x",
    name: "10xDEV",
    formula: "log₁₀(cache_read / input)",
    description: "Log-scale cascade summary under the reference null policy.",
  },
] as const;

export const SIGRANK_REFERENCE_EXTENSIONS = [
  {
    name: "Scale V",
    description: "SignalAF leaderboard scale dimension; not required for base compatibility.",
  },
  {
    name: "RS05",
    description: "24-stage SignalAF reference classification; not required for base compatibility.",
  },
  {
    name: "Build Archetypes",
    description: "10-type SignalAF operating-shape reference extension; not required for base compatibility.",
  },
] as const;
