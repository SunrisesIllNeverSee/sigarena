import Link from "next/link";
import { Mail } from "lucide-react";

const FOOTER_COLUMNS: {
  heading: string;
  links: { href: string; label: string }[];
}[] = [
  {
    heading: "Leaderboard",
    links: [
      { href: "/", label: "Full rankings" },
      { href: "/best-ai-user", label: "Best AI user" },
      { href: "/ai-power-users", label: "AI power users" },
      { href: "/weekly", label: "Weekly drop" },
    ],
  },
  {
    heading: "Metric rankings",
    links: [
      { href: "/best-ai-user", label: "Yield (Υ)" },
      { href: "/most-output-per-token", label: "Most output/token" },
      { href: "/most-context-reuse", label: "Most context reuse" },
      { href: "/cleanest-signal", label: "Cleanest signal" },
      { href: "/most-normalized", label: "10xDEV" },
      { href: "/most-efficient-overall", label: "Most efficient" },
      { href: "/largest-scale", label: "Largest scale" },
      { href: "/cheapest-tokens", label: "Cheapest tokens" },
      { href: "/best-op-ratio", label: "Best op ratio" },
    ],
  },
  {
    heading: "Operator evals",
    links: [
      { href: "/operator-evals", label: "What are operator evals?" },
      { href: "/ai-operator-standard", label: "AI operator standard" },
      { href: "/ai-operator-metrics", label: "AI operator metrics" },
      { href: "/model-vs-agent-vs-operator-evals", label: "Eval layers explained" },
      { href: "/privacy-preserving-ai-telemetry", label: "Privacy-preserving telemetry" },
      { href: "/public-operator-evals", label: "Public evals thesis" },
      { href: "/articles/why-operator-evals-matter", label: "Why evals matter" },
      { href: "/articles/operator-evals-vs-model-evals", label: "Operator vs model evals" },
      { href: "/how-it-works", label: "Υ Yield in 60 sec" },
      { href: "/ai-user-ranking", label: "How ranking works" },
      { href: "/ai-user-leaderboard", label: "What is this?" },
      { href: "/compare", label: "Compare operators" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { href: "/vs/vals-ai", label: "vs Vals AI" },
      { href: "/vs/topaiusers", label: "vs TopAIUsers" },
      { href: "/vs/ccusage", label: "vs ccusage" },
      { href: "/vs/langfuse", label: "vs Langfuse" },
      { href: "/vs/braintrust", label: "vs Braintrust" },
      { href: "/vs/langchain", label: "vs LangChain" },
      { href: "/vs/lmsys-arena", label: "vs LMSYS Arena" },
      { href: "/vs/wakatime", label: "vs WakaTime" },
      { href: "/vs/tokscale", label: "vs Tokscale" },
      { href: "/vs/mytokentracker", label: "vs mytokentracker" },
      { href: "/vs/clawdboard", label: "vs clawdboard" },
      { href: "/vs/tokenrank", label: "vs TokenRank" },
      { href: "/vs/tokentracker", label: "vs Token Tracker" },
      { href: "/vs/costhawk", label: "vs CostHawk" },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { href: "https://signalaf.com/platforms", label: "All platforms" },
      { href: "https://signalaf.com/platforms", label: "Claude Code" },
      { href: "https://signalaf.com/platforms", label: "Codex CLI" },
      { href: "https://signalaf.com/platforms", label: "Gemini CLI" },
      { href: "https://signalaf.com/platforms", label: "Copilot CLI" },
      { href: "https://signalaf.com/platforms", label: "OpenCode" },
      { href: "https://signalaf.com/platforms", label: "Goose" },
      { href: "https://signalaf.com/platforms", label: "Devin" },
    ],
  },
  {
    heading: "SigRank SignalAF",
    links: [
      { href: "https://signalaf.com", label: "signalaf.com" },
      { href: "https://signalaf.com/score", label: "Check my rank" },
      { href: "https://signalaf.com/methodology", label: "Methodology" },
      { href: "https://signalaf.com/faq", label: "FAQ" },
      { href: "/developers", label: "Developers" },
      { href: "/openapi.json", label: "OpenAPI" },
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-transparent to-blue-50/50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* SEO link grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-1.5">
                {col.links.map((l) => (
                  <li key={`${col.heading}-${l.href}-${l.label}`}>
                    <Link
                      href={l.href}
                      className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <Link
              href="https://signalaf.com"
              className="font-bold gradient-text"
            >
              SigRank SignalAF
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="transition-colors hover:text-foreground">About</Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
          Υ Yield = (cache_read × output) / input². Volume is noise. Yield is signal.
        </p>
      </div>
    </footer>
  );
}
