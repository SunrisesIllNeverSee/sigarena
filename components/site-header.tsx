import Link from "next/link";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <Trophy className="h-6 w-6 shrink-0 text-primary" />
          <span className="text-lg font-bold tracking-tight">
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
            className={cn(
              "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            )}
          >
            Check my rank
          </a>
        </div>
      </div>
    </header>
  );
}
