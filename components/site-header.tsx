import Link from "next/link";
import { Trophy } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary glow-primary">
            <Trophy className="h-5 w-5 shrink-0 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight gradient-text">
            AI User Leaderboard
          </span>
        </Link>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/how-it-works"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            How it works
          </Link>
          <Link
            href="/compare"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Compare
          </Link>
          <a
            href="https://signalaf.com/score"
            className="inline-flex items-center justify-center rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:gradient-primary-hover hover:glow-primary"
          >
            Check my rank
          </a>
        </div>
      </div>
    </header>
  );
}
