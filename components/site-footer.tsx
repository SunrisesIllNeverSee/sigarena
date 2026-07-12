import Link from "next/link";
import { Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-transparent to-blue-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <Link
              href="https://signalaf.com"
              className="font-bold gradient-text"
            >
              SigRank
            </Link>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link
              href="/how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="/compare"
              className="transition-colors hover:text-foreground"
            >
              Compare
            </Link>
            <a
              href="mailto:hello@signalaf.com"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
            <Link
              href="https://signalaf.com"
              className="transition-colors hover:text-foreground"
            >
              signalaf.com
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
