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
    heading: "How it works",
    links: [
      { href: "/how-it-works", label: "Υ Yield in 60 sec" },
      { href: "/ai-user-ranking", label: "How ranking works" },
      { href: "/ai-user-leaderboard", label: "What is this?" },
      { href: "/compare", label: "Compare operators" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { href: "/vs/topaiusers", label: "vs TopAIUsers" },
      { href: "/vs/ccusage", label: "vs ccusage" },
      { href: "/vs/langfuse", label: "vs Langfuse" },
      { href: "/vs/braintrust", label: "vs Braintrust" },
      { href: "/vs/langchain", label: "vs LangChain" },
      { href: "/vs/lmsys-arena", label: "vs LMSYS Arena" },
    ],
  },
  {
    heading: "SigRank",
    links: [
      { href: "https://signalaf.com", label: "signalaf.com" },
      { href: "https://signalaf.com/score", label: "Check my rank" },
      { href: "https://signalaf.com/methodology", label: "Methodology" },
      { href: "https://signalaf.com/faq", label: "FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-transparent to-blue-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* SEO link grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-1.5">
                {col.links.map((l) => (
                  <li key={l.href}>
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
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <Link
              href="https://signalaf.com"
              className="font-bold gradient-text"
            >
              SigRank
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="mailto:hello@signalaf.com"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
          Υ Yield = (cache_read × output) / input². Volume is noise. Yield is signal.
        </p>
      </div>
    </footer>
  );
}
