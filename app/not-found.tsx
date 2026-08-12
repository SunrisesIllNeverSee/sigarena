import Link from "next/link";
import { Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary glow-primary">
        <Trophy className="h-8 w-8 text-white" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-5xl font-bold text-muted-foreground">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Operator not found or leaderboard is refreshing.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg gradient-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:gradient-primary-hover hover:glow-primary"
      >
        Back to leaderboard
      </Link>
    </div>
  );
}
